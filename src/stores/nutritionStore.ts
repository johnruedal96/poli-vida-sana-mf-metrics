import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  portion: string;
  time: string;
  date: string;
}

interface NutritionState {
  foods: FoodEntry[];
  dailyGoal: number;
  addFood: (food: Omit<FoodEntry, 'id' | 'date'>) => void;
  removeFood: (id: string) => void;
  setDailyGoal: (goal: number) => void;
  getTodayCalories: () => number;
  getTodayMacros: () => { protein: number; carbs: number; fat: number; calories: number };
}

export const useNutritionStore = create<NutritionState>()(
  persist(
    (set, get) => ({
      foods: [],
      dailyGoal: 2000,
      
      addFood: (food) => {
        const newFood: FoodEntry = {
          ...food,
          id: Date.now().toString(),
          date: new Date().toISOString().split('T')[0],
        };
        set((state) => ({ foods: [...state.foods, newFood] }));
      },
      
      removeFood: (id) => {
        set((state) => ({ foods: state.foods.filter((f) => f.id !== id) }));
      },
      
      setDailyGoal: (goal) => set({ dailyGoal: goal }),
      
      getTodayCalories: () => {
        const today = new Date().toISOString().split('T')[0];
        return get().foods
          .filter((f) => f.date === today)
          .reduce((sum, f) => sum + f.calories, 0);
      },
      
      getTodayMacros: () => {
        const today = new Date().toISOString().split('T')[0];
        const todayFoods = get().foods.filter((f) => f.date === today);
        return todayFoods.reduce(
          (acc, f) => ({
            protein: acc.protein + f.protein,
            carbs: acc.carbs + f.carbs,
            fat: acc.fat + f.fat,
            calories: acc.calories + f.calories,
          }),
          { protein: 0, carbs: 0, fat: 0, calories: 0 }
        );
      },
    }),
    { name: 'vidasana-nutrition' }
  )
);