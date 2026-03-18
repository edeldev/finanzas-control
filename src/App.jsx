import { FinanceProvider } from "./context/FinanceContext";
import { BalanceCard } from "./components/dashboard/BalanceCard";
import { SummaryCards } from "./components/dashboard/SummaryCards";
import { AddTransaction } from "./components/transactions/AddTransaction";
import { TransactionList } from "./components/transactions/TransactionList";
import { FinancialHealthCard } from "./components/dashboard/FinancialHealthCard";
import { Toaster } from "react-hot-toast";

function App() {
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
        <main className="relative min-h-screen bg-linear-to-br from-slate-50 via-indigo-50 to-blue-100 py-12 px-6">
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]" />

          <div className="relative max-w-7xl mx-auto">
            <div className="mb-10">
              <h1 className="text-4xl font-bold text-slate-800">
                Finanzas Personales
              </h1>

              <p className="text-slate-500 mt-1">
                Controla tus ingresos y gastos
              </p>
            </div>

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
