export const formatMoney = (value, currency = "$") => {
  const amount = Number(value ?? 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return `${currency}${amount}`;
};
