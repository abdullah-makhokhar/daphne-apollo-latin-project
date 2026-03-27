import { GAME_CONFIG } from "../config/gameConfig";
import { getSpriteStage } from "../store/gameStore";

interface DaphneSpriteProps {
  unlockedCount: number;
  heat: number;
  onClick: () => void;
}

export function DaphneSprite({ unlockedCount, heat, onClick }: DaphneSpriteProps) {
  const stage = getSpriteStage(unlockedCount);
  const isHot = heat >= GAME_CONFIG.HEAT_PENALTY_THRESHOLD;

  const stageData = GAME_CONFIG.SPRITE_STAGES[stage];
  const progress = unlockedCount / 15;

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onClick={onClick}
        className="relative group select-none focus:outline-none"
        aria-label="Click to generate Numen"
      >
        <div
          className={`
            relative w-48 h-64 md:w-56 md:h-72 transition-all duration-700
            ${isHot ? "animate-pulse" : ""}
          `}
        >
          <svg
            viewBox="0 0 200 280"
            className="w-full h-full drop-shadow-lg group-hover:scale-105 group-active:scale-95 transition-transform duration-150"
          >
            <defs>
              <radialGradient id="glow-hot" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="glow-gold" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#d4af37" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
              </radialGradient>
              <filter id="bark-texture">
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.65"
                  numOctaves="3"
                  stitchTiles="stitch"
                />
                <feColorMatrix type="saturate" values="0" />
                <feBlend in="SourceGraphic" mode="multiply" />
              </filter>
            </defs>

            {isHot && (
              <ellipse cx="100" cy="140" rx="90" ry="130" fill="url(#glow-hot)" />
            )}

            {stage >= 4 && (
              <ellipse cx="100" cy="140" rx="90" ry="130" fill="url(#glow-gold)" />
            )}

            {stage === 0 && <WomanStage />}
            {stage === 1 && <RootsStage />}
            {stage === 2 && <BarkStage />}
            {stage === 3 && <BranchesStage />}
            {stage >= 4 && <LaurelStage />}

            <ellipse
              cx="100"
              cy="268"
              rx="40"
              ry="8"
              fill="#2d1810"
              opacity="0.3"
            />
          </svg>

          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 group-active:opacity-0 transition-opacity pointer-events-none">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-amber-400 animate-ping"
                style={{
                  transform: `translate(${(i - 1) * 30}px, -20px)`,
                  animationDelay: `${i * 0.15}s`,
                  animationDuration: "0.8s",
                }}
              />
            ))}
          </div>
        </div>
      </button>

      <div className="text-center">
        <p className="font-serif text-amber-200 text-sm italic opacity-75">
          {stageData.description}
        </p>
        <div className="mt-2 w-48 bg-stone-800 rounded-full h-1.5">
          <div
            className="bg-amber-600 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(progress * 100, 100)}%` }}
          />
        </div>
        <p className="text-stone-500 text-xs mt-1">{unlockedCount}/15 transformations</p>
      </div>
    </div>
  );
}

function WomanStage() {
  return (
    <g>
      <ellipse cx="100" cy="55" rx="22" ry="26" fill="#c2956f" opacity="0.9" />
      <path
        d="M100 30 Q85 20 82 15 Q100 8 118 15 Q115 20 100 30"
        fill="#1a0f08"
      />
      <path
        d="M78 81 Q68 130 65 160 Q72 168 80 165 Q85 140 90 120 Q100 145 100 165 Q100 145 110 120 Q115 140 120 165 Q128 168 135 160 Q132 130 122 81 Z"
        fill="#6b3a2a"
        opacity="0.85"
      />
      <path
        d="M78 81 Q100 95 122 81 L118 75 Q100 85 82 75 Z"
        fill="#7a4535"
      />
      <line x1="78" y1="85" x2="55" y2="125" stroke="#c2956f" strokeWidth="10" strokeLinecap="round" />
      <line x1="122" y1="85" x2="145" y2="125" stroke="#c2956f" strokeWidth="10" strokeLinecap="round" />
      <line x1="90" y1="165" x2="88" y2="220" stroke="#c2956f" strokeWidth="12" strokeLinecap="round" />
      <line x1="110" y1="165" x2="112" y2="220" stroke="#c2956f" strokeWidth="12" strokeLinecap="round" />
      <path
        d="M82 30 Q75 60 72 90 Q100 100 128 90 Q125 60 118 30"
        fill="#c2956f"
        opacity="0.7"
      />
    </g>
  );
}

