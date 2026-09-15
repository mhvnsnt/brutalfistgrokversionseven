import {
  EMPTY_INPUT,
  FighterAnimation,
  FighterState,
  type DummyBehavior,
  type FighterSnapshot,
  type FrameData,
  type Hitbox,
  type Hurtbox,
  type InputBitmask,
  type MatchPhase,
  type MatchSnapshot,
} from "../types";
import { getMove, type SchwarzerblitzMoveDefinition } from "./SchwarzerblitzMoveCatalog";
import type { BannonFighterProfile } from "../data/bannonRoster";
import type { StageDefinition } from "../data/stages";
import { GrappleSystem } from "./GrappleSystem";
import {
  BANNON_COMBAT_CONTRACT,
  boundedRootMotionVelocityMetersPerSecond,
  hitStopFramesForImpact,
} from "./BannonCombatContract";

const DEFAULT_HURTBOX: Hurtbox = { offsetX: 0, offsetZ: 0, width: 0.82, depth: 0.72 };
const LIGHT = getMove("light");
const HEAVY = getMove("heavy");
const INTRO_FRAMES = 90;
const ROUND_END_FRAMES = 110;
const ROUND_TIME_FRAMES = 99 * 60;
const KNOCKDOWN_FRAMES = 42;
const WAKE_FRAMES = 22;
const PIN_WIN_FRAMES = 90;
const ROUNDS_TO_WIN = 2;

type Side = "p1" | "p2";

interface FighterRuntime {
  profile: BannonFighterProfile;
  health: number;
  poise: number;
  x: number;
  z: number;
  facing: 1 | -1;
  state: FighterState;
  stateFrame: number;
  animation: FighterAnimation;
  move: FrameData | null;
  hitstun: number;
  blockstun: number;
  knockdown: number;
  wake: number;
  guard: boolean;
  crouch: boolean;
  roundsWon: number;
  edgeVx: number;
}

export interface EngineConfig {
  p1: BannonFighterProfile;
  p2: BannonFighterProfile;
  stage: StageDefinition;
  cpuP2: boolean;
  dummyBehavior: DummyBehavior;
  training: boolean;
}

export class GameEngine {
  public currentFrame = 0;
  public phase: MatchPhase = "intro";
  public round = 1;
  public timerFrames = ROUND_TIME_FRAMES;
  public hitStopFrames = 0;
  public lastResult: "p1" | "p2" | "draw" | null = null;
  public winner: "p1" | "p2" | "draw" | null = null;
  public readonly grapple = new GrappleSystem();
  public readonly config: EngineConfig;

  private p1: FighterRuntime;
  private p2: FighterRuntime;
  private phaseFrames = 0;
  private pinHold = 0;
  private paused = false;
  private readonly hurtbox = DEFAULT_HURTBOX;
  private p1Pressed = { light: false, heavy: false, grapple: false, pin: false };
  private p2Pressed = { light: false, heavy: false, grapple: false, pin: false };

  constructor(config: EngineConfig) {
    this.config = config;
    this.p1 = this.makeFighter(config.p1, -config.stage.spawnX);
    this.p2 = this.makeFighter(config.p2, config.stage.spawnX);
    this.p1.facing = 1;
    this.p2.facing = -1;
  }

  public setPaused(value: boolean) {
    this.paused = value;
  }

  public setDummyBehavior(behavior: DummyBehavior) {
    this.config.dummyBehavior = behavior;
  }

  public resetTraining() {
    this.currentFrame = 0;
    this.phase = "intro";
    this.phaseFrames = 0;
    this.round = 1;
    this.timerFrames = ROUND_TIME_FRAMES;
    this.hitStopFrames = 0;
    this.lastResult = null;
    this.winner = null;
    this.pinHold = 0;
    this.grapple.release(0);
    this.p1 = this.makeFighter(this.config.p1, -this.config.stage.spawnX);
    this.p2 = this.makeFighter(this.config.p2, this.config.stage.spawnX);
    this.p1.facing = 1;
    this.p2.facing = -1;
  }

