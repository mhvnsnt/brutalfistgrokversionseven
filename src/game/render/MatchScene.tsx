import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { StageMesh } from "./StageMesh";
import { FighterMesh } from "./FighterMesh";
import { PSX_PROFILES } from "./psx";
import type { GraphicsProfile } from "../types";
import type { MatchSnapshot } from "../types";
import type { BannonFighterProfile } from "../data/bannonRoster";
import type { StageDefinition } from "../data/stages";

const _desired = new THREE.Vector3();
const _look = new THREE.Vector3();

function CameraRig({
  p1x,
  p1z,
  p2x,
  p2z,
  shake,
}: {
  p1x: number;
  p1z: number;
  p2x: number;
  p2z: number;
  shake: number;
}) {
  useFrame(({ camera }) => {
    const midX = (p1x + p2x) * 0.5;
    const midZ = (p1z + p2z) * 0.5;
    const sep = Math.hypot(p2x - p1x, p2z - p1z);
    const dist = THREE.MathUtils.clamp(sep + 4.4, 6.4, 11.2);
    _desired.set(midX + shake * 0.08, 2.55, midZ + dist);
    _look.set(midX, 1.15, midZ);
    camera.position.lerp(_desired, 0.085);
    camera.lookAt(_look);
  });
  return null;
}

export function MatchScene({
  snapshot,
  p1,
  p2,
  stage,
  graphics,
  shake,
  onP1Ready,
  onP2Ready,
}: {
  snapshot: MatchSnapshot;
  p1: BannonFighterProfile;
  p2: BannonFighterProfile;
  stage: StageDefinition;
  graphics: GraphicsProfile;
  shake: number;
  onP1Ready?: (ok: boolean) => void;
  onP2Ready?: (ok: boolean) => void;
}) {
  const profile = PSX_PROFILES[graphics];
  const dpr: number | [number, number] = graphics === "HIGH_RES" ? [1, 1.5] : profile.renderScale;
  const p1Ready = useRef(onP1Ready);
  const p2Ready = useRef(onP2Ready);
  p1Ready.current = onP1Ready;
  p2Ready.current = onP2Ready;

  const lights = useMemo(
    () => ({
      ambient: stage.ambient,
      key: stage.keyLight,
      fill: stage.fillLight,
    }),
    [stage],
  );

  return (
    <div className="absolute inset-0 overflow-hidden bg-bg">
      <Canvas
        dpr={dpr}
        shadows
        gl={{ antialias: false, powerPreference: "high-performance" }}
        camera={{ position: [0, 2.6, 9.2], fov: 36, near: 0.1, far: 80 }}
        style={{ width: "100%", height: "100%", imageRendering: "pixelated" }}
      >
        <color attach="background" args={[stage.skyColor]} />
        <fog attach="fog" args={[stage.fogColor, 10, 26]} />
        <ambientLight intensity={lights.ambient} />
        <directionalLight position={[4, 8, 6]} intensity={lights.key} castShadow />
        <directionalLight position={[-6, 3, -2]} intensity={lights.fill} />
        <CameraRig p1x={snapshot.p1.x} p1z={snapshot.p1.z} p2x={snapshot.p2.x} p2z={snapshot.p2.z} shake={shake} />
        <StageMesh stage={stage} />
        <FighterMesh
          model={p1.model}
          animation={snapshot.p1.animation}
          position={[snapshot.p1.x, 0, snapshot.p1.z]}
          facing={snapshot.p1.facing}
          snap={profile.snap}
          onReady={(ok) => p1Ready.current?.(ok)}
        />
        <FighterMesh
          model={p2.model}
          animation={snapshot.p2.animation}
          position={[snapshot.p2.x, 0, snapshot.p2.z]}
          facing={snapshot.p2.facing}
          snap={profile.snap}
          onReady={(ok) => p2Ready.current?.(ok)}
        />
      </Canvas>
      <div className="scanlines pointer-events-none absolute inset-0" />
    </div>
  );
}

export function AttractScene({
  p1,
  p2,
  stage,
  graphics,
}: {
  p1: BannonFighterProfile;
  p2: BannonFighterProfile;
  stage: StageDefinition;
  graphics: GraphicsProfile;
}) {
  const dummy: MatchSnapshot = {
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
      x: -2.1,
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
      x: 2.1,
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
  };
  return <MatchScene snapshot={dummy} p1={p1} p2={p2} stage={stage} graphics={graphics} shake={0} />;
}
