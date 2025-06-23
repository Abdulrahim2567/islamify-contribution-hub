
export function formatCurrency(amount: number): string {
  return amount.toLocaleString() + " XAF";
}

export const getNowString = () => {
  const d = new Date();
  return d.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
};