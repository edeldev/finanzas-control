import { useFinance } from "../../context/FinanceContext";
import { calculateFinanceSummary } from "../../utils/calculations";
import { formatMoney } from "../../utils/formatters";

export const SummaryCards = () => {
  const { transactions, rule } = useFinance();

  const { income, expenses, savingsWithdrawals, investmentWithdrawals } =
    calculateFinanceSummary(transactions, rule);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
        <p className="text-xs text-slate-500">Ingresos totales</p>

        <h3 className="text-2xl font-bold text-emerald-500 mt-1">
          {formatMoney(income)}
        </h3>
      </div>

      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
        <p className="text-xs text-slate-500">Gastos de presupuesto</p>

        <h3 className="text-2xl font-bold text-red-500 mt-1">
          {formatMoney(expenses)}
        </h3>
      </div>

      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
        <p className="text-xs text-slate-500">Retiro de ahorro</p>

        <h3 className="text-2xl font-bold text-orange-500 mt-1">
          {formatMoney(savingsWithdrawals)}
        </h3>
      </div>

      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
        <p className="text-xs text-slate-500">Retiro de inversión</p>

        <h3 className="text-2xl font-bold text-purple-500 mt-1">
          {formatMoney(investmentWithdrawals)}
        </h3>
      </div>
    </div>
  );
};
