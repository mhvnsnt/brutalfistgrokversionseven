"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { loadSettings, useGameStore } from "./store";
import { BANNON_PLAYABLE_ROSTER } from "./data/bannonRoster";
import { getStage } from "./data/stages";
import { GameEngine } from "./engine/GameEngine";
import { type MatchSnapshot } from "./types";
import { AttractScene, MatchScene } from "./render/MatchScene";
import { useInput } from "./hooks/useInput";
import { playSfx, setMix, startMusic, stopMusic, unlockAudio } from "./audio";
import { MobileControls } from "./ui/MobileControls";
import {
  ArcadeEnd,
  BootScreen,
  CharacterSelect,
  FighterDetails,
  MainMenu,
  OptionsScreen,
  PauseMenu,
  ResultScreen,
  StageSelect,
  TitleScreen,
  VersusScreen,
} from "./ui/screens";

const BOOT_MS = 1600;

export function BrutalFistApp() {
  const store = useGameStore();
  const { p1Ref, p2Ref, setMobile, setKeys } = useInput();
  const engineRef = useRef<GameEngine | null>(null);
  const [mounted, setMounted] = useState(false);
  const [snapshot, setSnapshot] = useState<MatchSnapshot | null>(null);
  const [p1Ready, setP1Ready] = useState(false);
  const [p2Ready, setP2Ready] = useState(false);
  const [loadFail, setLoadFail] = useState(false);
  const [shake, setShake] = useState(0);
  const lastHit = useRef("");
  const lastPhase = useRef<string>("");
  const probeYaw = useRef(0);
  const probeSpeed = useRef(0);

  const p1 = store.p1 ?? BANNON_PLAYABLE_ROSTER[0] ?? null;
  const p2 = store.p2 ?? BANNON_PLAYABLE_ROSTER[1] ?? BANNON_PLAYABLE_ROSTER[0] ?? null;
  const stage = getStage(store.stageId);
  const attractP1 = BANNON_PLAYABLE_ROSTER[0];
  const attractP2 = BANNON_PLAYABLE_ROSTER[1] ?? BANNON_PLAYABLE_ROSTER[0];

  useEffect(() => {
    setMounted(true);
    useGameStore.setState({ settings: loadSettings() });
  }, []);

  useEffect(() => {
    if (store.screen !== "boot") return;
    const t = window.setTimeout(() => store.setScreen("title"), BOOT_MS);
    return () => window.clearTimeout(t);
  }, [store.screen, store]);

  useEffect(() => {
    setMix(store.settings.master, store.settings.music, store.settings.sfx);
  }, [store.settings.master, store.settings.music, store.settings.sfx]);

  const startFromTitle = () => {
    unlockAudio();
    playSfx("start");
    startMusic();
    store.setScreen("menu");
  };

  useEffect(() => {
    if (store.screen === "versus") {
      setP1Ready(false);
      setP2Ready(false);
      setLoadFail(false);
      engineRef.current = null;
      setSnapshot(null);
    }
    if (store.screen !== "versus" && store.screen !== "combat") {
      engineRef.current = null;
      setSnapshot(null);
    }
  }, [store.screen, p1?.model, p2?.model, store.stageId]);

  useEffect(() => {
    if (store.screen !== "versus" || !p1 || !p2) return;
    if (loadFail) return;
    if (!p1Ready || !p2Ready) return;
    const t = window.setTimeout(() => {
      engineRef.current = new GameEngine({
        p1,
        p2,
        stage,
        cpuP2: true,
        dummyBehavior: store.dummyBehavior,
        training: store.mode === "training",
      });
      store.fightersReady();
    }, 700);
    return () => window.clearTimeout(t);
  }, [store.screen, p1Ready, p2Ready, loadFail, p1, p2, stage, store]);

  useEffect(() => {
    if (store.screen !== "combat" || !engineRef.current) return;
    let raf = 0;
    let last = performance.now();
    let acc = 0;
    const step = 1000 / 60;
    const loop = (time: number) => {
      const engine = engineRef.current;
      if (!engine) return;
      engine.setPaused(store.paused);
      acc += Math.min(100, time - last);
      last = time;
      while (acc >= step) {
        engine.tick(p1Ref.current, p2Ref.current);
        acc -= step;
      }
      const snap = engine.getSnapshot();
      setSnapshot(snap);
      probeYaw.current = snap.p1.facing === 1 ? Math.PI / 2 : -Math.PI / 2;
      probeSpeed.current = Math.hypot(
        (p1Ref.current.left || p1Ref.current.right || p1Ref.current.up || p1Ref.current.down) ? 1 : 0,
        0,
      );
      const healthKey = `${snap.p1.health}:${snap.p2.health}:${snap.p1.state}:${snap.p2.state}`;
      if (healthKey !== lastHit.current) {
        const wasHit = lastHit.current;
        lastHit.current = healthKey;
        if (wasHit && (snap.p1.state === "Hitstun" || snap.p2.state === "Hitstun")) {
          playSfx(snap.hitStopFrames >= 4 ? "heavy" : "hit");
          if (store.settings.cameraShake) setShake(1);
        } else if (wasHit && (snap.p1.state === "Blockstun" || snap.p2.state === "Blockstun")) {
          playSfx("block");
        }
      }
      if (snap.phase !== lastPhase.current) {
        lastPhase.current = snap.phase;
        if (snap.phase === "matchOver") {
          playSfx("ko");
          window.setTimeout(() => store.matchFinished(snap.winner ?? "draw"), 1400);
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [store.screen, store.paused, store.settings.cameraShake, store, p1Ref, p2Ref]);

  useEffect(() => {
    if (shake <= 0) return;
    const id = requestAnimationFrame(() => setShake((s) => s * 0.78));
    return () => cancelAnimationFrame(id);
  }, [shake]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "KeyP" && store.screen === "combat") {
        store.setPaused(!store.paused);
      }
      if (e.code === "Enter" && store.screen === "title") startFromTitle();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [store]);

  useEffect(() => {
    window.__controlsTest = {
      getYaw: () => probeYaw.current,
      getSpeed: () => {
        const s = snapshot;
        if (!s) return probeSpeed.current;
        return Math.abs(s.p1.x) + Math.abs(s.p1.z) > 0 ? 1 : probeSpeed.current;
      },
      setKeys: (codes: string[]) => setKeys(codes),
    };
    return () => {
      delete window.__controlsTest;
    };
  }, [snapshot, setKeys]);

  const onP1Ready = useCallback((ok: boolean) => {
    setP1Ready(ok);
    if (!ok) setLoadFail(true);
  }, []);
  const onP2Ready = useCallback((ok: boolean) => {
    setP2Ready(ok);
    if (!ok) setLoadFail(true);
  }, []);

  if (!mounted) {
    return <div className="h-[100dvh] w-full bg-bg" />;
  }

  if (!BANNON_PLAYABLE_ROSTER.length) {
    return (
      <div className="screen-fill bg-bg text-fg">
        <div className="text-center">
          <div className="kicker text-danger">Roster locked</div>
          <h1 className="display-title mt-3">NO VALID BANNON GLB FIGHTERS</h1>
          <p className="mt-4 text-xs tracking-[0.22em] text-muted">NO GLB = NO CHARACTER</p>
        </div>
      </div>
    );
  }

  const showAttract = store.screen === "title" || store.screen === "menu";

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-bg text-fg touch-none">
      {showAttract && attractP1 && attractP2 && (
        <AttractScene p1={p1 ?? attractP1} p2={p2 ?? attractP2} stage={stage} graphics={store.settings.graphics} />
      )}
      {store.screen === "combat" && snapshot && p1 && p2 && (
        <MatchScene
          snapshot={snapshot}
          p1={p1}
          p2={p2}
          stage={stage}
          graphics={store.settings.graphics}
          shake={shake}
        />
      )}

      {store.screen === "boot" && <BootScreen />}
      {store.screen === "title" && <TitleScreen onStart={startFromTitle} />}
      {store.screen === "menu" && (
        <MainMenu
          onMode={(m) => {
            playSfx("confirm");
            store.beginMode(m);
          }}
          onOptions={() => {
            playSfx("menu");
            store.setScreen("options");
          }}
        />
      )}
      {store.screen === "options" && (
        <OptionsScreen
          settings={store.settings}
          onPatch={store.patchSettings}
          onBack={() => store.setScreen("menu")}
        />
      )}
      {store.screen === "select" && (
        <CharacterSelect
          slot={store.selecting}
          mode={store.mode}
          selected={store.selecting === "p1" ? store.p1 : store.p2}
          other={store.selecting === "p1" ? store.p2 : store.p1}
          onHover={(f) => {
            playSfx("menu");
            store.setFighter(store.selecting, f);
          }}
          onConfirm={() => {
            playSfx("confirm");
            store.confirmSelect();
          }}
          onBack={store.backToMenu}
        />
      )}
      {store.screen === "details" && p1 && (
        <FighterDetails
          fighter={store.selecting === "p2" && store.p2 ? store.p2 : p1}
          opponent={store.mode === "arcade" ? p2 : store.selecting === "p2" ? p1 : p2}
          onContinue={() => {
            playSfx("confirm");
            store.confirmDetails();
          }}
          onBack={() => store.setScreen("select")}
        />
      )}
      {store.screen === "stage" && (
        <StageSelect
          selected={store.stageId}
          onSelect={store.setStage}
          onConfirm={() => {
            playSfx("confirm");
            store.confirmStage();
          }}
          onBack={() => store.setScreen("details")}
        />
      )}
      {store.screen === "versus" && p1 && p2 && (
        <>
          <div className="absolute inset-0">
            <MatchScene
              snapshot={{
                frame: 0,
                phase: "intro",
                round: 1,
                roundsToWin: 2,
                timerFrames: 0,
                timerSeconds: 99,
                hitStopFrames: 0,
                p1: {
                  health: p1.hp,
                  maxHealth: p1.hp,
                  poise: p1.poise,
                  maxPoise: p1.poise,
                  x: -2,
                  z: 0,
                  facing: 1,
                  state: "Neutral" as never,
                  stateFrame: 0,
                  animation: "idle",
                  move: null,
                  guarding: false,
                  crouching: false,
                  roundsWon: 0,
                },
                p2: {
                  health: p2.hp,
                  maxHealth: p2.hp,
                  poise: p2.poise,
                  maxPoise: p2.poise,
                  x: 2,
                  z: 0,
                  facing: -1,
                  state: "Neutral" as never,
                  stateFrame: 0,
                  animation: "idle",
                  move: null,
                  guarding: false,
                  crouching: false,
                  roundsWon: 0,
                },
                grapplePhase: "none",
                grappleEscapeMeter: 0,
                lastResult: null,
                winner: null,
              }}
              p1={p1}
              p2={p2}
              stage={stage}
              graphics={store.settings.graphics}
              shake={0}
              onP1Ready={onP1Ready}
              onP2Ready={onP2Ready}
            />
          </div>
          <VersusScreen
            p1={p1}
            p2={p2}
            stageName={stage.name}
            loading={!p1Ready || !p2Ready}
            failed={loadFail}
          />
        </>
      )}
      {store.screen === "combat" && snapshot && p1 && p2 && (
        <>
          <MatchHud snapshot={snapshot} p1Name={p1.name} p2Name={p2.name} />
          {!store.paused && snapshot.phase !== "matchOver" && <MobileControls setMobile={setMobile} />}
          {store.paused && (
            <PauseMenu
              training={store.mode === "training"}
              dummy={store.dummyBehavior}
              onDummy={(d) => {
                store.setDummy(d);
                engineRef.current?.setDummyBehavior(d);
              }}
              onResetPos={() => engineRef.current?.resetPositions()}
              onResetHealth={() => engineRef.current?.resetHealth()}
              onResume={() => store.setPaused(false)}
              onExit={() => {
                stopMusic();
                store.backToMenu();
              }}
            />
          )}
        </>
      )}
      {store.screen === "result" && p1 && p2 && (
        <ResultScreen
          winner={store.lastWinner}
          p1={p1}
          p2={p2}
          mode={store.mode}
          arcadeComplete={store.arcadeWins >= 5}
          onRematch={() => {
            playSfx("confirm");
            store.rematch();
          }}
          onNext={() => {
            playSfx("confirm");
            store.nextArcade();
          }}
          onSelect={store.backToSelect}
          onMenu={() => {
            stopMusic();
            store.backToMenu();
          }}
        />
      )}
      {store.screen === "arcade-end" && <ArcadeEnd onMenu={store.backToMenu} />}
    </div>
  );
}

function MatchHud({
  snapshot,
  p1Name,
  p2Name,
}: {
  snapshot: MatchSnapshot;
  p1Name: string;
  p2Name: string;
}) {
  const p1pct = (snapshot.p1.health / snapshot.p1.maxHealth) * 100;
  const p2pct = (snapshot.p2.health / snapshot.p2.maxHealth) * 100;
  const ko = snapshot.phase === "matchOver" || snapshot.p1.health <= 0 || snapshot.p2.health <= 0;
  return (
    <div className="pointer-events-none absolute inset-0 z-30">
      <div className="flex items-start gap-3 px-3 pt-3 sm:px-5 sm:pt-4">
        <div className="flex-1">
          <div className="health-track">
            <div className="health-fill" style={{ width: `${p1pct}%` }} />
          </div>
          <div className="mt-1 flex justify-between text-[10px] tracking-[0.16em] text-muted">
            <span>{p1Name.toUpperCase()}</span>
            <span className="tabular-nums">{snapshot.p1.roundsWon}</span>
          </div>
        </div>
        <div className="min-w-14 text-center">
          <div className="font-mono text-lg tabular-nums text-fg">{snapshot.timerSeconds}</div>
          <div className="text-[9px] tracking-[0.2em] text-muted">R{snapshot.round}</div>
        </div>
        <div className="flex-1">
          <div className="health-track">
            <div className="health-fill ml-auto" style={{ width: `${p2pct}%` }} />
          </div>
          <div className="mt-1 flex justify-between text-[10px] tracking-[0.16em] text-muted">
            <span className="tabular-nums">{snapshot.p2.roundsWon}</span>
            <span>{p2Name.toUpperCase()}</span>
          </div>
        </div>
      </div>
      {snapshot.phase === "intro" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-4xl sm:text-6xl tracking-[0.18em] text-fg">ROUND {snapshot.round}</div>
        </div>
      )}
      {snapshot.grapplePhase !== "none" && snapshot.grapplePhase !== "escaped" && (
        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.22em] text-accent">
          {snapshot.grapplePhase.toUpperCase()} · ESC {Math.round(snapshot.grappleEscapeMeter)}
        </div>
      )}
      {ko && snapshot.phase === "matchOver" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="display-hero text-danger">K.O.</div>
        </div>
      )}
      <div className="absolute bottom-3 left-3 hidden text-[9px] tracking-[0.14em] text-muted md:block">
        WASD MOVE · J LIGHT · K HEAVY · L GUARD · U GRAPPLE · I ESCAPE · O PIN · P PAUSE
      </div>
    </div>
  );
}
