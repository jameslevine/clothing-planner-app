import { Fragment, useState } from "react";
import { garments, getGarment, categories } from "../data/wardrobe";
import { outfits } from "../data/outfits";
import { juneGrid } from "../data/insights";
import { staff } from "../data/staff";
import { activityFeed, activityStats, staffActivity } from "../data/themes";
import { draftQueue, uploadStats, extractedLabel } from "../data/uploads";
import { ItemCard } from "../components/ItemCard";
import { Button, Chip, Icon, Overline } from "../components/ui";
import "./admin.css";

const NAV = [
  { id: "activity", label: "Activity", icon: "chart" },
  { id: "upload", label: "Upload & Tag", icon: "camera" },
  { id: "wardrobe", label: "Wardrobe", icon: "grid" },
  { id: "calendar", label: "Outfit Planner", icon: "calendar" },
  { id: "qr", label: "Hanger Scan", icon: "qr" },
  { id: "staff", label: "Staff", icon: "user" },
];

export function AdminApp({ initial }: { initial?: string }) {
  // login gate — authed by default; ?screen=login forces the sign-in screen
  const [authed, setAuthed] = useState(initial !== "login");
  const [view, setView] = useState(
    initial && initial !== "login" ? initial : "activity",
  );

  if (!authed) {
    return <LoginView onLogin={() => { setAuthed(true); setView("activity"); }} />;
  }

  return (
    <div className="admin">
      <aside className="admin__sidebar">
        <div className="admin__brand">
          <h1 className="t-title-l">Atelier<span>.</span></h1>
          <span className="t-caption" style={{ color: "rgba(247,243,236,0.5)" }}>
            Wardrobe Studio
          </span>
        </div>
        <nav className="admin__nav">
          {NAV.map((n) => (
            <button
              key={n.id}
              className={`admin__navitem${view === n.id ? " admin__navitem--active" : ""}`}
              onClick={() => setView(n.id)}
            >
              <Icon name={n.icon} size={20} />
              {n.label}
            </button>
          ))}
        </nav>
        <div className="admin__user">
          <div className="admin__avatar">SM</div>
          <div style={{ flex: 1 }}>
            <div className="t-body-m-medium" style={{ color: "var(--color-text-inverse)" }}>
              Sofia M.
            </div>
            <div className="t-caption" style={{ color: "rgba(247,243,236,0.5)" }}>
              Super Admin
            </div>
          </div>
          <button onClick={() => setAuthed(false)} title="Log out" style={{ color: "rgba(247,243,236,0.6)" }}>
            <Icon name="logout" size={18} />
          </button>
        </div>
      </aside>

      <main className="admin__main no-scrollbar">
        {view === "activity" && <ActivityView />}
        {view === "upload" && <UploadView />}
        {view === "wardrobe" && <WardrobeView />}
        {view === "calendar" && <CalendarView />}
        {view === "qr" && <QRView />}
        {view === "staff" && <StaffView />}
      </main>
    </div>
  );
}

/* ---- Login ---- */
function LoginView({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="login">
      <div className="login__art">
        <img src="/wardrobe/coat.jpg" alt="" />
        <div className="login__art-cap">
          <span className="t-overline" style={{ color: "var(--color-text-accent)" }}>Atelier</span>
          <h1 className="t-display-l" style={{ color: "var(--color-text-inverse)", maxWidth: 360 }}>
            Wardrobe Studio
          </h1>
          <p className="t-body-m" style={{ color: "rgba(247,243,236,0.75)", marginTop: 8 }}>
            The private atelier dashboard for Eleanor's wardrobe.
          </p>
        </div>
      </div>
      <div className="login__panel">
        <Overline>Welcome back</Overline>
        <h2 className="t-title-l" style={{ margin: "8px 0 28px" }}>Sign in</h2>
        <div className="login__field">
          <label className="t-overline">Email</label>
          <input className="login__input" defaultValue="sofia@atelier.studio" />
        </div>
        <div className="login__field">
          <label className="t-overline">Password</label>
          <input className="login__input" type="password" defaultValue="••••••••••" />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "6px 0 24px" }}>
          <label className="t-caption" style={{ color: "var(--color-text-secondary)" }}>
            <input type="checkbox" defaultChecked /> Remember me
          </label>
          <span className="t-caption" style={{ color: "var(--color-text-accent)" }}>Forgot password?</span>
        </div>
        <Button full onClick={onLogin}>
          <Icon name="lock" size={16} /> Sign in
        </Button>
        <p className="t-caption" style={{ color: "var(--color-text-muted)", marginTop: 20, textAlign: "center" }}>
          Access is invitation-only · managed by your Super Admin
        </p>
      </div>
    </div>
  );
}

