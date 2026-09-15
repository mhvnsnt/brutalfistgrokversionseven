export type AppScreen =
  | "boot"
  | "title"
  | "menu"
  | "options"
  | "select"
  | "details"
  | "stage"
  | "versus"
  | "combat"
  | "result"
  | "arcade-end";

export type GameMode = "arcade" | "versus" | "training";

export type GraphicsProfile = "PS1_3D" | "RETRO8" | "HIGH_RES";

export type DummyBehavior = "stand" | "guard" | "attack";

export enum FighterState {
  Neutral = "Neutral",
  Crouch = "Crouch",
  Startup = "Startup",
  Active = "Active",
  Recovery = "Recovery",
  Hitstun = "Hitstun",
  Blockstun = "Blockstun",
  Grappled = "Grappled",
  Pinned = "Pinned",
  Knockdown = "Knockdown",
  Wake = "Wake",
  KO = "KO",
}

export type FighterAnimation =
  | "idle"
  | "walk"
  | "crouch"
  | "light"
  | "heavy"
  | "guard"
  | "hit"
  | "block"
  | "grapple"
  | "throw"
  | "pin"
  | "knockdown"
  | "wake"
  | "ko"
  | "victory";

export interface InputBitmask {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  light: boolean;
  heavy: boolean;
  guard: boolean;
  crouch: boolean;
  grapple: boolean;
  escape: boolean;
  pin: boolean;
}

export const EMPTY_INPUT: InputBitmask = {
  up: false,
  down: false,
  left: false,
  right: false,
  light: false,
  heavy: false,
  guard: false,
  crouch: false,
  grapple: false,
  escape: false,
  pin: false,
};

export interface Hitbox {
  offsetX: number;
  offsetZ: number;
  width: number;
  depth: number;
  damage: number;
  hitstun: number;
  blockstun: number;
  pushback: number;
  launch: number;
}

export interface Hurtbox {
  offsetX: number;
  offsetZ: number;
  width: number;
  depth: number;
}

export interface FrameData {
  startup: number;
  active: number;
  recovery: number;
  damage: number;
  hitAdvantage: number;
  blockAdvantage: number;
  pushback: number;
  hitstun?: number;
  blockstun?: number;
  hitbox?: Hitbox;
  hurtbox?: Hurtbox;
  animation?: FighterAnimation;
}

export type GrapplePhase =
  | "none"
  | "engaged"
  | "control"
  | "throw"
  | "pin-attempt"
  | "pinned"
  | "escaped";

export type MatchPhase = "intro" | "fight" | "roundEnd" | "matchOver";

export interface FighterSnapshot {
  health: number;
  maxHealth: number;
  poise: number;
  maxPoise: number;
  x: number;
  z: number;
  facing: 1 | -1;
  state: FighterState;
  stateFrame: number;
  animation: FighterAnimation;
  move: FrameData | null;
  guarding: boolean;
  crouching: boolean;
  roundsWon: number;
}

export interface MatchSnapshot {
  frame: number;
  phase: MatchPhase;
  round: number;
  roundsToWin: number;
  timerFrames: number;
  timerSeconds: number;
  hitStopFrames: number;
  p1: FighterSnapshot;
  p2: FighterSnapshot;
  grapplePhase: GrapplePhase;
  grappleEscapeMeter: number;
  lastResult: "p1" | "p2" | "draw" | null;
  winner: "p1" | "p2" | "draw" | null;
}
