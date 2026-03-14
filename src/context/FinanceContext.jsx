import { createContext, useContext, useEffect, useState } from "react";

const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [budget, setBudget] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("finance");

    if (saved) {
      const data = JSON.parse(saved);
      setTransactions(data.transactions || []);
      setBudget(data.budget || 0);
    }

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    localStorage.setItem(
      "finance",
      JSON.stringify({
        transactions,
        budget,
      }),
    );
  }, [transactions, budget, isLoaded]);

  const addTransaction = (transaction) => {
    const internalIncomeCategories = new Set([
      "investmentIncome",
      "savingsIncome",
    ]);

    const now = new Date().toISOString();

    if (
      transaction.type === "income" &&
      !internalIncomeCategories.has(transaction.category)
    ) {
      const amount = Number(transaction.amount);

      const savingsAmount = amount * 0.2;
      const investmentAmount = amount * 0.5;

      const groupId = crypto.randomUUID();

      const incomeTransaction = {
        ...transaction,
        id: crypto.randomUUID(),
        groupId,
        date: now,
      };

      const savingsTransaction = {
        id: crypto.randomUUID(),
        groupId,
        text: `Ahorro`,
        amount: savingsAmount,
        type: "expense",
        category: "savingsExpense",
        automatic: true,
        date: now,
      };

      const investmentTransaction = {
        id: crypto.randomUUID(),
        groupId,
        text: `Inversión`,
        amount: investmentAmount,
        type: "expense",
        category: "investmentExpense",
        automatic: true,
        date: now,
      };

      setTransactions((prev) => [
        ...prev,
        incomeTransaction,
        savingsTransaction,
        investmentTransaction,
      ]);

      return;
    }

    if (
      transaction.type === "income" &&
      transaction.category === "savingsIncome"
    ) {
      setTransactions((prev) => [
        ...prev,
        {
          ...transaction,
          id: crypto.randomUUID(),
          type: "income",
          category: "savingsIncome",
          date: now,
        },
      ]);
      return;
    }

    if (
      transaction.type === "income" &&
      transaction.category === "investmentIncome"
    ) {
      setTransactions((prev) => [
        ...prev,
        {
          ...transaction,
          id: crypto.randomUUID(),
          type: "income",
          category: "investmentIncome",
          date: now,
        },
      ]);
      return;
    }

    setTransactions((prev) => [
      ...prev,
      {
        ...transaction,
        id: crypto.randomUUID(),
        date: transaction.date || now,
      },
    ]);
  };

  const editTransaction = (id, updatedTransaction) => {
    setTransactions((prev) => {
      const target = prev.find((t) => t.id === id);

      if (!target) return prev;

      if (!target.groupId || target.automatic) {
        return prev.map((t) =>
          t.id === id ? { ...t, ...updatedTransaction } : t,
        );
      }

      const amount = Number(updatedTransaction.amount) || 0;

      const savingsAmount = amount * 0.2;
      const investmentAmount = amount * 0.5;

      return prev.map((t) => {
        if (t.groupId !== target.groupId) return t;

        if (t.id === id) {
          return {
            ...t,
            ...updatedTransaction,
          };
        }

        if (t.category === "savingsExpense") {
          return {
            ...t,
            amount: savingsAmount,
            text: `Ahorro • ${updatedTransaction.text}`,
          };
        }

        if (t.category === "investmentExpense") {
          return {
            ...t,
            amount: investmentAmount,
            text: `Inversión • ${updatedTransaction.text}`,
          };
        }

        return t;
      });
    });
  };

  const deleteTransaction = (id) => {
    setTransactions((prev) => {
      const target = prev.find((t) => t.id === id);

      if (!target) return prev;

      if (!target.groupId) {
        return prev.filter((t) => t.id !== id);
      }

      return prev.filter((t) => t.groupId !== target.groupId);
    });
  };

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        budget,
        setBudget,
        addTransaction,
        editTransaction,
        deleteTransaction,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => useContext(FinanceContext);
