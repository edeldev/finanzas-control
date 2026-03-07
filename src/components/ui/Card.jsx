export const Card = ({ children, className }) => {
  return (
    <div
      className={`bg-white border border-neutral-200 rounded-2xl shadow-sm p-6 ${className}`}
    >
      {children}
    </div>
  );
};
