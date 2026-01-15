import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getProgressColor = (
  percentage: number,
  type: "bar" | "card" = "bar"
) => {
  if (percentage >= 90)
    return type == "bar" ? "bg-green-500" : "border-green-200 bg-green-50";
  if (percentage >= 70)
    return type == "bar" ? "bg-yellow-500" : "border-yellow-200 bg-yellow-50";
  return type == "bar" ? "bg-red-500" : "border-red-300 bg-red-50";
};

export const calculatePercentage = (amount: number, total: number) => {
  return total > 0 ? Math.round((amount / total) * 100) : 0;
};
