# 🤝 Guía de Contribución

¡Gracias por tu interés en contribuir al Sistema de Control de Gastos Personales! Esta guía te ayudará a empezar.

## 📋 Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [Cómo Puedo Contribuir](#cómo-puedo-contribuir)
- [Configuración del Entorno de Desarrollo](#configuración-del-entorno-de-desarrollo)
- [Estándares de Código](#estándares-de-código)
- [Process de Pull Request](#proceso-de-pull-request)
- [Reportar Bugs](#reportar-bugs)
- [Sugerir Mejoras](#sugerir-mejoras)

---

## 📜 Código de Conducta

### Nuestro Compromiso

Este proyecto está comprometido a proporcionar una experiencia libre de acoso para todos, independientemente de:

- Edad
- Tamaño corporal
- Discapacidad
- Etnia
- Identidad y expresión de género
- Nivel de experiencia
- Nacionalidad
- Apariencia personal
- Raza
- Religión
- Identidad y orientación sexual

### Comportamiento Esperado

- Usar lenguaje acogedor e inclusivo
- Respetar diferentes puntos de vista y experiencias
- Aceptar críticas constructivas con gracia
- Enfocarse en lo que es mejor para la comunidad
- Mostrar empatía hacia otros miembros de la comunidad

### Comportamiento Inaceptable

- Uso de lenguaje o imágenes sexualizadas
- Comentarios insultantes o despectivos (trolling)
- Acoso público o privado
- Publicar información privada de otros sin permiso
- Otra conducta que razonablemente podría considerarse inapropiada

---

## 🚀 Cómo Puedo Contribuir

### Tipos de Contribuciones

1. **Reportar Bugs** 🐛
   - Encuentra y reporta errores
   - Proporciona información detallada

2. **Sugerir Funcionalidades** 💡
   - Propone nuevas características
   - Explica casos de uso

3. **Mejorar Documentación** 📝
   - Corrige typos
   - Agrega ejemplos
   - Aclara instrucciones

4. **Código** 💻
   - Arregla bugs
   - Implementa nuevas features
   - Refactoriza código existente

5. **Testing** 🧪
   - Escribe tests
   - Mejora cobertura
   - Prueba en diferentes navegadores

---

## 🛠️ Configuración del Entorno de Desarrollo

### 1. Fork y Clone

```bash
# Fork el repositorio en GitHub
# Luego clona tu fork

git clone https://github.com/TU-USUARIO/control-gastos.git
cd control-gastos
```

### 2. Agregar Remote Upstream

```bash
git remote add upstream https://github.com/USUARIO-ORIGINAL/control-gastos.git
git fetch upstream
```

### 3. Instalar Dependencias

```bash
npm install
```

### 4. Crear Rama de Trabajo

```bash
# Siempre crea una nueva rama desde main
git checkout -b feature/nombre-descriptivo
# O para bugs:
git checkout -b fix/descripcion-del-bug
```

### 5. Realizar Cambios

Realiza tus cambios siguiendo los [Estándares de Código](#estándares-de-código)

### 6. Probar Localmente

```bash
npm run dev
```

---

## 📏 Estándares de Código

### TypeScript

#### Tipado Estricto

```typescript
// ✅ Bueno: Tipos explícitos
interface Expense {
  id: string;
  name: string;
  amount: number;
  date: string;
}

const addExpense = (expense: Expense): void => {
  // ...
};

// ❌ Malo: Uso de 'any'
const addExpense = (expense: any) => {
  // ...
};
```

#### Nombres Descriptivos

```typescript
// ✅ Bueno
const calculateMonthlyTotal = (expenses: Expense[]): number => {
  return expenses.reduce((sum, exp) => sum + exp.amount, 0);
};

// ❌ Malo
const calc = (arr: any[]): number => {
  return arr.reduce((s, e) => s + e.amount, 0);
};
```

### React

#### Componentes Funcionales

```typescript
// ✅ Bueno: Componente funcional con tipado
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export function Button({ label, onClick, disabled = false }: ButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}

// ❌ Malo: Componente sin tipos
export function Button(props) {
  return <button onClick={props.onClick}>{props.label}</button>;
}
```

#### Hooks

```typescript
// ✅ Bueno: Custom hooks con tipado
function useExpenses(
  username: string,
): [Expense[], (expense: Expense) => void] {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const addExpense = useCallback((expense: Expense) => {
    setExpenses((prev) => [...prev, expense]);
  }, []);

  return [expenses, addExpense];
}

// Uso de useEffect con dependencias correctas
useEffect(() => {
  const savedData = localStorage.getItem(
    `expenses_${username}`,
  );
  if (savedData) {
    setExpenses(JSON.parse(savedData));
  }
}, [username]); // ✅ Dependencia explícita
```

### Tailwind CSS

```tsx
// ✅ Bueno: Clases organizadas y legibles
<div className="flex flex-col gap-4 p-6 bg-white rounded-lg shadow-lg">
  <h2 className="text-2xl">Título</h2>
  <p className="text-gray-600">Descripción</p>
</div>

// ❌ Malo: Demasiadas clases, difícil de leer
<div className="flex flex-col gap-4 p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 mt-4 mb-6">
  {/* Considera extraer a componente */}
</div>

// ✅ Mejor: Componente reutilizable
function Card({ children, className = '' }) {
  return (
    <div className={`flex flex-col gap-4 p-6 bg-white rounded-lg shadow-lg ${className}`}>
      {children}
    </div>
  );
}
```

### Estructura de Archivos

```typescript
// Orden de imports
// 1. React y librerías externas
import { useState, useEffect } from "react";
import { format } from "date-fns";

// 2. Componentes locales
import { Button } from "./ui/button";
import { Card } from "./ui/card";

// 3. Tipos e interfaces
import type { Expense } from "./types";

// 4. Utilidades y helpers
import { calculateTotal } from "./utils";

// 5. Estilos (si aplica)
import "./styles.css";
```

### Comentarios

```typescript
// ✅ Bueno: Comentarios útiles para lógica compleja
/**
 * Genera un resumen semanal de gastos
 * Se ejecuta automáticamente cada domingo a las 12:00
 * @param expenses - Array de gastos del usuario
 * @returns WeeklySummary con total y rango de fechas
 */
function generateWeeklySummary(
  expenses: Expense[],
): WeeklySummary {
  // Obtener rango de la semana actual
  const weekStart = startOfWeek(new Date(), {
    weekStartsOn: 1,
  });
  const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });

  // Filtrar gastos de esta semana
  const weekExpenses = expenses.filter((exp) => {
    const expDate = new Date(exp.date);
    return expDate >= weekStart && expDate <= weekEnd;
  });

  // Calcular total
  const total = weekExpenses.reduce(
    (sum, exp) => sum + exp.amount,
    0,
  );

  return {
    weekStart: format(weekStart, "yyyy-MM-dd"),
    weekEnd: format(weekEnd, "yyyy-MM-dd"),
    total,
    timestamp: Date.now(),
  };
}

// ❌ Malo: Comentarios obvios
// Crear variable para total
const total = 0; // inicializar en 0
```

---

## 🔄 Proceso de Pull Request

### 1. Sincronizar con Upstream

```bash
git fetch upstream
git checkout main
git merge upstream/main
```

### 2. Actualizar tu Rama

```bash
git checkout feature/tu-feature
git rebase main
```

### 3. Commit

Usa mensajes de commit descriptivos siguiendo [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Tipos de commits:
# feat: Nueva funcionalidad
# fix: Corrección de bug
# docs: Cambios en documentación
# style: Formato, punto y coma faltantes, etc.
# refactor: Refactorización de código
# test: Agregar tests
# chore: Tareas de mantenimiento

# Ejemplos:
git commit -m "feat: agregar categorías a gastos"
git commit -m "fix: corregir cálculo de porcentaje en indicador"
git commit -m "docs: actualizar README con ejemplos de uso"
git commit -m "refactor: optimizar filtrado de gastos por fecha"
```

### 4. Push

```bash
git push origin feature/tu-feature
```

### 5. Crear Pull Request

1. Ve a GitHub
2. Haz clic en "Compare & pull request"
3. Completa la plantilla de PR:

```markdown
## Descripción

Breve descripción de los cambios realizados

## Tipo de Cambio

- [ ] Bug fix
- [ ] Nueva funcionalidad
- [ ] Breaking change
- [ ] Documentación

## Checklist

- [ ] Mi código sigue los estándares del proyecto
- [ ] He realizado auto-review de mi código
- [ ] He comentado código complejo
- [ ] He actualizado la documentación
- [ ] Mis cambios no generan warnings
- [ ] He probado localmente

## Screenshots (si aplica)

[Agregar capturas de pantalla]

## Testing

Describe cómo probaste los cambios
```

### 6. Code Review

- Responde a comentarios de revisores
- Realiza cambios solicitados
- Mantén la rama actualizada

### 7. Merge

Una vez aprobado, el maintainer hará merge de tu PR

---

## 🐛 Reportar Bugs

### Antes de Reportar

1. **Busca issues existentes** - Quizás ya fue reportado
2. **Verifica en la última versión** - El bug podría estar arreglado
3. **Prueba en diferentes navegadores** - Determina si es específico

### Cómo Reportar

Usa la plantilla de issue en GitHub:

```markdown
**Descripción del Bug**
Descripción clara y concisa del problema

**Pasos para Reproducir**

1. Ve a '...'
2. Haz clic en '...'
3. Scroll hasta '...'
4. Ver error

**Comportamiento Esperado**
Qué esperabas que sucediera

**Comportamiento Actual**
Qué sucede en realidad

**Screenshots**
Si aplica, agrega capturas

**Entorno**

- OS: [e.g. Windows 11, macOS 14]
- Navegador: [e.g. Chrome 120, Firefox 121]
- Versión del Proyecto: [e.g. 1.0.0]

**Contexto Adicional**
Cualquier otra información relevante
```

---

## 💡 Sugerir Mejoras

### Plantilla de Feature Request

```markdown
**¿Tu solicitud está relacionada con un problema?**
Descripción clara del problema [e.g. Siempre me frustra cuando...]

**Describe la solución que te gustaría**
Descripción clara de lo que quieres que suceda

**Describe alternativas consideradas**
Otras soluciones o funcionalidades que has considerado

**Contexto Adicional**
Screenshots, mockups, o ejemplos de otras apps

**Prioridad**

- [ ] Low - Nice to have
- [ ] Medium - Important
- [ ] High - Critical
```

---

## 🏷️ Convenciones de Naming

### Archivos

```
ComponentName.tsx       # Componentes React (PascalCase)
utils.ts                # Utilidades (camelCase)
types.ts                # Definiciones de tipos
constants.ts            # Constantes
```

### Variables y Funciones

```typescript
// Variables
const userName = "Juan"; // camelCase
const MAX_BUDGET = 10000; // SCREAMING_SNAKE_CASE para constantes

// Funciones
function calculateTotal() {} // camelCase
const handleClick = () => {}; // camelCase

// Componentes
function ExpenseCard() {} // PascalCase

// Tipos e Interfaces
interface UserData {} // PascalCase
type ExpenseType = "food" | "transport"; // PascalCase
```

---

## 🧪 Testing

### Ejecutar Tests

```bash
# Ejecutar todos los tests
npm test

# Ejecutar con coverage
npm test -- --coverage

# Ejecutar en modo watch
npm test -- --watch
```

### Escribir Tests

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button Component', () => {
  it('renders with correct label', () => {
    render(<Button label="Click me" onClick={() => {}} />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button label="Click" onClick={handleClick} />);

    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button label="Click" onClick={() => {}} disabled />);
    expect(screen.getByText('Click')).toBeDisabled();
  });
});
```

---

## 📚 Recursos Útiles

### Documentación

- [React Docs](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Herramientas

- [VS Code](https://code.visualstudio.com/)
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [Git](https://git-scm.com/doc)

### Comunidad

- [Stack Overflow](https://stackoverflow.com/questions/tagged/react)
- [React Discord](https://discord.gg/react)
- [GitHub Discussions](https://github.com/features/discussions)

---

## ❓ Preguntas Frecuentes

**¿Necesito conocimiento avanzado para contribuir?**
No, contribuciones de todos los niveles son bienvenidas. Puedes empezar con documentación o bugs pequeños.

**¿Cuánto tiempo toma revisar un PR?**
Intentamos revisar en 2-3 días hábiles.

**¿Puedo trabajar en varios PRs simultáneamente?**
Sí, pero es recomendable enfocarse en uno a la vez.

**¿Qué hago si mi PR tiene conflictos?**
Haz rebase con la rama main y resuelve los conflictos localmente.

---

## 🙏 Agradecimientos

¡Gracias por considerar contribuir! Tu tiempo y esfuerzo son muy apreciados.

Si tienes preguntas, no dudes en:

- Abrir un issue
- Contactar a los maintainers
- Preguntar en las discusiones

**¡Happy coding! 🚀**