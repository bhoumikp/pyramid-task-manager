const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

export async function loginAsGuest() {
  const response = await fetch(`${API_URL}/auth/guest`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to login as guest");
  }

  return response.json();
}