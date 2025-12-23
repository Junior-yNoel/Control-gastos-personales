import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Card } from './ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Line, ComposedChart } from 'recharts';
import { format, startOfMonth, endOfMonth, eachWeekOfInterval, startOfWeek, endOfWeek } from 'date-fns';
import { es } from 'date-fns/locale';

interface WeeklySummary {
  weekStart: string;
  weekEnd: string;
  total: number;
  timestamp: number;
}

interface MonthlyChartProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  weeklySummaries: WeeklySummary[];
  monthlyBudget: number;
}

export function MonthlyChart({ open, onOpenChange, weeklySummaries, monthlyBudget }: MonthlyChartProps) {
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);

  // Obtener todas las semanas del mes
  const weeksInMonth = eachWeekOfInterval(
    { start: monthStart, end: monthEnd },
    { weekStartsOn: 1 }
  );

  // Crear datos del gráfico
  const chartData = weeksInMonth.map((weekStartDate, index) => {
    const weekEndDate = endOfWeek(weekStartDate, { weekStartsOn: 1 });
    const weekStartStr = format(weekStartDate, 'yyyy-MM-dd');
    const weekEndStr = format(weekEndDate, 'yyyy-MM-dd');

    // Buscar el resumen de esta semana
    const summary = weeklySummaries.find(
      s => s.weekStart === weekStartStr || 
      (new Date(s.weekStart) >= weekStartDate && new Date(s.weekStart) <= weekEndDate)
    );

    return {
      week: `Semana ${index + 1}`,
      weekLabel: `${format(weekStartDate, 'd MMM', { locale: es })} - ${format(weekEndDate, 'd MMM', { locale: es })}`,
      total: summary?.total || 0,
      weekStart: weekStartStr,
    };
  });

  const totalMonthly = chartData.reduce((sum, week) => sum + week.total, 0);
  const averageWeekly = totalMonthly / chartData.length;
  const budgetPerWeek = monthlyBudget / 4;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gráfico Mensual - {format(today, 'MMMM yyyy', { locale: es })}</DialogTitle>
          <DialogDescription>
            Análisis de gastos por semana del mes
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Resumen */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <p className="text-sm text-gray-600 dark:text-slate-400">Total Mensual</p>
              <p className="text-2xl text-blue-600">${totalMonthly.toLocaleString()}</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-gray-600 dark:text-slate-400">Presupuesto</p>
              <p className="text-2xl text-green-600">${monthlyBudget.toLocaleString()}</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-gray-600 dark:text-slate-400">Promedio Semanal</p>
              <p className="text-2xl text-purple-600">${averageWeekly.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-gray-600 dark:text-slate-400">Estado</p>
              <p className={`text-2xl ${totalMonthly > monthlyBudget ? 'text-red-600' : 'text-green-600'}`}>
                {totalMonthly > monthlyBudget ? 'Excedido' : 'Normal'}
              </p>
            </Card>
          </div>

          {/* Gráfico */}
          <Card className="p-6 bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100">
            <h3 className="text-lg mb-4">Gastos por Semana</h3>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="week" 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip 
                    formatter={(value: number, name: string) => {
                      if (name === 'total') return [`$${value.toLocaleString()}`, 'Gasto Total'];
                      if (name === 'budget') return [`$${value.toLocaleString()}`, 'Presupuesto'];
                      return [value, name];
                    }}
                    labelFormatter={(label, payload) => {
                      if (payload && payload[0]) {
                        return payload[0].payload.weekLabel;
                      }
                      return label;
                    }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="total" 
                    fill="#3b82f6" 
                    name="Gasto Total"
                    radius={[8, 8, 0, 0]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey={() => budgetPerWeek} 
                    stroke="#10b981" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Presupuesto Semanal"
                    dot={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Análisis */}
          <Card className="p-6 bg-blue-50 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100">
            <h3 className="text-lg mb-3">Análisis</h3>
            <div className="space-y-2 text-sm">
              <p>
                • Has gastado <strong>${totalMonthly.toLocaleString()}</strong> de <strong>${monthlyBudget.toLocaleString()}</strong> 
                {' '}({((totalMonthly / monthlyBudget) * 100).toFixed(1)}% del presupuesto mensual)
              </p>
              <p>
                • Promedio por semana: <strong>${averageWeekly.toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong>
              </p>
              <p>
                • Presupuesto sugerido por semana: <strong>${budgetPerWeek.toLocaleString()}</strong>
              </p>
              {totalMonthly > monthlyBudget && (
                <p className="text-red-600">
                  ⚠️ Has excedido tu presupuesto mensual por <strong>${(totalMonthly - monthlyBudget).toLocaleString()}</strong>
                </p>
              )}
              {totalMonthly <= monthlyBudget && averageWeekly > budgetPerWeek && (
                <p className="text-yellow-600">
                  ⚠️ Tu promedio semanal está por encima del presupuesto sugerido. Intenta reducir gastos.
                </p>
              )}
              {totalMonthly <= monthlyBudget && averageWeekly <= budgetPerWeek && (
                <p className="text-green-600">
                  ✓ ¡Excelente! Estás manejando bien tu presupuesto.
                </p>
              )}
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