/* ---- Reusable label-data block (item view, QR view) ---- */
function LabelBlock({ label }: { label: import("../data/wardrobe").LabelData }) {
  return (
    <div className="label-block">
      <span className="ai-panel__badge t-caption" style={{ marginBottom: 0 }}>
        <Icon name="sparkle" size={14} /> From label scan
      </span>
      <div className="label-block__grid">
        <div className="label-block__item">
          <span className="t-overline">Composition</span>
          <span className="t-body-m">{label.composition}</span>
        </div>
        <div className="label-block__item">
          <span className="t-overline">Origin</span>
          <span className="t-body-m">{label.origin}</span>
        </div>
        <div className="label-block__item">
          <span className="t-overline">Size</span>
          <span className="t-body-m">{label.size}</span>
        </div>
        <div className="label-block__item">
          <span className="t-overline">Style code</span>
          <span className="t-body-m">{label.styleCode ?? "—"}</span>
        </div>
        <div className="label-block__item" style={{ gridColumn: "1 / -1" }}>
          <span className="t-overline">Care</span>
          <div className="care-tags" style={{ marginTop: 4 }}>
            {label.care.map((c) => <span className="care-tag" key={c}>{c}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---- Upload: bulk / single / label, with draft review queue ---- */
function UploadView() {
  const [mode, setMode] = useState<"bulk" | "single" | "label">("bulk");
  return (
    <>
      <div className="admin__head">
        <div>
          <Overline>Add pieces</Overline>
          <h1 className="t-display-l">Upload &amp; Tag</h1>
          <p className="t-body-m">Bulk-upload to auto-enrich, or capture a single piece or its label.</p>
        </div>
      </div>

      <div className="upload-mode">
        <button className={mode === "bulk" ? "on" : ""} onClick={() => setMode("bulk")}>Bulk upload</button>
        <button className={mode === "single" ? "on" : ""} onClick={() => setMode("single")}>Single photo</button>
        <button className={mode === "label" ? "on" : ""} onClick={() => setMode("label")}>Scan label</button>
      </div>

      {mode === "bulk" && <BulkUpload />}
      {mode === "single" && <SingleUpload />}
      {mode === "label" && <LabelCapture />}
    </>
  );
}

function BulkUpload() {
  const done = uploadStats.draft + uploadStats.needsReview;
  const pct = Math.round((done / uploadStats.total) * 100);
  const statusChip = (s: string) =>
    s === "draft" ? "Draft" : s === "needs-review" ? "Review" : "Analysing";
  return (
    <>
      <div className="bulk-drop">
        <span className="bulk-drop__icon"><Icon name="camera" size={24} /></span>
        <div>
          <div className="t-title-m">Drop photos to upload</div>
          <div className="t-caption" style={{ color: "var(--color-text-secondary)" }}>
            JPG or PNG · up to 100 at once · each is auto-analysed with Claude Vision
          </div>
        </div>
        <Button><Icon name="plus" size={16} /> Choose files</Button>
      </div>

      <div className="enrich-banner">
        <Icon name="sparkle" size={20} />
        <div style={{ flex: 1 }}>
          <div className="t-body-m-medium" style={{ color: "var(--color-text-inverse)" }}>
            Enriching {uploadStats.total} pieces — {done} ready, {uploadStats.analysing} analysing
          </div>
          <div className="enrich-banner__bar" style={{ marginTop: 8 }}>
            <div className="enrich-banner__fill" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <span className="t-caption" style={{ color: "rgba(247,243,236,0.7)" }}>{pct}%</span>
      </div>

      <div className="admin__head" style={{ marginBottom: 16 }}>
        <h2 className="t-title-l">Draft review · {done} pieces</h2>
        <Button variant="secondary"><Icon name="check" size={16} /> Approve all drafts</Button>
      </div>

      <div className="draft-grid">
        {draftQueue.map((d) => (
          <div className="draft-card" key={d.id}>
            <div className={`draft-card__img${d.status === "analysing" ? " draft-card__img--analysing" : ""}`}>
              <img src={d.image} alt="" />
              <span className={`status-chip status-chip--${d.status}`}>{statusChip(d.status)}</span>
              {d.status === "analysing" && (
                <div className="draft-shimmer">
                  <Icon name="sparkle" size={20} />
                  Analysing…
                </div>
              )}
            </div>
            {d.status !== "analysing" && (
              <div className="draft-card__body">
                <div className="draft-card__row">
                  <span className="t-body-m-medium">{d.type}</span>
                  <span className={`conf conf--${d.confidence! >= 80 ? "high" : "low"}`}>{d.confidence}%</span>
                </div>
                <div className="t-caption" style={{ color: "var(--color-text-secondary)" }}>
                  {d.colour} · {d.category} · {d.brand}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

function SingleUpload() {
  const fields: { label: string; value: string; conf: "high" | "low" }[] = [
    { label: "Type", value: "Overcoat", conf: "high" },
    { label: "Category", value: "Outerwear", conf: "high" },
    { label: "Primary colour", value: "Camel", conf: "high" },
    { label: "Fabric", value: "Cashmere", conf: "low" },
    { label: "Brand", value: "The Row", conf: "low" },
  ];
  return (
    <div className="upload-layout">
      <div className="dropzone">
        <img src="/wardrobe/coat.jpg" alt="Uploaded garment" />
        <div className="dropzone__scan" />
      </div>
      <div className="ai-panel">
        <span className="ai-panel__badge t-caption">
          <Icon name="sparkle" size={14} /> Analysed with Claude Vision
        </span>
        {fields.map((f) => (
          <div className="field" key={f.label}>
            <div className="field__label t-overline">
              <span>{f.label}</span>
              <span className={`conf conf--${f.conf}`}>{f.conf === "high" ? "98% confident" : "Review"}</span>
            </div>
            <div className="field__input t-body-m">{f.value}<Icon name="chevron" size={16} /></div>
          </div>
        ))}
        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          <Button><Icon name="check" size={16} /> Save to wardrobe</Button>
          <Button variant="secondary"><Icon name="camera" size={16} /> Add label photo</Button>
        </div>
      </div>
    </div>
  );
}

function LabelCapture() {
  return (
    <div className="label-layout">
      <div>
        <div className="label-photo">
          <img src="/wardrobe/socks.jpg" alt="Care label" />
          <div className="label-photo__scan" />
        </div>
        <Button variant="secondary" full style={{ marginTop: 14 }}>
          <Icon name="camera" size={16} /> Retake label photo
        </Button>
      </div>
      <div>
        <span className="ai-panel__badge t-caption">
          <Icon name="sparkle" size={14} /> Extracted from label
        </span>
        <div className="label-rows" style={{ marginTop: 14 }}>
          <div className="label-row">
            <span className="label-row__key t-overline">Composition</span>
            <span className="label-row__val t-body-m">{extractedLabel.composition}</span>
          </div>
          <div className="label-row">
            <span className="label-row__key t-overline">Origin</span>
            <span className="label-row__val t-body-m">{extractedLabel.origin}</span>
          </div>
          <div className="label-row">
            <span className="label-row__key t-overline">Size</span>
            <span className="label-row__val t-body-m">{extractedLabel.size}</span>
          </div>
          <div className="label-row">
            <span className="label-row__key t-overline">Style code</span>
            <span className="label-row__val t-body-m">{extractedLabel.styleCode}</span>
          </div>
          <div className="label-row">
            <span className="label-row__key t-overline">Care</span>
            <div className="label-row__val care-tags">
              {extractedLabel.care.map((c) => <span className="care-tag" key={c}>{c}</span>)}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 18 }}>
          <Button><Icon name="check" size={16} /> Add to item</Button>
          <Button variant="secondary">Edit fields</Button>
        </div>
        <p className="t-caption" style={{ color: "var(--color-text-muted)", marginTop: 14 }}>
          Saved to the item — visible in the wardrobe and when its hanger QR is scanned.
        </p>
      </div>
    </div>
  );
}

/* ---- Wardrobe management (no heart, richer filters, item detail) ---- */
function WardrobeView() {
  const [cat, setCat] = useState("All");
  const [openItem, setOpenItem] = useState<string | null>(null);
  const shown = cat === "All" ? garments : garments.filter((g) => g.category === cat);
  const item = openItem ? getGarment(openItem) : undefined;
  return (
    <>
      <div className="admin__head">
        <div>
          <Overline>{garments.length} pieces</Overline>
          <h1 className="t-display-l">Wardrobe</h1>
        </div>
        <Button>
          <Icon name="plus" size={18} /> Add piece
        </Button>
      </div>
      <div className="toolbar">
        <div className="searchbar">
          <Icon name="search" size={20} />
          <input placeholder="Search by brand, colour, fabric, hanger…" />
        </div>
        <Button variant="secondary"><Icon name="grid" size={16} /> Filters</Button>
      </div>
      <div className="facet-row" style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        <Chip active={cat === "All"} onClick={() => setCat("All")}>All</Chip>
        {categories.map((c) => (
          <Chip key={c} active={cat === c} onClick={() => setCat(c)}>{c}</Chip>
        ))}
      </div>
      <div className="admin-grid">
        {shown.map((g) => (
          <ItemCard key={g.id} garment={g} hideFav onClick={() => setOpenItem(g.id)} />
        ))}
      </div>

      {item && (
        <div className="modal-backdrop" onClick={() => setOpenItem(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ width: 680 }}>
            <div className="modal__head">
              <div>
                <Overline>{item.brand} · {item.hanger}</Overline>
                <h2 className="t-title-l" style={{ marginTop: 6 }}>{item.name}</h2>
              </div>
              <button onClick={() => setOpenItem(null)}><Icon name="plus" size={24} /></button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 24 }}>
              <img src={item.image} alt={item.name} style={{ width: "100%", aspectRatio: "3/4", objectFit: "cover", borderRadius: "var(--radius-md)" }} />
              <div>
                <div className="attr-grid" style={{ gridTemplateColumns: "1fr 1fr", display: "grid", gap: 14 }}>
                  {[["Colour", item.color], ["Fabric", item.fabric], ["Pattern", item.pattern], ["Formality", item.formality], ["Category", item.category], ["Hanger", item.hanger ?? "—"]].map(([k, v]) => (
                    <div key={k} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <span className="t-overline" style={{ color: "var(--color-text-muted)" }}>{k}</span>
                      <span className="t-body-m">{v}</span>
                    </div>
                  ))}
                </div>
                {item.label ? (
                  <LabelBlock label={item.label} />
                ) : (
                  <div className="label-block" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span className="t-caption" style={{ color: "var(--color-text-secondary)" }}>No label scanned yet</span>
                    <Button variant="secondary"><Icon name="camera" size={16} /> Scan label</Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ---- Outfit planning — proper calendar ---- */
function CalendarView() {
  const [mode, setMode] = useState<"month" | "day">("month");
  const [openOutfit, setOpenOutfit] = useState<string | null>(null);
  const cells = juneGrid();
  const dow = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <>
      <div className="admin__head">
        <div>
          <Overline>Outfit Planner</Overline>
          <h1 className="t-display-l">Calendar</h1>
          <p className="t-body-m">Prepare Eleanor's looks ahead of each day.</p>
        </div>
      </div>

      <div className="cal-toolbar">
        <div className="cal-toolbar__left">
          <div className="cal-month-nav">
            <button><Icon name="back" size={18} /></button>
            <span className="t-title-m" style={{ minWidth: 130, textAlign: "center" }}>June 2026</span>
            <button><Icon name="chevron" size={18} /></button>
          </div>
          <Button variant="ghost" style={{ padding: "8px 14px" }}>Today</Button>
        </div>
        <div className="view-toggle">
          <button className={mode === "day" ? "on" : ""} onClick={() => setMode("day")}>Day</button>
          <button className={mode === "month" ? "on" : ""} onClick={() => setMode("month")}>Month</button>
        </div>
      </div>

      {mode === "month" ? (
        <div className="mcal">
          {dow.map((d) => <div className="mcal__dow t-overline" key={d}>{d}</div>)}
          {cells.map((c, i) => {
            const o = outfits.find((x) => x.id === c.outfitId);
            return (
              <button
                key={i}
                className={`mcal__cell${c.today ? " mcal__cell--today" : ""}${!c.day ? " mcal__cell--out" : ""}`}
                onClick={() => o ? setOpenOutfit(o.id) : c.day && setMode("day")}
                disabled={!c.day}
              >
                {c.day && (
                  <span className={`mcal__num${c.today ? " mcal__num--today" : ""}`}>{c.day}</span>
                )}
                {o && (
                  <div className={`mcal__chip${c.status === "planned" ? " mcal__chip--planned" : ""}`}>
                    <img src={getGarment(o.garmentIds[0])!.image} alt="" />
                    <span className="t-caption" style={{ lineHeight: "13px", fontSize: 11 }}>{o.name}</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      ) : (
        <DayView onOpen={setOpenOutfit} />
      )}

      {openOutfit && (
        <OutfitModal id={openOutfit} onClose={() => setOpenOutfit(null)} />
      )}
    </>
  );
}

function DayView({ onOpen }: { onOpen: (id: string) => void }) {
  const hours = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"];
  const slots: Record<string, { id: string; label: string }> = {
    "10:00": { id: "o3", label: "Café & errands" },
    "14:00": { id: "o4", label: "Boardroom" },
    "20:00": { id: "o1", label: "Gallery opening" },
  };
  return (
    <>
      <div className="t-title-m" style={{ marginBottom: 12 }}>Sunday, 22 June</div>
      <div className="dayview">
        {hours.map((h) => {
          const s = slots[h];
          const o = s ? outfits.find((x) => x.id === s.id) : null;
          return (
            <Fragment key={h}>
              <div className="dayview__time t-caption">{h}</div>
              <div className="dayview__slot">
                {o && (
                  <button className="dayview__outfit" onClick={() => onOpen(o.id)} style={{ width: "100%" }}>
                    <img src={getGarment(o.garmentIds[0])!.image} alt="" />
                    <div style={{ textAlign: "left" }}>
                      <div className="t-body-m-medium">{o.name}</div>
                      <div className="t-caption" style={{ color: "var(--color-text-secondary)" }}>{s!.label}</div>
                    </div>
                  </button>
                )}
              </div>
            </Fragment>
          );
        })}
      </div>
    </>
  );
}

function OutfitModal({ id, onClose }: { id: string; onClose: () => void }) {
  const o = outfits.find((x) => x.id === id)!;
  const pieces = o.garmentIds.map(getGarment).filter(Boolean);
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__head">
          <div>
            <Overline>{o.folder} · {o.occasion}</Overline>
            <h2 className="t-title-l" style={{ marginTop: 6 }}>{o.name}</h2>
          </div>
          <button onClick={onClose}><Icon name="plus" size={24} /></button>
        </div>
        <div className="outfit-pieces">
          {pieces.map((g) => (
            <div className="outfit-piece" key={g!.id}>
              <img src={g!.image} alt={g!.name} />
              <span className="t-caption" style={{ fontWeight: 600 }}>{g!.name}</span>
              <span className="t-caption" style={{ color: "var(--color-text-muted)" }}>{g!.hanger}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <Button><Icon name="check" size={16} /> Mark prepared</Button>
          <Button variant="secondary"><Icon name="share" size={16} /> Share</Button>
        </div>
      </div>
    </div>
  );
}

/* ---- Activity tracking portal ---- */
function ActivityView() {
  const maxActions = Math.max(...staffActivity.map((s) => s.actions));
  const typeIcon: Record<string, string> = {
    upload: "camera", outfit: "shirt", edit: "swap", login: "lock", share: "share",
  };
  return (
    <>
      <div className="admin__head">
        <div>
          <Overline>Dashboard</Overline>
          <h1 className="t-display-l">Activity</h1>
          <p className="t-body-m">Trace wardrobe and staff activity over time.</p>
        </div>
        <span className="status-dot status-dot--active t-caption">Live · synced {activityStats.lastSync}</span>
      </div>

      {/* headline metrics */}
      <div className="stat-row" style={{ gridTemplateColumns: "repeat(4, 1fr)", display: "grid", gap: 16, marginBottom: 28 }}>
        {[
          { n: activityStats.outfitsCreated, l: "Outfits created" },
          { n: activityStats.itemsAdded, l: "Items added" },
          { n: activityStats.activeStaff, l: "Active staff" },
          { n: "100%", l: "In sync" },
        ].map((s, i) => (
          <div className={`stat-card${i === 0 ? " stat-card--dark" : ""}`} key={s.l}>
            <div className="stat-card__num">{s.n}</div>
            <div className="stat-card__label">{s.l}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 28 }}>
        {/* activity feed */}
        <div>
          <h3 className="t-title-m" style={{ marginBottom: 14 }}>Recent activity</h3>
          <div className="staff-table">
            {activityFeed.map((a) => (
              <div className="staff-row" key={a.id} style={{ gridTemplateColumns: "40px 1fr auto" }}>
                <div className="staff-avatar" style={{ width: 36, height: 36, fontSize: 12 }}>{a.initials}</div>
                <div>
                  <div className="t-body-m">
                    <b>{a.who}</b> {a.action} {a.target && <span style={{ color: "var(--color-text-accent)" }}>{a.target}</span>}
                  </div>
                  <div className="t-caption" style={{ color: "var(--color-text-muted)" }}>
                    <Icon name={typeIcon[a.type]} size={12} /> {a.time}
                  </div>
                </div>
                <Icon name="chevron" size={16} />
              </div>
            ))}
          </div>
        </div>

        {/* per-staff volume */}
        <div>
          <h3 className="t-title-m" style={{ marginBottom: 14 }}>By team member</h3>
          <div className="card-soft">
            {staffActivity.map((s) => (
              <div className="bar-row" key={s.name} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div className="staff-avatar" style={{ width: 32, height: 32, fontSize: 11 }}>{s.initials}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span className="t-caption">{s.name}</span>
                    <span className="t-caption" style={{ color: "var(--color-text-muted)" }}>{s.actions}</span>
                  </div>
                  <div className="bar-track" style={{ height: 8, borderRadius: 999, background: "var(--color-bg-subtle)", overflow: "hidden" }}>
                    <div className="bar-fill" style={{ width: `${(s.actions / maxActions) * 100}%`, height: "100%", background: "var(--color-accent-brass)" }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* ---- Super-admin staff management (with profile editing) ---- */
function StaffView() {
  const [editing, setEditing] = useState<string | null>(null);
  const member = staff.find((m) => m.id === editing);
  return (
    <>
      <div className="admin__head">
        <div>
          <Overline>Super Admin</Overline>
          <h1 className="t-display-l">Staff</h1>
          <p className="t-body-m">Invite, manage, and edit staff profiles.</p>
        </div>
        <Button><Icon name="plus" size={18} /> Invite staff</Button>
      </div>
      <div className="staff-table">
        <div className="staff-row staff-row--head">
          <span className="t-overline">Member</span>
          <span className="t-overline">Role</span>
          <span className="t-overline">Status</span>
          <span></span>
        </div>
        {staff.map((m) => (
          <div className="staff-row" key={m.id}>
            <div className="staff-person">
              {m.photo ? (
                <img className="staff-avatar" src={m.photo} alt={m.name} style={{ objectFit: "cover" }} />
              ) : (
                <div className="staff-avatar">{m.initials}</div>
              )}
              <div>
                <div className="t-body-m-medium">{m.name}</div>
                <div className="t-caption" style={{ color: "var(--color-text-secondary)" }}>{m.email}</div>
              </div>
            </div>
            <span>
              <span className={`role-badge role-badge--${m.role === "Super Admin" ? "admin" : "staff"}`}>
                {m.role}
              </span>
            </span>
            <span className={`status-dot status-dot--${m.status} t-caption`}>
              {m.status === "active" ? "Active" : "Invite pending"}
            </span>
            <button style={{ color: "var(--color-text-muted)" }} onClick={() => setEditing(m.id)}>
              <Icon name="dots" size={20} />
            </button>
          </div>
        ))}
      </div>

      {member && (
        <div className="modal-backdrop" onClick={() => setEditing(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ width: 480 }}>
            <div className="modal__head">
              <div>
                <Overline>Edit profile</Overline>
                <h2 className="t-title-l" style={{ marginTop: 6 }}>{member.name}</h2>
              </div>
              <button onClick={() => setEditing(null)}><Icon name="plus" size={24} /></button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
              {member.photo ? (
                <img className="staff-avatar" src={member.photo} alt="" style={{ width: 72, height: 72, objectFit: "cover" }} />
              ) : (
                <div className="staff-avatar" style={{ width: 72, height: 72, fontSize: 22 }}>{member.initials}</div>
              )}
              <Button variant="secondary"><Icon name="camera" size={16} /> Change photo</Button>
            </div>
            <div className="field">
              <div className="field__label t-overline"><span>Full name</span></div>
              <div className="field__input t-body-m">{member.name}</div>
            </div>
            <div className="field">
              <div className="field__label t-overline"><span>Email</span></div>
              <div className="field__input t-body-m">{member.email}</div>
            </div>
            <div className="field">
              <div className="field__label t-overline"><span>Role</span></div>
              <div className="chip-set">
                <Chip active={member.role === "Super Admin"}>Super Admin</Chip>
                <Chip active={member.role === "Stylist"}>Stylist</Chip>
                <Chip active={member.role === "Wardrobe Assistant"}>Wardrobe Assistant</Chip>
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 18 }}>
              <Button onClick={() => setEditing(null)}><Icon name="check" size={16} /> Save profile</Button>
              <Button variant="secondary" onClick={() => setEditing(null)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ---- QR hanger scan (shows label/care data per item) ---- */
function QRView() {
  const items = ["g3", "g13"].map((id) => getGarment(id)!);
  const withLabel = items.find((g) => g.label) ?? items[0];
  return (
    <>
      <div className="admin__head">
        <div>
          <Overline>Hanger H-031</Overline>
          <h1 className="t-display-l">Hanger Scan</h1>
          <p className="t-body-m">Scan a hanger's QR to confirm its contents and care details.</p>
        </div>
      </div>
      <div className="qr-layout">
        <div className="scanner">
          <div className="scanner__frame" />
        </div>
        <div className="hanger-result">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <Overline>Scanned · H-031</Overline>
              <h2 className="t-title-l" style={{ marginTop: 6 }}>2 pieces on this hanger</h2>
            </div>
            <span className="conf conf--high" style={{ fontSize: 13, padding: "6px 12px" }}>
              <Icon name="check" size={14} /> Matches record
            </span>
          </div>
          <div className="hanger-items">
            {items.map((g) => (
              <div className="hanger-item" key={g.id}>
                <ItemCard garment={g} hideFav />
              </div>
            ))}
          </div>
          {withLabel.label && (
            <div style={{ marginTop: 20 }}>
              <Overline>{withLabel.name} · care &amp; composition</Overline>
              <LabelBlock label={withLabel.label} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
