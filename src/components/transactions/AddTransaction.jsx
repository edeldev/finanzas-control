import { useState } from "react";
import { useFinance } from "../../context/FinanceContext";
import { expenseCategories, incomeCategories } from "../../data/categories";
import { calculateFinanceSummary } from "../../utils/calculations";

export const AddTransaction = () => {
  const { addTransaction, transactions } = useFinance();

  const [type, setType] = useState("income");
  const [text, setText] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(incomeCategories[0].id);

  const categories = type === "income" ? incomeCategories : expenseCategories;

  const numericAmount = Number(amount);

  const validate = !text.trim() || !amount || numericAmount <= 0;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate) return;

    const { savings, investment } = calculateFinanceSummary(transactions);

    if (type === "expense") {
      if (category === "savingsExpense" && numericAmount > savings) {
        alert("No tienes suficiente ahorro");
        return;
      }

      if (category === "investmentExpense" && numericAmount > investment) {
        alert("No tienes suficiente inversión");
        return;
      }
    }

    addTransaction({
      text: text.trim(),
      amount: Math.abs(numericAmount),
      category,
      type,
    });

    setText("");
    setAmount("");
    setType("income");
    setCategory(incomeCategories[0].id);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-3xl p-4 lg:p-6 border border-slate-200 shadow-sm space-y-4"
    >
      <h3 className="text-lg font-semibold text-slate-800">Nuevo movimiento</h3>

      <input
        className="w-full border border-slate-200 rounded-xl px-4 py-3"
        placeholder="Descripción"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <input
        type="number"
        min="0"
        step="0.01"
        inputMode="decimal"
        className="w-full border border-slate-200 rounded-xl px-4 py-3"
        placeholder="Cantidad"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <select
        className="w-full border border-slate-200 rounded-xl px-4 py-3 cursor-pointer"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.icon} {cat.name}
          </option>
        ))}
      </select>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => {
            setType("income");
            setCategory(incomeCategories[0].id);
          }}
          className={`flex-1 py-2 cursor-pointer rounded-xl border ${
            type === "income"
              ? "bg-emerald-500 text-white"
              : "border-neutral-200"
          }`}
        >
          Ingreso
        </button>

        <button
          type="button"
          onClick={() => {
            setType("expense");
            setCategory(expenseCategories[0].id);
          }}
          className={`flex-1 py-2 cursor-pointer rounded-xl border ${
            type === "expense" ? "bg-red-500 text-white" : "border-neutral-200"
          }`}
        >
          Gasto
        </button>
      </div>

      <button
        type="submit"
        disabled={validate}
        className="w-full bg-indigo-600 cursor-pointer hover:bg-indigo-700 disabled:bg-slate-400 text-white py-3 rounded-xl"
      >
        Guardar
      </button>
    </form>
  );
};
