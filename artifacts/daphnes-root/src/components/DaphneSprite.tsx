import { GAME_CONFIG } from "../config/gameConfig";

interface DaphneSpriteProps {
  unlockedIds: string[];
  heat: number;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

// Checks if a specific line has been unlocked
function has(ids: string[], id: string) {
  return ids.includes(id);
}
// Counts how many of an array of ids are unlocked
function countOf(ids: string[], set: string[]) {
  return set.filter((id) => ids.includes(id)).length;
}

const PART1_IDS = ["line_543","line_544","line_545","line_546","line_548","line_549","line_550","line_551","line_552"];
const PART2_IDS = ["line_553","line_554","line_555","line_556","line_557","line_558","line_559","line_560","line_561"];

export function DaphneSprite({ unlockedIds, heat, onClick }: DaphneSpriteProps) {
  const safeIds = unlockedIds ?? [];
  const isHot = heat >= GAME_CONFIG.HEAT_PENALTY_THRESHOLD;
  const isDanger = heat >= 90;

  const p1 = countOf(safeIds, PART1_IDS); // 0-9
  const p2 = countOf(safeIds, PART2_IDS); // 0-9
  const total = safeIds.length;

  // Skin tone transitions from warm flesh → bark brown → deep green-brown
  const skinColor = p1 < 2 ? "#c2956f" : p1 < 5 ? "#9b7455" : "#6b4c35";
  const barkColor = p1 < 4 ? "#7a4535" : p1 < 7 ? "#5c3a22" : "#3d2010";
  const leafColor = p2 >= 5 ? "#4a9a35" : "#3a7a2a";
  const leafOpacity = 0.7 + p2 * 0.03;

  // Hair / crown colour
  const hairColor = p1 >= 6 ? "#2d5a1b" : "#1a0f08";

  const description = getDescription(p1, p2);

  return (
    <div className="flex flex-col items-center gap-3 select-none">
      <button
        onClick={onClick}
        className="relative group focus:outline-none cursor-pointer"
        aria-label="Click to generate Numen"
      >
        <div
          className={`relative w-44 h-72 md:w-52 md:h-80 transition-all duration-700 ${
            isDanger ? "animate-pulse" : ""
          }`}
        >
          <svg
            viewBox="0 0 200 310"
            className="w-full h-full drop-shadow-2xl group-hover:scale-105 group-active:scale-95 transition-transform duration-150"
          >
            <defs>
              <radialGradient id="glow-hot" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="glow-gold" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#d4af37" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="glow-green" cx="50%" cy="30%" r="60%">
                <stop offset="0%" stopColor="#4a9a35" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#4a9a35" stopOpacity="0" />
              </radialGradient>
              <filter id="glow-filter" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {/* Background glows */}
            {isHot && <ellipse cx="100" cy="155" rx="90" ry="140" fill="url(#glow-hot)" />}
            {p1 >= 8 && !isHot && <ellipse cx="100" cy="100" rx="85" ry="120" fill="url(#glow-green)" />}
            {p2 >= 7 && !isHot && <ellipse cx="100" cy="80" rx="90" ry="130" fill="url(#glow-gold)" />}

            {/* ── ROOTS (appear from line_546 onward) ── */}
            {p1 >= 4 && <Roots p1={p1} barkColor={barkColor} />}

            {/* ── LOWER BODY / TRUNK ── */}
            <LowerBody p1={p1} p2={p2} skinColor={skinColor} barkColor={barkColor} />

            {/* ── TORSO ── */}
            <Torso p1={p1} p2={p2} skinColor={skinColor} barkColor={barkColor} />

            {/* ── ARMS ── */}
            <Arms p1={p1} p2={p2} skinColor={skinColor} barkColor={barkColor} leafColor={leafColor} />

            {/* ── HEAD / CROWN ── */}
            <HeadAndCrown p1={p1} p2={p2} skinColor={skinColor} hairColor={hairColor} leafColor={leafColor} leafOpacity={leafOpacity} />

            {/* ── BARK TEXTURE LINES (appear as bark forms) ── */}
            {p1 >= 5 && <BarkTexture p1={p1} />}

            {/* ── GOLDEN LAUREL ADORNMENTS (Part 2) ── */}
            {p2 >= 6 && <GoldenAdornments p2={p2} />}

            {/* Shadow */}
            <ellipse cx="100" cy="302" rx="38" ry="6" fill="#1a0f08" opacity="0.35" />
          </svg>

          {/* Hover sparkle dots */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-amber-400 animate-ping"
                style={{
                  top: `${30 + i * 12}%`,
                  left: `${20 + (i % 2) * 60}%`,
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: "0.9s",
                }}
              />
            ))}
          </div>
        </div>
      </button>

