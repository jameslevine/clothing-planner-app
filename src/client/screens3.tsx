import { getGarment } from "../data/wardrobe";
import { outfits } from "../data/outfits";
import { voteSession } from "../data/staff";
import { APP_VERSION } from "../data/themes";
import { Button, Icon, Overline, Chip } from "../components/ui";
import { StatusBar, TabBar } from "../components/Device";
import "./client.css";

type Nav = (screen: string, arg?: string) => void;

/* ----------------------------- SHARE ----------------------------- */
export function ShareScreen({ nav }: { nav: Nav }) {
  const o = outfits[0];
  const pieces = o.garmentIds.map(getGarment).filter(Boolean);
  const channels = [
    { name: "WhatsApp", icon: "whatsapp", bg: "#25D366" },
    { name: "Messages", icon: "share", bg: "#1F1E1B" },
    { name: "Email", icon: "mail", bg: "#A8854E" },
  ];
  return (
    <div className="client">
      <StatusBar />
      <div className="client__body">
        <div className="page-head" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <Overline>Share</Overline>
            <h1 className="t-display-l">Send look</h1>
          </div>
          <button onClick={() => nav("planner")}><Icon name="back" size={22} /></button>
        </div>

        {/* the shareable image composite */}
        <div className="share-hero">
          <Overline>Atelier · Today's Look</Overline>
          <h2 className="t-title-l" style={{ color: "var(--color-text-inverse)", margin: "6px 0 2px" }}>{o.name}</h2>
          <span className="t-caption" style={{ color: "rgba(247,243,236,0.6)" }}>{pieces.length} pieces · {o.occasion}</span>
          <div className="share-hero__grid">
            {pieces.map((g) => <img key={g!.id} src={g!.image} alt={g!.name} />)}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(247,243,236,0.15)", paddingTop: 12 }}>
            <span className="t-caption" style={{ color: "rgba(247,243,236,0.6)" }}>Curated for Eleanor</span>
            <span className="t-title-m" style={{ color: "var(--color-text-accent)" }}>Atelier.</span>
          </div>
        </div>

        <div className="t-overline overline-muted" style={{ marginBottom: 10 }}>Share as image to</div>
        <div className="share-channels">
          {channels.map((c) => (
            <button className="share-chip" key={c.name}>
              <span className="share-chip__icon" style={{ background: c.bg }}>
                <Icon name={c.icon} size={20} />
              </span>
              <span className="t-caption">{c.name}</span>
            </button>
          ))}
        </div>
        <Button variant="secondary" full onClick={() => nav("voting")} style={{ marginTop: 14 }}>
          <Icon name="vote" size={18} /> Ask for votes instead
        </Button>
        <p className="t-caption" style={{ color: "var(--color-text-muted)", textAlign: "center", marginTop: 14 }}>
          Shares the pieces as a single image — never a photo of you.
        </p>
      </div>
      <TabBar active="planner" onChange={(id) => nav(id)} />
    </div>
  );
}

