import { API_URL } from "./constants.js";
import { getAccessToken } from "./token.js";

export async function $fetch(url, opts = {}) {
  const { body, method = "GET" } = opts;
  const headers = new Headers({
    Accept: "application/json",
  });

  if (url.startsWith("/")) {
    url = url.substring(1);
  }

  const accessToken = getAccessToken();
  if (accessToken) {
    headers.append("Authorization", `Bearer ${accessToken}`);
  }

  let _data;
  if (typeof body === "object") {
    _data = JSON.stringify(body);
    headers.append("Content-Type", "application/json");
  }

  try {
    const response = await fetch(`${API_URL}/${url}`, {
      headers,
      body: _data,
      method,
    });

    if (!response.ok) {
      return { data: null, hasError: true, statusCode: response.status };
    }

    if (response.status === 204) {
      return { data: null, hasError: false };
    }

    const jsonData = await response.json();
    return { data: jsonData.data, hasError: false };
  } catch (_) {
    return { data: null, hasError: true };
  }
}
