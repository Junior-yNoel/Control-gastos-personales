import { Card } from './ui/card';
import { Button } from './ui/button';
import { Trash2 } from 'lucide-react';
import { Expense } from './Dashboard';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
}

export function ExpenseList({ expenses, onDelete }: ExpenseListProps) {
  // Agrupar gastos por fecha
  const groupedExpenses = expenses.reduce((groups, expense) => {
    const date = expense.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(expense);
    return groups;
  }, {} as Record<string, Expense[]>);

  // Ordenar fechas de más reciente a más antigua
  const sortedDates = Object.keys(groupedExpenses).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  // Calcular total general
  const totalGeneral = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <Card className="p-6 bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100">
      <h3 className="text-lg mb-4">Lista de Gastos</h3>
      
      {expenses.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-slate-400">
          <p>No hay gastos registrados</p>
          <p className="text-sm mt-2">Agrega tu primer artículo para comenzar</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
          {sortedDates.map(date => {
            const dateExpenses = groupedExpenses[date];
            const dailyMax = dateExpenses.reduce((max, exp) => Math.max(max, exp.amount), 0);
            
            return (
              <div key={date} className="border-b pb-4 last:border-b-0">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm text-gray-600 dark:text-slate-400">
                    {format(new Date(date + 'T00:00:00'), 'EEEE, d MMMM yyyy', { locale: es })}
                  </h4>
                  <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded dark:bg-blue-900 dark:text-blue-200">
                    Máximo Día: ${dailyMax.toLocaleString()}
                  </span>
                </div>
                
                <div className="space-y-2">
                  {dateExpenses.map(expense => (
                    <div 
                      key={expense.id}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors dark:bg-slate-700 dark:hover:bg-slate-600"
                    >
                      <div className="flex-1">
                        <p className="text-sm">{expense.name}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm">${expense.amount.toLocaleString()}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(expense.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {expenses.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-slate-600">
          <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg dark:bg-green-900/20">
            <span className="text-lg font-semibold">Total General</span>
            <span className="text-xl font-bold text-green-700 dark:text-green-300">
              ${totalGeneral.toLocaleString()}
            </span>
          </div>
        </div>
      )}
    </Card>
  );
}
