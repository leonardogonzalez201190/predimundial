import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const serialize = (obj: any) => JSON.parse(JSON.stringify(obj));

const pad = (n: number) => String(n).padStart(2, "0");

export const formatDateWithAmPm = (value: string | Date) => {
  const d = value instanceof Date ? value : new Date(value);

  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
  ];

  const day = pad(d.getDate());
  const monthName = months[d.getMonth()];
  const year = d.getFullYear();

  let hours = d.getHours(); // 0-23
  const minutes = pad(d.getMinutes());

  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours === 0 ? 12 : hours; // 0 => 12

  return `${day} ${monthName} ${pad(hours)}:${minutes} ${ampm}`;
};