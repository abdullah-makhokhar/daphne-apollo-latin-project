import { StoryNode, ACTS } from "../config/gameConfig";

interface UpgradeShopProps {
  available: StoryNode[];
  numen: number;
  onPurchase: (node: StoryNode) => void;
  refugitActive: boolean;
}

export function UpgradeShop({ available, numen, onPurchase, refugitActive }: UpgradeShopProps) {
  const byAct = ACTS.map((act) => ({
    act,
    nodes: available.filter((n) => n.act === act.id),
  })).filter((a) => a.nodes.length > 0);

  if (available.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="font-serif text-amber-300 text-lg italic">Arbor eris...</p>
        <p className="text-stone-500 text-sm mt-1">All transformations complete</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-amber-300 text-base tracking-wide">Metamorphosis Upgrades</h2>
        {refugitActive && (
          <span className="text-xs bg-stone-800 border border-amber-700 text-amber-400 px-2 py-0.5 rounded font-serif italic">
            ↺ Refugit active
          </span>
        )}
      </div>

      {byAct.map(({ act, nodes }) => (
        <div key={act.id} className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-px flex-1 bg-stone-700" />
            <span className="font-serif text-xs text-stone-500 italic whitespace-nowrap">
              {act.name}: {act.subtitle}
            </span>
            <div className="h-px flex-1 bg-stone-700" />
          </div>

          {nodes.map((node) => {
            const canAfford = numen >= node.cost;
            return (
              <button
                key={node.id}
                onClick={() => canAfford && onPurchase(node)}
                disabled={!canAfford}
                className={`
                  w-full text-left rounded border px-3 py-2.5 transition-all duration-200
                  ${
                    canAfford
                      ? "border-amber-800 bg-stone-900 hover:bg-stone-800 hover:border-amber-600 cursor-pointer"
                      : "border-stone-800 bg-stone-950 cursor-not-allowed opacity-60"
                  }
                `}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p
                      className={`font-serif text-sm italic leading-snug ${
                        canAfford ? "text-amber-200" : "text-stone-500"
                      }`}
                    >
                      {node.line}
                    </p>
                    <p className="text-stone-500 text-xs mt-0.5 leading-snug">
                      {node.translation}
                    </p>
                    <p
                      className={`text-xs mt-1 leading-snug ${
                        canAfford ? "text-amber-600" : "text-stone-700"
                      }`}
                    >
                      {node.effectDescription}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <div
                      className={`font-serif text-sm font-semibold ${
                        canAfford ? "text-amber-400" : "text-stone-600"
                      }`}
                    >
                      {formatNumber(node.cost)}
                    </div>
                    <div className="text-stone-600 text-xs">numen</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return Math.floor(n).toString();
}
