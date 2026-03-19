import { useState } from "react";
import { useFinance } from "../../context/FinanceContext";
import { calculateFinanceSummary } from "../../utils/calculations";
import { formatMoney } from "../../utils/formatters";

export const BalanceCard = () => {
  const { transactions, rule } = useFinance();
  const [view, setView] = useState("total");

  const {
    investment = 0,
    savings = 0,
    remainingExpenses = 0,
    expenseProgress = 0,
  } = calculateFinanceSummary(transactions, rule);

  const totalMoney = investment + savings + remainingExpenses;
  const netWorth = investment + savings;

  const isTotal = view === "total";

  const getStatusColor = () => {
    if (expenseProgress > 100) return "from-red-500 via-red-600 to-red-700";
    if (expenseProgress > 80)
      return "from-yellow-500 via-orange-500 to-red-500";
    return "from-indigo-500 via-blue-500 to-indigo-700";
  };

  return (
    <div
      className={`rounded-[30px] p-8 text-white shadow-xl bg-linear-to-br ${getStatusColor()} transition-all duration-500`}
    >
      <div className="flex flex-col gap-6">
        <div className="flex bg-white/10 rounded-xl p-1 w-fit">
          <button
            onClick={() => setView("total")}
            className={`px-4 py-1 rounded-lg text-sm transition ${
              isTotal
                ? "bg-white text-black font-semibold"
                : "opacity-70 cursor-pointer"
            }`}
          >
            Total
          </button>

          <button
            onClick={() => setView("net")}
            className={`px-4 py-1 rounded-lg text-sm transition ${
              !isTotal
                ? "bg-white text-black font-semibold"
                : "opacity-70 cursor-pointer"
            }`}
          >
            Patrimonio
          </button>
        </div>

        <div>
          <p className="text-sm opacity-70 tracking-wide">
            {isTotal ? "Dinero total" : "Patrimonio"}
          </p>

          <h2 className="text-5xl font-bold mt-1 tracking-tight">
            {formatMoney(isTotal ? totalMoney : netWorth)}
          </h2>

          <p className="text-xs opacity-60 mt-1">
            {isTotal
              ? "Incluye ahorro, inversión y disponible para gastos"
              : "Solo ahorro + inversión"}
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
          <p className="text-xs uppercase opacity-70">Disponible para gastar</p>

          <p className="text-2xl font-semibold mt-1">
            {formatMoney(remainingExpenses)}
          </p>

          {remainingExpenses < 0 && (
            <p className="text-xs text-red-200 mt-1">
              ⚠️ Te excediste en gastos
            </p>
          )}
        </div>

        <div className="h-px bg-white/20" />

        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col bg-white/10 rounded-2xl p-4 border border-white/10">
            <span className="text-xs opacity-70 flex items-center gap-1">
              📈 Inversión
            </span>

            <span className="text-xl font-semibold mt-1">
              {formatMoney(investment)}
            </span>
          </div>

          <div className="flex flex-col bg-white/10 rounded-2xl p-4 border border-white/10">
            <span className="text-xs opacity-70 flex items-center gap-1">
              💰 Ahorro
            </span>

            <span className="text-xl font-semibold mt-1">
              {formatMoney(savings)}
            </span>
          </div>
        </div>

        <div className="text-center text-xs opacity-60 pt-2 border-t border-white/10">
          Regla: {rule.investment}% inv • {rule.savings}% ahorro •{" "}
          {rule.expenses}% gastos
        </div>
      </div>
    </div>
  );
};
