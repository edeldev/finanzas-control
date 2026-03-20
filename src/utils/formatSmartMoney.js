export const formatSmartMoney = (amount) => {
  const isCompact = amount >= 100000;

  const formatted = new Intl.NumberFormat("es-MX", {
    notation: isCompact ? "compact" : "standard",
    minimumFractionDigits: isCompact ? 0 : 2,
    maximumFractionDigits: isCompact ? 1 : 2,
  }).format(amount);

  return `$${formatted}`;
};
