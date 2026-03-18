export const getWeeklyTransactions = (transactions) => {
  const today = new Date();
  const sevenDaysAgo = new Date();

  sevenDaysAgo.setDate(today.getDate() - 6);

  sevenDaysAgo.setHours(0, 0, 0, 0);
  today.setHours(23, 59, 59, 999);

  return transactions.filter((t) => {
    const date = new Date(t.date);
    return date >= sevenDaysAgo && date <= today;
  });
};

export const getMonthlyTransactions = (transactions) => {
  const now = new Date();

  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);

  return transactions.filter((t) => {
    const date = new Date(t.date);
    return date >= start && date <= end;
  });
};

export const getTransactionsByRange = (transactions, startDate, endDate) => {
  const start = new Date(startDate + "T00:00:00");
  const end = new Date(endDate + "T23:59:59");

  return transactions.filter((t) => {
    const date = new Date(t.date);
    return date >= start && date <= end;
  });
};
