"use client";

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { AddExpenseDialog } from './AddExpenseDialog';
import { ExpenseList } from './ExpenseList';
import { ExpenseChart } from './ExpenseChart';
import { MonthlyChart } from './MonthlyChart';
import { LogOut, Edit2, TrendingUp, Moon, Sun } from 'lucide-react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { format, startOfWeek, endOfWeek } from 'date-fns';

export interface Expense {
  id: string;
  name: string;
  amount: number;
  date: string;
}

export interface WeeklySummary {
  weekStart: string;
  weekEnd: string;
  total: number;
  timestamp: number;
}

interface DashboardProps {
  username: string;
  onLogout: () => void;
}

export function Dashboard({ username, onLogout }: DashboardProps) {
  const [monthlyBudget, setMonthlyBudget] = useState(0);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [weeklySummaries, setWeeklySummaries] = useState<WeeklySummary[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isMonthlyChartOpen, setIsMonthlyChartOpen] = useState(false);
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [tempBudget, setTempBudget] = useState("0");
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Verificar si es un nuevo mes y resetear resúmenes semanales para empezar limpio
    const currentMonth = format(new Date(), 'yyyy-MM');
    const lastProcessedMonth = localStorage.getItem(`lastProcessedMonth_${username}`);
    
    if (lastProcessedMonth !== currentMonth) {
      // Es un nuevo mes, limpiar resúmenes semanales para empezar con gráfico limpio
      localStorage.removeItem(`weeklySummaries_${username}`);
      localStorage.setItem(`lastProcessedMonth_${username}`, currentMonth);
      setWeeklySummaries([]);
    }

    // Cargar datos del localStorage
    const savedBudget = localStorage.getItem(`budget_${username}`);
    const savedExpenses = localStorage.getItem(`expenses_${username}`);
    const savedSummaries = localStorage.getItem(`weeklySummaries_${username}`);
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    if (savedBudget) {
      setMonthlyBudget(parseFloat(savedBudget));
      setTempBudget(savedBudget);
    }
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    }
    if (savedSummaries) {
      setWeeklySummaries(JSON.parse(savedSummaries));
    }
    setTheme(savedTheme);
  }, [username]);

  // Aplicar tema
  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const generateWeeklySummary = () => {
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
    
    const weekStartStr = format(weekStart, 'yyyy-MM-dd');
    const weekEndStr = format(weekEnd, 'yyyy-MM-dd');

    // Calcular total de gastos de la semana
    const weekExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date + 'T00:00:00');
      return expenseDate >= weekStart && expenseDate <= weekEnd;
    });

    const total = weekExpenses.reduce((sum, expense) => sum + expense.amount, 0);

    // Verificar si ya existe un resumen para esta semana
    const existingSummaryIndex = weeklySummaries.findIndex(
      s => s.weekStart === weekStartStr
    );

    let newSummaries;
    if (existingSummaryIndex >= 0) {
      // Actualizar resumen existente
      newSummaries = [...weeklySummaries];
      newSummaries[existingSummaryIndex] = {
        weekStart: weekStartStr,
        weekEnd: weekEndStr,
        total,
        timestamp: Date.now(),
      };
    } else {
      // Crear nuevo resumen
      newSummaries = [
        ...weeklySummaries,
        {
          weekStart: weekStartStr,
          weekEnd: weekEndStr,
          total,
          timestamp: Date.now(),
        }
      ];
    }

    setWeeklySummaries(newSummaries);
    localStorage.setItem(`summaries_${username}`, JSON.stringify(newSummaries));
  };

  const saveData = (newExpenses: Expense[], newBudget?: number) => {
    localStorage.setItem(`expenses_${username}`, JSON.stringify(newExpenses));
    if (newBudget !== undefined) {
      localStorage.setItem(`budget_${username}`, newBudget.toString());
    }
  };

  const handleAddExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense = {
      ...expense,
      id: Date.now().toString(),
    };
    const newExpenses = [...expenses, newExpense];
    setExpenses(newExpenses);
    saveData(newExpenses);
  };

  const handleDeleteExpense = (id: string) => {
    const newExpenses = expenses.filter(e => e.id !== id);
    setExpenses(newExpenses);
    saveData(newExpenses);
  };

  const handleUpdateBudget = () => {
    const newBudget = parseFloat(tempBudget);
    if (!isNaN(newBudget) && newBudget > 0) {
      setMonthlyBudget(newBudget);
      saveData(expenses, newBudget);
      setIsEditingBudget(false);
    }
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const budgetPercentage = (totalExpenses / monthlyBudget) * 100;

  // Determinar el color del indicador
  const getIndicatorColor = () => {
    if (totalExpenses > monthlyBudget) {
      return 'bg-red-500';
    } else if (budgetPercentage >= 33.33) {
      return 'bg-yellow-500';
    } else {
      return 'bg-green-500';
    }
  };

  const getIndicatorText = () => {
    if (totalExpenses > monthlyBudget) {
      return 'Presupuesto excedido';
    } else if (budgetPercentage >= 33.33) {
      return 'Precaución';
    } else {
      return 'En buen estado';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-800 dark:text-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b dark:bg-slate-800 dark:border-slate-700 dark:shadow-slate-900">
        <div className="px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-4xl font-bold">Control de Gastos</h1>
              <p className="text-gray-600 text-lg">Bienvenido! {username || 'Usuario'}</p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className="w-10 h-10"
              >
                {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </Button>
              <Button 
                variant="outline" 
                onClick={onLogout}
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Budget and Indicator */}
          <div className="space-y-6">
            {/* Monthly Budget Card */}
            <Card className="p-6 bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg">Cantidad Mensual</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditingBudget(!isEditingBudget)}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
              </div>
              
              {isEditingBudget ? (
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="budget">Nuevo Presupuesto</Label>
                    <Input
                      id="budget"
                      type="number"
                      value={tempBudget}
                      onChange={(e) => setTempBudget(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleUpdateBudget} size="sm" className="flex-1">
                      Guardar
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setIsEditingBudget(false);
                        setTempBudget(monthlyBudget.toString());
                      }}
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-3xl text-green-600">${monthlyBudget.toLocaleString()}</p>
              )}
            </Card>

            {/* Status Indicator */}
            <Card className="p-6 bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100">
              <div className="flex flex-col items-center">
                <div className={`w-32 h-32 rounded-full ${getIndicatorColor()} flex items-center justify-center shadow-lg mb-4`}>
                  <div className="text-center text-white">
                    <p className="text-2xl">${totalExpenses.toLocaleString()}</p>
                    <p className="text-xs">Total Gastado</p>
                  </div>
                </div>
                <p className="text-lg">{getIndicatorText()}</p>
                <p className="text-sm text-gray-600 mt-2 dark:text-slate-400">
                  {budgetPercentage.toFixed(1)}% del presupuesto
                </p>
              </div>
            </Card>

            {/* Add Button */}
            <Button 
              onClick={() => setIsAddDialogOpen(true)}
              className="w-full bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              Agregar Artículos
            </Button>

            {/* Monthly Chart Button */}
            <Button 
              onClick={() => setIsMonthlyChartOpen(true)}
              className="w-full bg-purple-600 hover:bg-purple-700"
              size="lg"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Gráfico del Mes
            </Button>

            {/* Manual Weekly Summary Button (for testing) */}
            <Button 
              onClick={() => {
                generateWeeklySummary();
                alert('Resumen semanal generado');
              }}
              variant="outline"
              size="sm"
              className="w-full"
            >
              Generar Resumen Semanal (Manual)
            </Button>
          </div>

          {/* Middle Column - Expense List */}
          <div>
            <ExpenseList 
              expenses={expenses} 
              onDelete={handleDeleteExpense}
            />
          </div>

          {/* Right Column - Chart */}
          <div>
            <ExpenseChart expenses={expenses} />
          </div>
        </div>
      </main>

      {/* Add Expense Dialog */}
      <AddExpenseDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAdd={handleAddExpense}
      />

      {/* Monthly Chart Dialog */}
      <MonthlyChart
        open={isMonthlyChartOpen}
        onOpenChange={setIsMonthlyChartOpen}
        weeklySummaries={weeklySummaries}
        monthlyBudget={monthlyBudget}
      />
    </div>
  );
}