import { useEffect, useRef } from "react";
import { EMPTY_INPUT, type InputBitmask } from "../types";

export type ControlsProbe = {
  getYaw: () => number;
  getSpeed: () => number;
  setSteer?: (v: number) => void;
  setKeys?: (codes: string[]) => void;
};

declare global {
  interface Window {
    __controlsTest?: ControlsProbe;
  }
}

function applyCode(input: InputBitmask, code: string, pressed: boolean, player: 1 | 2) {
  if (player === 1) {
    switch (code) {
      case "KeyW":
      case "ArrowUp":
        if (code === "KeyW") input.up = pressed;
        break;
      case "KeyS":
        input.down = pressed;
        break;
      case "KeyA":
        input.left = pressed;
        break;
      case "KeyD":
        input.right = pressed;
        break;
      case "KeyJ":
        input.light = pressed;
        break;
      case "KeyK":
        input.heavy = pressed;
        break;
      case "KeyL":
        input.guard = pressed;
        break;
      case "KeyC":
        input.crouch = pressed;
        break;
      case "KeyU":
        input.grapple = pressed;
        break;
      case "KeyI":
        input.escape = pressed;
        break;
      case "KeyO":
        input.pin = pressed;
        break;
    }
  } else {
    switch (code) {
      case "ArrowUp":
        input.up = pressed;
        break;
      case "ArrowDown":
        input.down = pressed;
        break;
      case "ArrowLeft":
        input.left = pressed;
        break;
      case "ArrowRight":
        input.right = pressed;
        break;
      case "Numpad1":
      case "Digit1":
        input.light = pressed;
        break;
      case "Numpad2":
      case "Digit2":
        input.heavy = pressed;
        break;
      case "Numpad3":
      case "Digit3":
        input.guard = pressed;
        break;
      case "Numpad0":
        input.crouch = pressed;
        break;
      case "Numpad4":
      case "Digit4":
        input.grapple = pressed;
        break;
      case "Numpad5":
      case "Digit5":
        input.escape = pressed;
        break;
      case "Numpad6":
      case "Digit6":
        input.pin = pressed;
        break;
    }
  }
}

export function useInput() {
  const p1Ref = useRef<InputBitmask>({ ...EMPTY_INPUT });
  const p2Ref = useRef<InputBitmask>({ ...EMPTY_INPUT });
  const held = useRef<Set<string>>(new Set());
  const inject = useRef<string[] | null>(null);

  useEffect(() => {
    const rebuild = () => {
      const next1: InputBitmask = { ...EMPTY_INPUT };
      const next2: InputBitmask = { ...EMPTY_INPUT };
      const codes = inject.current ?? [...held.current];
      for (const code of codes) {
        applyCode(next1, code, true, 1);
        if (!inject.current) applyCode(next2, code, true, 2);
      }
      p1Ref.current = next1;
      p2Ref.current = next2;
    };

    const down = (e: KeyboardEvent) => {
      if (e.repeat) return;
      held.current.add(e.code);
      rebuild();
    };
    const up = (e: KeyboardEvent) => {
      held.current.delete(e.code);
      rebuild();
    };
    const clear = () => {
      held.current.clear();
      rebuild();
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", clear);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) clear();
    });
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", clear);
    };
  }, []);

  const setMobile = (patch: Partial<InputBitmask>) => {
    p1Ref.current = { ...p1Ref.current, ...patch };
  };

  const setKeys = (codes: string[]) => {
    inject.current = codes.length ? codes : null;
    const next1: InputBitmask = { ...EMPTY_INPUT };
    for (const code of codes) applyCode(next1, code, true, 1);
    p1Ref.current = next1;
  };

  return { p1Ref, p2Ref, setMobile, setKeys };
}