  public resetPositions() {
    this.p1.x = -this.config.stage.spawnX;
    this.p1.z = 0;
    this.p2.x = this.config.stage.spawnX;
    this.p2.z = 0;
    this.p1.state = FighterState.Neutral;
    this.p2.state = FighterState.Neutral;
    this.p1.move = null;
    this.p2.move = null;
    this.p1.animation = "idle";
    this.p2.animation = "idle";
    this.grapple.release(this.currentFrame);
  }

  public resetHealth() {
    this.p1.health = this.p1.profile.hp;
    this.p2.health = this.p2.profile.hp;
    this.p1.poise = this.p1.profile.poise;
    this.p2.poise = this.p2.profile.poise;
  }

  public tick(p1Input: InputBitmask, p2Input: InputBitmask = EMPTY_INPUT) {
    if (this.paused) return;
    if (this.phase === "matchOver") return;

    this.currentFrame++;
    this.phaseFrames++;

    if (this.phase === "intro") {
      this.updateFacing();
      this.p1.animation = "idle";
      this.p2.animation = "idle";
      if (this.phaseFrames >= INTRO_FRAMES) {
        this.phase = "fight";
        this.phaseFrames = 0;
      }
      return;
    }

    if (this.phase === "roundEnd") {
      if (this.phaseFrames >= ROUND_END_FRAMES) this.beginNextRound();
      return;
    }

    if (this.hitStopFrames > 0) {
      this.hitStopFrames--;
      return;
    }

    const cpuInput = this.config.cpuP2 ? this.thinkCpu() : p2Input;

    this.updateFacing();
    this.updateGrapple(p1Input, cpuInput);
    const g = this.grapple.getState();
    if (g.phase !== "none" && g.phase !== "escaped") {
      this.updateGrappledStates();
      this.edgePressed(p1Input, cpuInput);
      return;
    }
    if (g.phase === "escaped") this.grapple.release(this.currentFrame);

    this.simulateFighter("p1", this.p1, p1Input, this.p1Pressed);
    this.simulateFighter("p2", this.p2, cpuInput, this.p2Pressed);
    this.resolveBodySeparation();
    this.updateFacing();
    this.tickTimer();
    this.edgePressed(p1Input, cpuInput);
  }

  public getSnapshot(): MatchSnapshot {
    const g = this.grapple.getState();
    return {
      frame: this.currentFrame,
      phase: this.phase,
      round: this.round,
      roundsToWin: ROUNDS_TO_WIN,
      timerFrames: this.timerFrames,
      timerSeconds: Math.max(0, Math.ceil(this.timerFrames / 60)),
      hitStopFrames: this.hitStopFrames,
      p1: this.snapshot(this.p1),
      p2: this.snapshot(this.p2),
      grapplePhase: g.phase,
      grappleEscapeMeter: g.escapeMeter,
      lastResult: this.lastResult,
      winner: this.winner,
    };
  }

  public getP1() {
    return this.p1;
  }

  public getP2() {
    return this.p2;
  }

  private makeFighter(profile: BannonFighterProfile, x: number): FighterRuntime {
    return {
      profile,
      health: profile.hp,
      poise: profile.poise,
      x,
      z: 0,
      facing: x < 0 ? 1 : -1,
      state: FighterState.Neutral,
      stateFrame: 0,
      animation: "idle",
      move: null,
      hitstun: 0,
      blockstun: 0,
      knockdown: 0,
      wake: 0,
      guard: false,
      crouch: false,
      roundsWon: 0,
      edgeVx: 0,
    };
  }

  private snapshot(f: FighterRuntime): FighterSnapshot {
    return {
      health: f.health,
      maxHealth: f.profile.hp,
      poise: f.poise,
      maxPoise: f.profile.poise,
      x: f.x,
      z: f.z,
      facing: f.facing,
      state: f.state,
      stateFrame: f.stateFrame,
      animation: f.animation,
      move: f.move,
      guarding: f.guard,
      crouching: f.crouch,
      roundsWon: f.roundsWon,
    };
  }

  private edgePressed(p1: InputBitmask, p2: InputBitmask) {
    this.p1Pressed = {
      light: p1.light,
      heavy: p1.heavy,
      grapple: p1.grapple,
      pin: p1.pin,
    };
    this.p2Pressed = {
      light: p2.light,
      heavy: p2.heavy,
      grapple: p2.grapple,
      pin: p2.pin,
    };
  }

