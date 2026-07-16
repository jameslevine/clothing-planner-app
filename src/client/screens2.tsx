import { useState } from "react";
import { getGarment } from "../data/wardrobe";
import { outfits } from "../data/outfits";
import {
  pastOutfits,
  mostWorn,
  leastWorn,
  categoryUsage,
  insightStats,
  outfitRecs,
  recGarments,
  rediscover,
  juneGrid,
  sampleDayParts,
  type WornStat,
} from "../data/insights";
import { ItemCard } from "../components/ItemCard";
import { Button, Icon, Overline, SectionHeader } from "../components/ui";
import { StatusBar, TabBar } from "../components/Device";
import "./client.css";

type Nav = (screen: string, arg?: string) => void;

const outfitById = (id?: string) => outfits.find((o) => o.id === id);

/* ----------------------------- PLANNER ----------------------------- */
export function PlannerScreen({ nav }: { nav: Nav }) {
  const [view, setView] = useState<"month" | "day">("month");
  const cells = juneGrid();
  const dow = ["M", "T", "W", "T", "F", "S", "S"];

  if (view === "day") return <DayDetail nav={nav} onBack={() => setView("month")} />;

  return (
    <div className="client">
      <StatusBar />
      <div className="client__body">
        <div className="page-head" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <Overline>Plan & history</Overline>
            <h1 className="t-display-l">Planner</h1>
          </div>
          <button onClick={() => nav("share")} title="Share a look">
            <Icon name="share" size={22} />
          </button>
        </div>

        <div className="cal-nav">
          <button className="cal-nav__btn" onClick={() => { /* prev month */ }}>
            <Icon name="back" size={18} />
          </button>
          <span className="t-title-m">June 2026</span>
          <button className="cal-nav__btn">
            <Icon name="chevron" size={18} />
          </button>
        </div>

        <div className="cal-view-toggle" style={{ marginBottom: 16, width: "fit-content" }}>
          <button className="on">Month</button>
          <button onClick={() => setView("day")}>Day</button>
        </div>

        <div className="month-grid" style={{ marginBottom: 8 }}>
          {dow.map((d, i) => (
            <div className="month-dow" key={i}>{d}</div>
          ))}
          {cells.map((c, i) => {
            const o = outfitById(c.outfitId);
            return (
              <button
                key={i}
                className={`month-cell${c.today ? " month-cell--today" : ""}${!c.day ? " month-cell--out" : ""}`}
                onClick={() => c.day && setView("day")}
                disabled={!c.day}
              >
                {o && <img src={getGarment(o.garmentIds[0])!.image} alt="" />}
                {o && <div className="month-cell__scrim" />}
                {c.day && <span className="month-cell__num">{c.day}</span>}
              </button>
            );
          })}
        </div>
        <p className="t-caption" style={{ color: "var(--color-text-secondary)", marginTop: 8 }}>
          Tap any day to plan a morning, afternoon or evening look — or review what was worn.
        </p>

        <div style={{ height: 20 }} />
        <SectionHeader title="Recently worn" action="" />
        <div className="history-grid">
          {pastOutfits.slice(0, 4).map((d) => {
            const o = outfitById(d.outfitId)!;
            return (
              <button className="history-card" key={d.date} onClick={() => setView("day")}>
                <img src={getGarment(o.garmentIds[0])!.image} alt={o.name} />
                <div className="history-card__cap">
                  <span className="t-overline">{d.weekday} {d.dayNum} Jun</span>
                  <span className="t-body-m-medium">{o.name}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      <TabBar active="planner" onChange={(id) => nav(id)} />
    </div>
  );
}

/* Day detail — plan by time of day */
function DayDetail({ nav, onBack }: { nav: Nav; onBack: () => void }) {
  return (
    <div className="client">
      <StatusBar />
      <div className="client__body">
        <div className="page-head" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <Overline>Sunday · 22 June</Overline>
            <h1 className="t-display-l">The day</h1>
          </div>
          <button onClick={onBack}><Icon name="back" size={22} /></button>
        </div>

        {sampleDayParts.map((dp) => {
          const o = outfitById(dp.outfitId);
          return (
            <div className="daypart" key={dp.part}>
              <div className="daypart__time">
                <div className="t-overline">{dp.part}</div>
                <div className="t-caption" style={{ color: "var(--color-text-muted)" }}>{dp.time}</div>
              </div>
              {o ? (
                <img className="plan-day__thumb" src={getGarment(o.garmentIds[0])!.image} alt={o.name} />
              ) : (
                <button className="plan-day__empty" onClick={() => nav("builder")}>
                  <Icon name="plus" size={20} />
                </button>
              )}
              <div className="slot__info">
                {o ? (
                  <>
                    <span className="t-body-m-medium">{o.name}</span>
                    <span className="t-caption" style={{ color: "var(--color-text-secondary)" }}>{dp.occasion}</span>
                  </>
                ) : (
                  <>
                    <span className="t-body-m-medium" style={{ color: "var(--color-text-muted)" }}>Nothing planned</span>
                    <span className="t-caption" style={{ color: "var(--color-text-accent)" }}>{dp.occasion}</span>
                  </>
                )}
              </div>
              <Icon name="chevron" size={18} />
            </div>
          );
        })}

        <Button variant="secondary" full onClick={() => nav("builder")} style={{ marginTop: 8 }}>
          <Icon name="plus" size={18} /> Plan another time
        </Button>
      </div>
      <TabBar active="planner" onChange={(id) => nav(id)} />
    </div>
  );
}

/* ----------------------------- INSIGHTS ----------------------------- */
export function InsightsScreen({ nav }: { nav: Nav }) {
  const [wornTab, setWornTab] = useState<"most" | "least">("most");
  const maxPct = Math.max(...categoryUsage.map((c) => c.pct));
  const wornList: WornStat[] = wornTab === "most" ? mostWorn : leastWorn;

  return (
    <div className="client">
      <StatusBar />
      <div className="client__body">
        <div className="page-head">
          <Overline>This season</Overline>
          <h1 className="t-display-l">Insights</h1>
        </div>

        <div className="stat-row">
          <div className="stat-card stat-card--dark">
            <div className="stat-card__num">{insightStats.outfitsThisMonth}</div>
            <div className="stat-card__label">Outfits this month</div>
          </div>
          <div className="stat-card">
            <div className="stat-card__num">{insightStats.utilisation}%</div>
            <div className="stat-card__label">Wardrobe worn</div>
          </div>
          <div className="stat-card">
            <div className="stat-card__num">{insightStats.mostWornColour}</div>
            <div className="stat-card__label">Signature colour</div>
          </div>
          <div className="stat-card">
            <div className="stat-card__num">{insightStats.neglectedCount}</div>
            <div className="stat-card__label">Unworn in 90 days</div>
          </div>
        </div>

        <SectionHeader title="Recommended for you" action="" />
        {outfitRecs.map((rec) => {
          const items = recGarments(rec);
          return (
            <div className="rec-card" key={rec.id}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span className="t-title-m">{rec.title}</span>
                <span className="t-caption rec-card__reason"><Icon name="sparkle" size={13} /></span>
              </div>
              <span className="t-caption" style={{ color: "var(--color-text-secondary)", marginTop: -6 }}>
                {rec.reason}
              </span>
              <div className="rec-card__imgs">
                {items.map((g) => (
                  <img key={g.id} src={g.image} alt={g.name} />
                ))}
              </div>
              <Button variant="secondary" full onClick={() => nav("builder")}>
                Open in builder
              </Button>
            </div>
          );
        })}

        {/* most / least worn toggle */}
        <div className="section-header">
          <h2 className="t-title-l">Wear frequency</h2>
        </div>
        <div className="cal-view-toggle" style={{ marginBottom: 14, width: "fit-content" }}>
          <button className={wornTab === "most" ? "on" : ""} onClick={() => setWornTab("most")}>
            Most worn
          </button>
          <button className={wornTab === "least" ? "on" : ""} onClick={() => setWornTab("least")}>
            Least worn
          </button>
        </div>
        <div style={{ marginBottom: 24 }}>
          {wornList.map((s, i) => {
            const g = getGarment(s.garmentId)!;
            return (
              <button
                className="rank"
                key={s.garmentId}
                onClick={() => nav("item", g.id)}
                style={{ width: "100%", textAlign: "left" }}
              >
                <span className="rank__n">{i + 1}</span>
                <img className="rank__thumb" src={g.image} alt={g.name} />
                <div className="rank__info">
                  <div className="t-body-m-medium">{g.name}</div>
                  <div className="t-caption" style={{ color: "var(--color-text-secondary)" }}>{g.brand}</div>
                </div>
                <span className="rank__wears">
                  {s.wears} {s.wears === 1 ? "wear" : "wears"}
                </span>
              </button>
            );
          })}
        </div>

        <SectionHeader title="What you wear" action="" />
        <div style={{ marginBottom: 24 }}>
          {categoryUsage.map((c) => (
            <div className="bar-row" key={c.category}>
              <span className="bar-row__label">{c.category}</span>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: `${(c.pct / maxPct) * 100}%` }} />
              </div>
              <span className="bar-row__pct">{c.pct}%</span>
            </div>
          ))}
        </div>

        <SectionHeader title="Rediscover" action="" />
        <p className="t-caption" style={{ color: "var(--color-text-secondary)", marginTop: -8, marginBottom: 14 }}>
          <Icon name="star" size={13} /> Beautiful pieces you haven't worn lately
        </p>
        <div className="row-scroll">
          {rediscover.map((g) => (
            <ItemCard key={g.id} garment={g} onClick={() => nav("item", g.id)} />
          ))}
        </div>
      </div>
      <TabBar active="insights" onChange={(id) => nav(id)} />
    </div>
  );
}
