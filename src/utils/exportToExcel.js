import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { expenseCategories, incomeCategories } from "../data/categories";

export const exportTransactionsToExcel = (
  transactions,
  fileName,
  periodLabel = "",
) => {
  const allCategories = [...expenseCategories, ...incomeCategories];

  const sorted = [...transactions].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );

  let totalIncome = 0;
  let totalExpense = 0;

  const rows = sorted.map((t) => {
    const category = allCategories.find((c) => c.id === t.category);

    const categoryName = category ? category.name : "Sin categoría";

    const amount = Number(t.amount);

    if (t.type === "income") totalIncome += amount;
    else totalExpense += amount;

    const date = new Date(t.date);

    return [
      date.toLocaleDateString("es-MX"),
      date.toLocaleTimeString("es-MX", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      t.text,
      categoryName,
      t.type === "income" ? "Ingreso" : "Gasto",
      amount,
    ];
  });

  const balance = totalIncome - totalExpense;

  const sheetData = [
    ["REPORTE FINANCIERO"],
    [`Periodo: ${periodLabel}`],
    [`Generado: ${new Date().toLocaleString("es-MX")}`],
    [],
    ["Fecha", "Hora", "Concepto", "Categoría", "Tipo", "Monto"],
    ...rows,
    [],
    ["", "", "", "", "Total ingresos", totalIncome],
    ["", "", "", "", "Total gastos", totalExpense],
    ["", "", "", "", "Balance", balance],
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

  worksheet["!cols"] = [
    { wch: 12 },
    { wch: 10 },
    { wch: 30 },
    { wch: 20 },
    { wch: 12 },
    { wch: 12 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Movimientos");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const file = new Blob([excelBuffer], {
    type: "application/octet-stream",
  });

  saveAs(file, `${fileName}.xlsx`);
};
