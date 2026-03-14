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
      amount: Math.abs(Number(editAmount)),
    });

    setEditingId(null);
  };

  const groupedTransactions = [];
  const sorted = [...transactions].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );

  const used = new Set();

  sorted.forEach((t) => {
    if (used.has(t.id)) return;

    if (t.groupId && !t.automatic) {
      const children = sorted.filter(
        (x) => x.groupId === t.groupId && x.automatic,
      );

      groupedTransactions.push({
        parent: t,
        children,
      });

      used.add(t.id);
      children.forEach((c) => used.add(c.id));
    } else if (!t.groupId) {
      groupedTransactions.push({
        parent: t,
        children: [],
      });

      used.add(t.id);
    }
  });

  const sections = {
    hoy: [],
    ayer: [],
    semana: [],
    antiguo: [],
  };

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  groupedTransactions.forEach((t) => {
    const date = new Date(t.parent.date);

    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();
    const diffDays = (today - date) / (1000 * 60 * 60 * 24);

    if (isToday) sections.hoy.push(t);
    else if (isYesterday) sections.ayer.push(t);
    else if (diffDays <= 7) sections.semana.push(t);
    else sections.antiguo.push(t);
  });

  const renderTransaction = ({ parent, children }) => {
    const category = allCategories.find((c) => c.id === parent.category);

    const formattedAmount = Number(parent.amount).toLocaleString("es-MX", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    const formattedDate = new Date(parent.date).toLocaleString("es-MX", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <div key={parent.id} className="space-y-2">
        <div className="flex justify-between items-center p-4 rounded-2xl bg-white border border-slate-100 hover:border-slate-200 hover:shadow-sm transition">
          <div className="flex gap-3 items-start flex-1 min-w-0">
            <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-slate-100 text-lg shrink-0">
              {category?.icon || "📦"}
            </div>

            <div className="flex flex-col min-w-0">
              {editingId === parent.id ? (
                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="border border-slate-200 rounded-lg px-2 py-1 text-sm"
                />
              ) : (
                <p className="font-medium text-slate-800 truncate">
                  {parent.text}
                </p>
              )}

              <div className="flex flex-col text-xs leading-tight mt-1">
                <span className="text-slate-500 font-medium">
                  {category?.name || "Sin categoría"}
                </span>

                <span className="text-slate-400">{formattedDate}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {editingId === parent.id ? (
              <input
                type="number"
                value={editAmount}
                onChange={(e) => setEditAmount(e.target.value)}
                className="border border-slate-200 rounded-lg px-2 py-1 text-sm w-24 text-right"
              />
            ) : (
              <span
                className={`font-semibold text-lg ${
                  parent.type === "income" ? "text-emerald-500" : "text-red-500"
                }`}
              >
                {parent.type === "income" ? "+" : "-"}${formattedAmount}
              </span>
            )}

            <div className="flex gap-2 transition">
              {editingId === parent.id ? (
                <>
                  <button
                    className="cursor-pointer"
                    onClick={() => saveEdit(parent.id)}
                  >
                    💾
                  </button>
                  <button
                    className="cursor-pointer"
                    onClick={() => setEditingId(null)}
                  >
                    ✖
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => startEdit(parent)}
                    className="text-slate-400 hover:text-blue-500 cursor-pointer"
                  >
                    ✏️
                  </button>

                  <button
                    onClick={() => deleteTransaction(parent.id)}
                    className="text-slate-400 hover:text-red-500 cursor-pointer"
                  >
                    🗑
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {children.map((child) => (
          <div
            key={child.id}
            className="flex justify-between items-center pl-14 pr-4 py-2 text-sm text-slate-500"
          >
            <span className="flex items-center gap-2">
              <span className="text-xs text-slate-300">↳</span>

              {child.text.replace(" • " + parent.text, "")}

              <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                auto
              </span>
            </span>

            <span className="text-red-500 font-medium">
              -${Number(child.amount).toLocaleString("es-MX")}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const renderSection = (title, data) => {
    if (data.length === 0) return null;

    return (
      <div className="space-y-4">
        <h4 className="text-xs font-semibold text-slate-400 px-2 uppercase tracking-wider">
          {title}
        </h4>

        <div className="space-y-3">{data.map(renderTransaction)}</div>
      </div>
    );
  };

  return (
    <Card className="flex flex-col flex-1 rounded-3xl border border-slate-200 bg-slate-50 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-white rounded-t-3xl">
        <h3 className="font-semibold text-lg text-slate-800">Movimientos</h3>
      </div>

      <div className="px-6 pt-4">
        <ExportTransactions transactions={transactions} />
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-8 pt-4 space-y-8">
        {renderSection("Hoy", sections.hoy)}
        {renderSection("Ayer", sections.ayer)}
        {renderSection("Esta semana", sections.semana)}
        {renderSection("Pasados", sections.antiguo)}
      </div>
    </Card>
  );
};
