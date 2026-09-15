import { BANNON_PLAYABLE_ROSTER, type BannonFighterProfile } from "../data/bannonRoster";
import { STAGES, type StageId } from "../data/stages";
import { BANNON_GLB_PLAYABLE_MODELS, BANNON_GLB_BLOCKED_MODELS } from "../data/bannonGlbRoster";
import type { DummyBehavior, GameMode, GraphicsProfile } from "../types";
import type { GameSettings, SelectSlot } from "../store";
import { Kicker, MenuButton, StatBar } from "./chrome";

export function BootScreen() {
  return (
    <div className="screen-fill bg-bg text-fg">
      <div className="text-center">
        <Kicker>Schwarzerblitz runtime</Kicker>
        <h1 className="display-title mt-3">BRUTAL FIST</h1>
        <p className="mt-4 text-xs tracking-[0.28em] text-muted">VALIDATING BANNON CONTRACTS</p>
      </div>
    </div>
  );
}

export function TitleScreen({ onStart }: { onStart: () => void }) {
  return (
    <button type="button" onClick={onStart} className="screen-fill bg-transparent text-fg">
      <div className="relative z-10 text-center px-6">
        <Kicker>3D fighting / wrestling</Kicker>
        <h1 className="display-hero mt-2">BRUTAL FIST</h1>
        <p className="mt-6 text-sm tracking-[0.42em] text-accent animate-pulse">PRESS START</p>
        <p className="mt-8 max-w-sm mx-auto text-xs leading-relaxed text-muted">
          PS1-era 3D. Bannon roster. 60 Hz simulation. No fallback fighters.
        </p>
      </div>
    </button>
  );
}

export function MainMenu({
  onMode,
  onOptions,
}: {
  onMode: (mode: GameMode) => void;
  onOptions: () => void;
}) {
  return (
    <div className="screen-fill bg-transparent text-fg">
      <div className="relative z-10 w-[min(92vw,420px)] px-4">
        <Kicker>Brutal Fist</Kicker>
        <h1 className="display-title mt-2 mb-8">MAIN MENU</h1>
        <div className="space-y-2">
          <MenuButton onClick={() => onMode("arcade")}>ARCADE</MenuButton>
          <MenuButton onClick={() => onMode("versus")}>VERSUS</MenuButton>
          <MenuButton onClick={() => onMode("training")}>TRAINING</MenuButton>
          <MenuButton onClick={onOptions}>OPTIONS</MenuButton>
        </div>
      </div>
    </div>
  );
}

export function OptionsScreen({
  settings,
  onPatch,
  onBack,
}: {
  settings: GameSettings;
  onPatch: (patch: Partial<GameSettings>) => void;
  onBack: () => void;
}) {
  return (
    <div className="screen-fill bg-bg text-fg">
      <div className="relative z-10 w-[min(92vw,460px)] px-4">
        <Kicker>Configuration</Kicker>
        <h1 className="display-title mt-2 mb-8">OPTIONS</h1>
        <div className="space-y-6">
          <section>
            <div className="mb-2 text-[10px] tracking-[0.22em] text-muted">GRAPHICS</div>
            <div className="grid grid-cols-3 gap-2">
              {(["PS1_3D", "RETRO8", "HIGH_RES"] as GraphicsProfile[]).map((g) => (
                <button
                  key={g}
                  type="button"
                  disabled={g === "HIGH_RES"}
                  onClick={() => onPatch({ graphics: g })}
                  className={`menu-btn px-2 py-3 text-center text-[11px] ${settings.graphics === g ? "is-active" : ""}`}
                >
                  {g === "HIGH_RES" ? "HIGH_RES (RESERVED)" : g}
                </button>
              ))}
            </div>
          </section>
          {[
            ["MASTER", "master"],
            ["MUSIC", "music"],
            ["SFX", "sfx"],
          ].map(([label, key]) => (
            <label key={key} className="block">
              <div className="mb-2 flex justify-between text-[10px] tracking-[0.22em] text-muted">
                <span>{label}</span>
                <span className="tabular-nums text-fg">{Math.round((settings[key as "master"] as number) * 100)}</span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={settings[key as "master"] as number}
                onChange={(e) => onPatch({ [key]: Number(e.target.value) })}
                className="w-full accent-[var(--color-accent)]"
              />
            </label>
          ))}
          <MenuButton onClick={onBack}>BACK</MenuButton>
        </div>
      </div>
    </div>
  );
}