      <div className="text-center max-w-[200px]">
        <p className="font-serif text-amber-200 text-xs italic opacity-80 leading-snug">{description}</p>
        <div className="mt-2 w-40 mx-auto bg-stone-800 rounded-full h-1.5">
          <div
            className="bg-gradient-to-r from-amber-700 to-green-600 h-1.5 rounded-full transition-all duration-700"
            style={{ width: `${Math.min((total / 18) * 100, 100)}%` }}
          />
        </div>
        <p className="text-stone-600 text-xs mt-1">{total}/18 lines unlocked</p>
      </div>
    </div>
  );
}

// ── SVG SUB-COMPONENTS ────────────────────────────────────────

function Roots({ p1, barkColor }: { p1: number; barkColor: string }) {
  const depth = Math.min((p1 - 4) * 12, 55);
  return (
    <g opacity="0.9">
      <path d={`M92 285 Q86 ${285+depth*0.6} 74 ${285+depth} Q79 ${287+depth} 86 ${278+depth*0.5}`} fill={barkColor} />
      <path d={`M108 285 Q114 ${285+depth*0.6} 126 ${285+depth} Q121 ${287+depth} 114 ${278+depth*0.5}`} fill={barkColor} />
      <path d={`M100 288 Q100 ${300+depth*0.7} 100 ${300+depth} Q103 ${300+depth} 103 ${295+depth*0.5}`} fill={barkColor} />
      {p1 >= 6 && (
        <>
          <path d={`M88 280 Q76 ${285+depth*0.8} 62 ${290+depth} Q67 ${293+depth} 76 ${285+depth*0.6}`} fill={barkColor} />
          <path d={`M112 280 Q124 ${285+depth*0.8} 138 ${290+depth} Q133 ${293+depth} 124 ${285+depth*0.6}`} fill={barkColor} />
        </>
      )}
      {p1 >= 8 && (
        <>
          <path d={`M84 278 Q68 ${288+depth} 52 ${298+depth} Q58 ${302+depth} 70 ${292+depth*0.7}`} fill={barkColor} opacity="0.8"/>
          <path d={`M116 278 Q132 ${288+depth} 148 ${298+depth} Q142 ${302+depth} 130 ${292+depth*0.7}`} fill={barkColor} opacity="0.8"/>
        </>
      )}
    </g>
  );
}

function LowerBody({ p1, p2, skinColor, barkColor }: { p1: number; p2: number; skinColor: string; barkColor: string }) {
  // p1<4: bare legs; p1>=4: bark starts; p1>=7: full trunk
  if (p1 < 4) {
    return (
      <g>
        <line x1="90" y1="185" x2="88" y2="250" stroke={skinColor} strokeWidth="14" strokeLinecap="round" />
        <line x1="110" y1="185" x2="112" y2="250" stroke={skinColor} strokeWidth="14" strokeLinecap="round" />
      </g>
    );
  }
  if (p1 < 7) {
    const barkW = 14 + (p1 - 4) * 3;
    return (
      <g>
        <path
          d={`M${92 - (p1-4)*2} 185 Q${88 - (p1-4)*2} 220 ${86 - (p1-4)*2} 255 L${114+(p1-4)*2} 255 Q${112+(p1-4)*2} 220 ${108+(p1-4)*2} 185 Z`}
          fill={barkColor}
        />
        {/* Bark seam line */}
        <line x1="100" y1="185" x2="100" y2="255" stroke={skinColor} strokeWidth="1" opacity="0.3" />
      </g>
    );
  }
  // Full trunk
  const trunkW = p2 >= 3 ? 32 : 26;
  return (
    <g>
      <path
        d={`M${100 - trunkW/2} 180 Q${96 - trunkW/2} 225 ${94 - trunkW/2} 285 L${106 + trunkW/2} 285 Q${104 + trunkW/2} 225 ${100 + trunkW/2} 180 Z`}
        fill={barkColor}
      />
      <line x1={100 - trunkW/4} y1="185" x2={100 - trunkW/4} y2="280" stroke={skinColor} strokeWidth="1" opacity="0.2" />
      <line x1={100 + trunkW/4} y1="185" x2={100 + trunkW/4} y2="280" stroke={skinColor} strokeWidth="1" opacity="0.2" />
    </g>
  );
}

