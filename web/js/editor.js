import { autocompletion, closeBrackets } from "https://esm.sh/@codemirror/autocomplete";
import { indentOnInput, bracketMatching } from "https://esm.sh/@codemirror/language";
import { defaultKeymap, history, historyKeymap, indentWithTab } from "https://esm.sh/@codemirror/commands";

import { EditorView, lineNumbers, highlightActiveLine, keymap } from "https://esm.sh/@codemirror/view";
import { Compartment } from "https://esm.sh/@codemirror/state";
import { oneDark } from "https://esm.sh/@codemirror/theme-one-dark";

const DEFAULT_LANGUAGE = "markdown";

const LANGUAGES_PACKAGES = {
  javascript: {
    name: "@codemirror/lang-javascript",
    function: "javascript",
  },
  html: {
    name: "@codemirror/lang-html",
    function: "html"
  },
  css: {
    name: "@codemirror/lang-css",
    function: "css",
  },
  sql: {
    name: "@codemirror/lang-sql",
    function: "sql"
  },
  markdown: {
    name: "@codemirror/lang-markdown",
    function: "markdown",
  }
};

const EDITOR_THEME = EditorView.theme({
  "&": {
    backgroundColor: "var(--bulma-body-background-color)",
    border: "1px solid var(--bulma-border)",
    borderRadius: "var(--bulma-radius)",
    overflow: "hidden",
    minHeight: "var(--editor-min-height)"
  },
  ".cm-content": {
    padding: "0",
  },
  ".cm-gutters": {
    backgroundColor: "var(--bulma-body-background-color)",
    color: "#6c6c8c",
    borderRight: "1px solid var(--bulma-border)",
  },
  ".cm-activeLineGutter": {
    backgroundColor: "var(--bulma-body-background-color)"
  }
});

// Necesario para poder modificar el lenguaje dinámicamente.
// https://codemirror.net/docs/ref/#state.Compartment
// https://codemirror.net/examples/config/#dynamic-configuration
const languageConfig = new Compartment();
let editorView;

export async function initializeCodeEditor(parent) {
  const defaultLangModule = await loadLanguageModule(DEFAULT_LANGUAGE);

  editorView = new EditorView({
    extensions: [
      languageConfig.of(defaultLangModule ?? []),
      oneDark,
      EDITOR_THEME,
      lineNumbers(),
      highlightActiveLine(),
      indentOnInput(),
      bracketMatching(),
      autocompletion(),
      history(),
      closeBrackets(),

      keymap.of([
        ...defaultKeymap,
        ...historyKeymap,
        indentWithTab,
      ]),
    ],
    parent,
  });
}

async function loadLanguageModule(name) {
  const config = LANGUAGES_PACKAGES[name];
  if (config == null) {
    return null;
  }

  try {
    const module = await import(`https://esm.sh/${config.name}`);
    return module[config.function]();
  } catch (error) {
    console.error(
      `Ocurrió un error al cargar la configuración del lenguaje: ${name}`,
    );
    return null;
  }
}

export async function loadLanguageConfig(name) {
  const language = await loadLanguageModule(name);

  if (language && editorView) {
    editorView.dispatch({
      effects: languageConfig.reconfigure(language),
    });
  }
}

export function resetCodeEditor() {
  let transaction = editorView.state.update({
    changes: {
      from: 0,
      to: getCodeEditorValue().length,
      insert: "",
    }
  });

  editorView.dispatch(transaction);
}

export function getCodeEditorValue() {
  return editorView.state.doc.toString();
}

export function setEditorValue(value) {
  let transaction = editorView.state.update({
    changes: {
      from: 0,
      insert: value,
    }
  });

  editorView.dispatch(transaction);
}