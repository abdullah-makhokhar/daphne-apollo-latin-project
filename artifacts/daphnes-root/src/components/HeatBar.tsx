import { GAME_CONFIG } from "../config/gameConfig";

interface HeatBarProps {
  heat: number;
  apolloVisible: boolean;
}

export function HeatBar({ heat, apolloVisible }: HeatBarProps) {
  const pct = Math.min((heat / GAME_CONFIG.HEAT_MAX) * 100, 100);
  const isPenalty = heat >= GAME_CONFIG.HEAT_PENALTY_THRESHOLD;
  const isDanger = heat >= 90;

  const heatColor =
    pct < 50 ? "bg-amber-600" : pct < 80 ? "bg-orange-500" : "bg-red-500";

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span className="font-serif text-amber-300 text-sm tracking-wide">Apollo's Heat</span>
          {apolloVisible && (
            <span
              className={`text-xs px-1.5 py-0.5 rounded font-serif ${
                isDanger
                  ? "bg-red-900 text-red-200 animate-pulse"
                  : isPenalty
                  ? "bg-orange-900 text-orange-200"
                  : "bg-stone-800 text-amber-400"
              }`}
            >
              {isDanger ? "⚠ HE REACHES" : isPenalty ? "✋ His hand..." : "☀ Pursuing"}
            </span>
          )}
        </div>
        <span
          className={`text-xs font-mono ${
            isDanger ? "text-red-400 animate-pulse" : isPenalty ? "text-orange-400" : "text-stone-500"
          }`}
        >
          {Math.floor(pct)}%
        </span>
      </div>

      <div className="relative w-full bg-stone-900 rounded-full h-3 overflow-hidden border border-stone-700">
        <div
          className={`h-full rounded-full transition-all duration-300 ${heatColor} ${
            isDanger ? "animate-pulse" : ""
          }`}
          style={{ width: `${pct}%` }}
        />
        <div
          className="absolute top-0 left-0 h-full"
          style={{
            width: `${(GAME_CONFIG.HEAT_PENALTY_THRESHOLD / GAME_CONFIG.HEAT_MAX) * 100}%`,
            borderRight: "2px dashed rgba(251, 191, 36, 0.4)",
          }}
        />
      </div>

      {isPenalty && (
        <p className="mt-1 text-xs text-red-400 italic font-serif animate-pulse">
          sentit adhuc trepidare — Numen generation slowed by half
        </p>
      )}
      {!isPenalty && (
        <p className="mt-1 text-xs text-stone-600 italic font-serif">
          {heat < 30 ? "The god is distant still..." : heat < 60 ? "His golden lyre grows louder..." : "His breath on your bark..."}
        </p>
      )}
    </div>
  );
}
