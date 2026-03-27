interface NumenDisplayProps {
  numen: number;
  totalNumenEarned: number;
  clickPower: number;
  autoClickRate: number;
  numanMultiplier: number;
  isPenalty: boolean;
}

function formatNumber(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(2)}k`;
  return Math.floor(n).toString();
}

function formatPrecise(n: number): string {
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  if (n % 1 === 0) return n.toString();
  return n.toFixed(1);
}

export function NumenDisplay({
  numen,
  totalNumenEarned,
  clickPower,
  autoClickRate,
  numanMultiplier,
  isPenalty,
}: NumenDisplayProps) {
  const perSec = autoClickRate * numanMultiplier * (isPenalty ? 0.5 : 1);
  const perClick = clickPower * numanMultiplier * (isPenalty ? 0.5 : 1);

  return (
    <div className="text-center space-y-0.5 w-full">
      {/* Main counter */}
      <div className="font-serif">
        <span
          className={`text-4xl md:text-5xl font-bold tracking-tight transition-colors ${
            isPenalty ? "text-red-400" : "text-amber-300"
          }`}
        >
          {formatNumber(numen)}
        </span>
        <span className="text-amber-600 text-xl ml-2">Numen</span>
      </div>

      <p className="text-stone-600 text-xs font-serif italic">
        {formatNumber(totalNumenEarned)} total earned
      </p>

      {/* Per-click and per-sec — cookie clicker style */}
      <div className="flex items-center justify-center gap-4 mt-1">
        {/* Per click — highlighted like cookie clicker */}
        <div className="flex items-center gap-1 bg-stone-900 border border-stone-800 rounded px-2.5 py-1">
          <span className="text-amber-500 text-base">🖱</span>
          <div className="text-left">
            <div className="font-serif text-amber-300 text-sm font-semibold leading-none">
              +{formatPrecise(perClick)}
            </div>
            <div className="text-stone-600 text-xs leading-none">per click</div>
          </div>
        </div>

        {perSec > 0 && (
          <div className="flex items-center gap-1 bg-stone-900 border border-stone-800 rounded px-2.5 py-1">
            <span className="text-green-500 text-base">🌿</span>
            <div className="text-left">
              <div className="font-serif text-green-400 text-sm font-semibold leading-none">
                +{formatPrecise(perSec)}
              </div>
              <div className="text-stone-600 text-xs leading-none">per second</div>
            </div>
          </div>
        )}

        {numanMultiplier > 1 && (
          <div className="flex items-center gap-1 bg-stone-900 border border-amber-900/40 rounded px-2.5 py-1">
            <span className="text-amber-400 text-sm font-serif">×{numanMultiplier.toFixed(1)}</span>
            <div className="text-stone-600 text-xs">mult</div>
          </div>
        )}
      </div>

      {isPenalty && (
        <p className="text-red-500 text-xs italic font-serif animate-pulse mt-1">
          ☀ Apollo's Heat — all generation halved
        </p>
      )}
    </div>
  );
}
