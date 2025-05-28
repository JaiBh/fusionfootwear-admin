import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isAdmin(userId: string) {
  if (userId === process.env.ADMIN_USERID) {
    return true;
  }
}

export const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});
