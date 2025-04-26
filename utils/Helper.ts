import i18n from "@/i18n";

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

export const getFormattedDate = (datetime: number) => {
  const date = new Date(datetime * 1000);
  const now = new Date();

  const seconds = Math.floor((date.getTime() - now.getTime()) / 1000);

  const isFuture = seconds > 0;
  const absSeconds = Math.abs(seconds);

  const minutes = Math.floor(absSeconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30); // rough estimate
  const years = Math.floor(days / 365);

  let result = "";

  if (absSeconds < 60)
    result = `${absSeconds} ${i18n.t("time.second")}${
      absSeconds !== 1 ? "s" : ""
    }`;
  else if (minutes < 60)
    result = `${minutes} ${i18n.t("time.minute")}${minutes !== 1 ? "s" : ""}`;
  else if (hours < 24)
    result = `${hours} ${i18n.t("time.hour")}${hours !== 1 ? "s" : ""}`;
  else if (days < 7)
    result = `${days} ${i18n.t("time.day")}${days !== 1 ? "s" : ""}`;
  else if (weeks < 5)
    result = `${weeks} ${i18n.t("time.week")}${weeks !== 1 ? "s" : ""}`;
  else if (months < 12)
    result = `${months} ${i18n.t("time.month")}${months !== 1 ? "s" : ""}`;
  else result = `${years} ${i18n.t("time.year")}${years !== 1 ? "s" : ""}`;

  return isFuture
    ? `${i18n.t("time.in")} ${result}`
    : `${result} ${i18n.t("time.ago")}`;
};
