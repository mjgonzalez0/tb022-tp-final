import { API_URL } from "./constants.js";
import {
  initializeCodeEditor,
  loadLanguageConfig,
  resetCodeEditor,
  getCodeEditorValue,
} from "./editor.js";
import { initializeHeader } from "./header.js";
import { redirect, ROUTES } from "./routes.js";
import { initializePage } from "./setup-page.js";
import { getAccessToken } from "./token.js";

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
      const accessToken = getAccessToken();

      try {
        const response = await fetch(`${API_URL}/snippets`, {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            title: formData.get("title"),
            code: getCodeEditorValue(),
            visibility: formData.has("visibility"),
            runtime: formData.get("runtime"),
          })
        });

        if (!response.ok) {
          return;
        }

        const { data } = await response.json();
        const snippetId = data.id;

        form.reset();
        resetCodeEditor();

        redirect(ROUTES.SNIPPET(snippetId));
      } catch (e) {
        console.error(`HUBO UN ERROR: msg=${e.message}`);
      }
    });
  }
});
