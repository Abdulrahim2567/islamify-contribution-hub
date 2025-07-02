
export function formatCurrency(amount: number): string {
	if (amount >= 1_000_000_000) {
		return `${(amount / 1_000_000_000).toFixed(1).replace(/\.0$/, "")}B XAF`;
	} else if (amount >= 1_000_000) {
		return `${(amount / 1_000_000).toFixed(1).replace(/\.0$/, "")}M XAF`;
	} else {
		return `${amount.toLocaleString()} XAF`;
	}
}

export const getNowString = () => {
  const d = new Date();
  return d.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
};