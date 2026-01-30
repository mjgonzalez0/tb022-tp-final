import { initializePage } from "./setup-page.js";
import { initializeHeader } from "./header.js";
import { redirect, ROUTES } from "./routes.js";
import {
  getCodeEditorValue,
  initializeCodeEditor,
  loadLanguageConfig,
  resetCodeEditor,
  setEditorValue,
} from "./editor.js";
import { $fetch } from "./fetch.js";
import { getIdFromParam } from "./params.js";

await initializePage({
  requiresAuth: true,
  onReady: async (user) => {
    initializeHeader(user);

    const snippetId = getIdFromParam();
    if (!snippetId) {
      redirect(ROUTES.HOME);
      return;
    }

    const { hasError, data: snippet } = await $fetch(`/snippets/${snippetId}`);
    if (hasError || !snippet || snippet.user_id !== user.id) {
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
    fields.visibility.checked = snippet.is_public;

    await initializeCodeEditor(fields.editorParent);
    await loadLanguageConfig(snippet.runtime);
    setEditorValue(snippet.code);

    const form = document.querySelector("#edit-snippet");
    const deleteBtn = document.querySelector("#delete-snippet-btn");

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = new FormData(form);

      const { hasError } = await $fetch(`/snippets/${snippetId}`, {
        method: "PUT",
        body: {
          title: formData.get("title"),
          runtime: formData.get("runtime"),
          code: getCodeEditorValue(),
          visibility: formData.has("visibility"),
        },
      });

      if (hasError) {
        console.log("HUBO UN ERROR");
        return;
      }

      form.reset();
      resetCodeEditor();
      redirect(ROUTES.SNIPPET(snippetId));
    });

    deleteBtn.addEventListener("click", async () => {
      const { hasError } = await $fetch(`/snippets/${snippetId}`, {
        method: "DELETE",
      });

      if (!hasError) {
        redirect(ROUTES.HOME);
      }
    });
  },
});
