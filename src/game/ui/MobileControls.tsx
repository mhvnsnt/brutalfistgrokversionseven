import type { InputBitmask } from "../types";

function PadBtn({
  label,
  className,
  onHold,
}: {
  label: string;
  className?: string;
  onHold: (pressed: boolean) => void;
}) {
  return (
    <button
      type="button"
      className={`pad-btn ${className ?? ""}`}
      onPointerDown={(e) => {
        e.preventDefault();
        (e.currentTarget as HTMLButtonElement).setPointerCapture(e.pointerId);
        onHold(true);
      }}
      onPointerUp={() => onHold(false)}
      onPointerCancel={() => onHold(false)}
    >
      {label}
    </button>
  );
}

export function MobileControls({
  setMobile,
}: {
  setMobile: (patch: Partial<InputBitmask>) => void;
}) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-40 p-3 md:hidden">
      <div className="flex items-end justify-between gap-3">
        <div className="pointer-events-auto grid grid-cols-3 gap-1.5">
          <span />
          <PadBtn label="UP" onHold={(v) => setMobile({ up: v })} />
          <span />
          <PadBtn label="A" onHold={(v) => setMobile({ left: v })} />
          <PadBtn label="DN" onHold={(v) => setMobile({ down: v })} />
          <PadBtn label="D" onHold={(v) => setMobile({ right: v })} />
        </div>
        <div className="pointer-events-auto grid grid-cols-3 gap-1.5">
          <PadBtn label="LP" onHold={(v) => setMobile({ light: v })} />
          <PadBtn label="HP" onHold={(v) => setMobile({ heavy: v })} />
          <PadBtn label="GD" onHold={(v) => setMobile({ guard: v })} />
          <PadBtn label="GR" onHold={(v) => setMobile({ grapple: v })} />
          <PadBtn label="ESC" onHold={(v) => setMobile({ escape: v })} />
          <PadBtn label="PIN" onHold={(v) => setMobile({ pin: v })} />
        </div>
      </div>
    </div>
  );
}
