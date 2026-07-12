// src/cms/load.ts
import { cms } from "@shared/state/cms";

const API = import.meta.env.VITE_API_BASE_URL;

export async function ensureCMSLoaded() {
  if (cms.ready) return;

  const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/data`);
  cms.data = await res.json();
  cms.ready = true;
}