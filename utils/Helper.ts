export const hexToRgba = (hex: string, opacity: number): string => {
  // Remove the hash at the start if it's there
  hex = hex.replace(/^#/, "");

  // Parse shorthand hex (#abc → #aabbcc)
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((x) => x + x)
      .join("");
  }

  // Convert to integer values
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export const getFinalPercentageChange = (values: number[]): any => {
  if (values.length < 2 || values[0] === 0) return "undefined";

  const first = values[0];
  const last = values[values.length - 1];
  const change = ((last - first) / first) * 100;

  const sign = change >= 0 ? "+" : "";
  return {
    isPositive: sign === "+",
    value: `${sign}${change.toFixed(2).replace(".", ",")}%`,
  };
};

export const getDateRange = () => {
  const now = new Date();
  const to = now.toISOString().split("T")[0];

  const past = new Date();
  past.setDate(now.getDate() - 7);
  const from = past.toISOString().split("T")[0];

  return { from, to };
};
