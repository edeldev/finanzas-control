import { useState } from "react";
import { exportTransactionsToExcel } from "../../utils/exportToExcel";
import {
  getMonthlyTransactions,
  getTransactionsByRange,
  getWeeklyTransactions,
} from "../../utils/transactionFilters";

export const ExportTransactions = ({ transactions }) => {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const formatDate = (date) =>
    new Date(date + "T12:00:00").toLocaleDateString("es-MX");

  const clearRange = () => {
    setStart("");
    setEnd("");
  };

  return (
    <div className="flex flex-col gap-3 mb-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <button
          onClick={() => {
            const weekly = getWeeklyTransactions(transactions);

            if (weekly.length === 0) {
              alert("No hay movimientos esta semana");
              return;
            }

            exportTransactionsToExcel(
              weekly,
              "reporte-semana",
              "Últimos 7 días",
            );
          }}
          className="w-full bg-slate-900 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-slate-800 transition"
        >
          Exportar semana
        </button>

        <button
          onClick={() => {
            const monthly = getMonthlyTransactions(transactions);

            if (monthly.length === 0) {
              alert("No hay movimientos este mes");
              return;
            }

            exportTransactionsToExcel(monthly, "reporte-mes", "Este mes");
          }}
          className="w-full bg-emerald-500 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-emerald-600 transition"
        >
          Exportar mes
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="date"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
        />

        <input
          type="date"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
        />

        <button
          onClick={() => {
            if (!start || !end) {
              alert("Selecciona un rango de fechas");
              return;
            }

            const data = getTransactionsByRange(transactions, start, end);

            if (data.length === 0) {
              alert("No hay movimientos en ese rango");
              return;
            }

            const label = `Rango: ${formatDate(start)} - ${formatDate(end)}`;

            exportTransactionsToExcel(data, "reporte-personalizado", label);
          }}
          className="w-full bg-indigo-500 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-600 transition"
        >
          Exportar rango
        </button>
        {(start || end) && (
          <button
            onClick={clearRange}
            className="w-full bg-slate-200 text-slate-700 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-300 transition"
          >
            Limpiar rango
          </button>
        )}
      </div>
    </div>
  );
};
