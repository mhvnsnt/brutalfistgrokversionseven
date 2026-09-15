import { useMemo } from "react";
import type { StageDefinition } from "../data/stages";

export function StageMesh({ stage }: { stage: StageDefinition }) {
  const posts = useMemo(
    () =>
      [
        [-stage.boundsX, -stage.boundsZ],
        [stage.boundsX, -stage.boundsZ],
        [-stage.boundsX, stage.boundsZ],
        [stage.boundsX, stage.boundsZ],
      ] as const,
    [stage.boundsX, stage.boundsZ],
  );

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
        <planeGeometry args={[28, 22]} />
        <meshStandardMaterial color={stage.floorColor} roughness={1} metalness={0} flatShading />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[stage.boundsX * 2.2, stage.boundsZ * 2.4]} />
        <meshStandardMaterial color={stage.accentColor} roughness={0.95} flatShading />
      </mesh>
      <gridHelper
        args={[stage.boundsX * 2.2, 10, "#3a342c", "#26221c"]}
        position={[0, 0.02, 0]}
      />

      {stage.kind === "ring" && (
        <>
          {posts.map(([x, z], i) => (
            <mesh key={i} position={[x, 0.7, z]} castShadow>
              <boxGeometry args={[0.16, 1.4, 0.16]} />
              <meshStandardMaterial color="#c8c4b8" roughness={0.4} metalness={0.3} flatShading />
            </mesh>
          ))}
          {[0.35, 0.7, 1.05].map((y) => (
            <group key={y}>
              <mesh position={[0, y, -stage.boundsZ]}>
                <boxGeometry args={[stage.boundsX * 2, 0.05, 0.05]} />
                <meshStandardMaterial color="#d0ccc4" flatShading />
              </mesh>
              <mesh position={[0, y, stage.boundsZ]}>
                <boxGeometry args={[stage.boundsX * 2, 0.05, 0.05]} />
                <meshStandardMaterial color="#d0ccc4" flatShading />
              </mesh>
              <mesh position={[-stage.boundsX, y, 0]}>
                <boxGeometry args={[0.05, 0.05, stage.boundsZ * 2]} />
                <meshStandardMaterial color="#d0ccc4" flatShading />
              </mesh>
              <mesh position={[stage.boundsX, y, 0]}>
                <boxGeometry args={[0.05, 0.05, stage.boundsZ * 2]} />
                <meshStandardMaterial color="#d0ccc4" flatShading />
              </mesh>
            </group>
          ))}
        </>
      )}

      {stage.kind === "warehouse" && (
        <>
          <mesh position={[0, 2.4, -7.4]}>
            <boxGeometry args={[22, 5, 0.4]} />
            <meshStandardMaterial color={stage.wallColor} flatShading />
          </mesh>
          {[-8, -3, 3, 8].map((x) => (
            <mesh key={x} position={[x, 2.2, -6.8]} castShadow>
              <boxGeometry args={[0.5, 4.4, 0.5]} />
              <meshStandardMaterial color="#3a3228" flatShading />
            </mesh>
          ))}
          <mesh position={[-9, 0.4, 3.2]} castShadow>
            <boxGeometry args={[2.4, 0.8, 1.2]} />
            <meshStandardMaterial color="#4a3828" flatShading />
          </mesh>
          <mesh position={[8.5, 0.55, 2.6]} castShadow>
            <boxGeometry args={[1.6, 1.1, 1.6]} />
            <meshStandardMaterial color="#2c241c" flatShading />
          </mesh>
        </>
      )}

      {stage.kind === "rooftop" && (
        <>
          {[-10, -6, -2, 3, 7, 11].map((x, i) => (
            <mesh key={x} position={[x, 1.2 + (i % 3) * 0.8, -10]}>
              <boxGeometry args={[2.4, 2.4 + (i % 3) * 1.6, 2.4]} />
              <meshStandardMaterial color="#1a1c24" flatShading />
            </mesh>
          ))}
          <mesh position={[0, 0.08, 0]}>
            <boxGeometry args={[stage.boundsX * 2.4, 0.16, stage.boundsZ * 2.6]} />
            <meshStandardMaterial color="#303038" flatShading />
          </mesh>
        </>
      )}

      {stage.kind === "gym" && (
        <>
          <mesh position={[0, 2.1, -6.5]}>
            <boxGeometry args={[16, 4.2, 0.2]} />
            <meshStandardMaterial color="#2a2620" roughness={0.3} metalness={0.1} flatShading />
          </mesh>
          {[-5, 5].map((x) => (
            <mesh key={x} position={[x, 0.45, 3.4]} castShadow>
              <boxGeometry args={[1.8, 0.9, 0.7]} />
              <meshStandardMaterial color="#3a3228" flatShading />
            </mesh>
          ))}
        </>
      )}

      <mesh position={[0, 1.6, 8]} rotation={[0.1, 0, 0]}>
        <planeGeometry args={[30, 8]} />
        <meshStandardMaterial color={stage.skyColor} flatShading />
      </mesh>
    </group>
  );
}
