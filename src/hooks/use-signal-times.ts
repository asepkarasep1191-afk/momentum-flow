import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const STALE_MS = 6 * 60 * 60_000;

type Stamp = { first: number; last: number };

const memoryStorage: Storage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
  clear: () => undefined,
  key: () => null,
  length: 0,
};

type SignalTimesState = {
  stamps: Record<string, Stamp>;
  touch: (ids: string[]) => void;
};

export const useSignalTimes = create<SignalTimesState>()(
  persist(
    (set, get) => ({
      stamps: {},
      touch: (ids) => {
        const now = Date.now();
        const live = new Set(ids);
        const prev = get().stamps;
        const next: Record<string, Stamp> = {};
        let changed = false;
        for (const id of ids) {
          const s = prev[id];
          if (!s || now - s.last > STALE_MS) {
            next[id] = { first: now, last: now };
            changed = true;
          } else {
            next[id] = { first: s.first, last: now };
            if (s.last !== now) changed = true;
          }
        }
        for (const [id, s] of Object.entries(prev)) {
          if (live.has(id)) continue;
          if (now - s.last > STALE_MS) {
            changed = true;
            continue;
          }
          next[id] = s;
        }
        if (changed) set({ stamps: next });
      },
    }),
    {
      name: "momentumflow-signal-times",
      storage: createJSONStorage(() =>
        typeof window === "undefined" ? memoryStorage : sessionStorage,
      ),
    },
  ),
);
