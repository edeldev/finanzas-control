import { useFinance } from "../../context/FinanceContext";
import { calculateFinanceSummary } from "../../utils/calculations";
import { formatSmartMoney } from "../../utils/formatSmartMoney";
import { ProgressBar } from "../ui/ProgressBar";
import { FinanceChart } from "./FinanceChart";

export const FinancialHealthCard = () => {
  const { transactions, rule } = useFinance();

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
  } = calculateFinanceSummary(transactions, rule);

  if (income === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 text-center">
        <p className="text-slate-500 text-sm">
          Agrega ingresos para ver tu análisis financiero 📊
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
      <h3 className="text-lg font-semibold text-slate-800">
        Análisis financiero
      </h3>

      <FinanceChart />

      <div className="space-y-6">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-indigo-600">
              📈 Inversión recomendada ({rule.investment}%)
            </span>

            <span className="font-medium">
              {formatSmartMoney(investment)} /{" "}
              {formatSmartMoney(recommendedInvestment)}
            </span>
          </div>

          <ProgressBar value={investmentProgress} type="goal" />

          {investment < recommendedInvestment && (
            <div className="text-xs text-yellow-600 mt-1">
              Te faltan {formatSmartMoney(recommendedInvestment - investment)}{" "}
              para tu meta
            </div>
          )}

          {investment === recommendedInvestment && (
            <div className="text-xs text-green-600 mt-1">
              🎯 Excelente, ya cumpliste tu meta de inversión
            </div>
          )}

          {investment > recommendedInvestment && (
            <div className="text-xs text-green-700 mt-1 font-medium">
              🚀 Tienes {formatSmartMoney(investment - recommendedInvestment)}{" "}
              extra para invertir
            </div>
          )}
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-blue-600">
              💰 Ahorro recomendado ({rule.savings}%)
            </span>

            <span className="font-medium">
              {formatSmartMoney(savings)} /{" "}
              {formatSmartMoney(recommendedSavings)}
            </span>
          </div>

          <ProgressBar value={savingsProgress} type="goal" />

          {savings < recommendedSavings && (
            <div className="text-xs text-yellow-600 mt-1">
              Te faltan {formatSmartMoney(recommendedSavings - savings)} para
              ahorrar lo ideal
            </div>
          )}

          {savings === recommendedSavings && (
            <div className="text-xs text-green-600 mt-1">
              💰 Excelente, cumpliste tu meta de ahorro
            </div>
          )}

          {savings > recommendedSavings && (
            <div className="text-xs text-green-700 mt-1 font-medium">
              🏆 Ahorraste {formatSmartMoney(savings - recommendedSavings)}{" "}
              extra este periodo
            </div>
          )}
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-red-500">
              💸 Presupuesto de gastos ({rule.expenses}%)
            </span>

            <span className="font-medium">
              {formatSmartMoney(expenses)} / {formatSmartMoney(allowedExpenses)}
            </span>
          </div>

          <ProgressBar value={expenseProgress} type="expense" />

          <div className="text-xs mt-1">
            {remainingExpenses >= 0 ? (
              <span className="text-slate-400">
                Disponible: {formatSmartMoney(remainingExpenses)}
              </span>
            ) : (
              <span className="text-red-500 font-semibold">
                ⚠️ Te excediste por{" "}
                {formatSmartMoney(Math.abs(remainingExpenses))}
              </span>
            )}
          </div>

          {expenseProgress > 100 && (
            <div className="text-xs text-red-500 mt-1">
              🚨 Estás gastando más del {rule.expenses}% recomendado
            </div>
          )}
        </div>
      </div>

      <div className="text-center text-xs opacity-60 pt-2 border-t border-gray-500/30">
        Regla: {rule.investment}% inv • {rule.savings}% ahorro • {rule.expenses}
        % gastos
      </div>
    </div>
  );
};
