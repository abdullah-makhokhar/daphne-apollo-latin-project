import { useEffect, useState } from "react";

interface ClickEvent {
  id: number;
  x: number;
  y: number;
  amount: number;
}

interface ClickFeedbackProps {
  events: ClickEvent[];
}

export function ClickFeedback({ events }: ClickFeedbackProps) {
  return (
    <div className="fixed inset-0 pointer-events-none z-40" aria-hidden="true">
      {events.map((ev) => (
        <ClickRing key={ev.id} x={ev.x} y={ev.y} amount={ev.amount} />
      ))}
    </div>
  );
}

function ClickRing({ x, y, amount }: { x: number; y: number; amount: number }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Trigger animation on next frame
    const t = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(t);
  }, []);

  return (
    <div
      style={{ left: x, top: y, transform: "translate(-50%, -50%)" }}
      className="absolute"
    >
      {/* Expanding orange ring */}
      <div
        className={`absolute rounded-full border-2 border-orange-400 transition-all duration-500 ease-out ${
          mounted ? "w-14 h-14 opacity-0 -translate-y-2" : "w-4 h-4 opacity-70"
        }`}
        style={{ transform: "translate(-50%, -50%)" }}
      />
      {/* Second inner ring */}
      <div
        className={`absolute rounded-full border border-amber-300 transition-all duration-300 ease-out ${
          mounted ? "w-10 h-10 opacity-0" : "w-3 h-3 opacity-50"
        }`}
        style={{ transform: "translate(-50%, -50%)" }}
      />
      {/* Orange fill dot */}
      <div
        className={`absolute w-3 h-3 rounded-full bg-orange-400 transition-all duration-200 ease-out ${
          mounted ? "opacity-0 scale-150" : "opacity-80 scale-100"
        }`}
        style={{ transform: "translate(-50%, -50%)" }}
      />
      {/* Floating "+N numen" text */}
      <div
        className={`absolute whitespace-nowrap font-serif text-amber-300 text-sm font-bold transition-all duration-700 ease-out pointer-events-none select-none drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)] ${
          mounted ? "opacity-0 -translate-y-12" : "opacity-100 -translate-y-2"
        }`}
        style={{ transform: `translate(-50%, -50%)`, left: 0, top: 0 }}
      >
        +{formatAmount(amount)}
      </div>
    </div>
  );
}

function formatAmount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  if (n % 1 === 0) return n.toString();
  return n.toFixed(1);
}

// Hook to manage click events
let nextId = 0;
export function useClickFeedback() {
  const [events, setEvents] = useState<ClickEvent[]>([]);

  const addClick = (x: number, y: number, amount: number) => {
    const id = nextId++;
    setEvents((prev) => [...prev.slice(-12), { id, x, y, amount }]);
    // Remove after animation
    setTimeout(() => {
      setEvents((prev) => prev.filter((e) => e.id !== id));
    }, 800);
  };

  // Also render passive-income floating particles
  const addPassiveFloat = (amount: number) => {
    // Random position near the sprite area
    const x = window.innerWidth * 0.2 + Math.random() * 80;
    const y = window.innerHeight * 0.3 + Math.random() * 120;
    addClick(x, y, amount);
  };

  return { events, addClick, addPassiveFloat };
}
