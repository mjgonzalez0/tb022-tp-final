import { initializePage } from "./setup-page.js";
import { initializeHeader } from "./header.js";
import { redirect, ROUTES } from "./routes.js";
import { renderComments } from "./comment-section.js";
import { $fetch } from "./fetch.js";
import { getIdFromParam } from "./params.js";

import { codeToHtml } from "https://esm.sh/shiki@3.0.0";

await initializePage({
  onReady: async (user) => {
    initializeHeader(user);

    const snippetId = getIdFromParam();
    if (!snippetId) {
      redirect(ROUTES.HOME);
      return;
    }

    const { hasError, data: snippet } = await $fetch(`/snippets/${snippetId}`);
    if (hasError || !snippet) {
      redirect(ROUTES.HOME);
      return;
    }

    const commentsList = document.querySelector("#comments-list");
    const commentForm = document.querySelector("#comment-form");

    await renderComments(snippetId, commentsList, user);

    commentForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = new FormData(event.target);

      const { hasError } = await $fetch(`/snippets/${snippetId}/comments`, {
        method: "POST",
        body: {
          content: formData.get("content"),
        },
      });

      if (hasError) {
        console.error(`HUBO UN ERROR`);
        return;
      }

      commentForm.reset();
      await renderComments(snippetId, commentsList, user);
    });

    const editBtnEl = document.querySelector("#edit-snippet");
    const userProfileLink = document.querySelector("#user_profile_link");

    const elements = {
      title: document.querySelector("#snippet_title"),
      author: document.querySelector("#snippet_author"),
      date: document.querySelector("#snippet_creation_date"),
      runtime: document.querySelector("#snippet_runtime"),
      actions: document.querySelector("#actions"),
      code: document.querySelector("#snippet_code"),
    };

    const formattedDate = new Intl.DateTimeFormat("es", {
      dateStyle: "full",
    }).format(new Date(snippet.created_at));

    elements.title.textContent = snippet.title;
    elements.author.textContent = snippet.username;
    elements.date.textContent = formattedDate;
    elements.runtime.textContent = snippet.runtime;

    userProfileLink.setAttribute("href", ROUTES.USER_PROFILE(snippet.username));

    if (user?.id !== snippet.user_id) {
      elements.actions.remove();
    } else {
      const route = ROUTES.EDIT_SNIPPET(snippetId);
      editBtnEl.setAttribute("href", route);
    }

    elements.code.innerHTML = await codeToHtml(snippet.code, {
      lang: snippet.runtime,
      theme: "kanagawa-dragon",
    });
  },
});
