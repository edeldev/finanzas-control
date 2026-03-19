import { DangerZone } from "../../pages/Home/components/DangerZone";
import { RulePopover } from "./RulePopover";

export const MenuHeader = ({ userConfig }) => {
  return (
    <div className="w-full mb-4 md:mb-6">
      <div className="max-w-7xl mx-auto px-6 py-6 md:py-8 space-y-6 md:space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-0">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
              Hola, {userConfig.name} 👋
            </h1>
            <p className="text-sm sm:text-base text-slate-500 mt-1 md:mt-2">
              Controla y optimiza tu dinero de forma inteligente
            </p>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <RulePopover className="transition-transform hover:scale-105" />
            <DangerZone className="transition-transform hover:scale-105" />
          </div>
        </div>

        <div className="w-full h-px bg-linear-to-r from-indigo-200 via-slate-200 to-indigo-200 opacity-30"></div>
      </div>
    </div>
  );
};
