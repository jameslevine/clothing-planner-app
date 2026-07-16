import { useState } from "react";
import { ClientApp } from "./client/ClientApp";
import { AdminApp } from "./admin/AdminApp";
import "./App.css";

/* Read optional capture params:
   ?view=client&screen=search  → render only the client app on that screen
   ?view=admin&screen=calendar → render only the admin app on that view
   no params                   → interactive "both" stage for review */
function useParams() {
  const p = new URLSearchParams(window.location.search);
  return { view: p.get("view"), screen: p.get("screen") ?? undefined };
}

export default function App() {
  const { view, screen } = useParams();
  const [surface, setSurface] = useState<"both" | "client" | "admin">(
    view === "client" ? "client" : view === "admin" ? "admin" : "both",
  );

  // Capture mode: a single surface pinned via URL, no toolbar chrome.
  if (view === "client") {
    return (
      <div className="stage">
        <ClientApp initial={screen} />
      </div>
    );
  }
  if (view === "admin") {
    return (
      <div className="stage">
        <AdminApp initial={screen} />
      </div>
    );
  }

  return (
    <div className="stage-wrap">
      <header className="stage-bar">
        <div className="stage-bar__title">
          <span className="t-overline" style={{ color: "var(--color-text-accent)" }}>
            Atelier
          </span>
          <span className="t-body-m-medium">Luxury Wardrobe — Prototype</span>
        </div>
        <div className="stage-bar__toggle">
          {(["both", "client", "admin"] as const).map((s) => (
            <button
              key={s}
              className={`seg${surface === s ? " seg--on" : ""}`}
              onClick={() => setSurface(s)}
            >
              {s === "both" ? "Both" : s === "client" ? "iPhone" : "Admin"}
            </button>
          ))}
        </div>
      </header>

      <div className="stage">
        {(surface === "both" || surface === "client") && <ClientApp />}
        {(surface === "both" || surface === "admin") && <AdminApp />}
      </div>
    </div>
  );
}
