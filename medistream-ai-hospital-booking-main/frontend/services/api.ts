const BASE_URL =
  import.meta.env.VITE_BACKEND_URL ??
  "https://medistream-ai-hospital-booking.onrender.com";

export async function apiFetch<T = any>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("access_token");

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    let message = "Request failed";
    try {
      const err = await res.json();
      message = err.detail || message;
    } catch {}

    throw new Error(message);
  }

  return res.json();
}