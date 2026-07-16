import { useState } from "react";
import {
  garments,
  categories,
  getGarment,
  colorFacets,
  formalities,
  seasons,
} from "../data/wardrobe";
import { weather, today } from "../data/outfits";
import { outfitRecs, recGarments, mostWorn } from "../data/insights";
import { bodyZones, sampleFilled, type BodyZone } from "../data/mannequin";
import {
  eventThemes,
  colourThemes,
  looksForTheme,
  lookGarments,
  looksAroundItem,
} from "../data/themes";
import { ItemCard } from "../components/ItemCard";
import { Button, Chip, Icon, Overline, SectionHeader } from "../components/ui";
import { StatusBar, TabBar } from "../components/Device";
import { Mannequin } from "../components/Mannequin";
import { useBasket } from "./basket";
import "./client.css";

type Nav = (screen: string, arg?: string) => void;

/* ----------------------------- TODAY ----------------------------- */
export function TodayScreen({ nav }: { nav: Nav }) {
  const rec = outfitRecs[0];
  const recItems = recGarments(rec);
  const favs = garments.filter((g) => g.favourite);
  return (
    <div className="client">
      <StatusBar />
      <div className="client__body">
        <div className="today-hero">
          <div className="today-hero__eyebrow t-caption">
            <span className="sync-pill"><span className="sync-pill__dot" /> Synced · {today.weekday}, {today.date}</span>
            <button onClick={() => nav("profile")}><Icon name="user" size={22} /></button>
          </div>
          <h1 className="t-display-l today-hero__title">Good morning, Eleanor.</h1>
          <p className="t-body-m" style={{ color: "var(--color-text-secondary)" }}>
            Here is today, considered.
          </p>
        </div>

        <div className="weather-card">
          <div className="weather-card__top">
            <div>
              <Overline>{weather.city}</Overline>
              <div className="weather-card__temp">{weather.tempC}°</div>
            </div>
            <div className="weather-card__meta t-caption">
              <div>{weather.condition}</div>
              <div>H {weather.high}° · L {weather.low}°</div>
            </div>
          </div>
          <p className="weather-card__summary t-body-m">{weather.summary}</p>
          <div className="weather-card__hourly">
            {weather.hourly.map((h) => (
              <div className="weather-card__hour" key={h.time}>
                <span>{h.time}</span>
                <b>{h.t}°</b>
              </div>
            ))}
          </div>
        </div>

        {/* Voice trigger — prominent assistant entry */}
        <button className="voice-trigger" onClick={() => nav("voice")}>
          <span className="voice-trigger__mic"><Icon name="mic" size={20} /></span>
          <span className="voice-trigger__text">
            <span className="t-body-m-medium">Style with your voice</span>
            <span className="t-caption" style={{ color: "var(--color-text-secondary)" }}>
              “Plan me a smart lunch look”
            </span>
          </span>
          <Icon name="chevron" size={18} />
        </button>

        <SectionHeader title="Today's Edit" action="Refine" />
        <button className="suggest-card" onClick={() => nav("builder")}>
          <img src={recItems[0]?.image} alt="Suggested outfit" />
          <div className="suggest-card__overlay">
            <span className="suggest-card__tag t-caption">
              <Icon name="sparkle" size={14} /> {rec.reason}
            </span>
            <h3 className="t-title-l">{rec.title}</h3>
            <p className="t-body-m" style={{ opacity: 0.85 }}>
              {recItems.map((g) => g.name).join(" · ")}
            </p>
          </div>
        </button>

        <Button variant="secondary" full onClick={() => nav("builder-shuffle")} style={{ marginTop: 14, marginBottom: 28 }}>
          <Icon name="swap" size={18} /> Generate looks by theme
        </Button>

        <SectionHeader title="Your Favourites" action="See all" />
        <div className="row-scroll">
          {favs.map((g) => (
            <ItemCard key={g.id} garment={g} onClick={() => nav("item", g.id)} />
          ))}
        </div>
      </div>
      <TabBar active="today" onChange={(id) => nav(id)} />
    </div>
  );
}

