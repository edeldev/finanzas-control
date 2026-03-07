import { useFinance } from "../../context/FinanceContext";
import { expenseCategories, incomeCategories } from "../../data/categories";
import { Card } from "../ui/Card";
import { ExportTransactions } from "./ExportTransaction";

export const TransactionList = () => {
  const { transactions = [], deleteTransaction } = useFinance();

  const allCategories = [...expenseCategories, ...incomeCategories];

  return (
    <Card className="flex flex-col h-full rounded-3xl border border-slate-200 bg-white shadow-sm p-1 lg:p-6">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">
        <h3 className="font-semibold text-lg text-slate-800">Movimientos</h3>
      </div>

      <div className="px-4 pt-4">
        <ExportTransactions transactions={transactions} />
      </div>

      {transactions.length === 0 && (
        <div className="flex flex-col items-center h-full justify-center py-16 text-center text-slate-400">
          <div className="text-3xl mb-2">📊</div>
          <p className="text-sm">Aún no tienes movimientos registrados</p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-3">
        {transactions.map((t) => {
          const category = allCategories.find((c) => c.id === t.category);

          const date = new Date(t.date);

          const formattedDate = date.toLocaleDateString("es-MX");

          const formattedTime = date.toLocaleTimeString("es-MX", {
            hour: "2-digit",
            minute: "2-digit",
          });

          const formattedAmount = Number(t.amount).toFixed(2);

          return (
            <div
              key={t.id}
              className="flex justify-between items-center p-4 rounded-2xl border border-slate-100 bg-white hover:shadow-sm transition"
            >
              <div className="flex gap-3">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-100 text-base">
                  {category?.icon || "📦"}
                </div>

                <div className="flex flex-col">
                  <p className="font-medium text-slate-800 text-sm leading-tight">
                    {t.text}
                  </p>

                  <p className="text-xs text-slate-500">
                    {category?.name || "Sin categoría"}
                  </p>

                  <p className="text-xs text-slate-400 mt-1">
                    {formattedDate} • {formattedTime}
                  </p>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row items-end lg:items-center gap-2">
                <span
                  className={`font-semibold text-base ${
                    t.type === "income" ? "text-emerald-500" : "text-red-500"
                  }`}
                >
                  {t.type === "income" ? "+" : "-"}${formattedAmount}
                </span>

                <button
                  onClick={() => deleteTransaction(t.id)}
                  className="text-xs text-slate-400 cursor-pointer hover:text-red-500 transition"
                >
                  Eliminar x
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
