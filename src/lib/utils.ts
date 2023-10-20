import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const handleInvalidMsg = (
  e: React.FormEvent<HTMLInputElement> | React.FormEvent<HTMLTextAreaElement>,
  msg: string = "This field is required"
) => {
  (e.target as EventTarget & HTMLInputElement).setCustomValidity(msg);
};

export const getFormatedDate = (date: Date) => {
  return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
};
