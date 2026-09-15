/**
 * Shared Bannon -> Brutal Fist combat contract.
 * Sourced from Bannon's architecture ledger. Browser runtime is a
 * compatibility surface — native Jolt remains physics owner.
 */
export const BANNON_COMBAT_CONTRACT = {
  tickRate: 60,
  maxBodyVelocityMps: 3.8,
  damageScale: 8,
  maxHitStopFrames: 5,
  heavyHitStopFrames: 4,
  physicalPinShoulderToleranceM: 0.15,
  startingHp: 10000,
  poise: {
    enabled: true,
    zeroBehavior: "full-body-ragdoll",
  },
  rootMotion: {
    bounded: true,
    sweptCollision: true,
    nativeOwner: "C++",
  },
  hitReaction: {
    activeRagdollBlendOnHeavy: 1,
    nativePhysicsOwner: "Jolt",
  },
} as const;

export function boundedRootMotionVelocityMetersPerSecond(rawVelocity: number) {
  if (!Number.isFinite(rawVelocity)) return 0;
  return Math.max(
    -BANNON_COMBAT_CONTRACT.maxBodyVelocityMps,
    Math.min(BANNON_COMBAT_CONTRACT.maxBodyVelocityMps, rawVelocity),
  );
}

export function hitStopFramesForImpact(force: number) {
  if (!Number.isFinite(force) || force <= 0) return 0;
  if (force < BANNON_COMBAT_CONTRACT.damageScale * 0.75) return 0;
  const normalized = Math.min(1, force / (BANNON_COMBAT_CONTRACT.damageScale * 2));
  return Math.max(
    3,
    Math.min(
      BANNON_COMBAT_CONTRACT.maxHitStopFrames,
      Math.round(3 + normalized * 2),
    ),
  );
}

export function isPhysicalPin(
  leftShoulderDistanceM: number,
  rightShoulderDistanceM: number,
) {
  return (
    Number.isFinite(leftShoulderDistanceM) &&
    Number.isFinite(rightShoulderDistanceM) &&
    leftShoulderDistanceM <= BANNON_COMBAT_CONTRACT.physicalPinShoulderToleranceM &&
    rightShoulderDistanceM <= BANNON_COMBAT_CONTRACT.physicalPinShoulderToleranceM
  );
}
