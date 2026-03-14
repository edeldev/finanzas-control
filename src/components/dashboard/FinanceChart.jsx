import { useFinance } from "../../context/FinanceContext";
import { calculateFinanceSummary } from "../../utils/calculations";
import { formatMoney } from "../../utils/formatters";

export const FinanceChart = () => {
  const { transactions } = useFinance();

  const { expenses, allowedExpenses, remainingExpenses } =
    calculateFinanceSummary(transactions);

  const total = allowedExpenses || 1;

  const safeExpenses = Math.min(expenses, allowedExpenses);

  const expensesAngle = (safeExpenses / total) * 360;

  return (
    <div className="flex flex-col items-center py-6 gap-4">
      <div className="relative flex items-center justify-center">
        <div
          className="w-44 h-44 rounded-full"
          style={{
            background:
              allowedExpenses === 0
                ? "#e5e7eb"
                : `conic-gradient(
            #ef4444 0deg ${expensesAngle}deg,
            #22c55e ${expensesAngle}deg 360deg
          )`,
          }}
        />

        <div className="absolute w-28 h-28 bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
          <span className="text-xs text-slate-400">Disponible</span>

          <span className="text-lg font-semibold text-slate-800">
            {formatMoney(remainingExpenses)}
          </span>
        </div>
      </div>

      <div className="flex gap-5 text-xs text-slate-500">
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 bg-red-500 rounded-full"></span>
          Gastado
        </div>

        <div className="flex items-center gap-1">
          <span className="w-3 h-3 bg-green-500 rounded-full"></span>
          Disponible
        </div>
      </div>
    </div>
  );
};
