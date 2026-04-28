import { useNutritionStore } from 'mf-nutrition/stores/nutrition';
import { useWorkoutStore } from 'mf-exercise/stores/workout';
import { useWaterStore } from 'mf-nutrition/stores/water';

interface DashboardProps {
  nutritionData?: {
    calories: number;
    macros: { protein: number; carbs: number; fat: number };
    dailyGoal: number;
  };
  exerciseData?: {
    duration: number;
    calories: number;
  };
  waterData?: {
    glasses: number;
    dailyGoal: number;
  };
  onNavigate?: (path: string) => void;
}

const CIRCUMFERENCE = 439.822971502571;

export function Dashboard(props: DashboardProps) {
  const { dailyGoal, getTodayMacros } = useNutritionStore();
  const { getTodayDuration } = useWorkoutStore();
  const { dailyGoal: waterGoal, getTodayGlasses } = useWaterStore();
  
  const glassesCount = getTodayGlasses();

  const nutrition = props.nutritionData || {
    calories: getTodayMacros().calories,
    macros: getTodayMacros(),
    dailyGoal
  };
  
  const exercise = props.exerciseData || {
    duration: getTodayDuration(),
    calories: 0
  };
  
  const water = props.waterData || {
    glasses: glassesCount,
    dailyGoal: waterGoal
  };

  const proteinGoal = 80;
  const carbsGoal = 200;
  const fatGoal = 65;

  return (
    <main>
      <section className="ml-2 mr-4 lg:ml-8 lg:mr-12">
        <p className="text-[10px] font-light tracking-[0.05em] uppercase text-neutral-500 mb-1">resumen diario</p>
        <h2 className="text-4xl font-bold tracking-tight text-on-surface">
          Mantén el ritmo, <span className="text-primary">Alex</span>.
        </h2>
      </section>

      <section className="grid sm:grid-cols-1 md:grid-cols-3 gap-6">
        <ProgressRing
          value={nutrition.calories}
          max={nutrition.dailyGoal}
          currentLabel={nutrition.calories.toLocaleString()}
          subtitle="kcal restantes"
          title="Calorías"
          percentageText={`${Math.round((nutrition.calories / nutrition.dailyGoal) * 100)}% de la meta diaria alcanzada`}
          colorClass="text-primary-container"
          bgClass="text-primary-container/10"
        />
        <ProgressRing
          value={exercise.duration}
          max={60}
          currentLabel={exercise.duration.toString()}
          subtitle="min hoy"
          title="Ejercicio"
          percentageText={`${Math.round((exercise.duration / 60) * 100)}% de la meta diaria alcanzada`}
          colorClass="text-secondary"
          bgClass="text-secondary/10"
        />
        <ProgressRing
          value={water.glasses}
          max={water.dailyGoal}
          currentLabel={water.glasses.toString()}
          subtitle="vasos"
          title="Hidratación"
          percentageText={`${Math.round((water.glasses / water.dailyGoal) * 100)}% de la meta diaria alcanzada`}
          colorClass="text-tertiary"
          bgClass="text-tertiary/10"
        />
      </section>

      <section className="bg-surface-container-low rounded-[2rem] p-6 md:p-10">
        <div className="mb-8">
          <p className="text-[10px] font-light tracking-[0.05em] uppercase text-neutral-500 mb-1">Acciones rápidas</p>
          <h3 className="text-2xl font-bold tracking-tight">Sigue tu progreso</h3>
        </div>
        <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => props.onNavigate?.('/nutrition')}
            className="flex items-center justify-between p-6 bg-surface-container-lowest rounded-full group hover:shadow-lg transition-all active:scale-95 w-full"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <span className="material-symbols-outlined">restaurant</span>
              </div>
              <span className="font-semibold text-lg">+ Comida</span>
            </div>
            <span className="material-symbols-outlined text-neutral-300 group-hover:text-primary transition-colors">
              add_circle
            </span>
          </button>
          <button
            onClick={() => props.onNavigate?.('/nutrition')}
            className="flex items-center justify-between p-6 bg-surface-container-lowest rounded-full group hover:shadow-lg transition-all active:scale-95 w-full"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary group-hover:bg-primary group-hover:text-white transition-colors">
                <span className="material-symbols-outlined">water_drop</span>
              </div>
              <span className="font-semibold text-lg">+ Agua</span>
            </div>
            <span className="material-symbols-outlined text-neutral-300 group-hover:text-primary transition-colors">
              add_circle
            </span>
          </button>
          <button
            onClick={() => props.onNavigate?.('/exercise')}
            className="flex items-center justify-between p-6 bg-surface-container-lowest rounded-full group hover:shadow-lg transition-all active:scale-95 w-full"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary group-hover:bg-primary group-hover:text-white transition-colors">
                <span className="material-symbols-outlined">fitness_center</span>
              </div>
              <span className="font-semibold text-lg">+ Ejercicio</span>
            </div>
            <span className="material-symbols-outlined text-neutral-300 group-hover:text-primary transition-colors">
              add_circle
            </span>
          </button>
        </div>
      </section>

      <section className="grid sm:grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-surface-container-lowest rounded-[2rem] p-8 border border-outline-variant/15">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-bold text-xl">Balance de Nutrientes</h4>
            <span className="text-xs text-neutral-500 font-medium">Desglose Diario</span>
          </div>
          <div className="space-y-6">
            <NutrientBar label="proteína" current={nutrition.macros.protein} max={proteinGoal} colorClass="bg-primary" />
            <NutrientBar label="Carbohidratos" current={nutrition.macros.carbs} max={carbsGoal} colorClass="bg-secondary" />
            <NutrientBar label="grasas" current={nutrition.macros.fat} max={fatGoal} colorClass="bg-tertiary" />
          </div>
        </div>

        <div className="relative rounded-[2rem] overflow-hidden group aspect-video lg:aspect-auto">
          <img
            alt="Workout context"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-8 flex flex-col justify-end">
            <span className="text-primary-container text-xs font-bold tracking-widest uppercase mb-2">
              próximo entrenamiento
            </span>
            <h4 className="text-white text-2xl font-bold">Tren superior</h4>
            <p className="text-white/70 text-sm">Programado para las 6:00pm de hoy</p>
          </div>
        </div>
      </section>
    </main>
  );
}

