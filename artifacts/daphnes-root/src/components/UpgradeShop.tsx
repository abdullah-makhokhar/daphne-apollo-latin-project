import { StoryNode, PARTS } from "../config/gameConfig";

interface UpgradeShopProps {
  available: StoryNode[];
  numen: number;
  onPurchase: (node: StoryNode) => void;
  refugitActive: boolean;
  unlockedCount: number;
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(2)}k`;
  return Math.floor(n).toString();
}

export function UpgradeShop({ available, numen, onPurchase, refugitActive, unlockedCount }: UpgradeShopProps) {
  const part1 = available.filter((n) => n.part === 1);
  const part2 = available.filter((n) => n.part === 2);

  if (available.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="font-serif text-amber-300 text-2xl italic">Arbor eris certe.</p>
        <p className="text-stone-500 text-sm mt-2">All 18 lines revealed. The Laurel stands eternal.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-amber-300 text-base tracking-wide">Metamorphosis Upgrades</h2>
        <div className="flex items-center gap-2">
          {refugitActive && (
            <span className="text-xs bg-stone-800 border border-green-800 text-green-400 px-2 py-0.5 rounded font-serif italic">
              ↺ Refugit active
            </span>
          )}
          <span className="text-xs text-stone-600 font-serif">{unlockedCount}/18</span>
        </div>
      </div>

      {part1.length > 0 && (
        <PartSection
          partKey={1}
          nodes={part1}
          numen={numen}
          onPurchase={onPurchase}
        />
      )}

      {part2.length > 0 && (
        <PartSection
          partKey={2}
          nodes={part2}
          numen={numen}
          onPurchase={onPurchase}
        />
      )}
    </div>
  );
}

function PartSection({
  partKey,
  nodes,
  numen,
  onPurchase,
}: {
  partKey: 1 | 2;
  nodes: StoryNode[];
  numen: number;
  onPurchase: (n: StoryNode) => void;
}) {
  const info = PARTS[partKey];
  return (
    <div className="space-y-2">
      {/* Part header */}
      <div className="rounded-md border border-stone-700 bg-stone-900/60 px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="font-serif text-amber-400 text-xs tracking-widest uppercase">{info.title}</span>
          <div className="h-px flex-1 bg-stone-700" />
          <span className="font-serif text-stone-500 text-xs italic">{info.latinTitle} · {info.lines}</span>
        </div>
        <p className="font-serif text-stone-400 text-sm italic mt-0.5">{info.subtitle}</p>
        <p className="text-stone-600 text-xs mt-0.5">{info.description}</p>
      </div>

      {nodes.map((node) => {
        const canAfford = numen >= node.cost;
        return (
          <button
            key={node.id}
            onClick={() => canAfford && onPurchase(node)}
            disabled={!canAfford}
            className={`
              w-full text-left rounded border px-3 py-2.5 transition-all duration-200 group
              ${
                canAfford
                  ? "border-amber-800/60 bg-stone-900 hover:bg-stone-800 hover:border-amber-500 cursor-pointer shadow-[0_0_12px_rgba(180,130,30,0.1)] hover:shadow-[0_0_20px_rgba(180,130,30,0.2)]"
                  : "border-stone-800 bg-stone-950 cursor-not-allowed opacity-50"
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
                <div className="flex items-center gap-3 mt-1.5">
                  <span className={`text-xs ${canAfford ? "text-green-500" : "text-stone-700"}`}>
                    ✦ {node.effectDescription}
                  </span>
                </div>
                <p className={`text-xs mt-0.5 italic ${canAfford ? "text-amber-700" : "text-stone-800"}`}>
                  🌿 {node.spriteEffect}
                </p>
              </div>
              <div className="text-right shrink-0 flex flex-col items-end gap-0.5">
                <div
                  className={`font-serif text-base font-semibold ${
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
  );
}
