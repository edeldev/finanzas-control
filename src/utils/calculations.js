export const calculateFinanceSummary = (transactions = [], rule) => {
  let income = 0;
  let incomeForRule = 0;

  let expenses = 0;

  let savings = 0;
  let investment = 0;

  let savingsWithdrawals = 0;
  let investmentWithdrawals = 0;

  transactions.forEach((t) => {
    const amount = Number(t.amount) || 0;

    if (t.type === "income") {
      income += amount;

      if (t.category === "savingsIncome") {
        savings += amount;
        return;
      }

      if (t.category === "investmentIncome") {
        investment += amount;
        return;
      }

      incomeForRule += amount;
      return;
    }

    if (t.type === "expense") {
      if (t.category === "savingsExpense") {
        if (t.automatic) {
          savings += amount;
        } else {
          savings -= amount;
          savingsWithdrawals += amount;
        }
        return;
      }

      if (t.category === "investmentExpense") {
        if (t.automatic) {
          investment += amount;
        } else {
          investment -= amount;
          investmentWithdrawals += amount;
        }
        return;
      }

      expenses += amount;
    }
  });

  const recommendedSavings = incomeForRule * (rule.savings / 100);
  const recommendedInvestment = incomeForRule * (rule.investment / 100);
  const allowedExpenses = incomeForRule * (rule.expenses / 100);

  const remainingExpenses = allowedExpenses - expenses;

  const expenseProgress =
    allowedExpenses > 0 ? (expenses / allowedExpenses) * 100 : 0;

  const savingsProgress =
    recommendedSavings > 0 ? (savings / recommendedSavings) * 100 : 0;

  const investmentProgress =
    recommendedInvestment > 0 ? (investment / recommendedInvestment) * 100 : 0;

  return {
    income,
    expenses,

    savings,
    investment,

    savingsWithdrawals,
    investmentWithdrawals,

    allowedExpenses,
    remainingExpenses,

    recommendedSavings,
    recommendedInvestment,

    expenseProgress,
    savingsProgress,
    investmentProgress,
  };
};