export function CharacterSelect({
  slot,
  mode,
  selected,
  other,
  onHover,
  onConfirm,
  onBack,
}: {
  slot: SelectSlot;
  mode: GameMode;
  selected: BannonFighterProfile | null;
  other: BannonFighterProfile | null;
  onHover: (f: BannonFighterProfile) => void;
  onConfirm: () => void;
  onBack: () => void;
}) {
  if (!BANNON_PLAYABLE_ROSTER.length) {
    return (
      <div className="screen-fill bg-bg text-fg">
        <div className="text-center px-6">
          <Kicker>Roster locked</Kicker>
          <h1 className="display-title mt-3">NO VALID BANNON GLB FIGHTERS</h1>
          <p className="mt-4 text-xs tracking-[0.22em] text-danger">NO GLB = NO CHARACTER</p>
        </div>
      </div>
    );
  }

  return (
    <div className="screen-fill bg-bg text-fg overflow-y-auto">
      <div className="relative z-10 w-full max-w-5xl px-4 py-8">
        <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
          <div>
            <Kicker>
              {mode.toUpperCase()} · {slot === "p1" ? "PLAYER 1" : mode === "training" ? "DUMMY" : "PLAYER 2"}
            </Kicker>
            <h1 className="display-title mt-2">SELECT FIGHTER</h1>
          </div>
          <button type="button" className="menu-btn w-auto px-5 py-3" onClick={onBack}>
            BACK
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mb-6">
          {BANNON_PLAYABLE_ROSTER.map((f) => {
            const active = selected?.model === f.model;
            return (
              <button
                key={`${f.id}:${f.model}`}
                type="button"
                onClick={() => onHover(f)}
                onDoubleClick={onConfirm}
                className={`fighter-card ${active ? "is-active" : ""}`}
              >
                <div className="text-[11px] font-semibold tracking-[0.16em]">{f.name.toUpperCase()}</div>
                <div className="mt-1 text-[9px] tracking-[0.14em] text-muted">{f.attire ?? "Default attire"}</div>
                <div className="mt-2 text-[9px] text-accent">GLB PASS</div>
              </button>
            );
          })}
        </div>
        {selected && (
          <div className="panel p-4 sm:p-5">
            <div className="flex flex-wrap justify-between gap-3">
              <div>
                <div className="text-xl tracking-[0.12em]">{selected.name.toUpperCase()}</div>
                <div className="mt-1 text-xs text-muted">{selected.style} · {selected.model}</div>
              </div>
              <button type="button" className="menu-btn w-auto px-5 py-3 is-active" onClick={onConfirm}>
                CONFIRM
              </button>
            </div>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">{selected.bio}</p>
            <div className="mt-4 space-y-2">
              <StatBar label="HP" value={selected.hp} max={10000} />
              <StatBar label="SPD" value={selected.speed} max={100} />
              <StatBar label="STR" value={selected.strength} max={100} />
              <StatBar label="POISE" value={selected.poise} max={100} />
            </div>
            {other && slot === "p2" && (
              <div className="mt-3 text-[10px] tracking-[0.18em] text-muted">P1 {other.name.toUpperCase()}</div>
            )}
          </div>
        )}
        <p className="mt-4 text-[10px] tracking-[0.16em] text-muted">
          {BANNON_GLB_PLAYABLE_MODELS.length} playable GLB attires · {BANNON_GLB_BLOCKED_MODELS.length} gated until QA/rig pass
        </p>
      </div>
    </div>
  );
}

