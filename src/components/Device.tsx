/* iPhone device frame + bottom tab bar for the client app. */
import type { ReactNode } from "react";
import { Icon } from "./ui";
import "./device.css";

export function Device({ children }: { children: ReactNode }) {
  return (
    <div className="device">
      <div className="device__screen no-scrollbar">{children}</div>
    </div>
  );
}

const TABS = [
  { id: "today", label: "Today", icon: "home" },
  { id: "search", label: "Wardrobe", icon: "search" },
  { id: "builder", label: "Create", icon: "plus" },
  { id: "planner", label: "Planner", icon: "calendar" },
  { id: "insights", label: "Insights", icon: "chart" },
];

export function TabBar({
  active,
  onChange,
}: {
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <nav className="tabbar">
      {TABS.map((t) => (
        <button
          key={t.id}
          className={`tabbar__item${active === t.id ? " tabbar__item--active" : ""}`}
          onClick={() => onChange(t.id)}
        >
          <Icon name={t.icon} size={22} />
          <span>{t.label}</span>
        </button>
      ))}
    </nav>
  );
}

export function StatusBar({ dark }: { dark?: boolean }) {
  const c = dark ? "var(--color-text-inverse)" : "var(--color-text-primary)";
  return (
    <div className={`statusbar${dark ? " statusbar--dark" : ""}`}>
      <span>9:41</span>
      <span className="statusbar__icons">
        {/* signal */}
        <svg width="18" height="12" viewBox="0 0 18 12" fill={c} aria-hidden>
          <rect x="0" y="8" width="3" height="4" rx="1" />
          <rect x="5" y="5" width="3" height="7" rx="1" />
          <rect x="10" y="2" width="3" height="10" rx="1" />
          <rect x="15" y="0" width="3" height="12" rx="1" opacity="0.35" />
        </svg>
        {/* wifi */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none" stroke={c} strokeWidth="1.4" strokeLinecap="round" aria-hidden>
          <path d="M1 4.2a10 10 0 0 1 14 0M3.5 6.8a6.4 6.4 0 0 1 9 0" />
          <circle cx="8" cy="10" r="1" fill={c} stroke="none" />
        </svg>
        {/* battery */}
        <svg width="24" height="12" viewBox="0 0 24 12" fill="none" aria-hidden>
          <rect x="0.5" y="0.5" width="20" height="11" rx="3" stroke={c} opacity="0.4" />
          <rect x="2" y="2" width="16" height="8" rx="1.6" fill={c} />
          <rect x="22" y="4" width="1.6" height="4" rx="0.8" fill={c} opacity="0.4" />
        </svg>
      </span>
    </div>
  );
}
