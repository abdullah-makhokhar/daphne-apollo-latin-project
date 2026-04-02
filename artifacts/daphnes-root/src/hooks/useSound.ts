import { useCallback, useEffect, useRef } from "react";
import {
  SOUND_CONFIG,
  SOUND_ENABLED,
  UPGRADE_SOUND_OVERRIDES,
  SoundEventKey,
  SoundSlot,
} from "../config/soundConfig";

// Pool size for high-frequency sounds (e.g. click)
const POOL_SIZE = 4;

type AudioPool = HTMLAudioElement[];
type SoundCache = Map<string, AudioPool>;

// Resolves a filename to the full public path
function resolveSrc(filename: string): string {
  return `${import.meta.env.BASE_URL}sounds/${filename}`;
}

// Creates a pool of Audio elements from a SoundSlot
function createPool(slot: SoundSlot): AudioPool {
  if (!slot.src || !slot.enabled || !SOUND_ENABLED) return [];
  const url = resolveSrc(slot.src);
  return Array.from({ length: POOL_SIZE }, () => {
    const el = new Audio(url);
    el.volume = Math.max(0, Math.min(1, slot.volume));
    el.preload = "auto";
    return el;
  });
}

// Plays the next available audio element in a pool
function playFromPool(pool: AudioPool): void {
  if (!pool.length) return;
  // Find a ready element (ended or never started)
  const ready = pool.find((el) => el.ended || el.currentTime === 0);
  const target = ready ?? pool[0];
  target.currentTime = 0;
  target.play().catch(() => {
    // Autoplay policy may block until first user gesture — silently ignore
  });
}

// ─── Hook ─────────────────────────────────────────────────────
export function useSound() {
  const cache = useRef<SoundCache>(new Map());

  // Preload all configured sounds on mount
  useEffect(() => {
    if (!SOUND_ENABLED) return;

    const allSlots: Array<[string, SoundSlot]> = [
      ...Object.entries(SOUND_CONFIG) as Array<[string, SoundSlot]>,
      ...Object.entries(UPGRADE_SOUND_OVERRIDES).filter(([, v]) => v != null) as Array<[string, SoundSlot]>,
    ];

    for (const [key, slot] of allSlots) {
      if (slot?.src && slot.enabled && !cache.current.has(key)) {
        cache.current.set(key, createPool(slot));
      }
    }

    // Cleanup: remove Audio references
    return () => {
      cache.current.forEach((pool) => pool.forEach((el) => { el.src = ""; }));
      cache.current.clear();
    };
  }, []);

  // Play a named game event sound
  const play = useCallback((event: SoundEventKey) => {
    if (!SOUND_ENABLED) return;
    const slot = SOUND_CONFIG[event];
    if (!slot || !slot.src || !slot.enabled) return;

    if (!cache.current.has(event)) {
      cache.current.set(event, createPool(slot));
    }
    const pool = cache.current.get(event);
    if (pool) playFromPool(pool);
  }, []);

  // Play upgrade sound — checks per-upgrade override first, then falls back to generic "upgrade"
  const playUpgrade = useCallback((upgradeId: string) => {
    if (!SOUND_ENABLED) return;

    const override = UPGRADE_SOUND_OVERRIDES[upgradeId];
    if (override?.src && override.enabled) {
      const cacheKey = `upgrade:${upgradeId}`;
      if (!cache.current.has(cacheKey)) {
        cache.current.set(cacheKey, createPool(override));
      }
      const pool = cache.current.get(cacheKey);
      if (pool) playFromPool(pool);
      return;
    }

    // Fall back to generic upgrade sound
    play("upgrade");
  }, [play]);

  return { play, playUpgrade };
}
