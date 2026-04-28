import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WaterState {
  glasses: number;
  dailyGoal: number;
  addGlass: () => void;
  removeGlass: () => void;
  setDailyGoal: (goal: number) => void;
  getTodayGlasses: () => number;
}

export const useWaterStore = create<WaterState>()(
  persist(
    (set, get) => ({
      glasses: 0,
      dailyGoal: 8,
      
      addGlass: () => set((state) => ({ glasses: state.glasses + 1 })),
      removeGlass: () => set((state) => ({ glasses: Math.max(0, state.glasses - 1) })),
      setDailyGoal: (goal) => set({ dailyGoal: goal }),
      
      getTodayGlasses: () => get().glasses,
    }),
    { name: 'vidasana-water' }
  )
);