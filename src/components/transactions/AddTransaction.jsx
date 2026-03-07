import { useState } from "react";
import { useFinance } from "../../context/FinanceContext";
import { expenseCategories, incomeCategories } from "../../data/categories";

export const AddTransaction = () => {
  const { addTransaction } = useFinance();

  const [type, setType] = useState("expense");
  const [text, setText] = useState("");
  const [amount, setAmount] = useState("");

  const [category, setCategory] = useState(expenseCategories[0].id);

  const categories = type === "income" ? incomeCategories : expenseCategories;
  const numericAmount = Number(amount);

  const validate = !text.trim() || !amount || Number(amount) <= 0;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate) return;

    addTransaction({
      id: Date.now(),
      text: text.trim(),
      amount: Math.abs(numericAmount),
      category,
      type,
      date: new Date().toISOString(),
    });

    setText("");
    setAmount("");
    setType("expense");
    setCategory(incomeCategories[0].id);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4"
    >
      <h3 className="text-lg font-semibold text-slate-800">Nuevo movimiento</h3>

      <input
        className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="Descripción"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <input
        type="number"
        step="0.01"
        className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="Cantidad"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <select
        className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
          className={`flex-1 py-2 rounded-xl border cursor-pointer transition ${
            type === "income"
              ? "bg-emerald-500 text-white border-emerald-500"
              : "border-neutral-200 hover:bg-neutral-50"
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
          className={`flex-1 py-2 rounded-xl border cursor-pointer transition ${
            type === "expense"
              ? "bg-red-500 text-white border-red-500"
              : "border-neutral-200 hover:bg-neutral-50"
          }`}
        >
          Gasto
        </button>
      </div>

      <button
        type="submit"
        disabled={validate}
        className="w-full bg-indigo-600 hover:bg-indigo-700 cursor-pointer disabled:cursor-not-allowed disabled:bg-slate-400 transition text-white py-3 rounded-xl font-medium"
      >
        Guardar
      </button>
    </form>
  );
};