function Torso({ p1, p2, skinColor, barkColor }: { p1: number; p2: number; skinColor: string; barkColor: string }) {
  const hasBark = p1 >= 5;
  const torsoColor = hasBark ? barkColor : skinColor;
  const torsoW = hasBark ? 28 + (p1 - 5) * 3 : 22;

  return (
    <g>
      <path
        d={`M${100 - torsoW} 100 Q${96 - torsoW} 145 ${94 - torsoW/1.2} 185 L${106 + torsoW/1.2} 185 Q${104 + torsoW} 145 ${100 + torsoW} 100 Z`}
        fill={torsoColor}
        opacity={hasBark ? 0.95 : 0.85}
      />
      {/* Dress / robe visible until bark takes over */}
      {!hasBark && (
        <path
          d={`M${78} 100 Q${75} 145 ${72} 185 L${128} 185 Q${125} 145 ${122} 100 Z`}
          fill="#6b3a2a"
          opacity="0.7"
        />
      )}
    </g>
  );
}

function Arms({ p1, p2, skinColor, barkColor, leafColor }: { p1: number; p2: number; skinColor: string; barkColor: string; leafColor: string }) {
  const hasBranches = p1 >= 6;
  const color = hasBranches ? barkColor : skinColor;

  if (!hasBranches) {
    // p1 < 6: raised arms (prayer pose after line_545)
    const raised = p1 >= 3;
    return (
      <g>
        <line x1="78" y1="105" x2={raised ? 48 : 52} y2={raised ? 72 : 130} stroke={color} strokeWidth="12" strokeLinecap="round" />
        <line x1="122" y1="105" x2={raised ? 152 : 148} y2={raised ? 72 : 130} stroke={color} strokeWidth="12" strokeLinecap="round" />
      </g>
    );
  }

  // Branches
  const branchThick = 12 + (p1 - 6) * 2 + p2 * 1;
  return (
    <g>
      {/* Main branches */}
      <line x1="80" y1="110" x2={45 - p2 * 3} y2={75 - p2 * 4} stroke={barkColor} strokeWidth={branchThick} strokeLinecap="round" />
      <line x1="120" y1="110" x2={155 + p2 * 3} y2={75 - p2 * 4} stroke={barkColor} strokeWidth={branchThick} strokeLinecap="round" />

      {/* Sub-branches appear in Part 2 */}
      {p2 >= 1 && (
        <>
          <line x1="58" y1="88" x2="40" y2="62" stroke={barkColor} strokeWidth={branchThick * 0.6} strokeLinecap="round" />
          <line x1="142" y1="88" x2="160" y2="62" stroke={barkColor} strokeWidth={branchThick * 0.6} strokeLinecap="round" />
        </>
      )}
      {p2 >= 2 && (
        <>
          <line x1="50" y1="76" x2="30" y2="55" stroke={barkColor} strokeWidth={branchThick * 0.4} strokeLinecap="round" />
          <line x1="150" y1="76" x2="170" y2="55" stroke={barkColor} strokeWidth={branchThick * 0.4} strokeLinecap="round" />
          <line x1="55" y1="70" x2="40" y2="45" stroke={barkColor} strokeWidth={branchThick * 0.3} strokeLinecap="round" />
          <line x1="145" y1="70" x2="160" y2="45" stroke={barkColor} strokeWidth={branchThick * 0.3} strokeLinecap="round" />
        </>
      )}

      {/* Leaf clusters on branch tips */}
      {p1 >= 7 && <LeafCluster cx={42} cy={68} leafColor={leafColor} size={12 + p2 * 4} />}
      {p1 >= 7 && <LeafCluster cx={158} cy={68} leafColor={leafColor} size={12 + p2 * 4} />}
      {p2 >= 1 && <LeafCluster cx={32} cy={52} leafColor={leafColor} size={10 + p2 * 3} />}
      {p2 >= 1 && <LeafCluster cx={168} cy={52} leafColor={leafColor} size={10 + p2 * 3} />}
      {p2 >= 3 && <LeafCluster cx={22} cy={44} leafColor={leafColor} size={8 + p2 * 3} />}
      {p2 >= 3 && <LeafCluster cx={178} cy={44} leafColor={leafColor} size={8 + p2 * 3} />}
    </g>
  );
}

