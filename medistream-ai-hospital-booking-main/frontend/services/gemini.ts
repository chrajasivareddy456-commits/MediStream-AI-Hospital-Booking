import { apiFetch } from "./api";

export async function analyzeSymptoms(symptoms: string) {
  return apiFetch("/api/analyze", {
    method: "POST",
    body: JSON.stringify({ symptoms }),
  });
}
