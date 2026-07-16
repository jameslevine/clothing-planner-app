/* Shared editorial-luxury UI primitives used across both surfaces. */
import type { ReactNode, CSSProperties } from "react";
import "./ui.css";

export function Button({
  children,
  variant = "primary",
  full,
  onClick,
  style,
}: {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  full?: boolean;
  onClick?: () => void;
  style?: CSSProperties;
}) {
  return (
    <button
      className={`btn btn--${variant}${full ? " btn--full" : ""}`}
      onClick={onClick}
      style={style}
    >
      {children}
    </button>
  );
}

export function Chip({
  children,
  active,
  onClick,
}: {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button className={`chip${active ? " chip--active" : ""}`} onClick={onClick}>
      {children}
    </button>
  );
}

export function Overline({ children }: { children: ReactNode }) {
  return <span className="t-overline overline-muted">{children}</span>;
}

export function SectionHeader({
  title,
  action,
}: {
  title: string;
  action?: string;
}) {
  return (
    <div className="section-header">
      <h2 className="t-title-l">{title}</h2>
      {action && <span className="t-caption section-header__action">{action}</span>}
    </div>
  );
}

/* Inline icon set — minimal stroked glyphs to match the refined aesthetic. */
export function Icon({ name, size = 22 }: { name: string; size?: number }) {
  const p: Record<string, ReactNode> = {
    search: <path d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM21 21l-4.3-4.3" />,
    home: <path d="M3 10.5 12 3l9 7.5M5 9.5V21h14V9.5" />,
    hanger: <path d="M12 4a2 2 0 1 0 1.5 3.3L12 9 4 15h16L12 9" />,
    heart: <path d="M12 20s-7-4.5-9.2-9C1.3 7.5 3 4.5 6 4.5c2 0 3 1.2 4 2.5 1-1.3 2-2.5 4-2.5 3 0 4.7 3 3.2 6.5C19 15.5 12 20 12 20Z" />,
    "heart-fill": <path d="M12 20s-7-4.5-9.2-9C1.3 7.5 3 4.5 6 4.5c2 0 3 1.2 4 2.5 1-1.3 2-2.5 4-2.5 3 0 4.7 3 3.2 6.5C19 15.5 12 20 12 20Z" />,
    mic: <path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3ZM6 11a6 6 0 0 0 12 0M12 18v3" />,
    plus: <path d="M12 5v14M5 12h14" />,
    sparkle: <path d="M12 3v6M12 15v6M3 12h6M15 12h6M6 6l3 3M15 15l3 3M18 6l-3 3M9 15l-3 3" />,
    grid: <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />,
    calendar: <path d="M4 6h16v15H4zM4 10h16M8 3v4M16 3v4" />,
    camera: <path d="M4 8h4l2-2h4l2 2h4v12H4zM12 17a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />,
    chevron: <path d="m9 6 6 6-6 6" />,
    back: <path d="m15 6-6 6 6 6" />,
    user: <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21a8 8 0 0 1 16 0" />,
    check: <path d="m5 12 5 5 9-11" />,
    qr: <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 14h2v2h-2zM14 18h2v2h-2zM18 18h2v2h-2z" />,
    chart: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />,
    clock: <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 7v5l3 2" />,
    star: <path d="m12 4 2.4 5 5.6.8-4 4 1 5.6L12 16l-5 2.4 1-5.6-4-4 5.6-.8z" />,
    shirt: <path d="M8 3 4 6l2 3 2-1v10h8V8l2 1 2-3-4-3-2 2H10z" />,
    swap: <path d="M4 8h12l-3-3M20 16H8l3 3" />,
    share: <path d="M16 6l-4-4-4 4M12 2v13M5 12v8h14v-8" />,
    mail: <path d="M3 6h18v12H3zM3 7l9 6 9-6" />,
    dots: <path d="M12 6h.01M12 12h.01M12 18h.01" />,
    logout: <path d="M9 21H4V3h5M16 16l5-4-5-4M21 12H9" />,
    lock: <path d="M6 11h12v9H6zM9 11V8a3 3 0 0 1 6 0v3" />,
    vote: <path d="M9 12l2 2 4-4M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />,
    whatsapp: <path d="M12 3a9 9 0 0 0-7.7 13.6L3 21l4.5-1.2A9 9 0 1 0 12 3ZM8.5 8c.3 0 .6.3.8.7l.5 1.2-.7.8c.5 1 1.4 1.9 2.4 2.4l.8-.7 1.2.5c.4.2.7.5.7.8 0 1-1 1.7-1.8 1.6-3-.3-5.5-2.8-5.8-5.8C6.8 9 7.5 8 8.5 8Z" />,
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={name === "heart-fill" ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {p[name]}
    </svg>
  );
}
