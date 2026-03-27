interface NumenDisplayProps {
  numen: number;
  totalNumenEarned: number;
  clickPower: number;
  autoClickRate: number;
  numanMultiplier: number;
}

function formatNumber(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(2)}k`;
  return Math.floor(n).toString();
}

export function NumenDisplay({
  numen,
  totalNumenEarned,
  clickPower,
  autoClickRate,
  numanMultiplier,
}: NumenDisplayProps) {
  const perSec = autoClickRate * numanMultiplier;
  const perClick = clickPower * numanMultiplier;

  return (
    <div className="text-center space-y-1">
      <div className="font-serif">
        <span className="text-4xl md:text-5xl font-bold text-amber-300 tracking-tight">
          {formatNumber(numen)}
        </span>
        <span className="text-amber-600 text-lg ml-2">Numen</span>
      </div>

      <p className="text-stone-500 text-xs font-serif italic">
        {formatNumber(totalNumenEarned)} total essence earned
      </p>

      <div className="flex items-center justify-center gap-4 text-xs text-stone-500 font-serif mt-2">
        <span title="Numen per click">
          ✦ {formatNumber(perClick)}/click
        </span>
        {perSec > 0 && (
          <span title="Numen per second">
            ⟳ {formatNumber(perSec)}/sec
          </span>
        )}
        {numanMultiplier > 1 && (
          <span className="text-amber-700" title="Numen multiplier">
            ×{numanMultiplier.toFixed(1)}
          </span>
        )}
      </div>
    </div>
  );
}
