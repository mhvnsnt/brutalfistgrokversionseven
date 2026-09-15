import { create } from "zustand";
import type { AppScreen, DummyBehavior, GameMode, GraphicsProfile } from "./types";
import type { BannonFighterProfile } from "./data/bannonRoster";
import { BANNON_PLAYABLE_ROSTER } from "./data/bannonRoster";
import type { StageId } from "./data/stages";
import { STAGES } from "./data/stages";

export type SelectSlot = "p1" | "p2";

export interface GameSettings {
  graphics: GraphicsProfile;
  master: number;
  music: number;
  sfx: number;
  cameraShake: boolean;
}

const DEFAULT_SETTINGS: GameSettings = {
  graphics: "PS1_3D",
  master: 0.8,
  music: 0.45,
  sfx: 0.85,
  cameraShake: true,
};

const SETTINGS_KEY = "brutal-fist-settings";

export function loadSettings(): GameSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<GameSettings>;
    return { ...DEFAULT_SETTINGS, ...parsed, graphics: parsed.graphics === "RETRO8" ? "RETRO8" : "PS1_3D" };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function saveSettings(settings: GameSettings) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

interface GameStore {
  screen: AppScreen;
  mode: GameMode;
  selecting: SelectSlot;
  p1: BannonFighterProfile | null;
  p2: BannonFighterProfile | null;
  stageId: StageId;
  arcadeIndex: number;
  arcadeWins: number;
  lastWinner: "p1" | "p2" | "draw" | null;
  dummyBehavior: DummyBehavior;
  paused: boolean;
  settings: GameSettings;
  setScreen: (screen: AppScreen) => void;
  setMode: (mode: GameMode) => void;
  setSelecting: (slot: SelectSlot) => void;
  setFighter: (slot: SelectSlot, fighter: BannonFighterProfile) => void;
  setStage: (id: StageId) => void;
  setDummy: (behavior: DummyBehavior) => void;
  setPaused: (paused: boolean) => void;
  patchSettings: (patch: Partial<GameSettings>) => void;
  beginMode: (mode: GameMode) => void;
  confirmSelect: () => void;
  confirmDetails: () => void;
  confirmStage: () => void;
  fightersReady: () => void;
  matchFinished: (winner: "p1" | "p2" | "draw") => void;
  rematch: () => void;
  nextArcade: () => void;
  backToMenu: () => void;
  backToSelect: () => void;
}

function nextArcadeOpponent(p1: BannonFighterProfile, index: number) {
  const others = BANNON_PLAYABLE_ROSTER.filter((f) => f.model !== p1.model);
  if (!others.length) return BANNON_PLAYABLE_ROSTER[0];
  return others[index % others.length];
}

export const useGameStore = create<GameStore>()((set, get) => ({
  screen: "boot",
  mode: "versus",
  selecting: "p1",
  p1: BANNON_PLAYABLE_ROSTER[0] ?? null,
  p2: BANNON_PLAYABLE_ROSTER[1] ?? BANNON_PLAYABLE_ROSTER[0] ?? null,
  stageId: STAGES[0].id,
  arcadeIndex: 0,
  arcadeWins: 0,
  lastWinner: null,
  dummyBehavior: "stand",
  paused: false,
  settings: DEFAULT_SETTINGS,
  setScreen: (screen) => set({ screen, paused: false }),
  setMode: (mode) => set({ mode }),
  setSelecting: (slot) => set({ selecting: slot }),
  setFighter: (slot, fighter) => set({ [slot]: fighter }),
  setStage: (id) => set({ stageId: id }),
  setDummy: (behavior) => set({ dummyBehavior: behavior }),
  setPaused: (paused) => set({ paused }),
  patchSettings: (patch) => {
    const settings = { ...get().settings, ...patch };
    saveSettings(settings);
    set({ settings });
  },
  beginMode: (mode) =>
    set({
      mode,
      selecting: "p1",
      screen: "select",
      arcadeIndex: 0,
      arcadeWins: 0,
      lastWinner: null,
      paused: false,
    }),
  confirmSelect: () => {
    const { mode, selecting, p1 } = get();
    if (mode === "versus" && selecting === "p1") {
      set({ selecting: "p2", screen: "select" });
      return;
    }
    if (mode === "arcade" && p1) {
      set({ p2: nextArcadeOpponent(p1, 0), arcadeIndex: 0, screen: "details" });
      return;
    }
    set({ screen: "details" });
  },
  confirmDetails: () => set({ screen: "stage" }),
  confirmStage: () => set({ screen: "versus" }),
  fightersReady: () => set({ screen: "combat", paused: false }),
  matchFinished: (winner) => {
    const { mode, arcadeWins } = get();
    set({
      lastWinner: winner,
      paused: false,
      screen: "result",
      arcadeWins: mode === "arcade" && winner === "p1" ? arcadeWins + 1 : arcadeWins,
    });
  },
  rematch: () => set({ screen: "versus", paused: false, lastWinner: null }),
  nextArcade: () => {
    const { p1, arcadeIndex } = get();
    if (!p1) return;
    const next = arcadeIndex + 1;
    const ladder = BANNON_PLAYABLE_ROSTER.filter((f) => f.model !== p1.model);
    if (next >= Math.min(5, ladder.length)) {
      set({ screen: "arcade-end" });
      return;
    }
    set({
      arcadeIndex: next,
      p2: nextArcadeOpponent(p1, next),
      screen: "versus",
      lastWinner: null,
    });
  },
  backToMenu: () =>
    set({
      screen: "menu",
      paused: false,
      selecting: "p1",
      lastWinner: null,
    }),
  backToSelect: () =>
    set({
      screen: "select",
      selecting: "p1",
      paused: false,
      lastWinner: null,
    }),
}));
