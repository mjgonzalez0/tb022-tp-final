import { initializePage } from "./setup-page.js";
import { initializeHeader } from "./header.js";
import { API_URL } from "./constants.js";
import { ROUTES } from "./routes.js";
import { getRelativeTimeString } from "./date.js";

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

    const { error, data } = await getSnippets();
    if (error) {
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

async function getSnippets() {
  try {
    const response = await fetch(`${API_URL}/snippets`);
    if (!response.ok) {
      throw new Error("No se pudieron obtener resultados");
    }

    const snippets = await response.json();
    return { error: null, data: snippets.data };
  } catch (e) {
    return { error: e.message, data: [] };
  }
}

function renderSnippets(snippets) {
  const container = document.querySelector("#snippets-list");
  container.innerHTML = "";

  snippets.forEach((snippet) => {
    const item = document.createElement("li");
    const href = ROUTES.SNIPPET(snippet.id);
    const createdAt = getRelativeTimeString(new Date(snippet.created_at));

    item.innerHTML = /* html */ `
      <a href="${href}" class="snippet">
        <h2 class="heading-level-6">${snippet.title}</h2>
        <ul class="info">
            <li>
               <span class="icon-user" aria-hidden="true"></span>
               <span class="text">
                Creado por <span>${snippet.username}</span>
                </span>
            </li>

            <li>
                <span class="icon-clock" aria-hidden="true"></span>
                <span class="text">Publicado ${createdAt}</span>
            </li>

            <li>
                <span class="icon-filter" aria-hidden="true"></span>
                <span class="text">${snippet.runtime}</span>
            </li>
        </ul>
      </a>
    `;

    container.appendChild(item);
  });
}
