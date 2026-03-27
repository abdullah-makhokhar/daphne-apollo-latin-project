import { useEffect, useRef, useState } from "react";
import { useGameStore, getAvailableUpgrades, getUnlockedNodes } from "../store/gameStore";
import { DaphneSprite } from "../components/DaphneSprite";
import { HeatBar } from "../components/HeatBar";
import { UpgradeShop } from "../components/UpgradeShop";
import { ScrollOfOvid } from "../components/ScrollOfOvid";
import { NumenDisplay } from "../components/NumenDisplay";
import { TriumphScreen } from "../components/TriumphScreen";
import { ParticleBackground } from "../components/ParticleBackground";
import { ClickFeedback, useClickFeedback } from "../components/ClickFeedback";
import { GAME_CONFIG } from "../config/gameConfig";

type TabId = "upgrades" | "scroll";

export default function Game() {
  const store = useGameStore();
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("upgrades");
  const { events, addClick } = useClickFeedback();

  const isHot = store.apolloHeat >= GAME_CONFIG.HEAT_PENALTY_THRESHOLD;
  const isDanger = store.apolloHeat >= 90;

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

  const effectivePerClick = store.clickPower * store.numanMultiplier * (isHot ? 0.5 : 1);

  const handleSpriteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    store.handleClick();
    addClick(e.clientX, e.clientY, effectivePerClick);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-200 font-serif relative overflow-hidden">
      {/* Particle background layer */}
      <ParticleBackground heat={store.apolloHeat} unlockedCount={unlockedCount} />

      {/* Click feedback layer */}
      <ClickFeedback events={events} />

      {/* Triumph overlay */}
      {store.gamePhase === "triumph" && <TriumphScreen onReset={store.resetGame} />}

      {/* Heat border vignette */}
      <div
        className={`fixed inset-0 pointer-events-none z-10 transition-all duration-700 ${
          isDanger
            ? "shadow-[inset_0_0_120px_rgba(220,38,38,0.4)] ring-4 ring-red-700 ring-inset"
            : isHot
            ? "shadow-[inset_0_0_80px_rgba(220,38,38,0.2)] ring-2 ring-red-800 ring-inset"
            : ""
        }`}
      />

      {/* Main content — above particles */}
      <div className="relative z-20 max-w-6xl mx-auto px-4 py-5">
        {/* Header */}
        <header className="text-center mb-6 space-y-1">
          <h1 className="text-4xl md:text-5xl font-serif text-amber-300 tracking-wide drop-shadow-[0_2px_8px_rgba(212,175,55,0.4)]">
            Daphne's Root
          </h1>
          <p className="text-stone-500 text-sm italic font-serif tracking-widest">
            Metamorphōsis — Ovid · I.543–561
          </p>
          <p className="text-stone-600 text-xs">Become the Laurel. Resist the Sun.</p>
        </header>

        {/* Main 3-col layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Left column — sprite + stats */}
          <div className="md:col-span-1 flex flex-col items-center gap-4">
            <NumenDisplay
              numen={store.numen}
              totalNumenEarned={store.totalNumenEarned}
              clickPower={store.clickPower}
              autoClickRate={store.autoClickRate}
              numanMultiplier={store.numanMultiplier}
              isPenalty={isHot}
            />

            <DaphneSprite
              unlockedIds={store.unlockedIds}
              heat={store.apolloHeat}
              onClick={handleSpriteClick}
            />

            <div className="w-full space-y-2">
              <HeatBar heat={store.apolloHeat} apolloVisible={store.apolloVisible} />
            </div>

            {/* Stat cards */}
            <div className="w-full grid grid-cols-3 gap-2">
              <StatCard label="Lines" value={`${unlockedCount}/18`} />
              <StatCard label="×Click" value={`${effectivePerClick.toFixed(0)}`} />
              <StatCard label="Heat×" value={`${(store.heatRateMultiplier * 100).toFixed(0)}%`} />
            </div>

            <button
              onClick={store.resetGame}
              className="text-xs text-stone-800 hover:text-stone-600 transition-colors font-serif italic"
            >
              abandon transformation
            </button>
          </div>

          {/* Right column — tabs */}
          <div className="md:col-span-2">
            <div className="border border-stone-800 rounded-lg overflow-hidden bg-stone-950/80 backdrop-blur-sm">
              <div className="flex border-b border-stone-800">
                <TabButton
                  active={activeTab === "upgrades"}
                  onClick={() => setActiveTab("upgrades")}
                  badge={available.length}
                  badgeColor="amber"
                >
                  Metamorphosis
                </TabButton>
                <TabButton
                  active={activeTab === "scroll"}
                  onClick={() => setActiveTab("scroll")}
                  badge={unlocked.length}
                  badgeColor="green"
                >
                  Scroll of Ovid
                </TabButton>
              </div>

              <div className="p-4 overflow-y-auto max-h-[58vh] scrollbar-thin">
                {activeTab === "upgrades" ? (
                  <UpgradeShop
                    available={available}
                    numen={store.numen}
                    onPurchase={store.purchaseUpgrade}
                    refugitActive={store.refugitActive}
                    unlockedCount={unlockedCount}
                  />
                ) : (
                  <ScrollOfOvid unlockedNodes={unlocked} />
                )}
              </div>
            </div>

            {/* Apollo warning */}
            {store.apolloVisible && (
              <div
                className={`mt-3 rounded border px-4 py-2.5 text-sm font-serif italic transition-all duration-500 ${
                  isDanger
                    ? "border-red-700 bg-red-950/40 text-red-300 animate-pulse shadow-[0_0_20px_rgba(220,38,38,0.3)]"
                    : isHot
                    ? "border-orange-800 bg-orange-950/30 text-orange-300"
                    : "border-amber-900/60 bg-amber-950/20 text-amber-400"
                }`}
              >
                {isDanger
                  ? '☀ "sentit adhuc trepidare novo sub cortice pectus" — he feels your heart trembling! Numen halved.'
                  : isHot
                  ? "☀ Apollo's hand presses the bark — feel the heat. Purchase upgrades or she burns."
                  : "☀ Hanc quoque Phoebus amat — Apollo draws near, but the bark holds for now..."}
              </div>
            )}
          </div>
        </div>

        <footer className="text-center mt-8 text-stone-800 text-xs italic font-serif space-y-1">
          <p>"oscula dat ligno; refugit tamen oscula lignum."</p>
          <p>Ovid, Metamorphōsēs I.556 · Progress auto-saved to browser</p>
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
  badgeColor,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  badge?: number;
  badgeColor?: "amber" | "green";
}) {
  return (
    <button
      onClick={onClick}
      className={`
        flex-1 px-4 py-3 text-sm font-serif transition-all duration-200 flex items-center justify-center gap-1.5
        ${
          active
            ? "bg-stone-900 text-amber-300 border-b-2 border-amber-600"
            : "text-stone-500 hover:text-stone-300 hover:bg-stone-900/40"
        }
      `}
    >
      {children}
      {badge !== undefined && badge > 0 && (
        <span
          className={`text-xs px-1.5 py-0.5 rounded-full ${
            active
              ? badgeColor === "green"
                ? "bg-green-900 text-green-300"
                : "bg-amber-800 text-amber-200"
              : "bg-stone-800 text-stone-400"
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
    <div className="border border-stone-800 rounded bg-stone-950/70 px-2 py-1.5 text-center">
      <div className="font-serif text-amber-400 text-base leading-tight">{value}</div>
      <div className="text-stone-700 text-xs mt-0.5">{label}</div>
    </div>
  );
}
