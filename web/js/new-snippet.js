import {
  initializeCodeEditor,
  loadLanguageConfig,
  resetCodeEditor,
  getCodeEditorValue,
} from "./editor.js";
import { initializeHeader } from "./header.js";
import { redirect, ROUTES } from "./routes.js";
import { initializePage } from "./setup-page.js";
import { $fetch } from "./fetch.js";

await initializePage({
  requiresAuth: true,
  onReady: async (user) => {
    const editor = document.querySelector("#editor");
    const form = document.querySelector("#new-snippet");
    const runtimeSelect = document.querySelector("#runtime");

    initializeHeader(user);
    initializeCodeEditor(editor);

    runtimeSelect.addEventListener("change", async (event) => {
      const runtime = event.target.value;
      await loadLanguageConfig(runtime);
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = new FormData(event.target);

      const { hasError, data: snippet } = await $fetch("/snippets", {
        method: "POST",
        body: {
          title: formData.get("title"),
          code: getCodeEditorValue(),
          visibility: formData.has("visibility"),
          runtime: formData.get("runtime"),
        },
      });

      if (hasError) {
        console.error("HUBO UN ERROR");
        return;
      }

      form.reset();
      resetCodeEditor();
      redirect(ROUTES.SNIPPET(snippet.id));
    });
  },
});