/* ----------------------------- VOTING ----------------------------- */
export function VotingScreen({ nav }: { nav: Nav }) {
  const total = voteSession.options.reduce((s, o) => s + o.votes, 0);
  const lead = Math.max(...voteSession.options.map((o) => o.votes));
  return (
    <div className="client">
      <StatusBar />
      <div className="client__body">
        <div className="page-head" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <Overline>Collaborative pick</Overline>
            <h1 className="t-display-l">Votes</h1>
          </div>
          <button onClick={() => nav("share")}><Icon name="back" size={22} /></button>
        </div>
        <p className="t-body-m" style={{ color: "var(--color-text-secondary)", marginTop: -8, marginBottom: 18 }}>
          {voteSession.question} · {total} votes
        </p>

        {voteSession.options.map((opt) => {
          const pieces = opt.garmentIds.map(getGarment).filter(Boolean);
          const pct = Math.round((opt.votes / total) * 100);
          const isLead = opt.votes === lead;
          return (
            <div className={`vote-opt${isLead ? " vote-opt--lead" : ""}`} key={opt.id}>
              <div className="vote-opt__imgs">
                {pieces.slice(0, 4).map((g) => <img key={g!.id} src={g!.image} alt="" />)}
              </div>
              <div className="vote-opt__body">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span className="t-body-m-medium">{opt.label}</span>
                  {isLead && <span className="pill pill--planned">Leading</span>}
                </div>
                <div className="vote-opt__bar"><div className="vote-opt__fill" style={{ width: `${pct}%` }} /></div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span className="t-caption" style={{ color: "var(--color-text-secondary)" }}>{opt.votes} votes · {pct}%</span>
                  <span className="t-caption" style={{ color: "var(--color-text-accent)" }}>Vote</span>
                </div>
              </div>
            </div>
          );
        })}
        <Button full onClick={() => nav("share")} style={{ marginTop: 6 }}>
          <Icon name="share" size={18} /> Share to collect more votes
        </Button>
      </div>
      <TabBar active="planner" onChange={(id) => nav(id)} />
    </div>
  );
}

/* ----------------------------- PROFILE ----------------------------- */
export function ProfileScreen({ nav }: { nav: Nav }) {
  return (
    <div className="client">
      <StatusBar />
      <div className="client__body">
        <div className="profile-head">
          <img className="profile-avatar" src="/wardrobe/editorial1.jpg" alt="Eleanor" />
          <h1 className="t-title-l">Eleanor Whitmore</h1>
          <span className="t-caption" style={{ color: "var(--color-text-secondary)" }}>London · Member since 2024</span>
          <div className="sync-pill" style={{ marginTop: 12 }}>
            <span className="sync-pill__dot" /> All changes synced
          </div>
        </div>

        <div className="t-overline overline-muted" style={{ marginBottom: 10 }}>Style preferences</div>
        <div className="pref-chips" style={{ marginBottom: 24 }}>
          <Chip active>Tailored</Chip>
          <Chip active>Neutral palette</Chip>
          <Chip active>Cashmere</Chip>
          <Chip>Evening</Chip>
          <Chip>Minimal</Chip>
        </div>

        <div className="t-overline overline-muted" style={{ marginBottom: 10 }}>Account</div>
        <div className="profile-list">
          <div className="profile-row">
            <Icon name="user" size={20} />
            <span className="profile-row__label t-body-m">Personal details</span>
            <Icon name="chevron" size={18} />
          </div>
          <div className="profile-row">
            <Icon name="grid" size={20} />
            <span className="profile-row__label t-body-m">Sizes &amp; measurements</span>
            <Icon name="chevron" size={18} />
          </div>
          <div className="profile-row">
            <Icon name="sparkle" size={20} />
            <span className="profile-row__label t-body-m">Favourite brands</span>
            <span className="profile-row__value">12</span>
          </div>
          <div className="profile-row">
            <Icon name="user" size={20} />
            <span className="profile-row__label t-body-m">Contact my stylist</span>
            <Icon name="chevron" size={18} />
          </div>
        </div>

        <div className="t-overline overline-muted" style={{ marginBottom: 10 }}>Data &amp; sync</div>
        <div className="profile-list">
          <div className="profile-row">
            <Icon name="swap" size={20} />
            <span className="profile-row__label t-body-m">Offline mode</span>
            <span className="profile-row__value">On</span>
          </div>
          <div className="profile-row">
            <Icon name="check" size={20} />
            <span className="profile-row__label t-body-m">Last synced</span>
            <span className="profile-row__value">Just now</span>
          </div>
        </div>

        <Button variant="secondary" full onClick={() => nav("today")}>
          <Icon name="logout" size={18} /> Sign out
        </Button>

        <p className="app-version t-caption" style={{ marginTop: 18 }}>
          Atelier · version {APP_VERSION}
        </p>
      </div>
      <TabBar active="today" onChange={(id) => nav(id)} />
    </div>
  );
}
