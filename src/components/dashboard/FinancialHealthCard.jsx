import { useFinance } from "../../context/FinanceContext";
import { calculateFinanceSummary } from "../../utils/calculations";
import { formatMoney } from "../../utils/formatters";
import { ProgressBar } from "../ui/ProgressBar";
import { FinanceChart } from "./FinanceChart";

export const FinancialHealthCard = () => {
  const { transactions } = useFinance();

  const {
    income,
    expenses,
    investment,
    savings,
    allowedExpenses,
    remainingExpenses,
    expenseProgress,
    savingsProgress,
    investmentProgress,
    recommendedSavings,
    recommendedInvestment,
  } = calculateFinanceSummary(transactions);

  const hasIncome = income > 0;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
      <h3 className="text-lg font-semibold text-slate-800">
        Análisis financiero
      </h3>

      <FinanceChart />

      <div className="space-y-5">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-indigo-600">
              📈 Inversión recomendada (50%)
            </span>

            <span className="font-medium">
              {formatMoney(investment)} / {formatMoney(recommendedInvestment)}
            </span>
          </div>

          <ProgressBar value={hasIncome ? investmentProgress : 0} type="goal" />
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-blue-600">💰 Ahorro recomendado (20%)</span>

            <span className="font-medium">
              {formatMoney(savings)} / {formatMoney(recommendedSavings)}
            </span>
          </div>

          <ProgressBar value={hasIncome ? savingsProgress : 0} type="goal" />
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-red-500">💸 Presupuesto de gastos (30%)</span>
            <span className="font-medium">
              {formatMoney(expenses)} / {formatMoney(allowedExpenses)}
            </span>
          </div>

          <ProgressBar value={hasIncome ? expenseProgress : 0} type="expense" />

          <div className="text-xs text-slate-400 mt-1">
            Disponible para gastar: {formatMoney(remainingExpenses)}
          </div>
        </div>
      </div>

      <div className="text-xs text-slate-400 pt-3 border-t text-balance text-center">
        Basado en la regla financiera
        <span className="font-medium">
          {" "}
          50% inversión • 20% ahorro • 30% gastos
        </span>
      </div>
    </div>
  );
};
