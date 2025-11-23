const TOKEN_KEY = "_snippets_session";

export function saveAccessToken(token) {
 localStorage.setItem(TOKEN_KEY, token);
}

export function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function deleteAccessToken() {
  localStorage.removeItem(TOKEN_KEY);
}
