import { initializePage } from "./setup-page.js";
import { initializeHeader } from "./header.js";
import { API_URL } from "./constants.js";
import { redirect, ROUTES } from "./routes.js";
import {
  getCodeEditorValue,
  initializeCodeEditor,
  loadLanguageConfig,
  resetCodeEditor,
  setEditorValue,
} from "./editor.js";
import { getAccessToken } from "./token.js";

await initializePage({
  requiresAuth: true,
  onReady: async (user) => {
    initializeHeader(user);

    const snippetId = getSnippetId();
    if (!snippetId) {
      redirect(ROUTES.HOME);
      return;
    }

    const snippet = await getSnippetById(snippetId);
    if (!snippet || snippet.user_id !== user.id) {
      redirect(ROUTES.HOME);
      return;
    }

    const fields = {
      title: document.querySelector("#title"),
      runtime: document.querySelector("#runtime"),
      visibility: document.querySelector("#visibility"),
      editorParent: document.querySelector("#editor"),
    };

    title.value = snippet.title;
    runtime.value = snippet.runtime;
    visibility.value = snippet.is_public;

    await initializeCodeEditor(fields.editorParent);
    await loadLanguageConfig(snippet.runtime);
    setEditorValue(snippet.code);

    const form = document.querySelector("#edit-snippet");
    const deleteBtn = document.querySelector("#delete-snippet-btn");

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = new FormData(form);
      const accessToken = getAccessToken();

      try {
        const response = await fetch(`${API_URL}/snippets/${snippetId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            title: formData.get("title"),
            runtime: formData.get("runtime"),
            code: getCodeEditorValue(),
            is_public: formData.has("visibility"),
          }),
        });

        if (!response.ok) {
          console.error(`HUBO UN ERROR: msg=${response.status}`);
          return;
        }

        form.reset();
        resetCodeEditor();

        const route = ROUTES.SNIPPET(snippetId);
        redirect(route);
      } catch (e) {
        console.error(`HUBO UN ERROR: msg=${e.message}`);
      }
    });

    deleteBtn.addEventListener("click", async () => {
      const accessToken = getAccessToken();

      try {
        const response = await fetch(`${API_URL}/snippets/${snippetId}`, {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          console.error(`HUBO UN ERROR: msg=${response.status}`);
          return;
        }

        const route = ROUTES.HOME;
        redirect(route);
      } catch (e) {
        console.error(`HUBO UN ERROR: msg=${e.message}`);
      }
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
  const accessToken = getAccessToken();
  const res = await fetch(`${API_URL}/snippets/${id}`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    }
  });

  if (!res.ok) {
    return null;
  }

  return res
    .json()
    .then((c) => c.data)
    .catch(() => null);
}