  private justPressed(side: Side, key: "light" | "heavy" | "grapple" | "pin", input: InputBitmask) {
    const prev = side === "p1" ? this.p1Pressed : this.p2Pressed;
    return input[key] && !prev[key];
  }

  private updateGrapple(p1Input: InputBitmask, p2Input: InputBitmask) {
    const g = this.grapple.getState();
    const distance = Math.hypot(this.p2.x - this.p1.x, this.p2.z - this.p1.z);

    if (g.phase === "none") {
      if (
        this.justPressed("p1", "grapple", p1Input) &&
        this.p1.state === FighterState.Neutral &&
        this.p2.state === FighterState.Neutral &&
        this.grapple.canEngage(distance, this.p2.guard)
      ) {
        this.grapple.engage("p1", "p2", this.currentFrame);
        return;
      }
      if (
        this.justPressed("p2", "grapple", p2Input) &&
        this.p2.state === FighterState.Neutral &&
        this.p1.state === FighterState.Neutral &&
        this.grapple.canEngage(distance, this.p1.guard)
      ) {
        this.grapple.engage("p2", "p1", this.currentFrame);
      }
      return;
    }

    if (g.phase === "engaged" || g.phase === "control") {
      const defenderInput = g.defenderId === "p2" ? p2Input : p1Input;
      const attackerInput = g.attackerId === "p1" ? p1Input : p2Input;
      if (defenderInput.escape) this.grapple.applyEscapeInput(9, this.currentFrame);
      else this.grapple.advanceControl(this.currentFrame);

      if (this.justPressed(g.attackerId === "p1" ? "p1" : "p2", "pin", attackerInput)) {
        this.grapple.attemptPin(this.currentFrame, this.measurePinContact());
      } else if (this.justPressed(g.attackerId === "p1" ? "p1" : "p2", "heavy", attackerInput)) {
        this.executeThrow(g.attackerId === "p1" ? "p1" : "p2");
      }
    }
  }

  private executeThrow(attacker: Side) {
    this.grapple.startThrow(this.currentFrame);
    const atk = attacker === "p1" ? this.p1 : this.p2;
    const def = attacker === "p1" ? this.p2 : this.p1;
    const damage = this.scaledDamage(180, atk.profile);
    def.health = Math.max(0, def.health - damage);
    def.poise = Math.max(0, def.poise - 18);
    def.state = FighterState.Hitstun;
    def.hitstun = 28;
    def.animation = "hit";
    atk.animation = "throw";
    def.x += atk.facing * 1.35;
    this.hitStopFrames = BANNON_COMBAT_CONTRACT.heavyHitStopFrames;
    this.grapple.release(this.currentFrame);
    this.clamp(def);
    if (def.health <= 0) this.knockOut(attacker === "p1" ? "p2" : "p1");
    else if (def.poise <= 0) this.knockDown(attacker === "p1" ? "p2" : "p1");
  }

  private updateGrappledStates() {
    const g = this.grapple.getState();
    const atk = g.attackerId === "p1" ? this.p1 : this.p2;
    const def = g.defenderId === "p2" ? this.p2 : this.p1;
    atk.state = FighterState.Grappled;
    def.state = FighterState.Grappled;
    atk.animation = g.phase === "pinned" ? "pin" : "grapple";
    def.animation = g.phase === "pinned" ? "pin" : "grapple";
    const mid = (this.p1.x + this.p2.x) * 0.5;
    atk.x += (mid - atk.facing * 0.42 - atk.x) * 0.2;
    def.x += (mid + atk.facing * 0.42 - def.x) * 0.2;

    if (g.phase === "pinned") {
      def.state = FighterState.Pinned;
      this.pinHold++;
      if (this.pinHold >= PIN_WIN_FRAMES && !this.config.training) {
        this.endRound(g.attackerId === "p1" ? "p1" : "p2");
      }
    } else {
      this.pinHold = 0;
    }
  }

