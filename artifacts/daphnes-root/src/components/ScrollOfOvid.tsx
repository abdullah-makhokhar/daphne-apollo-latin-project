import { StoryNode, PARTS } from "../config/gameConfig";

interface ScrollOfOvidProps {
  unlockedNodes: StoryNode[];
}

export function ScrollOfOvid({ unlockedNodes }: ScrollOfOvidProps) {
  const part1 = unlockedNodes.filter((n) => n.part === 1);
  const part2 = unlockedNodes.filter((n) => n.part === 2);

  if (unlockedNodes.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="font-serif text-stone-600 text-sm italic">
          The scroll awaits your first transformation...
        </p>
        <p className="text-stone-700 text-xs mt-2">
          Purchase upgrades to reveal the lines of Ovid
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-amber-300 text-base tracking-wide">Scroll of Ovid</h2>
        <span className="text-stone-600 text-xs font-serif italic">Metamorphōsēs I.543–561</span>
      </div>

      {part1.length > 0 && (
        <ScrollPart part={1} nodes={part1} />
      )}

      {part2.length > 0 && (
        <ScrollPart part={2} nodes={part2} />
      )}
    </div>
  );
}

function ScrollPart({ part, nodes }: { part: 1 | 2; nodes: StoryNode[] }) {
  const info = PARTS[part];
  return (
    <div className="space-y-2">
      <div className="rounded border border-stone-800 bg-stone-900/40 px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="font-serif text-amber-500 text-xs tracking-widest uppercase">{info.title}</span>
          <div className="h-px flex-1 bg-stone-800" />
          <span className="font-serif text-stone-600 text-xs italic">{info.latinTitle}</span>
        </div>
        <p className="text-stone-400 text-sm font-serif italic">{info.subtitle}</p>
      </div>

      {nodes.map((node, idx) => (
        <div
          key={node.id}
          className="rounded border border-stone-800/60 bg-stone-950 px-3 py-2.5"
          style={{ animation: `fadeIn 0.5s ease-in ${idx * 0.05}s both` }}
        >
          <p className="font-serif text-sm italic text-amber-300 leading-snug">{node.line}</p>
          <p className="text-stone-500 text-xs mt-0.5 leading-snug">{node.translation}</p>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-green-600 text-xs">✦ {node.effectDescription}</span>
            <span className="text-amber-800 text-xs italic">🌿 {node.spriteEffect}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
