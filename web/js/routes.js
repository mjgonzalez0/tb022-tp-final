export const ROUTES = {
  LOGIN: "login.html",
  SNIPPET: (id) => `/snippets.html?id=${encodeURIComponent(id)}`,
  HOME: "index.html",
  NEW_SNIPPET: "/new-snippet",
};

export function redirect(to) {
  window.location = to;
}
