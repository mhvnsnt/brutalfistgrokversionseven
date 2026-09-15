import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { PSX_VERTEX_SNAP } from "./psx";
import type { FighterAnimation } from "../types";
import { glbPublicUrl } from "../data/bannonGlbRoster";

interface FighterMeshProps {
  model: string;
  animation: FighterAnimation;
  position: [number, number, number];
  facing: 1 | -1;
  snap: number;
  onReady?: (ok: boolean) => void;
}

const ALIASES: Record<string, string[]> = {
  idle: ["idle", "Idle", "neutral", "standing"],
  walk: ["walk", "Walk", "walking", "run"],
  crouch: ["crouch", "Crouch"],
  light: ["light", "Light", "punch", "Punch", "attack"],
  heavy: ["heavy", "Heavy", "strong"],
  guard: ["guard", "Guard", "block", "Block"],
  hit: ["hit", "Hit", "hurt", "flinch"],
  block: ["block", "Block", "guard"],
  grapple: ["grapple", "Grapple", "clinch"],
  throw: ["throw", "Throw"],
  pin: ["pin", "Pin"],
  knockdown: ["knockdown", "down", "fall"],
  wake: ["wake", "getup", "standup"],
  ko: ["ko", "KO", "knockout", "death"],
  victory: ["win", "victory", "idle"],
};

export function FighterMesh({
  model,
  animation,
  position,
  facing,
  snap,
  onReady,
}: FighterMeshProps) {
  const groupRef = useRef<THREE.Group>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const actionsRef = useRef<Record<string, THREE.AnimationAction>>({});
  const activeRef = useRef<THREE.AnimationAction | null>(null);
  const [root, setRoot] = useState<THREE.Group | null>(null);
  const [failed, setFailed] = useState(false);
  const url = glbPublicUrl(model);

  const snapSnippet = useMemo(
    () => PSX_VERTEX_SNAP.replace("SNAP_RES", snap > 0 ? snap.toFixed(1) : "0.0"),
    [snap],
  );
  const readyRef = useRef(onReady);
  readyRef.current = onReady;

  useEffect(() => {
    let live = true;
    setRoot(null);
    setFailed(false);
    const loader = new GLTFLoader();
    loader.load(
      url,
      (gltf) => {
        if (!live) return;
        const cloned = gltf.scene.clone(true);
        const box = new THREE.Box3().setFromObject(cloned);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const scale = size.y > 0 ? 2.55 / size.y : 1;
        cloned.scale.setScalar(scale);
        cloned.position.set(-center.x * scale, -box.min.y * scale, -center.z * scale);

        cloned.traverse((child) => {
          const mesh = child as THREE.Mesh;
          if (!mesh.isMesh) return;
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          materials.forEach((material) => {
            const mat = material as THREE.MeshStandardMaterial;
            mat.flatShading = true;
            mat.metalness = Math.min(mat.metalness ?? 0, 0.15);
            mat.roughness = Math.max(mat.roughness ?? 0.8, 0.72);
            if (mat.map) {
              mat.map.minFilter = THREE.NearestFilter;
              mat.map.magFilter = THREE.NearestFilter;
              mat.map.generateMipmaps = false;
            }
            if (snap > 0) {
              mat.onBeforeCompile = (shader) => {
                shader.vertexShader = shader.vertexShader.replace(
                  "#include <project_vertex>",
                  snapSnippet,
                );
              };
            }
            mat.needsUpdate = true;
          });
        });

        mixerRef.current = new THREE.AnimationMixer(cloned);
        actionsRef.current = {};
        for (const clip of gltf.animations) {
          actionsRef.current[clip.name] = mixerRef.current.clipAction(clip);
        }
        setRoot(cloned);
        readyRef.current?.(true);
      },
      undefined,
      () => {
        if (!live) return;
        setFailed(true);
        readyRef.current?.(false);
      },
    );
    return () => {
      live = false;
      mixerRef.current?.stopAllAction();
      mixerRef.current = null;
      actionsRef.current = {};
    };
  }, [url, snap, snapSnippet]);

  useEffect(() => {
    if (!root) return;
    const aliases = ALIASES[animation] ?? [animation];
    const names = Object.keys(actionsRef.current);
    const match =
      names.find((n) => aliases.some((a) => n.toLowerCase() === a.toLowerCase())) ??
      names.find((n) => aliases.some((a) => n.toLowerCase().includes(a.toLowerCase())));
    const next = match ? actionsRef.current[match] : null;
    if (next === activeRef.current) return;
    activeRef.current?.fadeOut(0.08);
    if (next) {
      const loop = animation === "idle" || animation === "walk" || animation === "guard" || animation === "crouch";
      next.reset().fadeIn(0.08).play();
      next.setLoop(loop ? THREE.LoopRepeat : THREE.LoopOnce, loop ? Infinity : 1);
    }
    activeRef.current = next;
  }, [animation, root]);

  useFrame(({ clock }, delta) => {
    mixerRef.current?.update(delta);
    const g = groupRef.current;
    if (!g) return;
    const t = clock.elapsedTime;
    let y = position[1];
    let rotX = 0;
    let scaleY = 1;
    if (animation === "idle") y += Math.sin(t * 5) * 0.03;
    if (animation === "walk") y += Math.abs(Math.sin(t * 9)) * 0.06;
    if (animation === "light") rotX = -0.18;
    if (animation === "heavy") rotX = -0.32;
    if (animation === "hit") rotX = 0.22;
    if (animation === "block" || animation === "guard") rotX = 0.08;
    if (animation === "crouch") {
      y -= 0.28;
      scaleY = 0.82;
    }
    if (animation === "knockdown" || animation === "ko") {
      rotX = 1.15;
      y += 0.15;
    }
    if (animation === "wake") rotX = 0.4;
    if (animation === "grapple") rotX = -0.12;
    if (animation === "throw") rotX = -0.4;
    if (animation === "pin") {
      y -= 0.35;
      rotX = 0.55;
    }
    g.position.set(position[0], y, position[2]);
    g.rotation.set(rotX, facing === 1 ? Math.PI / 2 : -Math.PI / 2, 0);
    g.scale.set(1, scaleY, 1);
  });

  if (failed) return null;
  if (!root) return null;

  return (
    <group ref={groupRef} position={position}>
      <primitive object={root} />
    </group>
  );
}
