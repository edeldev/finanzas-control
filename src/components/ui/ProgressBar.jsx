export const ProgressBar = ({ value, type = "goal" }) => {
  let color = "bg-green-500";

  if (type === "expense") {
    if (value > 100) color = "bg-red-500";
    else if (value > 70) color = "bg-yellow-500";
  }

  if (type === "goal") {
    if (value < 50) color = "bg-red-400";
    else if (value < 100) color = "bg-yellow-500";
    else color = "bg-green-500";
  }

  return (
    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
      <div
        className={`${color} h-full transition-all duration-500`}
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
  );
};
