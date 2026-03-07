import { FinanceProvider } from "./context/FinanceContext";
import { BalanceCard } from "./components/dashboard/BalanceCard";
import { SummaryCards } from "./components/dashboard/SummaryCards";
import { AddTransaction } from "./components/transactions/AddTransaction";
import { TransactionList } from "./components/transactions/TransactionList";

function App() {
  return (
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
              <BalanceCard />
              <SummaryCards />
              <AddTransaction />
            </div>

            <div className="lg:col-span-2 h-full">
              <TransactionList />
            </div>
          </div>
        </div>
      </main>
    </FinanceProvider>
  );
}

export default App;
