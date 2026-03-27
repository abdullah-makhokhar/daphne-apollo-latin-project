import { create } from "zustand";
import { persist } from "zustand/middleware";
import { STORY_NODES, GAME_CONFIG, StoryNode } from "../config/gameConfig";

export interface GameState {
  numen: number;
  totalNumenEarned: number;
  apolloHeat: number;
  unlockedIds: string[];
  clickPower: number;
  autoClickRate: number;
  heatRateMultiplier: number;
  numanMultiplier: number;
  refugitActive: boolean;
  apolloVisible: boolean;
  gamePhase: "playing" | "triumph";
  triumphTime: number | null;
  lastSaved: number;
  tick: () => void;
  handleClick: () => void;
  purchaseUpgrade: (node: StoryNode) => void;
  resetGame: () => void;
  _hydrateComplete: boolean;
}

const INITIAL_STATE = {
  numen: 0,
  totalNumenEarned: 0,
  apolloHeat: 0,
  unlockedIds: [] as string[],
  clickPower: GAME_CONFIG.BASE_CLICK_POWER,
  autoClickRate: 0,
  heatRateMultiplier: 1,
  numanMultiplier: 1,
  refugitActive: false,
  apolloVisible: false,
  gamePhase: "playing" as const,
  triumphTime: null as number | null,
  lastSaved: Date.now(),
  _hydrateComplete: false,
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      tick: () => {
        const state = get();
        if (state.gamePhase === "triumph") return;

        const heatIncrease =
          GAME_CONFIG.HEAT_INCREASE_RATE *
          state.heatRateMultiplier *
          (GAME_CONFIG.TICK_RATE_MS / 1000);

        const newHeat = Math.min(state.apolloHeat + heatIncrease, GAME_CONFIG.HEAT_MAX);

        const penaltyActive = newHeat >= GAME_CONFIG.HEAT_PENALTY_THRESHOLD;
        const effectiveMultiplier = penaltyActive
          ? state.numanMultiplier * GAME_CONFIG.HEAT_PENALTY_SLOW
          : state.numanMultiplier;

        const autoEarned =
          (state.autoClickRate * effectiveMultiplier * GAME_CONFIG.TICK_RATE_MS) / 1000;

        set((s) => ({
          apolloHeat: newHeat,
          numen: s.numen + autoEarned,
          totalNumenEarned: s.totalNumenEarned + autoEarned,
        }));
      },

      handleClick: () => {
        const state = get();
        if (state.gamePhase === "triumph") return;

        const penaltyActive = state.apolloHeat >= GAME_CONFIG.HEAT_PENALTY_THRESHOLD;
        const effectiveMultiplier = penaltyActive
          ? state.numanMultiplier * GAME_CONFIG.HEAT_PENALTY_SLOW
          : state.numanMultiplier;

        const earned = state.clickPower * effectiveMultiplier;
        set((s) => ({
          numen: s.numen + earned,
          totalNumenEarned: s.totalNumenEarned + earned,
        }));
      },

      purchaseUpgrade: (node: StoryNode) => {
        const state = get();
        if (state.numen < node.cost) return;
        if (state.unlockedIds.includes(node.id)) return;

        let updates: Partial<GameState> = {
          numen: state.numen - node.cost,
          unlockedIds: [...state.unlockedIds, node.id],
        };

        const { effect } = node;

        if (state.refugitActive && effect.type !== "endgame") {
          const newHeat = Math.max(0, state.apolloHeat - GAME_CONFIG.REFUGIT_PUSHBACK);
          updates.apolloHeat = newHeat;
        }

        switch (effect.type) {
          case "clickPower":
            updates.clickPower = state.clickPower + effect.bonus;
            break;
          case "autoClick":
            updates.autoClickRate = state.autoClickRate + effect.rate;
            break;
          case "heatReduction":
            updates.heatRateMultiplier = state.heatRateMultiplier * effect.multiplier;
            break;
          case "numanMultiplier":
            updates.numanMultiplier = state.numanMultiplier * effect.multiplier;
            break;
          case "refugit":
            updates.refugitActive = true;
            updates.apolloHeat = Math.max(0, state.apolloHeat - effect.pushback);
            break;
          case "finalMultiplier":
            updates.numanMultiplier = state.numanMultiplier * effect.multiplier;
            break;
          case "apolloEvent":
            updates.apolloVisible = true;
            break;
          case "endgame":
            updates.gamePhase = "triumph";
            updates.triumphTime = Date.now();
            break;
          default:
            break;
        }

        set(updates);
      },

      resetGame: () => {
        set({ ...INITIAL_STATE, _hydrateComplete: true, lastSaved: Date.now() });
      },
    }),
    {
      name: "daphnes-root-save",
      onRehydrateStorage: () => (state) => {
        if (state) {
          state._hydrateComplete = true;
        }
      },
    }
  )
);

export function getAvailableUpgrades(state: GameState): StoryNode[] {
  return STORY_NODES.filter((n) => !state.unlockedIds.includes(n.id));
}

export function getUnlockedNodes(state: GameState): StoryNode[] {
  return STORY_NODES.filter((n) => state.unlockedIds.includes(n.id));
}

export function getSpriteStage(unlockedCount: number): number {
  const stages = GAME_CONFIG.SPRITE_STAGES;
  let stage = 0;
  for (let i = 0; i < stages.length; i++) {
    if (unlockedCount >= stages[i].threshold) {
      stage = i;
    }
  }
  return stage;
}
