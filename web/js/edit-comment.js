import { initializePage } from "./setup-page.js";
import { initializeHeader } from "./header.js";
import { redirect, ROUTES } from "./routes.js";
import { getAccessToken } from "./token.js";
import { $fetch } from "./fetch.js";

await initializePage({
  requiresAuth: true,
  onReady: async (user) => {
    initializeHeader(user);

    const commentId = getCommentId();
    if (!commentId) {
      redirect(ROUTES.HOME);
      return;
    }

    const { hasError, data: comment } = await $fetch(`/comments/${commentId}`);
    if (hasError || !comment) {
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

      const { hasError } = await $fetch(`/comments/${commentId}`, {
        method: "PUT",
        body: {
          content: formData.get("content"),
        },
      });

      if (!hasError) {
        form.reset();
        const route = ROUTES.SNIPPET(snippetId);
        redirect(route);
      }
    });

    deleteCommentBtn.addEventListener("click", async () => {
      const { hasError } = await $fetch(`/comments/${commentId}`, {
        method: "DELETE",
      });

      if (!hasError) {
        const route = ROUTES.SNIPPET(snippetId);
        redirect(route);
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