export function FighterDetails({
  fighter,
  opponent,
  onContinue,
  onBack,
}: {
  fighter: BannonFighterProfile;
  opponent: BannonFighterProfile | null;
  onContinue: () => void;
  onBack: () => void;
}) {
  return (
    <div className="screen-fill bg-bg text-fg">
      <div className="relative z-10 w-[min(92vw,560px)] px-4">
        <Kicker>Fighter record</Kicker>
        <h1 className="display-title mt-2">{fighter.name.toUpperCase()}</h1>
        <p className="mt-4 text-sm leading-relaxed text-muted">{fighter.bio}</p>
        <div className="mt-6 panel p-4 space-y-2">
          <div className="text-[10px] tracking-[0.2em] text-muted">{fighter.role} · {fighter.style}</div>
          <StatBar label="HP" value={fighter.hp} max={10000} />
          <StatBar label="SPD" value={fighter.speed} max={100} />
          <StatBar label="STR" value={fighter.strength} max={100} />
          <StatBar label="POISE" value={fighter.poise} max={100} />
          <div className="pt-2 text-[10px] tracking-[0.16em] text-muted">
            MODEL {fighter.model} · GATE PASS · SCALE {fighter.physicsScale}
          </div>
        </div>
        {opponent && (
          <div className="mt-4 text-xs tracking-[0.18em] text-muted">VS {opponent.name.toUpperCase()}</div>
        )}
        <div className="mt-6 grid grid-cols-2 gap-2">
          <MenuButton onClick={onBack}>BACK</MenuButton>
          <MenuButton active onClick={onContinue}>CONTINUE</MenuButton>
        </div>
      </div>
    </div>
  );
}

export function StageSelect({
  selected,
  onSelect,
  onConfirm,
  onBack,
}: {
  selected: StageId;
  onSelect: (id: StageId) => void;
  onConfirm: () => void;
  onBack: () => void;
}) {
  return (
    <div className="screen-fill bg-bg text-fg">
      <div className="relative z-10 w-[min(92vw,640px)] px-4">
        <Kicker>Environment</Kicker>
        <h1 className="display-title mt-2 mb-6">SELECT STAGE</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {STAGES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => onSelect(s.id)}
              className={`fighter-card text-left ${selected === s.id ? "is-active" : ""}`}
            >
              <div className="text-sm tracking-[0.16em]">{s.name}</div>
              <div className="mt-1 text-[10px] text-muted">{s.subtitle}</div>
              <div className="mt-3 text-[10px] tracking-[0.14em] text-muted">
                BOUNDS {s.boundsX.toFixed(1)}m × {s.boundsZ.toFixed(1)}m
              </div>
            </button>
          ))}
        </div>
        <div className="mt-6 grid grid-cols-2 gap-2">
          <MenuButton onClick={onBack}>BACK</MenuButton>
          <MenuButton active onClick={onConfirm}>FIGHT</MenuButton>
        </div>
      </div>
    </div>
  );
}

export function VersusScreen({
  p1,
  p2,
  stageName,
  loading,
  failed,
}: {
  p1: BannonFighterProfile;
  p2: BannonFighterProfile;
  stageName: string;
  loading: boolean;
  failed: boolean;
}) {
  return (
    <div className="screen-fill bg-bg/55 text-fg">
      <div className="relative z-10 w-full px-6">
        <Kicker>{stageName}</Kicker>
        <div className="mt-8 flex items-center justify-between gap-4">
          <div className="flex-1">
            <div className="text-3xl sm:text-5xl italic tracking-tight">{p1.name.toUpperCase()}</div>
            <div className="mt-2 text-[10px] tracking-[0.2em] text-muted">{p1.attire ?? p1.model}</div>
          </div>
          <div className="text-4xl sm:text-6xl font-semibold text-danger">VS</div>
          <div className="flex-1 text-right">
            <div className="text-3xl sm:text-5xl italic tracking-tight">{p2.name.toUpperCase()}</div>
            <div className="mt-2 text-[10px] tracking-[0.2em] text-muted">{p2.attire ?? p2.model}</div>
          </div>
        </div>
        <div className="mt-12 text-center text-xs tracking-[0.32em] text-accent">
          {failed
            ? "FIGHTER ASSET FAILED — MATCH LOCKED"
            : loading
              ? "LOADING VERIFIED BANNON GLB"
              : "READY"}
        </div>
        {failed && (
          <div className="mt-3 text-center text-[10px] tracking-[0.2em] text-danger">
            NO FALLBACK ACTOR WILL BE USED
          </div>
        )}
      </div>
    </div>
  );
}

