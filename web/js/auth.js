import { API_URL } from "./constants.js";
import { getAccessToken } from "./token.js";

export async function getCurrentUser() {
  const accessToken = getAccessToken();
  if (!accessToken) {
    return null;
  }

  try {
    const response = await fetch(`${API_URL}/users`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      }
    });

    if (!response.ok) {
      // Error de conexión o token invalido.
      return null;
    }

    return await response.json();
  } catch (_) {
    return null;
  }
}
