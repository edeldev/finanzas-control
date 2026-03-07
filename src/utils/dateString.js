export const getDateString = (date) => {
  return new Date(date).toISOString().slice(0, 10);
};
