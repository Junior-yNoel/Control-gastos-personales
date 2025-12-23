import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Expense } from './Dashboard';

interface AddExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (expense: Omit<Expense, 'id'>) => void;
}

export function AddExpenseDialog({ open, onOpenChange, onAdd }: AddExpenseDialogProps) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (name && amount && date) {
      onAdd({
        name,
        amount: parseFloat(amount),
        date,
      });
      
      // Reset form
      setName('');
      setAmount('');
      setDate(new Date().toISOString().split('T')[0]);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Artículo</DialogTitle>
          <DialogDescription>Ingresa los detalles del artículo que deseas agregar.</DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="expense-name">Nombre del Artículo</Label>
            <Input
              id="expense-name"
              type="text"
              placeholder="Ej: Comida, Transporte"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="expense-amount">Precio</Label>
            <Input
              id="expense-amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="expense-date">Fecha</Label>
            <Input
              id="expense-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="mt-1"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
              Agregar
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}