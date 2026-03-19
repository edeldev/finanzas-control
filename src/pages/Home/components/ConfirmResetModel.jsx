import { motion, AnimatePresence } from "framer-motion";

export const ConfirmResetModal = ({ open, onClose, onConfirm, loading }) => {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 px-4"
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ duration: 0.25 }}
          >
            <div
              className="w-full max-w-md rounded-3xl bg-white shadow-2xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-red-100 mb-4">
                <span className="text-2xl">⚠️</span>
              </div>

              <h2 className="text-xl font-bold text-slate-800">
                Eliminar todos los datos
              </h2>

              <p className="text-slate-500 mt-2 text-sm leading-relaxed">
                Esta acción eliminará todas tus transacciones, configuraciones y
                no se puede deshacer.
              </p>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={onClose}
                  className="cursor-pointer flex-1 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
                >
                  Cancelar
                </button>

                <button
                  onClick={onConfirm}
                  className={`flex-1 py-2 rounded-xl bg-red-500 text-white transition shadow ${
                    loading
                      ? "opacity-60 cursor-not-allowed"
                      : "hover:bg-red-600 cursor-pointer"
                  }`}
                  disabled={loading}
                >
                  {loading ? "Eliminando..." : "Eliminar"}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
