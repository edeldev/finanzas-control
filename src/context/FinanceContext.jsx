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
    setTransactions((prev) => [
      ...prev,
      { ...transaction, id: crypto.randomUUID() },
    ]);
  };

  const editTransaction = (id, updatedTransaction) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updatedTransaction } : t)),
    );
  };

  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
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
