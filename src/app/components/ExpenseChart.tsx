import { Card } from './ui/card';
import { Expense } from './Dashboard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format, parseISO, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { es } from 'date-fns/locale';

interface ExpenseChartProps {
  expenses: Expense[];
}

export function ExpenseChart({ expenses }: ExpenseChartProps) {
  // Obtener la semana actual
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Lunes
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 }); // Domingo

  // Crear array con todos los días de la semana
  const daysOfWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // Agrupar gastos por día de la semana actual
  const chartData = daysOfWeek.map(day => {
    const dayString = format(day, 'yyyy-MM-dd');
    const dayExpenses = expenses.filter(expense => expense.date === dayString);
    const total = dayExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    return {
      day: format(day, 'EEEE', { locale: es }).slice(0, 3), // Lun, Mar, Mié, etc.
      fullDay: format(day, 'EEEE', { locale: es }),
      amount: total,
      date: dayString,
    };
  });

  return (
    <Card className="p-6 bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100">
      <h3 className="text-lg mb-4">Gráfico Semanal</h3>
      
      {expenses.length === 0 ? (
        <div className="h-[400px] flex items-center justify-center text-gray-500 dark:text-slate-400">
          <div className="text-center">
            <p>No hay datos para mostrar</p>
            <p className="text-sm mt-2">Los gastos aparecerán aquí</p>
          </div>
        </div>
      ) : (
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="day" 
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip 
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Gasto']}
                labelFormatter={(label, payload) => {
                  if (payload && payload[0]) {
                    return payload[0].payload.fullDay;
                  }
                  return label;
                }}
              />
              <Legend />
              <Bar 
                dataKey="amount" 
                fill="#60a5fa" 
                name="Gasto Diario"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600 text-center dark:text-slate-400">
        Semana del {format(weekStart, 'd MMM', { locale: es })} al {format(weekEnd, 'd MMM yyyy', { locale: es })}
      </div>
    </Card>
  );
}
