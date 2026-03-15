import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Função utilitária para combinar classes do Tailwind sem conflito
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
