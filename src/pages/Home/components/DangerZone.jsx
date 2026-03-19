import { useState } from "react";
import toast from "react-hot-toast";
import { useFinance } from "../../../context/FinanceContext";
import { ConfirmResetModal } from "./ConfirmResetModel";

export const DangerZone = () => {
  const { resetAllData } = useFinance();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = () => {
    if (loading) return;
    setLoading(true);

    toast.success("Datos eliminados");

    setTimeout(() => {
      resetAllData();
    }, 800);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="
          px-4 py-2 rounded-full text-sm font-medium
          text-red-500 bg-red-50
          hover:bg-red-100
          transition-all duration-200 cursor-pointer
        "
      >
        Reset
      </button>

      <ConfirmResetModal
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={handleConfirm}
        loading={loading}
      />
    </>
  );
};
