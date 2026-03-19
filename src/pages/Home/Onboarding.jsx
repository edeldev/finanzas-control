import { useState } from "react";
import { rules } from "../../data/rules";
import toast from "react-hot-toast";

export const Onboarding = ({ onFinish }) => {
  const [name, setName] = useState("");
  const [selectedRule, setSelectedRule] = useState(rules[0]);

  const isValid = name.trim().length > 0;

  const handleSubmit = () => {
    if (!isValid) {
      toast.error("Por favor ingresa tu nombre");
      return;
    }

    const data = { name: name.trim(), rule: selectedRule };
    localStorage.setItem("userConfig", JSON.stringify(data));
    toast.success(`¡Bienvenido, ${name.trim()}! 🚀`);
    onFinish(data);
  };

  const handleChange = (e) => {
    setName(e.target.value);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-indigo-900 to-slate-800 px-6">
      <div className="w-full max-w-2xl backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">Bienvenido 👋</h1>
          <p className="text-slate-300 mt-2">
            Configura tu estrategia financiera
          </p>
        </div>

        <div className="mb-6">
          <label className="text-slate-300 text-sm">¿Cómo te llamas?</label>
          <input
            type="text"
            placeholder="Ej: Mauricio"
            value={name}
            onChange={handleChange}
            className={`w-full mt-2 p-3 rounded-xl bg-white/20 text-white placeholder:text-slate-400 outline-none border 
              ${!isValid && name ? "border-red-400 focus:ring-red-400" : "border-white/20 focus:ring-indigo-400"}
              focus:ring-2
            `}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {rules.map((rule, i) => {
            const isActive = selectedRule.name === rule.name;

            return (
              <div
                key={i}
                onClick={() => setSelectedRule(rule)}
                className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 border
                  ${
                    isActive
                      ? "bg-indigo-500 text-white border-indigo-400 scale-[1.02] shadow-lg"
                      : "bg-white/10 text-slate-200 border-white/20 hover:bg-white/20"
                  }
                `}
              >
                <h3 className="font-semibold text-lg">{rule.name}</h3>
                <p className="text-sm opacity-80 mb-2">{rule.description}</p>

                <div className="text-xs flex gap-2 flex-wrap">
                  <span className="bg-black/20 px-2 py-1 rounded-lg">
                    📈 {rule.investment}%
                  </span>
                  <span className="bg-black/20 px-2 py-1 rounded-lg">
                    💰 {rule.savings}%
                  </span>
                  <span className="bg-black/20 px-2 py-1 rounded-lg">
                    💸 {rule.expenses}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={handleSubmit}
          disabled={!isValid}
          className={`w-full py-3 rounded-xl font-semibold text-lg shadow-lg transition
            ${
              isValid
                ? "bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer"
                : "bg-slate-600 text-slate-300 cursor-not-allowed"
            }
          `}
        >
          Comenzar 🚀
        </button>
      </div>
    </div>
  );
};
