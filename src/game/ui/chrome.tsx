import type { ReactNode } from "react";

export function Overlay({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 z-20 flex flex-col ${className}`}>
      {children}
    </div>
  );
}

export function MenuButton({
  children,
  active,
  onClick,
  disabled,
}: {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`menu-btn w-full text-left ${active ? "is-active" : ""}`}
    >
      {children}
    </button>
  );
}

export function Kicker({ children }: { children: ReactNode }) {
  return <div className="kicker">{children}</div>;
}

export function StatBar({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="flex items-center gap-3">
      <div className="w-16 shrink-0 text-[10px] tracking-[0.18em] text-muted">{label}</div>
      <div className="h-1.5 flex-1 overflow-hidden rounded-sm bg-elevated">
        <div className="h-full bg-accent" style={{ width: `${pct}%` }} />
      </div>
      <div className="w-8 text-right font-mono text-[10px] text-fg tabular-nums">{value}</div>
    </div>
  );
}
