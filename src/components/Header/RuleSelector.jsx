import { useFinance } from "../../context/FinanceContext";
import { rules } from "../../data/rules";
import toast from "react-hot-toast";

export const RuleSelector = () => {
  const { rule, setRule } = useFinance();

  const handleChange = (r) => {
    if (r.name === rule.name) return;
    setRule(r);
    toast.success(`Regla: ${r.name}`);
  };

  return (
    <div className="flex gap-2 flex-wrap">
      {rules.map((r) => {
        const isActive = r.name === rule.name;

        return (
          <button
            key={r.name}
            onClick={() => handleChange(r)}
            className={`
              relative px-4 py-2 rounded-xl text-sm font-medium
              transition-all duration-300
              border
              ${
                isActive
                  ? "bg-slate-900 text-white border-slate-900 shadow-sm scale-[1.03]"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300 cursor-pointer"
              }
            `}
          >
            <span className="relative flex items-center gap-2">{r.name}</span>
          </button>
        );
      })}
    </div>
  );
};
