import { StoryNode, ACTS } from "../config/gameConfig";

interface ScrollOfOvidProps {
  unlockedNodes: StoryNode[];
}

export function ScrollOfOvid({ unlockedNodes }: ScrollOfOvidProps) {
  const byAct = ACTS.map((act) => ({
    act,
    nodes: unlockedNodes.filter((n) => n.act === act.id),
  })).filter((a) => a.nodes.length > 0);

  if (unlockedNodes.length === 0) {
    return (
      <div className="text-center py-6">
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
    <div className="space-y-4">
      <h2 className="font-serif text-amber-300 text-base tracking-wide">
        Scroll of Ovid
        <span className="ml-2 text-stone-600 text-xs font-sans">
          Metamorphoses I.545–559
        </span>
      </h2>

      {byAct.map(({ act, nodes }) => (
        <div key={act.id} className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-px flex-1 bg-stone-800" />
            <span className="font-serif text-xs text-stone-600 italic whitespace-nowrap">
              {act.name}: {act.subtitle}
            </span>
            <div className="h-px flex-1 bg-stone-800" />
          </div>

          {nodes.map((node, idx) => (
            <div
              key={node.id}
              className="rounded border border-stone-800 bg-stone-950 px-3 py-2 animate-[fadeIn_0.5s_ease-in]"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <p className="font-serif text-sm italic text-amber-300 leading-snug">
                {node.line}
              </p>
              <p className="text-stone-500 text-xs mt-1 leading-snug">
                {node.translation}
              </p>
              <p className="text-amber-800 text-xs mt-0.5">✦ {node.effectDescription}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
