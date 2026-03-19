import { useState, useRef, useEffect } from "react";
import { RuleSelector } from "./RuleSelector";
import { useFinance } from "../../context/FinanceContext";

export const RulePopover = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  const { rule } = useFinance();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="
          px-4 py-2 rounded-full text-sm font-medium
          bg-slate-900 text-white
          hover:bg-slate-800
          transition-all duration-200 cursor-pointer
        "
      >
        ⚙️ Regla: {rule.investment}% inv • {rule.savings}% ahorro •{" "}
        {rule.expenses}% gastos
      </button>

      {open && (
        <div
          className="
            absolute right-0 mt-3 w-80
            bg-white/90 backdrop-blur-xl
            border border-slate-200
            rounded-2xl shadow-lg
            p-4 z-50
            animate-in fade-in zoom-in-95
          "
        >
          <div className="flex items-start gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 text-sm">
              ⚙️
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-800">
                Cambiar regla
              </p>
              <p className="text-xs text-slate-500">
                Aplica solo a ingresos futuros
              </p>
            </div>
          </div>

          <RuleSelector />
        </div>
      )}
    </div>
  );
};
