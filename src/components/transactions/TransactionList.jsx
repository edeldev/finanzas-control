import { useState } from "react";
import { useFinance } from "../../context/FinanceContext";
import { expenseCategories, incomeCategories } from "../../data/categories";
import { Card } from "../ui/Card";
import { ExportTransactions } from "./ExportTransaction";

export const TransactionList = () => {
  const {
    transactions = [],
    deleteTransaction,
    editTransaction,
  } = useFinance();

  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editAmount, setEditAmount] = useState("");

  const allCategories = [...expenseCategories, ...incomeCategories];

  const startEdit = (t) => {
    setEditingId(t.id);
    setEditText(t.text);
    setEditAmount(t.amount);
  };

  const saveEdit = (id) => {
    editTransaction(id, {
      text: editText,
      amount: Number(editAmount),
    });

    setEditingId(null);
  };

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
              className="flex justify-between items-center p-4 rounded-2xl border border-slate-100 bg-white hover:bg-slate-50 hover:shadow-sm transition"
            >
              <div className="flex gap-3 items-start flex-1 min-w-0">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 text-lg">
                  {category?.icon || "📦"}
                </div>

                <div className="flex flex-col min-w-0">
                  {editingId === t.id ? (
                    <input
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="border border-slate-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  ) : (
                    <p className="font-medium text-slate-800 text-sm truncate">
                      {t.text}
                    </p>
                  )}

                  <span className="text-xs text-slate-500">
                    {category?.name || "Sin categoría"}
                  </span>

                  <span className="text-xs text-slate-400 mt-1">
                    {formattedDate} • {formattedTime}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {editingId === t.id ? (
                  <input
                    type="number"
                    value={editAmount}
                    onChange={(e) => setEditAmount(e.target.value)}
                    className="border border-slate-200 rounded-lg px-2 py-1 text-sm w-24 text-right focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                ) : (
                  <span
                    className={`font-semibold text-lg ${
                      t.type === "income" ? "text-emerald-500" : "text-red-500"
                    }`}
                  >
                    {t.type === "income" ? "+" : "-"}${formattedAmount}
                  </span>
                )}

                <div className="flex items-center gap-2 transition">
                  {editingId === t.id ? (
                    <>
                      <button
                        type="button"
                        onClick={() => saveEdit(t.id)}
                        className="cursor-pointer text-xs font-medium text-emerald-600 hover:text-emerald-700"
                      >
                        💾
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="cursor-pointer text-xs font-medium text-red-600 hover:text-red-700"
                      >
                        X
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => startEdit(t)}
                      className="cursor-pointer text-sm text-slate-400 hover:text-blue-500"
                    >
                      ✏️
                    </button>
                  )}

                  {!editingId && (
                    <button
                      type="button"
                      onClick={() => deleteTransaction(t.id)}
                      className="cursor-pointer text-sm text-slate-400 hover:text-red-500"
                    >
                      🗑
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
