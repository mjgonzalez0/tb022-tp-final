import { initializePage } from "./setup-page.js";
import { initializeHeader } from "./header.js";
import { API_URL } from "./constants.js";
import { renderSnippets } from "./snippet-section.js";
import { ROUTES } from "./routes.js";
import { getRelativeTimeString } from "./date.js";
import { $fetch } from "./fetch.js";

await initializePage({
  onReady: async (user) => {
    initializeHeader(user);

    const selectOrderEl = document.querySelector("#results-order");
    const emptyState = document.querySelector("#empty-state");
    const errorState = document.querySelector("#error-state");

    let snippetsData = [];

    selectOrderEl.addEventListener("change", (event) => {
      let sortedData = [...snippetsData];
      switch (event.target.value) {
        case "newest":
          sortedData.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at),
          );
          break;
        case "oldest":
          sortedData.sort(
            (a, b) => new Date(a.created_at) - new Date(b.created_at),
          );
          break;
      }

      renderSnippets(sortedData);
    });

    const { hasError, data } = await $fetch("/snippets");
    if (hasError) {
      errorState.removeAttribute("hidden");

      document.querySelector("#retry-btn").addEventListener("click", () => {
        window.location.reload();
      });

      return;
    }

    if (data.length === 0) {
      emptyState.removeAttribute("hidden");
      return;
    }

    snippetsData = data;
    renderSnippets(data);
  },
});
