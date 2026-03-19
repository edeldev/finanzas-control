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
          flex items-center gap-2
          px-4 py-2 rounded-full text-sm font-medium
          bg-linear-to-r from-slate-900 to-slate-700 text-white
          hover:from-slate-800 hover:to-slate-600
          shadow-md hover:shadow-lg
          transition-all duration-200 cursor-pointer
        "
      >
        <span className="text-base">⚙️</span>

        <span className="hidden sm:inline">
          {rule.investment}% inversión • {rule.savings}% ahorro •{" "}
          {rule.expenses}% gastos
        </span>

        <span className="sm:hidden">Regla</span>
      </button>

      {open && (
        <div
          className="
            absolute mt-3 w-80
            bg-white/80 backdrop-blur-2xl
            border border-white/40
            rounded-3xl shadow-2xl
            p-5 z-50
            animate-in fade-in zoom-in-95 duration-200
          "
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 text-lg">
              ⚙️
            </div>

            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-800">
                Regla financiera
              </p>
              <p className="text-xs text-slate-500">
                Se aplica automáticamente a tus ingresos
              </p>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="text-slate-400 hover:text-slate-700 transition cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="h-px bg-slate-200 mb-4" />

          <RuleSelector setOpen={setOpen} />

          <div className="mt-4 text-[11px] text-slate-400 text-center">
            💡 Tip: Ajusta tu regla según tus metas financieras
          </div>
        </div>
      )}
    </div>
  );
};
