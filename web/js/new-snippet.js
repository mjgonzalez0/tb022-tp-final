import {
  initializeCodeEditor,
  loadLanguageConfig,
  resetCodeEditor,
  getCodeEditorValue,
} from "./editor.js";

initializeCodeEditor(
  document.querySelector("#editor"),
);

const form = document.querySelector("#new-snippet");
const runtimeSelect = document.querySelector("#runtime");

runtimeSelect.addEventListener("change", async (event) => {
  const runtime = event.target.value;
  await loadLanguageConfig(runtime);
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(event.target)
  const snippet = {
    title: formData.get("title"),
    code: getCodeEditorValue(),
    visibility: formData.has("visibility"),
    runtime: formData.get("runtime"),
  };

  form.reset();
  resetCodeEditor();
});
