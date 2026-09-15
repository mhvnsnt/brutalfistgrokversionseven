import { BANNON_COMBAT_CONTRACT } from "../engine/BannonCombatContract";
import { BANNON_GLB_PLAYABLE_MODELS, type BannonGlbRosterEntry } from "./bannonGlbRoster";

export interface BannonFighterProfile {
  id: string;
  name: string;
  dna: string;
  role: string;
  poise: number;
  hp: number;
  speed: number;
  strength: number;
  physicsScale: number;
  payback: string;
  manager: string;
  bio: string;
  style: string;
  model: string;
  attire?: string;
  rigStatus: BannonGlbRosterEntry["rigStatus"];
  playableGate: "PASS";
}

/**
 * Fighter data is downstream of the GLB-backed identity.
 * Stats/bios are only attached to PASS-gated GLB models.
 * Do not invent lore — identity comes from Bannon source records.
 */
const PROFILE_CORE: Record<
  string,
  Omit<BannonFighterProfile, "model" | "attire" | "rigStatus" | "playableGate" | "name">
> = {
  bannon: {
    id: "bannon",
    dna: "BANNON_V1_CORE",
    role: "Wrestler",
    poise: 95,
    hp: BANNON_COMBAT_CONTRACT.startingHp,
    speed: 85,
    strength: 90,
    physicsScale: 1.1,
    payback: "Beast Mode",
    manager: "None",
    style: "Power wrestling",
    bio: "The physical nucleus and absolute force of the Bannon Engine.",
  },
  maime: {
    id: "maime",
    dna: "MAIME",
    role: "Wrestler",
    poise: 85,
    hp: BANNON_COMBAT_CONTRACT.startingHp,
    speed: 90,
    strength: 78,
    physicsScale: 1,
    payback: "TBD",
    manager: "None",
    style: "Striking wrestler",
    bio: "Bannon GLB-backed fighter.",
  },
  onyx: {
    id: "onyx",
    dna: "ONYX",
    role: "Wrestler",
    poise: 90,
    hp: BANNON_COMBAT_CONTRACT.startingHp,
    speed: 88,
    strength: 86,
    physicsScale: 1,
    payback: "TBD",
    manager: "None",
    style: "Brawler",
    bio: "Bannon GLB-backed fighter.",
  },
  cipher: {
    id: "cipher",
    dna: "CIPHER",
    role: "Wrestler",
    poise: 88,
    hp: BANNON_COMBAT_CONTRACT.startingHp,
    speed: 93,
    strength: 80,
    physicsScale: 1,
    payback: "TBD",
    manager: "None",
    style: "High-speed striker",
    bio: "Bannon GLB-backed fighter.",
  },
  viper: {
    id: "viper",
    dna: "VIPER",
    role: "Wrestler",
    poise: 86,
    hp: BANNON_COMBAT_CONTRACT.startingHp,
    speed: 92,
    strength: 82,
    physicsScale: 1,
    payback: "TBD",
    manager: "None",
    style: "Counter wrestler",
    bio: "Bannon GLB-backed fighter.",
  },
  kobra: {
    id: "kobra",
    dna: "KOBRA",
    role: "Wrestler",
    poise: 87,
    hp: BANNON_COMBAT_CONTRACT.startingHp,
    speed: 91,
    strength: 84,
    physicsScale: 1,
    payback: "TBD",
    manager: "None",
    style: "Submission striker",
    bio: "Bannon GLB-backed fighter.",
  },
  aaron_ruben: {
    id: "aaron_ruben",
    dna: "AARON_RUBEN",
    role: "Wrestler",
    poise: 91,
    hp: BANNON_COMBAT_CONTRACT.startingHp,
    speed: 80,
    strength: 92,
    physicsScale: 1.05,
    payback: "TBD",
    manager: "None",
    style: "Heavy grappler",
    bio: "Bannon GLB-backed fighter.",
  },
};

export function profileFromGlb(entry: BannonGlbRosterEntry): BannonFighterProfile | null {
  if (entry.playableGate !== "PASS") return null;
  const core = PROFILE_CORE[entry.id];
  if (!core) return null;
  return {
    ...core,
    name: entry.name,
    model: entry.model,
    attire: entry.attire,
    rigStatus: entry.rigStatus,
    playableGate: "PASS",
  };
}

export const BANNON_PLAYABLE_ROSTER: readonly BannonFighterProfile[] = BANNON_GLB_PLAYABLE_MODELS
  .map(profileFromGlb)
  .filter((p): p is BannonFighterProfile => p !== null);

export function getPlayableByModel(model: string) {
  return BANNON_PLAYABLE_ROSTER.find((f) => f.model === model) ?? null;
}

export function getPlayableByKey(id: string, model: string) {
  return BANNON_PLAYABLE_ROSTER.find((f) => f.id === id && f.model === model) ?? null;
}

export function uniquePlayableFighters() {
  const seen = new Set<string>();
  return BANNON_PLAYABLE_ROSTER.filter((f) => {
    if (seen.has(f.id)) return false;
    seen.add(f.id);
    return true;
  });
}
