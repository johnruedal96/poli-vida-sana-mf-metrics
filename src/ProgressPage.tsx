import { useNutritionStore } from 'mf-nutrition/stores/nutrition';
import { useWorkoutStore } from 'mf-exercise/stores/workout';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function ProgressPage() {
  const { foods, dailyGoal } = useNutritionStore();
  const { workouts } = useWorkoutStore();

  const getLast7DaysData = () => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayName = date.toLocaleDateString('es-ES', { weekday: 'short' });
      
      const dayFoods = foods.filter(f => f.date === dateStr);
      const dayWorkouts = workouts.filter(w => w.date === dateStr);
      
      data.push({
        name: dayName,
        calories: dayFoods.reduce((sum, f) => sum + f.calories, 0),
        exercise: dayWorkouts.reduce((sum, w) => sum + w.duration, 0),
      });
    }
    return data;
  };

  const getWeeklyMacros = () => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayName = date.toLocaleDateString('es-ES', { weekday: 'short' });
      
      const dayFoods = foods.filter(f => f.date === dateStr);
      const macros = dayFoods.reduce(
        (acc, f) => ({ protein: acc.protein + f.protein, carbs: acc.carbs + f.carbs, fat: acc.fat + f.fat }),
        { protein: 0, carbs: 0, fat: 0 }
      );
      
      data.push({
        name: dayName,
        protein: Math.round(macros.protein),
        carbs: Math.round(macros.carbs),
        fat: Math.round(macros.fat),
      });
    }
    return data;
  };

  const caloriesData = getLast7DaysData();
  const macrosData = getWeeklyMacros();

  const totalStats = foods.reduce(
    (acc, f) => ({
      calories: acc.calories + f.calories,
      protein: acc.protein + f.protein,
      carbs: acc.carbs + f.carbs,
      fat: acc.fat + f.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const workoutStats = workouts.reduce(
    (acc, w) => ({ duration: acc.duration + w.duration, calories: acc.calories + w.calories }),
    { duration: 0, calories: 0 }
  );

  return (
    <main>
      <div className="mb-10">
        <span className="font-label text-xs uppercase tracking-[0.2em] font-light text-secondary mb-1 block">
          Estadísticas
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight text-on-surface font-headline leading-tight">
          Tu Progreso
        </h1>
        <p className="text-on-surface-variant mt-2 text-sm">Últimos 7 días de actividad</p>
      </div>

      <section className="mb-8">
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-lg text-on-surface mb-4">Calorías diarias</h3>
          <div className="recharts-responsive-container" style={{ width: '100%', height: '200px', minWidth: 0 }}>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={caloriesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e7e8e9" />
                <XAxis dataKey="name" stroke="#757575" fontSize={12} />
                <YAxis stroke="#757575" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="calories" 
                  stroke="#006d37" 
                  strokeWidth={2}
                  dot={{ fill: '#006d37', strokeWidth: 2 }}
                  name="Calorías"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center mt-4 text-sm text-neutral-500">Meta diaria: {dailyGoal} kcal</div>
        </div>
      </section>

      <section className="mb-8">
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-lg text-on-surface mb-4">Ejercicio diario (min)</h3>
          <div className="recharts-responsive-container" style={{ width: '100%', height: '200px', minWidth: 0 }}>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={caloriesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e7e8e9" />
                <XAxis dataKey="name" stroke="#757575" fontSize={12} />
                <YAxis stroke="#757575" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px' }}
                />
                <Bar dataKey="exercise" fill="#006397" radius={[4, 4, 0, 0]} name="Minutos" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-lg text-on-surface mb-4">Macros diario</h3>
          <div className="recharts-responsive-container" style={{ width: '100%', height: '200px', minWidth: 0 }}>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={macrosData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e7e8e9" />
                <XAxis dataKey="name" stroke="#757575" fontSize={12} />
                <YAxis stroke="#757575" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px' }}
                />
                <Bar dataKey="protein" stackId="a" fill="#006d37" name="Proteína" />
                <Bar dataKey="carbs" stackId="a" fill="#006397" name="Carbs" />
                <Bar dataKey="fat" stackId="a" fill="#98472a" name="Grasa" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4 text-xs">
            <span className="text-primary">● Proteína</span>
            <span className="text-secondary">● Carbs</span>
            <span className="text-tertiary">● Grasa</span>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-lg text-on-surface mb-6">Totales acumulados</h3>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-4 bg-surface rounded-xl">
              <div className="text-2xl font-bold text-primary">{totalStats.calories}</div>
              <div className="text-xs text-neutral-500 uppercase tracking-wider mt-1">Calorías</div>
            </div>
            <div className="text-center p-4 bg-surface rounded-xl">
              <div className="text-2xl font-bold text-secondary">{totalStats.protein}g</div>
              <div className="text-xs text-neutral-500 uppercase tracking-wider mt-1">Proteína</div>
            </div>
            <div className="text-center p-4 bg-surface rounded-xl">
              <div className="text-2xl font-bold text-tertiary">{totalStats.carbs}g</div>
              <div className="text-xs text-neutral-500 uppercase tracking-wider mt-1">Carbs</div>
            </div>
            <div className="text-center p-4 bg-surface rounded-xl">
              <div className="text-2xl font-bold text-on-surface-variant">{totalStats.fat}g</div>
              <div className="text-xs text-neutral-500 uppercase tracking-wider mt-1">Grasa</div>
            </div>
          </div>
          <div className="p-4 bg-primary/10 rounded-xl text-center">
            <div className="text-xl font-bold text-primary">{workoutStats.duration} min</div>
            <div className="text-xs text-neutral-500 uppercase tracking-wider mt-1">Ejercicio total • {workoutStats.calories} kcal quemadas</div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ProgressPage