function RootsStage() {
  return (
    <g>
      <ellipse cx="100" cy="55" rx="22" ry="26" fill="#8b6e52" opacity="0.9" />
      <path
        d="M100 30 Q85 20 82 15 Q100 8 118 15 Q115 20 100 30"
        fill="#1a0f08"
      />
      <path
        d="M78 81 Q68 130 65 160 Q72 168 80 165 Q85 140 90 120 Q100 145 100 165 Q100 145 110 120 Q115 140 120 165 Q128 168 135 160 Q132 130 122 81 Z"
        fill="#5c3a22"
        opacity="0.9"
      />
      <line x1="78" y1="85" x2="55" y2="125" stroke="#8b6e52" strokeWidth="10" strokeLinecap="round" />
      <line x1="122" y1="85" x2="145" y2="125" stroke="#8b6e52" strokeWidth="10" strokeLinecap="round" />
      <path d="M90 220 Q85 240 75 260 Q80 262 85 255 Q88 240 90 230" fill="#3d2010" />
      <path d="M110 220 Q115 240 125 260 Q120 262 115 255 Q112 240 110 230" fill="#3d2010" />
      <path d="M100 230 Q100 250 100 268 Q103 268 103 250 Q103 230 100 230" fill="#3d2010" />
      <path d="M92 235 Q80 248 72 265 Q76 266 82 252 Q88 240 92 235" fill="#3d2010" />
      <path d="M108 235 Q120 248 128 265 Q124 266 118 252 Q112 240 108 235" fill="#3d2010" />
    </g>
  );
}

function BarkStage() {
  return (
    <g>
      <ellipse cx="100" cy="55" rx="22" ry="26" fill="#6b4c35" opacity="0.95" />
      <path
        d="M100 30 Q85 20 82 15 Q100 8 118 15 Q115 20 100 30"
        fill="#1a0f08"
      />
      <path
        d="M78 81 Q65 130 62 165 Q72 175 82 170 Q86 145 90 120 Q100 148 100 170 Q100 148 110 120 Q114 145 118 170 Q128 175 138 165 Q135 130 122 81 Z"
        fill="#4a2e18"
      />
      <path d="M70 100 Q80 95 85 105" stroke="#3d2010" strokeWidth="1.5" fill="none" />
      <path d="M115 110 Q125 105 130 115" stroke="#3d2010" strokeWidth="1.5" fill="none" />
      <path d="M68 130 Q78 125 83 135" stroke="#3d2010" strokeWidth="1.5" fill="none" />
      <path d="M118 140 Q128 135 133 145" stroke="#3d2010" strokeWidth="1.5" fill="none" />
      <line x1="78" y1="85" x2="52" y2="128" stroke="#4a2e18" strokeWidth="12" strokeLinecap="round" />
      <line x1="122" y1="85" x2="148" y2="128" stroke="#4a2e18" strokeWidth="12" strokeLinecap="round" />
      <path d="M88 220 Q82 242 72 262 Q78 264 84 255 Q88 242 90 230" fill="#3d2010" />
      <path d="M112 220 Q118 242 128 262 Q122 264 116 255 Q112 242 110 230" fill="#3d2010" />
      <path d="M100 225 Q100 248 100 268 Q104 268 104 248 Q104 225 100 225" fill="#3d2010" />
      <path d="M94 230 Q82 246 74 265 Q79 266 85 252 Q90 240 94 230" fill="#3d2010" />
      <path d="M106 230 Q118 246 126 265 Q121 266 115 252 Q110 240 106 230" fill="#3d2010" />
    </g>
  );
}

