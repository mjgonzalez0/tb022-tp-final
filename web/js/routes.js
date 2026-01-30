export const ROUTES = {
  LOGIN: "login.html",
  SNIPPET: (id) => `/snippets.html?id=${encodeURIComponent(id)}`,
  EDIT_SNIPPET: (id) => `/edit-snippet.html?id=${encodeURIComponent(id)}`,
  HOME: "index.html",
  NEW_SNIPPET: "/new-snippet.html",
  PROFILE: "/perfil.html",
  EDIT_COMMENT: (id) => `/editar-comentario.html?id=${encodeURIComponent(id)}`,
  USER_PROFILE: (username) =>
    `/perfil.html?username=${encodeURIComponent(username)}`,
};

export function redirect(to) {
  window.location = to;
}
