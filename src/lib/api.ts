import axios from "axios";
import type { Analytics, ShortUrl } from "./types";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

export async function listUrls(): Promise<ShortUrl[]> {
  const { data } = await api.get<{ data: ShortUrl[] }>("/");
  return data.data;
}

export async function createUrl(url: string): Promise<ShortUrl> {
  const { data } = await api.post<{ data: ShortUrl }>("/api/urls", { url });
  return data.data;
}

export async function getAnalytics(code: string): Promise<Analytics> {
  const { data } = await api.get<{ data: Analytics }>(`/api/analytics/${code}`);
  return data.data;
}

export async function simulateClick(code: string): Promise<void> {
  await api.post(`/api/analytics/${code}`);
}

export function shortUrlFor(code: string): string {
  const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:2000";

  return `${backendUrl}/${code}`;
}
