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
              📈 Inversión recomendada (50%)
            </span>

            <span className="font-medium">
              {formatMoney(investment)} / {formatMoney(recommendedInvestment)}
            </span>
          </div>

          <ProgressBar value={investmentProgress} type="goal" />

          {investment < recommendedInvestment && (
            <div className="text-xs text-yellow-600 mt-1">
              Has retirado {formatMoney(recommendedInvestment - investment)} de
              tu inversión
            </div>
          )}

          {investment === recommendedInvestment && (
            <div className="text-xs text-green-600 mt-1">
              🎯 Excelente, ya cumpliste tu meta de inversión
            </div>
          )}

          {investment > recommendedInvestment && (
            <div className="text-xs text-green-700 mt-1 font-medium">
              🚀 Tienes {formatMoney(investment - recommendedInvestment)} extra
              para invertir
            </div>
          )}
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-blue-600">💰 Ahorro recomendado (20%)</span>

            <span className="font-medium">
              {formatMoney(savings)} / {formatMoney(recommendedSavings)}
            </span>
          </div>

          <ProgressBar value={savingsProgress} type="goal" />

          {savings < recommendedSavings && (
            <div className="text-xs text-yellow-600 mt-1">
              Has retirado {formatMoney(recommendedSavings - savings)} de tu
              ahorro
            </div>
          )}

          {savings === recommendedSavings && (
            <div className="text-xs text-green-600 mt-1">
              💰 Excelente, cumpliste tu meta de ahorro
            </div>
          )}

          {savings > recommendedSavings && (
            <div className="text-xs text-green-700 mt-1 font-medium">
              🏆 Ahorraste {formatMoney(savings - recommendedSavings)} extra
              este periodo
            </div>
          )}
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-red-500">💸 Presupuesto de gastos (30%)</span>

            <span className="font-medium">
              {formatMoney(expenses)} / {formatMoney(allowedExpenses)}
            </span>
          </div>

          <ProgressBar value={expenseProgress} type="expense" />

          <div className="text-xs mt-1">
            {remainingExpenses >= 0 ? (
              <span className="text-slate-400">
                Disponible: {formatMoney(remainingExpenses)}
              </span>
            ) : (
              <span className="text-red-500 font-semibold">
                ⚠️ Te excediste por {formatMoney(Math.abs(remainingExpenses))}
              </span>
            )}
          </div>

          {expenseProgress > 100 && (
            <div className="text-xs text-red-500 mt-1">
              🚨 Estás gastando más del 30% recomendado
            </div>
          )}
        </div>
      </div>

      <div className="text-xs text-slate-400 pt-3 border-t text-center">
        Basado en la regla financiera{" "}
        <span className="font-medium">
          50% inversión • 20% ahorro • 30% gastos
        </span>
      </div>
    </div>
  );
};
