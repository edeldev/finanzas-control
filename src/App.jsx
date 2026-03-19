import { useEffect, useState } from "react";
import { FinanceProvider } from "./context/FinanceContext";
import { BalanceCard } from "./components/dashboard/BalanceCard";
import { SummaryCards } from "./components/dashboard/SummaryCards";
import { AddTransaction } from "./components/transactions/AddTransaction";
import { TransactionList } from "./components/transactions/TransactionList";
import { FinancialHealthCard } from "./components/dashboard/FinancialHealthCard";
import { Toaster } from "react-hot-toast";
import { Onboarding } from "./pages/Home/Onboarding";
import { MenuHeader } from "./components/Header/MenuHeader";

function App() {
  const [userConfig, setUserConfig] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("userConfig");
    if (saved) {
      setUserConfig(JSON.parse(saved));
    }
  }, []);

  if (!userConfig) {
    return <Onboarding onFinish={setUserConfig} />;
  }

  return (
    <>
      <Toaster
        position="top-right"
        gutter={8}
        containerStyle={{ top: 20, right: 20 }}
        toastOptions={{
          duration: 2500,
          style: {
            borderRadius: "16px",
            background: "rgba(17, 24, 39, 0.8)",
            color: "#fff",
            backdropFilter: "blur(10px)",
          },
        }}
      />

      <FinanceProvider>
        <main className="relative min-h-screen pb-12">
          <MenuHeader userConfig={userConfig} />
          <div className="relative max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="space-y-6 lg:sticky top-5 h-fit">
                <SummaryCards />
                <BalanceCard />
                <FinancialHealthCard />
              </div>

              <div className="lg:col-span-2 flex flex-col gap-6">
                <AddTransaction />
                <TransactionList />
              </div>
            </div>
          </div>
        </main>
      </FinanceProvider>
    </>
  );
}

export default App;
