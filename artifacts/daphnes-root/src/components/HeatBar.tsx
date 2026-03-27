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
    pct < 40 ? "from-amber-700 to-amber-600"
    : pct < GAME_CONFIG.HEAT_PENALTY_THRESHOLD ? "from-orange-600 to-orange-500"
    : "from-red-700 to-red-500";

  const barGlow =
    isDanger ? "shadow-[0_0_12px_rgba(220,38,38,0.7)]"
    : isPenalty ? "shadow-[0_0_8px_rgba(234,88,12,0.5)]"
    : "";

  return (
    <div className="w-full space-y-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-serif text-amber-300 text-sm tracking-wide">Apollo's Heat</span>
          {apolloVisible && (
            <span
              className={`text-xs px-1.5 py-0.5 rounded font-serif ${
                isDanger
                  ? "bg-red-900 text-red-200 animate-pulse"
                  : isPenalty
                  ? "bg-orange-900/70 text-orange-200"
                  : "bg-stone-800 text-amber-500"
              }`}
            >
              {isDanger ? "⚠ HIS HAND REACHES" : isPenalty ? "✋ He draws close" : "☀ Pursuing"}
            </span>
          )}
        </div>
        <span
          className={`text-xs font-mono font-semibold ${
            isDanger ? "text-red-400 animate-pulse" : isPenalty ? "text-orange-400" : "text-stone-500"
          }`}
        >
          {Math.floor(pct)}%
        </span>
      </div>

      <div className="relative w-full bg-stone-900 rounded-full h-3.5 overflow-hidden border border-stone-700">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${heatColor} transition-all duration-150 ${barGlow} ${
            isDanger ? "animate-pulse" : ""
          }`}
          style={{ width: `${pct}%` }}
        />
        {/* Penalty threshold marker */}
        <div
          className="absolute top-0 h-full border-r-2 border-dashed border-amber-500/40 pointer-events-none"
          style={{ left: `${GAME_CONFIG.HEAT_PENALTY_THRESHOLD}%` }}
        />
      </div>

      <p
        className={`text-xs font-serif italic transition-colors ${
          isDanger
            ? "text-red-400 animate-pulse"
            : isPenalty
            ? "text-orange-500"
            : "text-stone-700"
        }`}
      >
        {isDanger
          ? "sentit adhuc trepidare — bark barely holds!"
          : isPenalty
          ? "His warmth seeps through the bark — Numen flows at half speed"
          : heat < 30
          ? "The god is distant still..."
          : heat < 55
          ? "His golden lyre grows louder..."
          : "His breath upon your bark..."}
      </p>
    </div>
  );
}