export function ResultScreen({
  winner,
  p1,
  p2,
  mode,
  arcadeComplete,
  onRematch,
  onNext,
  onSelect,
  onMenu,
}: {
  winner: "p1" | "p2" | "draw" | null;
  p1: BannonFighterProfile;
  p2: BannonFighterProfile;
  mode: GameMode;
  arcadeComplete: boolean;
  onRematch: () => void;
  onNext: () => void;
  onSelect: () => void;
  onMenu: () => void;
}) {
  const name = winner === "p1" ? p1.name : winner === "p2" ? p2.name : "DRAW";
  return (
    <div className="screen-fill bg-bg text-fg">
      <div className="relative z-10 w-[min(92vw,420px)] px-4 text-center">
        <Kicker>{mode === "arcade" ? "Arcade result" : "Match result"}</Kicker>
        <h1 className="display-hero mt-3">{winner === "draw" ? "DRAW" : "K.O."}</h1>
        <p className="mt-4 text-lg tracking-[0.2em]">{name.toUpperCase()}</p>
        <div className="mt-8 space-y-2">
          {mode === "arcade" && winner === "p1" && !arcadeComplete && (
            <MenuButton active onClick={onNext}>NEXT OPPONENT</MenuButton>
          )}
          {mode === "arcade" && (winner !== "p1" || arcadeComplete) && (
            <MenuButton active onClick={onMenu}>MAIN MENU</MenuButton>
          )}
          {mode !== "arcade" && <MenuButton active onClick={onRematch}>REMATCH</MenuButton>}
          <MenuButton onClick={onSelect}>CHARACTER SELECT</MenuButton>
          <MenuButton onClick={onMenu}>MAIN MENU</MenuButton>
        </div>
      </div>
    </div>
  );
}

export function ArcadeEnd({ onMenu }: { onMenu: () => void }) {
  return (
    <div className="screen-fill bg-bg text-fg">
      <div className="relative z-10 text-center px-6">
        <Kicker>Arcade</Kicker>
        <h1 className="display-hero mt-3">TOUR COMPLETE</h1>
        <p className="mt-4 text-sm text-muted">Five verified Bannon opponents down.</p>
        <div className="mt-8 mx-auto w-[min(92vw,320px)]">
          <MenuButton active onClick={onMenu}>MAIN MENU</MenuButton>
        </div>
      </div>
    </div>
  );
}

export function PauseMenu({
  training,
  dummy,
  onDummy,
  onResetPos,
  onResetHealth,
  onResume,
  onExit,
}: {
  training: boolean;
  dummy: DummyBehavior;
  onDummy: (d: DummyBehavior) => void;
  onResetPos: () => void;
  onResetHealth: () => void;
  onResume: () => void;
  onExit: () => void;
}) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-bg/80">
      <div className="panel w-[min(92vw,360px)] p-5">
        <Kicker>{training ? "Training" : "Paused"}</Kicker>
        <h2 className="mt-2 text-2xl tracking-[0.12em]">PAUSE</h2>
        <div className="mt-5 space-y-2">
          <MenuButton active onClick={onResume}>RESUME</MenuButton>
          {training && (
            <>
              <MenuButton onClick={onResetPos}>RESET POSITIONS</MenuButton>
              <MenuButton onClick={onResetHealth}>RESET HEALTH</MenuButton>
              <div className="grid grid-cols-3 gap-1.5 pt-1">
                {(["stand", "guard", "attack"] as DummyBehavior[]).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => onDummy(d)}
                    className={`menu-btn py-3 text-center text-[11px] ${dummy === d ? "is-active" : ""}`}
                  >
                    {d.toUpperCase()}
                  </button>
                ))}
              </div>
            </>
          )}
          <MenuButton onClick={onExit}>EXIT TO MENU</MenuButton>
        </div>
      </div>
    </div>
  );
}