/* ----------------------------- SEARCH ----------------------------- */
export function SearchScreen({ nav }: { nav: Nav }) {
  const [active, setActive] = useState<string>("All");
  const { items } = useBasket();
  const filtered =
    active === "All" ? garments : garments.filter((g) => g.category === active);
  return (
    <div className="client">
      <StatusBar />
      {items.length > 0 && (
        <button className="basket-fab" onClick={() => nav("basket")}>
          <Icon name="shirt" size={16} />
          <span className="t-caption">Outfit</span>
          <span className="basket-fab__count">{items.length}</span>
        </button>
      )}
      <div className="client__body">
        <div className="page-head">
          <Overline>Wardrobe</Overline>
          <h1 className="t-display-l">Search</h1>
        </div>
        <div className="searchbar">
          <Icon name="search" size={20} />
          <input placeholder="Search 148 pieces — brand, colour, fabric…" />
          <button className="searchbar__mic" onClick={() => nav("voice")}>
            <Icon name="mic" size={18} />
          </button>
        </div>
        <div className="facet-row">
          <Chip active={active === "All"} onClick={() => setActive("All")}>
            All
          </Chip>
          {categories.map((c) => (
            <Chip key={c} active={active === c} onClick={() => setActive(c)}>
              {c}
            </Chip>
          ))}
        </div>
        <div className="result-meta t-caption">
          <span>{filtered.length} pieces</span>
          <button
            onClick={() => nav("filters")}
            style={{ display: "inline-flex", gap: 6, alignItems: "center", color: "var(--color-text-primary)" }}
          >
            <Icon name="grid" size={16} /> Filters
          </button>
        </div>
        <div className="grid-2">
          {filtered.map((g) => (
            <ItemCard key={g.id} garment={g} onClick={() => nav("item", g.id)} />
          ))}
        </div>
      </div>
      <TabBar active="search" onChange={(id) => nav(id)} />
    </div>
  );
}

