import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getProjectImages(project) {
  if (!project) return [];
  const rawList = Array.isArray(project.images) ? project.images : [];
  const cleaned = rawList
    .map((item) => (typeof item === "string" ? item.trim() : String(item?.url || "").trim()))
    .filter(Boolean);
  if (cleaned.length > 0) {
    return cleaned;
  }
  const single = typeof project.image === "string" ? project.image.trim() : "";
  return single ? [single] : [];
}