  private measurePinContact() {
    const distance = Math.hypot(this.p2.x - this.p1.x, this.p2.z - this.p1.z);
    const ringMatContact =
      Math.abs(this.p2.x) <= this.config.stage.boundsX &&
      Math.abs(this.p2.z) <= this.config.stage.boundsZ;
    const shoulderDistance = Math.max(0, distance - 0.15);
    return {
      leftShoulderDistanceM: shoulderDistance,
      rightShoulderDistanceM: shoulderDistance,
      ringMatContact,
    };
  }

  private simulateFighter(
    side: Side,
    f: FighterRuntime,
    input: InputBitmask,
    _prev: { light: boolean; heavy: boolean; grapple: boolean; pin: boolean },
  ) {
    if (f.health <= 0) {
      f.state = FighterState.KO;
      f.animation = "ko";
      return;
    }

    if (f.knockdown > 0) {
      f.knockdown--;
      f.state = FighterState.Knockdown;
      f.animation = "knockdown";
      if (f.knockdown === 0) {
        f.wake = WAKE_FRAMES;
        f.state = FighterState.Wake;
        f.animation = "wake";
        f.poise = Math.max(12, Math.round(f.profile.poise * 0.45));
      }
      return;
    }
    if (f.wake > 0) {
      f.wake--;
      f.state = FighterState.Wake;
      f.animation = "wake";
      if (!f.wake) f.state = FighterState.Neutral;
      return;
    }
    if (f.hitstun > 0) {
      f.hitstun--;
      f.state = FighterState.Hitstun;
      f.animation = "hit";
      f.x += f.edgeVx;
      f.edgeVx *= 0.82;
      this.clamp(f);
      if (!f.hitstun) f.state = FighterState.Neutral;
      return;
    }
    if (f.blockstun > 0) {
      f.blockstun--;
      f.state = FighterState.Blockstun;
      f.animation = "block";
      if (!f.blockstun) f.state = FighterState.Neutral;
      return;
    }

    if (f.move) {
      f.stateFrame++;
      if (f.state === FighterState.Startup && f.stateFrame >= f.move.startup) {
        f.state = FighterState.Active;
        f.stateFrame = 0;
      } else if (f.state === FighterState.Active) {
        if (f.stateFrame === 1) this.tryHit(side, f.move);
        if (f.stateFrame >= f.move.active) {
          f.state = FighterState.Recovery;
          f.stateFrame = 0;
        }
      } else if (f.state === FighterState.Recovery && f.stateFrame >= f.move.recovery) {
        f.state = FighterState.Neutral;
        f.stateFrame = 0;
        f.move = null;
      }
      f.animation = f.move?.animation ?? "light";
      return;
    }

    if (f.state !== FighterState.Neutral && f.state !== FighterState.Crouch) return;

    f.guard = input.guard;
    f.crouch = input.crouch || (input.down && !input.left && !input.right && !input.up);
    if (f.guard) {
      f.state = FighterState.Neutral;
      f.animation = "guard";
      return;
    }
    if (f.crouch) {
      f.state = FighterState.Crouch;
      f.animation = "crouch";
      return;
    }
    f.state = FighterState.Neutral;

    if (this.justPressed(side, "light", input) && this.canStartMove(f, LIGHT)) {
      this.startMove(f, LIGHT);
      return;
    }
    if (this.justPressed(side, "heavy", input) && this.canStartMove(f, HEAVY)) {
      this.startMove(f, HEAVY);
      return;
    }

    this.moveFighter(f, input);
    const moving = input.left || input.right || input.up || input.down;
    f.animation = moving ? "walk" : "idle";
  }

  private startMove(f: FighterRuntime, move: FrameData) {
    f.move = { ...move, damage: this.scaledDamage(move.damage, f.profile) };
    f.state = FighterState.Startup;
    f.stateFrame = 0;
    f.animation = move.animation ?? "light";
  }

  private canStartMove(f: FighterRuntime, move: FrameData | null) {
    const candidate = move as SchwarzerblitzMoveDefinition | null;
    if (!candidate) return false;
    const other = f === this.p1 ? this.p2 : this.p1;
    const distance = Math.hypot(other.x - f.x, other.z - f.z);
    return distance >= candidate.minRange && distance <= candidate.maxRange;
  }