function HeadAndCrown({ p1, p2, skinColor, hairColor, leafColor, leafOpacity }: {
  p1: number; p2: number; skinColor: string; hairColor: string; leafColor: string; leafOpacity: number;
}) {
  const faceColor = p1 >= 8 ? "#8b6e52" : skinColor;

  return (
    <g>
      {/* Face */}
      <ellipse cx="100" cy="72" rx={p1 >= 8 ? 18 : 22} ry={p1 >= 8 ? 20 : 25} fill={faceColor} opacity="0.95" />

      {/* Hair / crown */}
      {p1 < 6 ? (
        // Hair
        <path
          d={`M100 48 Q${p1 >= 3 ? 82 : 78} ${p1 >= 3 ? 38 : 42} ${p1 >= 3 ? 79 : 76} 35 Q100 ${p1 >= 3 ? 26 : 30} ${p1 >= 3 ? 121 : 124} 35 Q${p1 >= 3 ? 118 : 122} ${p1 >= 3 ? 38 : 42} 100 48`}
          fill={hairColor}
        />
      ) : (
        // Hair becoming leaves
        <>
          <path
            d="M80 55 Q70 38 65 28 Q80 22 92 40 Z"
            fill={leafColor} opacity={leafOpacity}
          />
          <path
            d="M120 55 Q130 38 135 28 Q120 22 108 40 Z"
            fill={leafColor} opacity={leafOpacity}
          />
          <path
            d="M100 50 Q94 32 96 18 Q106 18 104 32 Z"
            fill={leafColor} opacity={leafOpacity}
          />
          {p1 >= 7 && (
            <>
              <path d="M88 52 Q74 36 68 22 Q82 18 90 38 Z" fill={leafColor} opacity={leafOpacity} />
              <path d="M112 52 Q126 36 132 22 Q118 18 110 38 Z" fill={leafColor} opacity={leafOpacity} />
            </>
          )}
        </>
      )}

      {/* Crown leafy canopy — grows progressively */}
      {p1 >= 8 && (
        <g>
          <LeafCluster cx={100} cy={28} leafColor={leafColor} size={22 + p2 * 8} />
          {p2 >= 1 && <LeafCluster cx={80} cy={38} leafColor={leafColor} size={14 + p2 * 5} />}
          {p2 >= 1 && <LeafCluster cx={120} cy={38} leafColor={leafColor} size={14 + p2 * 5} />}
          {p2 >= 3 && <LeafCluster cx={65} cy={48} leafColor={leafColor} size={12 + p2 * 4} />}
          {p2 >= 3 && <LeafCluster cx={135} cy={48} leafColor={leafColor} size={12 + p2 * 4} />}
          {p2 >= 5 && <LeafCluster cx={100} cy={10} leafColor={leafColor} size={30 + p2 * 6} />}
          {p2 >= 7 && <LeafCluster cx={75} cy={20} leafColor={leafColor} size={20 + p2 * 5} />}
          {p2 >= 7 && <LeafCluster cx={125} cy={20} leafColor={leafColor} size={20 + p2 * 5} />}
        </g>
      )}

      {/* Top-of-tree point (line_552 — "her face has the top of a tree") */}
      {p1 >= 9 && (
        <g>
          <line x1="100" y1="50" x2="100" y2="-5" stroke="#3d2010" strokeWidth="8" strokeLinecap="round" />
          {p2 >= 6 && (
            <ellipse cx="100" cy={-5} rx="10" ry="7" fill="#d4af37" opacity="0.85" filter="url(#glow-filter)" />
          )}
        </g>
      )}
    </g>
  );
}

