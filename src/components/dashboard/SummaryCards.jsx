import { useFinance } from "../../context/FinanceContext";
import { calculateIncome, calculateExpenses } from "../../utils/calculations";

export const SummaryCards = () => {
  const { transactions } = useFinance();

  const income = calculateIncome(transactions);
  const expenses = calculateExpenses(transactions);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
        <p className="text-sm text-slate-500">Ingresos</p>

        <h3 className="text-2xl font-bold text-emerald-500 mt-1">
          ${income.toFixed(2)}
        </h3>
      </div>

      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
        <p className="text-sm text-slate-500">Gastos</p>

        <h3 className="text-2xl font-bold text-red-500 mt-1">
          ${expenses.toFixed(2)}
        </h3>
      </div>
    </div>
  );
};