  private moveFighter(f: FighterRuntime, input: InputBitmask) {
    const max = BANNON_COMBAT_CONTRACT.maxBodyVelocityMps;
    const speedScale = f.profile.speed / 85;
    const walk = boundedRootMotionVelocityMetersPerSecond(max * speedScale) / 60;
    const side = walk * 0.72;
    if (input.left) f.x -= walk;
    if (input.right) f.x += walk;
    if (input.up) f.z -= side;
    if (input.down && !f.crouch) f.z += side;
    this.clamp(f);
  }

  private thinkCpu(): InputBitmask {
    const input: InputBitmask = { ...EMPTY_INPUT };
    if (this.config.training) {
      if (this.config.dummyBehavior === "guard") input.guard = true;
      if (this.config.dummyBehavior === "stand") return input;
    }

    const dx = this.p1.x - this.p2.x;
    const dz = this.p1.z - this.p2.z;
    const distance = Math.hypot(dx, dz);
    const aggression = this.config.training && this.config.dummyBehavior === "attack" ? 0.85 : 0.42 + this.round * 0.08;

    if (this.p2.state !== FighterState.Neutral && this.p2.state !== FighterState.Crouch) return input;

    if (this.p1.move && this.p1.state === FighterState.Startup && distance < 1.8 && Math.random() < 0.35) {
      input.guard = true;
      return input;
    }

    if (distance > 1.85) {
      if (dx > 0.08) input.right = true;
      if (dx < -0.08) input.left = true;
      if (Math.abs(dz) > 0.12) {
        if (dz > 0) input.down = true;
        else input.up = true;
      }
    } else {
      if (Math.random() < aggression) {
        if (distance <= 0.9 && Math.random() < 0.22) input.grapple = true;
        else if (Math.random() < 0.38) input.heavy = true;
        else input.light = true;
      } else if (Math.random() < 0.18) input.guard = true;
    }
    return input;
  }

  private scaledDamage(base: number, fighter: BannonFighterProfile) {
    return Math.max(
      1,
      Math.round(base * BANNON_COMBAT_CONTRACT.damageScale * (fighter.strength / 90)),
    );
  }

  private tryHit(side: Side, move: FrameData) {
    const attacker = side === "p1" ? this.p1 : this.p2;
    const defender = side === "p1" ? this.p2 : this.p1;
    const hitbox = move.hitbox ?? this.legacyHitbox(move);
    const centerX = attacker.x + attacker.facing * hitbox.offsetX;
    const centerZ = attacker.z + hitbox.offsetZ;
    const xOverlap = Math.abs(centerX - defender.x) <= (hitbox.width + this.hurtbox.width) * 0.5;
    const zOverlap = Math.abs(centerZ - defender.z) <= (hitbox.depth + this.hurtbox.depth) * 0.5;
    if (!xOverlap || !zOverlap) return;
    if (
      defender.state === FighterState.Knockdown ||
      defender.state === FighterState.Wake ||
      defender.state === FighterState.KO
    )
      return;

    const damage = this.scaledDamage(hitbox.damage || move.damage, attacker.profile);
    const push = hitbox.pushback || move.pushback;
    const blocked = defender.guard && defender.state !== FighterState.Startup && defender.state !== FighterState.Active;

    if (blocked) {
      defender.health = Math.max(0, defender.health - Math.round(damage * 0.12));
      defender.state = FighterState.Blockstun;
      defender.animation = "block";
      defender.blockstun = hitbox.blockstun || move.blockstun || 9;
      defender.x += attacker.facing * push * 0.45;
    } else {
      defender.health = Math.max(0, defender.health - damage);
      defender.state = FighterState.Hitstun;
      defender.animation = "hit";
      defender.hitstun = hitbox.hitstun || move.hitstun || 15;
      defender.poise = Math.max(0, defender.poise - Math.max(4, Math.round(damage / 90)));
      defender.x += attacker.facing * push;
      defender.edgeVx = attacker.facing * push * 0.12;
    }

    this.hitStopFrames = Math.max(
      this.hitStopFrames,
      blocked ? 2 : hitStopFramesForImpact(damage / 80),
    );
    this.clamp(defender);

    if (defender.health <= 0) this.knockOut(side === "p1" ? "p2" : "p1");
    else if (!blocked && defender.poise <= 0) this.knockDown(side === "p1" ? "p2" : "p1");
  }

