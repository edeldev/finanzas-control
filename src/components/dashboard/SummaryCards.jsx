import { useFinance } from "../../context/FinanceContext";
import { calculateFinanceSummary } from "../../utils/calculations";
import { formatSmartMoney } from "../../utils/formatSmartMoney";

const Card = ({ title, value, color, icon }) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl p-5 bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div
        className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition ${color}`}
      />

      <div className="relative z-10 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-slate-500 uppercase ">
            {title}
          </p>

          <span className="text-lg opacity-70">{icon}</span>
        </div>

        <h3 className="text-2xl font-bold tracking-tight whitespace-nowrap tabular-nums text-slate-900">
          {value}
        </h3>
      </div>

      <div
        className={`absolute bottom-0 left-0 w-full h-0.75 ${color} opacity-70`}
      />
    </div>
  );
};

export const SummaryCards = () => {
  const { transactions, rule } = useFinance();

  const { income, expenses, savingsWithdrawals, investmentWithdrawals } =
    calculateFinanceSummary(transactions, rule);

  return (
    <div className="grid grid-cols-2 gap-5">
      <Card
        title="Ingresos totales"
        value={formatSmartMoney(income)}
        color="bg-emerald-400"
        icon="💰"
      />

      <Card
        title="Gastos"
        value={formatSmartMoney(expenses)}
        color="bg-red-400"
        icon="💸"
      />

      <Card
        title="Retiro ahorro"
        value={formatSmartMoney(savingsWithdrawals)}
        color="bg-orange-400"
        icon="🏦"
      />

      <Card
        title="Retiro inversión"
        value={formatSmartMoney(investmentWithdrawals)}
        color="bg-purple-400"
        icon="📈"
      />
    </div>
  );
};
