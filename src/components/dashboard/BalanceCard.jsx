import { useEffect, useState } from "react";
import { useFinance } from "../../context/FinanceContext";
import { calculateFinanceSummary } from "../../utils/calculations";
import { formatSmartMoney } from "../../utils/formatSmartMoney";

export const BalanceCard = () => {
  const { transactions, rule } = useFinance();
  const [view, setView] = useState("total");
  const [showBalance, setShowBalance] = useState(() => {
    if (typeof window === "undefined") return true;

    const saved = localStorage.getItem("finance:showBalance");
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem("finance:showBalance", JSON.stringify(showBalance));
  }, [showBalance]);

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
        <div className="flex items-center justify-between">
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

          <div className="flex items-center justify-center h-8 px-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition">
            <button
              onClick={() => setShowBalance((prev) => !prev)}
              className="flex items-center gap-1 text-xs font-medium tracking-wide text-white/80 hover:text-white transition"
            >
              <span className="text-sm">{showBalance ? "🙈" : "👁️"}</span>
              <span className="hidden sm:inline">
                {showBalance ? "Ocultar" : "Mostrar"}
              </span>
            </button>
          </div>
        </div>

        <div>
          <p className="text-sm opacity-70 tracking-wide">
            {isTotal ? "Dinero total" : "Patrimonio"}
          </p>

          <h2 className="text-5xl font-bold mt-1 tracking-tight whitespace-nowrap tabular-nums transition-all duration-300">
            {showBalance
              ? formatSmartMoney(isTotal ? totalMoney : netWorth)
              : "••••••"}
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
            {showBalance ? formatSmartMoney(remainingExpenses) : "••••••"}
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
              {showBalance ? formatSmartMoney(investment) : "••••••"}
            </span>
          </div>

          <div className="flex flex-col bg-white/10 rounded-2xl p-4 border border-white/10">
            <span className="text-xs opacity-70 flex items-center gap-1">
              💰 Ahorro
            </span>

            <span className="text-xl font-semibold mt-1">
              {showBalance ? formatSmartMoney(savings) : "••••••"}
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
