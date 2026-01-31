export const ROUTES = {
  LOGIN: "/login.html",
  SNIPPET: (id) => `/snippets.html?id=${encodeURIComponent(id)}`,
  EDIT_SNIPPET: (id) => `/editar-snippet.html?id=${encodeURIComponent(id)}`,
  HOME: "index.html",
  PROFILE: "/perfil.html",
  NEW_SNIPPET: "/crear-snippet.html",
  EDIT_COMMENT: (id) => `/editar-comentario.html?id=${encodeURIComponent(id)}`,
  USER_PROFILE: (username) =>
    `/perfil.html?username=${encodeURIComponent(username)}`,
  EDIT_PROFILE: "/editar-perfil.html",
};

export function redirect(to) {
  window.location = to;
}
