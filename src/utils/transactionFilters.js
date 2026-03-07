import { getDateString } from "./dateString";

export const getWeeklyTransactions = (transactions) => {
  const today = new Date();
  const sevenDaysAgo = new Date();

  sevenDaysAgo.setDate(today.getDate() - 6);

  const start = getDateString(sevenDaysAgo);
  const end = getDateString(today);

  return transactions.filter((t) => {
    const d = getDateString(t.date);
    return d >= start && d <= end;
  });
};

export const getMonthlyTransactions = (transactions) => {
  const now = new Date();

  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const startStr = getDateString(start);
  const endStr = getDateString(end);

  return transactions.filter((t) => {
    const d = getDateString(t.date);
    return d >= startStr && d <= endStr;
  });
};

export const getTransactionsByRange = (transactions, startDate, endDate) => {
  return transactions.filter((t) => {
    const d = getDateString(t.date);
    return d >= startDate && d <= endDate;
  });
};