/* ------------------------- WARDROBE FILTERS ------------------------- */
export function FiltersScreen({ nav }: { nav: Nav }) {
  const [cats, setCats] = useState<string[]>(["Outerwear", "Knitwear"]);
  const [colors, setColors] = useState<string[]>(["Camel"]);
  const [form, setForm] = useState<string[]>(["Smart"]);
  const [szn, setSzn] = useState<string[]>([]);

  const toggle = (arr: string[], set: (v: string[]) => void, v: string) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  return (
    <div className="client filters">
      <StatusBar />
      <div className="filters__body">
        <div className="page-head" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <Overline>Refine</Overline>
            <h1 className="t-display-l">Filters</h1>
          </div>
          <button onClick={() => nav("search")}><Icon name="back" size={22} /></button>
        </div>

        <div className="filter-group">
          <div className="filter-group__title t-overline">Category</div>
          <div className="chip-wrap">
            {categories.map((c) => (
              <Chip key={c} active={cats.includes(c)} onClick={() => toggle(cats, setCats, c)}>
                {c}
              </Chip>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <div className="filter-group__title t-overline">Colour</div>
          <div className="swatch-row">
            {colorFacets.map((c) => (
              <button className="swatch" key={c.name} onClick={() => toggle(colors, setColors, c.name)}>
                <span
                  className={`swatch__dot${colors.includes(c.name) ? " swatch__dot--on" : ""}`}
                  style={{ background: c.hex }}
                />
                <span className="t-caption">{c.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <div className="filter-group__title t-overline">Formality</div>
          <div className="chip-wrap">
            {formalities.map((f) => (
              <Chip key={f} active={form.includes(f)} onClick={() => toggle(form, setForm, f)}>
                {f}
              </Chip>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <div className="filter-group__title t-overline">Season</div>
          <div className="chip-wrap">
            {seasons.map((s) => (
              <Chip key={s} active={szn.includes(s)} onClick={() => toggle(szn, setSzn, s)}>
                {s}
              </Chip>
            ))}
          </div>
        </div>
      </div>
      <div className="filters__footer">
        <Button variant="secondary" onClick={() => { setCats([]); setColors([]); setForm([]); setSzn([]); }} style={{ flex: 1 }}>
          Clear
        </Button>
        <Button onClick={() => nav("results")} style={{ flex: 2 }}>
          Show 24 pieces
        </Button>
      </div>
    </div>
  );
}

/* --------------------- FILTERED RESULTS (variant) --------------------- */
export function ResultsScreen({ nav }: { nav: Nav }) {
  // a representative filtered selection: camel/smart outerwear + knitwear
  const results = garments.filter((g) =>
    ["Outerwear", "Knitwear"].includes(g.category),
  );
  const tags = ["Outerwear", "Knitwear", "Camel", "Smart"];
  return (
    <div className="client">
      <StatusBar />
      <div className="client__body">
        <div className="page-head" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <Overline>Filtered</Overline>
            <h1 className="t-display-l">Results</h1>
          </div>
          <button onClick={() => nav("filters")} className="t-caption" style={{ color: "var(--color-text-accent)" }}>
            Edit filters
          </button>
        </div>
        <div className="active-filters">
          {tags.map((t) => (
            <span className="filter-tag" key={t}>
              {t} <Icon name="plus" size={12} />
            </span>
          ))}
        </div>
        <div className="result-meta t-caption">
          <span>{results.length} pieces match</span>
          <span style={{ color: "var(--color-text-muted)" }}>Sort · Recent</span>
        </div>
        <div className="grid-2">
          {results.map((g) => (
            <ItemCard key={g.id} garment={g} onClick={() => nav("item", g.id)} />
          ))}
        </div>
      </div>
      <TabBar active="search" onChange={(id) => nav(id)} />
    </div>
  );
}

/* --------------------------- ITEM DETAIL --------------------------- */
export function ItemScreen({ nav, id }: { nav: Nav; id: string }) {
  const g = getGarment(id) ?? garments[0];
  const { items, add } = useBasket();
  const inBasket = items.includes(g.id);
  const attrs: [string, string][] = [
    ["Brand", g.brand],
    ["Colour", g.color],
    ["Fabric", g.fabric],
    ["Pattern", g.pattern],
    ["Formality", g.formality],
    ["Hanger", g.hanger ?? "—"],
  ];
  return (
    <div className="client">
      <button className="floating-back" onClick={() => nav("search")}>
        <Icon name="back" size={20} />
      </button>
      {items.length > 0 && (
        <button className="basket-fab" onClick={() => nav("basket")}>
          <Icon name="shirt" size={16} />
          <span className="basket-fab__count">{items.length}</span>
        </button>
      )}
      <div className="detail-image">
        <img src={g.image} alt={g.name} />
      </div>
      <div className="client__body">
        <div className="detail-head">
          <Overline>{g.brand}</Overline>
          <h1 className="t-title-l" style={{ margin: "6px 0 4px" }}>{g.name}</h1>
          <p className="t-body-m" style={{ color: "var(--color-text-secondary)" }}>
            {g.color} · {g.category} · Last worn {g.lastWorn ?? "—"}
          </p>
        </div>
        <div className="attr-grid">
          {attrs.map(([k, v]) => (
            <div className="attr" key={k}>
              <span className="t-overline">{k}</span>
              <span className="t-body-m-medium">{v}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Button full onClick={() => { add(g.id); nav("basket"); }}>
            <Icon name={inBasket ? "check" : "plus"} size={18} />
            {inBasket ? "In your outfit · View" : "Add to outfit"}
          </Button>
          <Button variant="secondary" full onClick={() => nav("around", g.id)}>
            <Icon name="sparkle" size={18} /> Style 3 looks around this
          </Button>
        </div>
      </div>
      <TabBar active="search" onChange={(id) => nav(id)} />
    </div>
  );
}

/* --------------- STYLE 3 LOOKS AROUND AN ITEM --------------- */
export function AroundItemScreen({ nav, id }: { nav: Nav; id: string }) {
  const hero = getGarment(id) ?? garments[0];
  const looks = looksAroundItem(id);
  return (
    <div className="client">
      <StatusBar />
      <div className="client__body">
        <div className="page-head" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <Overline>Styled around</Overline>
            <h1 className="t-display-l">{hero.name}</h1>
          </div>
          <button onClick={() => nav("item", id)}><Icon name="back" size={22} /></button>
        </div>
        <p className="t-caption" style={{ color: "var(--color-text-secondary)", marginTop: -8, marginBottom: 16 }}>
          <Icon name="sparkle" size={13} /> Three looks built around your {hero.category.toLowerCase()}
        </p>
        {looks.map((look) => {
          const pieces = lookGarments(look);
          return (
            <div className="look-card" key={look.id}>
              <div className="look-card__imgs">
                {pieces.map((p) => <img key={p.id} src={p.image} alt={p.name} />)}
              </div>
              <div className="look-card__body">
                <div>
                  <div className="t-body-m-medium">{look.name}</div>
                  <div className="t-caption" style={{ color: "var(--color-text-secondary)" }}>
                    {pieces.length} pieces
                  </div>
                </div>
                <button className="t-caption slot__swap" onClick={() => nav("builder")}>Open</button>
              </div>
            </div>
          );
        })}
      </div>
      <TabBar active="search" onChange={(id) => nav(id)} />
    </div>
  );
}

/* ------------------- OUTFIT BASKET / CREATE OUTFIT ------------------- */
export function BasketScreen({ nav }: { nav: Nav }) {
  const { items, remove, note, setNote } = useBasket();
  const pieces = items.map(getGarment).filter(Boolean);
  return (
    <div className="client">
      <StatusBar />
      <div className="client__body">
        <div className="page-head" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <Overline>Your outfit</Overline>
            <h1 className="t-display-l">Create</h1>
          </div>
          <button onClick={() => nav("search")}><Icon name="back" size={22} /></button>
        </div>

        <div className="basket-list">
          {pieces.map((g) => (
            <div className="basket-row" key={g!.id}>
              <img src={g!.image} alt={g!.name} />
              <div className="basket-row__info">
                <div className="t-body-m-medium">{g!.name}</div>
                <div className="t-caption" style={{ color: "var(--color-text-secondary)" }}>
                  {g!.brand} · {g!.category}
                </div>
              </div>
              <button onClick={() => remove(g!.id)} className="t-caption" style={{ color: "var(--color-text-muted)" }}>
                Remove
              </button>
            </div>
          ))}
        </div>

        <Button variant="ghost" full onClick={() => nav("search")} style={{ border: "1.5px dashed var(--color-border-strong)", marginBottom: 20 }}>
          <Icon name="plus" size={18} /> Add another piece
        </Button>

        <div className="note-label t-overline">
          <Icon name="user" size={14} /> Note to your stylist
        </div>
        <textarea
          className="note-field"
          placeholder="e.g. Please press the trousers and lay this out for Thursday morning…"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <Button full onClick={() => nav("planner")}>
          <Icon name="check" size={18} /> Create outfit ({pieces.length} pieces)
        </Button>
      </div>
      <TabBar active="builder" onChange={(id) => nav(id)} />
    </div>
  );
}

/* ----------------- OUTFIT BUILDER — mannequin canvas ----------------- */
export function BuilderScreen({ nav, empty, shuffle }: { nav: Nav; empty?: boolean; shuffle?: boolean }) {
  const [mode, setMode] = useState<"dress" | "shuffle">(shuffle ? "shuffle" : "dress");
  const [filled, setFilled] = useState<Record<string, string | undefined>>(
    () => (empty ? {} : { ...sampleFilled }),
  );
  const [sheetZone, setSheetZone] = useState<BodyZone | null>(null);
  const [theme, setTheme] = useState("dinner");

  const pieceCount = Object.values(filled).filter(Boolean).length;
  const sheetItems = sheetZone
    ? garments.filter((g) => sheetZone.categories.includes(g.category))
    : [];
  // recommendations from past decisions (most-worn that fit empty zones)
  const recs = mostWorn.slice(0, 4).map((m) => getGarment(m.garmentId)!);

  const pick = (gid: string) => {
    if (sheetZone) setFilled((f) => ({ ...f, [sheetZone.id]: gid }));
    setSheetZone(null);
  };

  return (
    <div className="client">
      <StatusBar />
      <div className="client__body">
        <div className="page-head">
          <Overline>Create</Overline>
          <h1 className="t-display-l">Outfit Builder</h1>
        </div>

        <div className="builder-mode">
          <button className={mode === "dress" ? "on" : ""} onClick={() => setMode("dress")}>
            Dress the figure
          </button>
          <button className={mode === "shuffle" ? "on" : ""} onClick={() => setMode("shuffle")}>
            Shuffle by theme
          </button>
        </div>

        {mode === "dress" ? (
          <>
            <p className="t-body-m" style={{ color: "var(--color-text-secondary)", marginBottom: 8 }}>
              Tap a + on the figure to dress each area.
            </p>
            <Mannequin zones={bodyZones} filled={filled} onZone={(z) => setSheetZone(z)} />

            <div className="builder-recs">
              <SectionHeader title="Recommended for you" action="" />
              <p className="t-caption" style={{ color: "var(--color-text-secondary)", marginTop: -8, marginBottom: 12 }}>
                <Icon name="sparkle" size={13} /> Based on what you've worn and loved
              </p>
              <div className="row-scroll" style={{ marginBottom: 4 }}>
                {recs.map((g) => (
                  <div className="rec-chip" key={g.id}>
                    <img src={g.image} alt={g.name} />
                    <div>
                      <div className="t-caption" style={{ fontWeight: 600 }}>{g.name}</div>
                      <div className="t-caption" style={{ color: "var(--color-text-muted)" }}>{g.brand}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="builder-summary">
              <span className="t-caption" style={{ color: "var(--color-text-secondary)" }}>
                {pieceCount} pieces · styled for 14° &amp; light cloud
              </span>
              <button className="t-caption slot__swap" onClick={() => setFilled({})}>Reset</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
              <Button full onClick={() => nav("basket")}>
                <Icon name="check" size={18} /> Create outfit
              </Button>
              <Button variant="secondary" full onClick={() => nav("planner")}>
                <Icon name="calendar" size={18} /> Plan this outfit
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="theme-section">
              <div className="t-overline overline-muted" style={{ marginBottom: 10 }}>Occasion</div>
              <div className="theme-row">
                {eventThemes.map((t) => (
                  <Chip key={t.id} active={theme === t.id} onClick={() => setTheme(t.id)}>{t.label}</Chip>
                ))}
              </div>
            </div>
            <div className="theme-section">
              <div className="t-overline overline-muted" style={{ marginBottom: 10 }}>Colour story</div>
              <div className="theme-row">
                {colourThemes.map((t) => (
                  <Chip key={t.id}>{t.label}</Chip>
                ))}
              </div>
            </div>

            <div className="builder-summary" style={{ marginBottom: 4 }}>
              <span className="t-caption" style={{ color: "var(--color-text-secondary)" }}>
                3 looks generated for this theme
              </span>
              <button className="t-caption slot__swap"><Icon name="swap" size={13} /> Shuffle again</button>
            </div>

            {looksForTheme(theme).map((look) => {
              const pieces = lookGarments(look);
              return (
                <div className="look-card" key={look.id}>
                  <div className="look-card__imgs">
                    {pieces.map((p) => <img key={p.id} src={p.image} alt={p.name} />)}
                  </div>
                  <div className="look-card__body">
                    <div>
                      <div className="t-body-m-medium">{look.name}</div>
                      <div className="t-caption" style={{ color: "var(--color-text-secondary)" }}>{pieces.length} pieces</div>
                    </div>
                    <button className="t-caption slot__swap" onClick={() => nav("basket")}>Create</button>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

      {sheetZone && (
        <div className="sheet-backdrop" onClick={() => setSheetZone(null)}>
          <div className="sheet no-scrollbar" onClick={(e) => e.stopPropagation()}>
            <div className="sheet__grip" />
            <div className="sheet__head">
              <div>
                <Overline>Add to {sheetZone.label}</Overline>
                <h2 className="t-title-l" style={{ marginTop: 4 }}>{sheetZone.label}</h2>
              </div>
              <button className="t-caption" onClick={() => setSheetZone(null)} style={{ color: "var(--color-text-accent)" }}>
                Close
              </button>
            </div>
            <div className="searchbar" style={{ marginBottom: 14 }}>
              <Icon name="search" size={20} />
              <input placeholder={`Search ${sheetZone.label.toLowerCase()}…`} />
            </div>
            <div className="sheet__grid">
              {sheetItems.map((g) => (
                <ItemCard key={g.id} garment={g} onClick={() => pick(g.id)} />
              ))}
            </div>
          </div>
        </div>
      )}

      <TabBar active="builder" onChange={(id) => nav(id)} />
    </div>
  );
}

/* ----------------------------- VOICE ----------------------------- */
export function VoiceScreen({ nav }: { nav: Nav }) {
  return (
    <div className="voice no-scrollbar">
      <StatusBar dark />
      <div style={{ paddingTop: 8, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <Overline>Atelier Voice</Overline>
          <h1 className="t-title-l" style={{ color: "var(--color-text-inverse)", marginTop: 6 }}>
            Let's build today's look
          </h1>
        </div>
        <button onClick={() => nav("today")} style={{ color: "rgba(247,243,236,0.6)" }}>
          <Icon name="plus" size={24} />
        </button>
      </div>
      <div className="voice__transcript">
        <div className="bubble bubble--ai">
          Good morning, Eleanor. It's 14° and lightly cloudy in London. Shall I plan
          something smart for the day?
        </div>
        <div className="bubble bubble--user">
          Something for a lunch, with the camel coat.
        </div>
        <div className="bubble bubble--ai">
          Lovely. I've paired your Loro Piana knit and Max Mara trousers under the camel
          overcoat, with the leather pumps. Shall I open it in the builder?
        </div>
      </div>
      <div className="voice__chips">
        <Chip>Open in builder</Chip>
        <Chip>Swap the shoes</Chip>
        <Chip>More formal</Chip>
      </div>
      <button className="voice__mic" onClick={() => nav("builder")}>
        <Icon name="mic" size={30} />
      </button>
      <p className="voice__hint t-caption">Listening… tap to speak</p>
      <Button
        variant="secondary"
        full
        onClick={() => nav("today")}
        style={{ background: "transparent", color: "var(--color-text-inverse)", borderColor: "rgba(247,243,236,0.3)" }}
      >
        Close
      </Button>
    </div>
  );
}
