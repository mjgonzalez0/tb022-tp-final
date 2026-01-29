export const ROUTES = {
  LOGIN: "login.html",
  SNIPPET: (id) => `/snippets.html?id=${encodeURIComponent(id)}`,
  EDIT_SNIPPET: (id) => `/edit-snippet.html?id=${encodeURIComponent(id)}`,
  HOME: "index.html",
  NEW_SNIPPET: "/new-snippet.html",
  PROFILE: "/profile.html"
};

export function redirect(to) {
  window.location = to;
}
