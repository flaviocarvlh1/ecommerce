// src/helpers/money.ts
export const formatCentsToEUR = (cents: number) => {
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
};
