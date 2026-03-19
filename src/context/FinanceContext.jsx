import { createContext, useContext, useEffect, useState } from "react";
import { getExpenseBalance } from "../utils/expenseBalance";

const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [budget, setBudget] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [rule, setRule] = useState({
    investment: 50,
    expenses: 30,
    savings: 20,
  });

  useEffect(() => {
    const saved = localStorage.getItem("finance");
    const userConfig = localStorage.getItem("userConfig");

    if (saved) {
      const data = JSON.parse(saved);
      setTransactions(data.transactions || []);
      setBudget(data.budget || 0);
    }

    if (userConfig) {
      const parsed = JSON.parse(userConfig);
      if (parsed.rule) setRule(parsed.rule);
    }

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    localStorage.setItem("finance", JSON.stringify({ transactions, budget }));
  }, [transactions, budget, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;

    const userConfig = JSON.parse(localStorage.getItem("userConfig")) || {};

    localStorage.setItem("userConfig", JSON.stringify({ ...userConfig, rule }));
  }, [rule, isLoaded]);

  const getBalance = (list, type) => {
    return list.reduce((acc, t) => {
      if (t.category === `${type}Expense`) {
        return t.automatic ? acc + t.amount : acc - t.amount;
      }
      if (t.category === `${type}Income`) {
        return acc + t.amount;
      }
      return acc;
    }, 0);
  };

  const changeRule = (newRule) => {
    setTransactions((prev) => {
      const groups = {};

      prev.forEach((t) => {
        if (!t.groupId) return;
        if (!groups[t.groupId]) groups[t.groupId] = [];
        groups[t.groupId].push(t);
      });

      const baseByGroup = {};

      Object.keys(groups).forEach((groupId) => {
        const incomeTx = groups[groupId].find(
          (t) => t.type === "income" && !t.automatic,
        );

        if (incomeTx) {
          baseByGroup[groupId] = Number(incomeTx.amount) || 0;
        }
      });

      return prev.map((t) => {
        if (!t.groupId) return t;

        const baseAmount = baseByGroup[t.groupId];
        if (baseAmount === undefined) return t;

        if (t.category === "savingsExpense" && t.automatic) {
          return {
            ...t,
            amount: baseAmount * (newRule.savings / 100),
          };
        }

        if (t.category === "investmentExpense" && t.automatic) {
          return {
            ...t,
            amount: baseAmount * (newRule.investment / 100),
          };
        }

        return t;
      });
    });

    setRule(newRule);
  };

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

      const savingsAmount = amount * (rule.savings / 100);
      const investmentAmount = amount * (rule.investment / 100);

      const groupId = crypto.randomUUID();

      setTransactions((prev) => [
        ...prev,
        {
          ...transaction,
          id: crypto.randomUUID(),
          groupId,
          date: now,
        },
        {
          id: crypto.randomUUID(),
          groupId,
          text: "Ahorro",
          amount: savingsAmount,
          type: "expense",
          category: "savingsExpense",
          automatic: true,
          date: now,
        },
        {
          id: crypto.randomUUID(),
          groupId,
          text: "Inversión",
          amount: investmentAmount,
          type: "expense",
          category: "investmentExpense",
          automatic: true,
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
        date: now,
      },
    ]);
  };

  const editTransaction = (id, updatedTransaction) => {
    const target = transactions.find((t) => t.id === id);
    if (!target) return { success: false };

    const newAmount = Number(updatedTransaction.amount) || 0;

    if (target.category === "savingsExpense" && !target.automatic) {
      const filtered = transactions.filter((t) => t.id !== id);
      const available = getBalance(filtered, "savings");

      if (newAmount > available) {
        return { success: false, error: "No tienes suficiente ahorro" };
      }
    }

    if (target.category === "investmentExpense" && !target.automatic) {
      const filtered = transactions.filter((t) => t.id !== id);
      const available = getBalance(filtered, "investment");

      if (newAmount > available) {
        return { success: false, error: "No tienes suficiente inversión" };
      }
    }

    if (
      target.type === "expense" &&
      target.category !== "savingsExpense" &&
      target.category !== "investmentExpense"
    ) {
      const filtered = transactions.filter((t) => t.id !== id);
      const balance = getExpenseBalance(filtered);

      if (newAmount > balance) {
        return {
          success: false,
          error: "No tienes suficiente presupuesto",
        };
      }
    }

    setTransactions((prev) => {
      if (!target.groupId || target.automatic) {
        return prev.map((t) =>
          t.id === id ? { ...t, ...updatedTransaction } : t,
        );
      }

      const amount = newAmount;
      const savingsAmount = amount * (rule.savings / 100);
      const investmentAmount = amount * (rule.investment / 100);

      return prev.map((t) => {
        if (t.groupId !== target.groupId) return t;

        if (t.id === id) {
          return { ...t, ...updatedTransaction };
        }

        if (t.category === "savingsExpense" && t.automatic) {
          return {
            ...t,
            amount: savingsAmount,
            text: `Ahorro • ${updatedTransaction.text}`,
          };
        }

        if (t.category === "investmentExpense" && t.automatic) {
          return {
            ...t,
            amount: investmentAmount,
            text: `Inversión • ${updatedTransaction.text}`,
          };
        }

        return t;
      });
    });

    return { success: true };
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

  const resetAllData = () => {
    setTransactions([]);
    setBudget(0);

    localStorage.removeItem("finance");
    localStorage.removeItem("userConfig");

    window.location.reload();
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
        rule,
        changeRule,
        resetAllData,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => useContext(FinanceContext);