  private knockDown(side: Side) {
    const f = side === "p1" ? this.p1 : this.p2;
    if (f.health <= 0) return this.knockOut(side);
    f.state = FighterState.Knockdown;
    f.animation = "knockdown";
    f.knockdown = KNOCKDOWN_FRAMES;
    f.move = null;
    f.hitstun = 0;
    f.poise = 0;
  }

  private knockOut(side: Side) {
    const f = side === "p1" ? this.p1 : this.p2;
    f.health = 0;
    f.state = FighterState.KO;
    f.animation = "ko";
    f.move = null;
    if (this.config.training) return;
    this.endRound(side === "p1" ? "p2" : "p1");
  }

  private tickTimer() {
    if (this.config.training || this.phase !== "fight") return;
    this.timerFrames--;
    if (this.timerFrames <= 0) {
      if (this.p1.health === this.p2.health) this.endRound("draw");
      else this.endRound(this.p1.health > this.p2.health ? "p1" : "p2");
    }
  }

  private endRound(result: "p1" | "p2" | "draw") {
    if (this.phase !== "fight") return;
    this.lastResult = result;
    if (result === "p1") this.p1.roundsWon++;
    if (result === "p2") this.p2.roundsWon++;
    const p1Win = this.p1.roundsWon >= ROUNDS_TO_WIN;
    const p2Win = this.p2.roundsWon >= ROUNDS_TO_WIN;
    if (p1Win || p2Win) {
      this.phase = "matchOver";
      this.winner = p1Win && p2Win ? "draw" : p1Win ? "p1" : "p2";
      if (this.winner === "p1") this.p1.animation = "victory";
      if (this.winner === "p2") this.p2.animation = "victory";
    } else {
      this.phase = "roundEnd";
      this.phaseFrames = 0;
    }
  }

  private beginNextRound() {
    this.round++;
    this.phase = "intro";
    this.phaseFrames = 0;
    this.timerFrames = ROUND_TIME_FRAMES;
    this.hitStopFrames = 0;
    this.pinHold = 0;
    this.grapple.release(this.currentFrame);
    const p1Wins = this.p1.roundsWon;
    const p2Wins = this.p2.roundsWon;
    this.p1 = this.makeFighter(this.config.p1, -this.config.stage.spawnX);
    this.p2 = this.makeFighter(this.config.p2, this.config.stage.spawnX);
    this.p1.roundsWon = p1Wins;
    this.p2.roundsWon = p2Wins;
    this.p1.facing = 1;
    this.p2.facing = -1;
  }

  private legacyHitbox(move: FrameData): Hitbox {
    return {
      offsetX: 0.9,
      offsetZ: 0,
      width: 1.2,
      depth: 0.8,
      damage: move.damage,
      hitstun: move.hitstun ?? 15,
      blockstun: move.blockstun ?? 9,
      pushback: move.pushback,
      launch: 0,
    };
  }

  private resolveBodySeparation() {
    const dx = this.p2.x - this.p1.x;
    const dz = this.p2.z - this.p1.z;
    const distance = Math.hypot(dx, dz);
    const minimum = 0.72;
    if (distance <= 0 || distance >= minimum) return;
    const nx = dx / distance;
    const nz = dz / distance;
    const correction = (minimum - distance) * 0.5;
    this.p1.x -= nx * correction;
    this.p1.z -= nz * correction;
    this.p2.x += nx * correction;
    this.p2.z += nz * correction;
    this.clamp(this.p1);
    this.clamp(this.p2);
  }

  private updateFacing() {
    if (this.p2.x > this.p1.x + 0.01) {
      this.p1.facing = 1;
      this.p2.facing = -1;
    } else if (this.p2.x < this.p1.x - 0.01) {
      this.p1.facing = -1;
      this.p2.facing = 1;
    }
  }

  private clamp(f: FighterRuntime) {
    f.x = Math.max(-this.config.stage.boundsX, Math.min(this.config.stage.boundsX, f.x));
    f.z = Math.max(-this.config.stage.boundsZ, Math.min(this.config.stage.boundsZ, f.z));
  }
}