function ProgressRing({
  value,
  max,
  currentLabel,
  subtitle,
  title,
  percentageText,
  colorClass,
  bgClass
}: {
  value: number;
  max: number;
  currentLabel: string;
  subtitle: string;
  title: string;
  percentageText: string;
  colorClass: string;
  bgClass: string;
}) {
  const percentage = Math.min(100, (value / max) * 100);
  const offset = CIRCUMFERENCE - (percentage / 100) * CIRCUMFERENCE;

  return (
    <div className="bg-surface-container-lowest rounded-3xl p-8 flex flex-col items-center justify-center relative overflow-hidden group">
      <div className={`absolute -top-4 -right-4 w-24 h-24 ${bgClass || 'text-primary-container/10'} rounded-full blur-2xl group-hover:text-primary-container/20 transition-all`} />
      <div className="relative flex items-center justify-center mb-6">
        <svg className="w-40 h-40">
          <circle
            className="text-surface-container-highest stroke-current"
            cx="80"
            cy="80"
            fill="transparent"
            r="70"
            strokeWidth="12"
          />
          <circle
            className={`${colorClass} stroke-current progress-ring-circle`}
            cx="80"
            cy="80"
            fill="transparent"
            r="70"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            strokeLinecap="round"
            strokeWidth="12"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold tracking-tight">{currentLabel}</span>
          <span className="text-[10px] font-light tracking-widest uppercase text-neutral-400">
            {subtitle}
          </span>
        </div>
      </div>
      <div className="text-center">
        <h3 className="font-bold text-lg mb-1">{title}</h3>
        <p className="text-sm text-neutral-500">{percentageText}</p>
      </div>
    </div>
  );
}

function NutrientBar({
  label,
  current,
  max,
  colorClass
}: {
  label: string;
  current: number;
  max: number;
  colorClass: string;
}) {
  const percentage = Math.min(100, (current / max) * 100);

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs font-semibold uppercase tracking-wider">
        <span>{label}</span>
        <span>{current}g / {max}g</span>
      </div>
      <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
        <div
          className={`h-full ${colorClass} rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default Dashboard