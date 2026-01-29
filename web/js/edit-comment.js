import { initializePage } from "./setup-page.js";
import { initializeHeader } from "./header.js";
import { redirect, ROUTES } from "./routes.js";
import { getAccessToken } from "./token.js";
import { API_URL } from "./constants.js";

await initializePage({
  requiresAuth: true,
  onReady: async (user) => {
    initializeHeader(user.data);

    const commentId = getCommentId();
    if (!commentId) {
      redirect(ROUTES.HOME);
      return;
    }

    const comment = await getCommentById(commentId);
    if (!comment) {
      redirect(ROUTES.HOME);
      return;
    }

    const snippetId = comment.snippet_id;

    const form = document.querySelector("#comment-form");
    const deleteCommentBtn = document.querySelector("#delete-comment-btn");
    const fields = {
      content: document.querySelector("#content"),
    };

    fields.content.value = comment.content;

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = new FormData(event.target);
      const accessToken = getAccessToken();

      try {
        const response = await fetch(`${API_URL}/comments/${commentId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            content: formData.get("content"),
          }),
        });

        if (!response.ok) {
          return;
        }

        form.reset();
        const route = ROUTES.SNIPPET(snippetId);
        redirect(route);
      } catch (e) {
        console.error(`HUBO UN ERROR: msg=${e.message}`);
      }
    });

    deleteCommentBtn.addEventListener("click", async () => {
      const accessToken = getAccessToken();

      try {
        const response = await fetch(`${API_URL}/comments/${commentId}`, {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          return;
        }

        const route = ROUTES.SNIPPET(snippetId);
        redirect(route);
      } catch (e) {
        console.error(`HUBO UN ERROR: msg=${e.message}`);
      }
    });
  },
});

export function getCommentId() {
  const params = new URLSearchParams(window.location.search);

  const value = params.get("id");
  if (!value) {
    return null;
  }

  const parsed = Number.parseInt(value);
  return Number.isNaN(parsed) ? null : parsed;
}

export async function getCommentById(id) {
  const accessToken = getAccessToken();

  try {
    const response = await fetch(`${API_URL}/comments/${id}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    return response.json().then((c) => c.data);
  } catch (_) {
    return null;
  }
}
