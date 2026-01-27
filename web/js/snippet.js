import { initializePage } from "./setup-page.js";
import { initializeHeader } from "./header.js";
import { redirect, ROUTES } from "./routes.js";
import { API_URL } from "./constants.js";

import { codeToHtml } from "https://esm.sh/shiki@3.0.0";

await initializePage({
  onReady: async (user) => {
    initializeHeader(user);

    const snippetId = getSnippetId();
    if (!snippetId) {
      redirect(ROUTES.HOME);
      return;
    }

    const snippet = await getSnippetById(snippetId);
    if (!snippet) {
      redirect(ROUTES.HOME);
      return;
    }

    const titleEl = document.querySelector("#snippet_title");
    const authorEl = document.querySelector("#snippet_author");
    const dateEl = document.querySelector("#snippet_creation_date");
    const runtimeEl = document.querySelector("#snippet_runtime");
    const actionsEl = document.querySelector("#actions");
    const codeEl = document.querySelector("#snippet_code");
    const editBtnEl = document.querySelector("#edit-snippet");

    titleEl.innerHTML = snippet.title;
    authorEl.innerHTML = snippet.username;
    dateEl.innerHTML = new Intl.DateTimeFormat("es", {
      dateStyle: "full",
    }).format(new Date(snippet.created_at));
    runtimeEl.innerHTML = snippet.runtime;

    if (user.data.id !== snippet.user_id) {
      actionsEl.remove();
    } else {
      const route = ROUTES.EDIT_SNIPPET(snippetId);
      editBtnEl.setAttribute("href", route);
    }

    codeEl.innerHTML = await codeToHtml(snippet.code, {
      lang: snippet.runtime,
      theme: "kanagawa-dragon",
    });
  },
});

function getSnippetId() {
  const params = new URLSearchParams(window.location.search);

  const value = params.get("id");
  if (!value) {
    return null;
  }

  const parsed = Number.parseInt(value);
  return Number.isNaN(parsed) ? null : parsed;
}

async function getSnippetById(id) {
  const res = await fetch(`${API_URL}/snippets/${id}`);

  if (!res.ok) {
    return null;
  }

  return res
    .json()
    .then((c) => c.data)
    .catch(() => null);
}
