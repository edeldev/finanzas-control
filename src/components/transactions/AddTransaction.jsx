import { useState } from "react";
import { useFinance } from "../../context/FinanceContext";
import { expenseCategories, incomeCategories } from "../../data/categories";
import { calculateFinanceSummary } from "../../utils/calculations";
import toast from "react-hot-toast";

export const AddTransaction = () => {
  const { addTransaction, transactions, rule } = useFinance();

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

    const { savings, investment } = calculateFinanceSummary(transactions, rule);

    if (type === "expense") {
      if (category === "savingsExpense" && numericAmount > savings) {
        toast.error("No tienes suficiente ahorro 💸");
        return;
      }

      if (category === "investmentExpense" && numericAmount > investment) {
        toast.error("No tienes suficiente inversión 📉");
        return;
      }
    }

    addTransaction({
      text: text.trim(),
      amount: Math.abs(numericAmount),
      category,
      type,
    });

    toast.success(
      type === "income" ? `Ingreso agregado 💰` : `Gasto registrado 🧾`,
    );

    setText("");
    setAmount("");
    setType("income");
    setCategory(incomeCategories[0].id);
  };

  const formatInput = (value) => {
    if (!value) return "";

    if (value.endsWith(".")) return value;

    const parts = value.split(".");

    const decimals = parts[1]?.slice(0, 2) || "";
    const integer = parts[0];

    const formattedInteger = Number(integer).toLocaleString("en-US");

    if (value.includes(".")) {
      return `${formattedInteger}.${decimals}`;
    }

    return formattedInteger;
  };

  return (
    <form
      id="transaction"
      onSubmit={handleSubmit}
      className="bg-white rounded-3xl p-4 lg:p-6 border border-slate-200 shadow-sm space-y-4 scroll-m-20"
    >
      <h3 className="text-lg font-semibold text-slate-800">Nuevo movimiento</h3>

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

      <input
        autoFocus={``}
        className="w-full border border-slate-200 rounded-xl px-4 py-3"
        placeholder="Descripción"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-4 py-3">
        <span className="text-slate-400 font-semibold">$</span>

        <input
          type="text"
          inputMode="decimal"
          placeholder="0.00"
          value={formatInput(amount)}
          onChange={(e) => {
            let raw = e.target.value.replace(/,/g, "");
            raw = raw.replace(/[^0-9.]/g, "");

            const parts = raw.split(".");
            if (parts.length > 2) {
              raw = parts[0] + "." + parts[1];
            }

            if (parts[1]?.length > 2) {
              raw = parts[0] + "." + parts[1].slice(0, 2);
            }

            setAmount(raw);
          }}
          className="flex-1 outline-none font-semibold text-lg"
        />
      </div>

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
