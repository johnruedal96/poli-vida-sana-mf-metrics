declare module "*.css" {
  const content: any;
  export default content;
}

declare module 'mf-nutrition/stores/nutrition' {
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
  type UseNutritionStore = () => NutritionState;
  export const useNutritionStore: UseNutritionStore;
}

declare module 'mf-nutrition/stores/water' {
  interface WaterState {
    glasses: number;
    dailyGoal: number;
    addGlass: () => void;
    removeGlass: () => void;
    setDailyGoal: (goal: number) => void;
    getTodayGlasses: () => number;
  }
  type UseWaterStore = () => WaterState;
  export const useWaterStore: UseWaterStore;
}

declare module 'mf-exercise/stores/workout' {
  export interface WorkoutEntry {
    id: string;
    type: string;
    duration: number;
    intensity: number;
    notes: string;
    calories: number;
    date: string;
    time: string;
  }
  interface WorkoutState {
    workouts: WorkoutEntry[];
    addWorkout: (workout: Omit<WorkoutEntry, 'id' | 'date'>) => void;
    removeWorkout: (id: string) => void;
    getTodayWorkouts: () => WorkoutEntry[];
    getTodayDuration: () => number;
    getTodayCalories: () => number;
  }
  type UseWorkoutStore = () => WorkoutState;
  export const useWorkoutStore: UseWorkoutStore;
}