import { useEffect, useRef, useState } from "react";
import { useGameStore, getAvailableUpgrades, getUnlockedNodes } from "../store/gameStore";
import { DaphneSprite } from "../components/DaphneSprite";
import { HeatBar } from "../components/HeatBar";
import { UpgradeShop } from "../components/UpgradeShop";
import { ScrollOfOvid } from "../components/ScrollOfOvid";
import { NumenDisplay } from "../components/NumenDisplay";
import { TriumphScreen } from "../components/TriumphScreen";
import { GAME_CONFIG } from "../config/gameConfig";

type TabId = "upgrades" | "scroll";

export default function Game() {
  const store = useGameStore();
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("upgrades");

  useEffect(() => {
    tickRef.current = setInterval(() => {
      store.tick();
    }, GAME_CONFIG.TICK_RATE_MS);
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, []);

  const available = getAvailableUpgrades(store);
  const unlocked = getUnlockedNodes(store);
  const unlockedCount = store.unlockedIds.length;
  const isHot = store.apolloHeat >= GAME_CONFIG.HEAT_PENALTY_THRESHOLD;

  return (
    <div className="min-h-screen bg-stone-950 text-stone-200 font-serif">
      {store.gamePhase === "triumph" && (
        <TriumphScreen onReset={store.resetGame} />
      )}

      <div
        className={`
          fixed inset-0 pointer-events-none z-10 transition-all duration-1000
          ${isHot ? "ring-4 ring-red-600 ring-inset shadow-[inset_0_0_80px_rgba(220,38,38,0.25)]" : ""}
        `}
      />

      <div className="max-w-6xl mx-auto px-4 py-6">
        <header className="text-center mb-8 space-y-1">
          <h1 className="text-4xl md:text-5xl font-serif text-amber-300 tracking-wide">
            Daphne's Root
          </h1>
          <p className="text-stone-500 text-sm italic font-serif tracking-widest">
            Metamorphōsis — Ovid · I.545–559
          </p>
          <p className="text-stone-600 text-xs">
            Become the Laurel. Resist the Sun.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 flex flex-col items-center gap-5">
            <NumenDisplay
              numen={store.numen}
              totalNumenEarned={store.totalNumenEarned}
              clickPower={store.clickPower}
              autoClickRate={store.autoClickRate}
              numanMultiplier={store.numanMultiplier}
            />

            <DaphneSprite
              unlockedCount={unlockedCount}
              heat={store.apolloHeat}
              onClick={store.handleClick}
            />

            <div className="w-full">
              <HeatBar heat={store.apolloHeat} apolloVisible={store.apolloVisible} />
            </div>

            <div className="w-full text-center">
              <button
                onClick={store.resetGame}
                className="text-xs text-stone-700 hover:text-stone-500 transition-colors font-serif italic"
              >
                abandon transformation
              </button>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="border border-stone-800 rounded-lg overflow-hidden bg-stone-950/50">
              <div className="flex border-b border-stone-800">
                <TabButton
                  active={activeTab === "upgrades"}
                  onClick={() => setActiveTab("upgrades")}
                  badge={available.length}
                >
                  Upgrades
                </TabButton>
                <TabButton
                  active={activeTab === "scroll"}
                  onClick={() => setActiveTab("scroll")}
                  badge={unlocked.length}
                >
                  Scroll of Ovid
                </TabButton>
              </div>

              <div className="p-4 overflow-y-auto max-h-[60vh] scrollbar-thin">
                {activeTab === "upgrades" ? (
                  <UpgradeShop
                    available={available}
                    numen={store.numen}
                    onPurchase={store.purchaseUpgrade}
                    refugitActive={store.refugitActive}
                  />
                ) : (
                  <ScrollOfOvid unlockedNodes={unlocked} />
                )}
              </div>
            </div>

            {store.apolloVisible && (
              <div
                className={`
                  mt-3 rounded border px-4 py-2.5 text-sm font-serif italic
                  ${
                    isHot
                      ? "border-red-800 bg-red-950/30 text-red-300 animate-pulse"
                      : "border-amber-900 bg-amber-950/20 text-amber-400"
                  }
                `}
              >
                {isHot
                  ? "☀ Apollo's hand stretches toward your bark — sentit adhuc trepidare sub cortice pectus — your Numen generation is halved!"
                  : "☀ Phoebus amat — Apollo pursues still, but the bark holds..."}
              </div>
            )}

            <div className="mt-3 grid grid-cols-3 gap-3">
              <StatCard label="Lines Unlocked" value={`${unlockedCount}/15`} />
              <StatCard label="Click Power" value={`×${(store.clickPower * store.numanMultiplier).toFixed(1)}`} />
              <StatCard label="Heat Rate" value={`${(store.heatRateMultiplier * 100).toFixed(0)}%`} />
            </div>
          </div>
        </div>

        <footer className="text-center mt-10 text-stone-800 text-xs italic font-serif space-y-1">
          <p>"dixit et osculis lignum; refugit tamen oscula lignum."</p>
          <p>Ovid, Metamorphōsēs I.556 · Progress saved automatically</p>
        </footer>
      </div>
    </div>
  );
}

function TabButton({
  children,
  active,
  onClick,
  badge,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  badge?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        flex-1 px-4 py-3 text-sm font-serif transition-colors duration-200 flex items-center justify-center gap-1.5
        ${
          active
            ? "bg-stone-900 text-amber-300 border-b-2 border-amber-600"
            : "text-stone-500 hover:text-stone-300 hover:bg-stone-900/50"
        }
      `}
    >
      {children}
      {badge !== undefined && badge > 0 && (
        <span
          className={`text-xs px-1.5 py-0.5 rounded-full ${
            active ? "bg-amber-800 text-amber-200" : "bg-stone-800 text-stone-400"
          }`}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-stone-800 rounded bg-stone-950/50 px-3 py-2 text-center">
      <div className="font-serif text-amber-400 text-lg">{value}</div>
      <div className="text-stone-600 text-xs mt-0.5">{label}</div>
    </div>
  );
}
