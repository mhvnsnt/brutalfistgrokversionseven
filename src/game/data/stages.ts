export type StageId = "iron-pit" | "hall-ring" | "night-roof" | "training-gym";

export interface StageDefinition {
  id: StageId;
  name: string;
  subtitle: string;
  boundsX: number;
  boundsZ: number;
  spawnX: number;
  floorColor: string;
  wallColor: string;
  accentColor: string;
  fogColor: string;
  skyColor: string;
  ambient: number;
  keyLight: number;
  fillLight: number;
  kind: "warehouse" | "ring" | "rooftop" | "gym";
}

export const STAGES: readonly StageDefinition[] = [
  {
    id: "iron-pit",
    name: "IRON PIT",
    subtitle: "Abandoned foundry floor",
    boundsX: 5.5,
    boundsZ: 2.35,
    spawnX: 2.2,
    floorColor: "#2a2620",
    wallColor: "#1a1612",
    accentColor: "#6a3a28",
    fogColor: "#12100e",
    skyColor: "#0e0c0a",
    ambient: 0.55,
    keyLight: 2.4,
    fillLight: 0.7,
    kind: "warehouse",
  },
  {
    id: "hall-ring",
    name: "HALL STREET",
    subtitle: "Four ropes, no mercy",
    boundsX: 4.6,
    boundsZ: 2.1,
    spawnX: 1.85,
    floorColor: "#1c2420",
    wallColor: "#141816",
    accentColor: "#8a8a86",
    fogColor: "#101412",
    skyColor: "#0c1010",
    ambient: 0.7,
    keyLight: 2.8,
    fillLight: 0.9,
    kind: "ring",
  },
  {
    id: "night-roof",
    name: "NIGHT ROOF",
    subtitle: "City edge, open sky",
    boundsX: 5.8,
    boundsZ: 2.5,
    spawnX: 2.35,
    floorColor: "#242428",
    wallColor: "#16161c",
    accentColor: "#3a4250",
    fogColor: "#0a0c14",
    skyColor: "#080a12",
    ambient: 0.45,
    keyLight: 1.8,
    fillLight: 0.55,
    kind: "rooftop",
  },
  {
    id: "training-gym",
    name: "TRAINING GYM",
    subtitle: "Mats, lights, repetition",
    boundsX: 5.2,
    boundsZ: 2.2,
    spawnX: 2.05,
    floorColor: "#2c2418",
    wallColor: "#1c1814",
    accentColor: "#5a5044",
    fogColor: "#141210",
    skyColor: "#12100e",
    ambient: 0.85,
    keyLight: 2.2,
    fillLight: 1.1,
    kind: "gym",
  },
];

export function getStage(id: StageId) {
  return STAGES.find((s) => s.id === id) ?? STAGES[0];
}