function BranchesStage() {
  return (
    <g>
      <ellipse cx="100" cy="50" rx="20" ry="24" fill="#4a3320" opacity="0.95" />
      <line x1="100" y1="26" x2="100" y2="5" stroke="#2d5a1b" strokeWidth="6" />
      <line x1="100" y1="10" x2="80" y2="-5" stroke="#2d5a1b" strokeWidth="4" />
      <line x1="100" y1="10" x2="120" y2="-5" stroke="#2d5a1b" strokeWidth="4" />
      <ellipse cx="100" cy="0" rx="18" ry="12" fill="#3a7a2a" opacity="0.85" />
      <ellipse cx="80" cy="-5" rx="14" ry="9" fill="#3a7a2a" opacity="0.75" />
      <ellipse cx="120" cy="-5" rx="14" ry="9" fill="#3a7a2a" opacity="0.75" />
      <path
        d="M78 74 Q65 125 62 162 Q72 172 82 167 Q86 142 90 118 Q100 145 100 167 Q100 145 110 118 Q114 142 118 167 Q128 172 138 162 Q135 125 122 74 Z"
        fill="#3d2010"
      />
      <path d="M50 120 Q42 115 38 125 Q45 130 50 120" fill="#2d5a1b" />
      <path d="M38 120 Q32 112 28 120 Q34 126 38 120" fill="#3a7a2a" />
      <path d="M150 120 Q158 115 162 125 Q155 130 150 120" fill="#2d5a1b" />
      <path d="M162 120 Q168 112 172 120 Q166 126 162 120" fill="#3a7a2a" />
      <path d="M88 215 Q82 238 72 258 Q78 260 84 252 Q88 238 90 225" fill="#3d2010" />
      <path d="M112 215 Q118 238 128 258 Q122 260 116 252 Q112 238 110 225" fill="#3d2010" />
      <path d="M100 220 Q100 245 100 265 Q104 265 104 245 Q104 220 100 220" fill="#3d2010" />
      <path d="M94 228 Q82 243 74 262 Q79 263 85 250 Q90 238 94 228" fill="#3d2010" />
      <path d="M106 228 Q118 243 126 262 Q121 263 115 250 Q110 238 106 228" fill="#3d2010" />
    </g>
  );
}

function LaurelStage() {
  return (
    <g>
      <ellipse cx="100" cy="120" rx="75" ry="100" fill="#2d5a1b" opacity="0.35" />
      <line x1="100" y1="220" x2="100" y2="30" stroke="#3d2010" strokeWidth="16" strokeLinecap="round" />
      <path d="M100 120 Q75 100 55 110 Q70 125 100 120" fill="#2d5a1b" opacity="0.9" />
      <path d="M100 120 Q125 100 145 110 Q130 125 100 120" fill="#2d5a1b" opacity="0.9" />
      <path d="M100 90 Q75 70 50 75 Q65 93 100 90" fill="#2d5a1b" opacity="0.85" />
      <path d="M100 90 Q125 70 150 75 Q135 93 100 90" fill="#2d5a1b" opacity="0.85" />
      <path d="M100 60 Q80 42 60 48 Q72 63 100 60" fill="#2d5a1b" opacity="0.8" />
      <path d="M100 60 Q120 42 140 48 Q128 63 100 60" fill="#2d5a1b" opacity="0.8" />
      <path d="M100 150 Q72 138 50 148 Q68 162 100 150" fill="#3a7a2a" opacity="0.8" />
      <path d="M100 150 Q128 138 150 148 Q132 162 100 150" fill="#3a7a2a" opacity="0.8" />
      <path d="M100 180 Q78 172 60 180 Q75 192 100 180" fill="#3a7a2a" opacity="0.75" />
      <path d="M100 180 Q122 172 140 180 Q125 192 100 180" fill="#3a7a2a" opacity="0.75" />
      <ellipse cx="100" cy="20" rx="38" ry="28" fill="#3a7a2a" opacity="0.9" />
      <ellipse cx="100" cy="20" rx="25" ry="18" fill="#4a9a35" opacity="0.7" />
      <ellipse cx="100" cy="18" rx="12" ry="9" fill="#d4af37" opacity="0.6" />
      <path d="M88 215 Q82 235 72 255 Q78 257 84 248 Q88 235 90 220" fill="#3d2010" />
      <path d="M112 215 Q118 235 128 255 Q122 257 116 248 Q112 235 110 220" fill="#3d2010" />
      <path d="M100 218 Q100 242 100 262 Q104 262 104 242 Q104 218 100 218" fill="#3d2010" />
      <path d="M94 226 Q82 240 74 258 Q79 260 85 247 Q90 235 94 226" fill="#3d2010" />
      <path d="M106 226 Q118 240 126 258 Q121 260 115 247 Q110 235 106 226" fill="#3d2010" />
      <circle cx="68" cy="40" r="3" fill="#d4af37" opacity="0.7" />
      <circle cx="130" cy="55" r="2.5" fill="#d4af37" opacity="0.6" />
      <circle cx="55" cy="100" r="2" fill="#d4af37" opacity="0.5" />
      <circle cx="145" cy="85" r="2.5" fill="#d4af37" opacity="0.6" />
      <circle cx="62" cy="155" r="2" fill="#d4af37" opacity="0.5" />
      <circle cx="140" cy="145" r="2" fill="#d4af37" opacity="0.5" />
    </g>
  );
}
