import { useFinance } from "../../context/FinanceContext";
import { calculateBalance } from "../../utils/calculations";

export const BalanceCard = () => {
  const { transactions } = useFinance();
  const balance = calculateBalance(transactions);

  return (
    <div className="relative overflow-hidden rounded-[28px] p-6 text-white shadow-xl bg-linear-to-br from-indigo-500 via-blue-500 to-indigo-700">
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>

      <div className="relative flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm opacity-80">Balance disponible</p>

            <h2 className="text-3xl sm:text-4xl font-bold mt-1 tracking-tight">
              ${balance.toFixed(2)}
            </h2>
          </div>

          <div className="bg-white/20 px-3 py-1 rounded-full text-xs">
            Cuenta
          </div>
        </div>

        <p className="text-xs opacity-70">Actualizado automáticamente</p>
      </div>
    </div>
  );
};
