import { useFinance } from "../../context/FinanceContext";
import { calculateFinanceSummary } from "../../utils/calculations";

export const BalanceCard = () => {
  const { transactions } = useFinance();

  const { investment, savings, remainingExpenses } =
    calculateFinanceSummary(transactions);

  const totalBalance =
    (investment ?? 0) + (savings ?? 0) + (remainingExpenses ?? 0);

  return (
    <div className="rounded-[30px] p-8 text-white shadow-xl bg-linear-to-br from-indigo-500 via-blue-500 to-indigo-700">
      <div className="flex flex-col gap-7">
        <div>
          <p className="text-sm opacity-70 tracking-wide">Balance total</p>

          <h2 className="text-5xl font-bold mt-1 tracking-tight">
            ${(totalBalance ?? 0).toFixed(2)}
          </h2>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4">
          <p className="text-xs uppercase opacity-70">
            Disponible del presupuesto de gastos
          </p>

          <p className="text-2xl font-semibold mt-1">
            ${(remainingExpenses ?? 0).toFixed(2)}
          </p>
        </div>

        <div className="h-px bg-white/20" />

        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col bg-white/10 rounded-2xl p-4">
            <span className="text-xs opacity-70 flex items-center gap-1">
              📈 Inversión
            </span>

            <span className="text-xl font-semibold mt-1">
              ${(investment ?? 0).toFixed(2)}
            </span>
          </div>

          <div className="flex flex-col bg-white/10 rounded-2xl p-4">
            <span className="text-xs opacity-70 flex items-center gap-1">
              💰 Ahorro
            </span>

            <span className="text-xl font-semibold mt-1">
              ${(savings ?? 0).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