function LeafCluster({ cx, cy, leafColor, size }: { cx: number; cy: number; leafColor: string; size: number }) {
  const r = size / 2;
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={r * 1.3} ry={r} fill={leafColor} opacity="0.85" />
      <ellipse cx={cx - r * 0.7} cy={cy + r * 0.3} rx={r * 0.8} ry={r * 0.6} fill={leafColor} opacity="0.7" />
      <ellipse cx={cx + r * 0.7} cy={cy + r * 0.3} rx={r * 0.8} ry={r * 0.6} fill={leafColor} opacity="0.7" />
      <ellipse cx={cx} cy={cy - r * 0.5} rx={r * 0.7} ry={r * 0.5} fill="#4aaa40" opacity="0.5" />
    </g>
  );
}

function BarkTexture({ p1 }: { p1: number }) {
  return (
    <g stroke="#2a1508" strokeWidth="1" fill="none" opacity="0.4">
      <path d="M88 105 Q96 100 92 115" />
      <path d="M108 118 Q116 113 112 128" />
      {p1 >= 6 && <path d="M86 135 Q94 130 90 145" />}
      {p1 >= 6 && <path d="M110 148 Q118 143 114 158" />}
      {p1 >= 7 && <path d="M88 162 Q96 157 92 172" />}
      {p1 >= 7 && <path d="M109 170 Q117 165 113 180" />}
    </g>
  );
}

function GoldenAdornments({ p2 }: { p2: number }) {
  return (
    <g filter="url(#glow-filter)">
      {p2 >= 6 && <circle cx="68" cy="55" r="3" fill="#d4af37" opacity="0.8" />}
      {p2 >= 6 && <circle cx="132" cy="55" r="3" fill="#d4af37" opacity="0.8" />}
      {p2 >= 7 && <circle cx="42" cy="68" r="2.5" fill="#d4af37" opacity="0.7" />}
      {p2 >= 7 && <circle cx="158" cy="68" r="2.5" fill="#d4af37" opacity="0.7" />}
      {p2 >= 8 && <circle cx="22" cy="44" r="2" fill="#d4af37" opacity="0.6" />}
      {p2 >= 8 && <circle cx="178" cy="44" r="2" fill="#d4af37" opacity="0.6" />}
      {p2 >= 9 && <circle cx="100" cy="-5" r="5" fill="#d4af37" opacity="0.9" />}
    </g>
  );
}

function getDescription(p1: number, p2: number): string {
  if (p2 >= 9) return "Complete. Eternal. The Laurel of Rome.";
  if (p2 >= 7) return "Golden triumph light crowns the canopy";
  if (p2 >= 5) return "The god concedes — gold crowns the leaves";
  if (p2 >= 3) return "She shrinks from his kisses — the bark holds";
  if (p2 >= 1) return "Apollo's hand presses the bark — she trembles";
  if (p1 >= 9) return "Her face crowns the treetop — splendor remains";
  if (p1 >= 7) return "Deep roots anchor her — branches reach wide";
  if (p1 >= 5) return "Bark wraps her torso — hair turns to leaves";
  if (p1 >= 3) return "Her arms reach skyward — the prayer is spoken";
  if (p1 >= 1) return "She pales, exhausted — her feet slow";
  return "A nymph flees the golden god";
}
