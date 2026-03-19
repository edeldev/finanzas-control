import { useFinance } from "../../context/FinanceContext";
import { rules } from "../../data/rules";
import toast from "react-hot-toast";

export const RuleSelector = ({ setOpen }) => {
  const { rule, changeRule } = useFinance();

  const handleChange = (r) => {
    if (r.name === rule.name) return;

    changeRule(r);
    toast.success("Regla actualizada 🔥");
  };

  return (
    <div className="grid grid-cols-1 gap-3">
      {rules.map((r) => {
        const isActive = r.name === rule.name;

        return (
          <button
            key={r.name}
            onClick={() => {
              handleChange(r);
              setOpen(false);
            }}
            className={`
              w-full text-left p-4 rounded-2xl border
              transition-all duration-200
              ${
                isActive
                  ? "bg-slate-900 text-white border-slate-900 shadow-md"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 cursor-pointer"
              }
            `}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sm">{r.name}</span>

              {isActive && (
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                  Activa
                </span>
              )}
            </div>

            <div className="mt-2 text-xs opacity-80">
              {r.investment}% inversión • {r.savings}% ahorro • {r.expenses}%
              gastos
            </div>

            <div className="mt-3 h-2 w-full bg-slate-200 rounded-full overflow-hidden">
              <div className="flex h-full">
                <div
                  className="bg-indigo-500"
                  style={{ width: `${r.investment}%` }}
                />
                <div
                  className="bg-emerald-500"
                  style={{ width: `${r.savings}%` }}
                />
                <div
                  className="bg-red-400"
                  style={{ width: `${r.expenses}%` }}
                />
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};
