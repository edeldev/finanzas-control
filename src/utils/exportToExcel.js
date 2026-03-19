import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { expenseCategories, incomeCategories } from "../data/categories";
import { calculateFinanceSummary } from "./calculations";

export const exportTransactionsToExcel = (
  transactions,
  fileName,
  periodLabel = "",
  rule,
) => {
  const allCategories = [...expenseCategories, ...incomeCategories];

  const sorted = [...transactions].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );

  const summary = calculateFinanceSummary(transactions, rule);

  const {
    investment = 0,
    savings = 0,
    remainingExpenses = 0,
    income = 0,
    expenses = 0,
  } = summary;

  const totalMoney = investment + savings + remainingExpenses;
  const netWorth = investment + savings;

  const used = new Set();
  const rows = [];

  sorted.forEach((t) => {
    if (used.has(t.id)) return;

    const category = allCategories.find((c) => c.id === t.category);
    const date = new Date(t.date);

    rows.push({
      Fecha: date.toLocaleDateString("es-MX"),
      Hora: date.toLocaleTimeString("es-MX", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      Concepto: t.text,
      Categoría: category?.name || "Sin categoría",
      Tipo: t.type === "income" ? "Ingreso" : "Gasto",
      Monto: t.type === "income" ? Number(t.amount) : -Number(t.amount),
    });

    used.add(t.id);

    if (t.groupId && !t.automatic) {
      const children = sorted.filter(
        (x) => x.groupId === t.groupId && x.automatic,
      );

      children.forEach((child) => {
        const childCategory = allCategories.find(
          (c) => c.id === child.category,
        );

        rows.push({
          Fecha: "",
          Hora: "",
          Concepto: `   ↳ ${child.text.replace(" • " + t.text, "")}`,
          Categoría: childCategory?.name || "Auto",
          Tipo: "Auto",
          Monto: -Number(child.amount),
        });

        used.add(child.id);
      });
    }
  });

  const wsMovements = XLSX.utils.json_to_sheet(rows);

  wsMovements["!cols"] = [
    { wch: 12 },
    { wch: 10 },
    { wch: 35 },
    { wch: 20 },
    { wch: 12 },
    { wch: 15 },
  ];

  wsMovements["!autofilter"] = { ref: "A1:F1" };

  const summaryData = [
    ["REPORTE FINANCIERO"],
    [`Periodo: ${periodLabel}`],
    [`Generado: ${new Date().toLocaleString("es-MX")}`],
    [],
    ["RESUMEN GENERAL"],
    ["Ingresos totales", income],
    ["Gastos de presupuesto", expenses],
    ["Disponible para gastar", remainingExpenses],
    [],
    ["AHORRO E INVERSIÓN"],
    ["Ahorro", savings],
    ["Inversión", investment],
    [],
    ["TOTALES"],
    ["Dinero total", totalMoney],
    ["Patrimonio (neto)", netWorth],
    [],
    ["REGLA FINANCIERA"],
    ["% Inversión", `${rule?.investment ?? 0}%`],
    ["% Ahorro", `${rule?.savings ?? 0}%`],
    ["% Gastos", `${rule?.expenses ?? 0}%`],
  ];

  const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);

  wsSummary["!cols"] = [{ wch: 30 }, { wch: 20 }];

  const applyMoneyFormat = (ws) => {
    if (!ws["!ref"]) return;

    const range = XLSX.utils.decode_range(ws["!ref"]);

    for (let r = range.s.r; r <= range.e.r; r++) {
      for (let c = range.s.c; c <= range.e.c; c++) {
        const cell = ws[XLSX.utils.encode_cell({ r, c })];

        if (cell && typeof cell.v === "number") {
          cell.z = '"$"#,##0.00';
        }
      }
    }
  };

  applyMoneyFormat(wsMovements);
  applyMoneyFormat(wsSummary);

  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, wsSummary, "Resumen");
  XLSX.utils.book_append_sheet(wb, wsMovements, "Movimientos");

  const excelBuffer = XLSX.write(wb, {
    bookType: "xlsx",
    type: "array",
  });

  const file = new Blob([excelBuffer], {
    type: "application/octet-stream",
  });

  saveAs(file, `${fileName}.xlsx`);
};
