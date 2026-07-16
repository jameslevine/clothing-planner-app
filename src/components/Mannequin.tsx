/* Faceless feminine silhouette for the outfit builder. No avatar, no likeness —
   an abstract elegant woman's form with tappable + hotspots over each body zone. */
import type { BodyZone } from "../data/mannequin";
import { getGarment } from "../data/wardrobe";
import { Icon } from "./ui";

export function Mannequin({
  zones,
  filled,
  onZone,
}: {
  zones: BodyZone[];
  filled: Record<string, string | undefined>;
  onZone: (zone: BodyZone) => void;
}) {
  return (
    <div className="mannequin">
      <div className="mannequin__stage">
        <div className="mannequin__figure">
          <WomanFigure />
        </div>

        {zones.map((z) => {
          const gid = filled[z.id];
          const g = gid ? getGarment(gid) : undefined;
          return (
            <div
              className="mannequin__hotspot"
              key={z.id}
              style={{ left: `${z.x}%`, top: `${z.y}%` }}
            >
              {g ? (
                <button onClick={() => onZone(z)} title={`${z.label}: ${g.name}`}>
                  <img className="hotspot__thumb" src={g.image} alt={g.name} />
                </button>
              ) : (
                <>
                  <button className="hotspot__btn" onClick={() => onZone(z)}>
                    <Icon name="plus" size={18} />
                  </button>
                  <span className="hotspot__label">{z.label}</span>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* Abstract, faceless feminine croquis — stylised hourglass form, no features. */
function WomanFigure() {
  return (
    <svg viewBox="0 0 200 440" width="60%" height="94%" aria-hidden>
      <g fill="var(--color-taupe-200, #c2b5a1)" opacity="0.5">
        {/* head */}
        <ellipse cx="100" cy="36" rx="19" ry="23" />
        {/* neck */}
        <path d="M92 56 q8 8 16 0 l2 14 q-10 6 -20 0 z" />
        {/* hair suggestion (soft shoulders) */}
        <path d="M78 40 q-8 26 4 44 q18 -10 36 0 q12 -18 4 -44 q-22 14 -44 0 z" opacity="0.55" />
        {/* torso — narrow waist, feminine */}
        <path d="M72 78 q28 -10 56 0 q-4 30 -6 44 q14 22 8 50 q-30 12 -60 0 q-6 -28 8 -50 q-2 -14 -6 -44 z" />
        {/* arms */}
        <path d="M72 82 q-16 6 -20 40 q-3 26 -8 50 q6 4 12 0 q6 -26 10 -48 q5 -22 6 -42 z" />
        <path d="M128 82 q16 6 20 40 q3 26 8 50 q-6 4 -12 0 q-6 -26 -10 -48 q-5 -22 -6 -42 z" />
        {/* hips */}
        <path d="M76 168 q24 12 48 0 q8 20 4 40 q-28 10 -56 0 q-4 -20 4 -40 z" />
        {/* legs — long, tapering */}
        <path d="M84 204 q8 6 16 0 q4 90 0 196 q-6 4 -12 0 q-8 -100 -4 -196 z" />
        <path d="M116 204 q-8 6 -16 0 q-4 90 0 196 q6 4 12 0 q8 -100 4 -196 z" />
      </g>
    </svg>
  );
}
