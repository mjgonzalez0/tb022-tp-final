import { initializePage } from "./setup-page.js";
import { initializeHeader } from "./header.js";
import { API_URL } from "./constants.js";
import { ROUTES } from "./routes.js";
import { getRelativeTimeString } from "./date.js";

await initializePage({
  onReady: async (user) => {
    initializeHeader(user);

    const selectOrderEl = document.querySelector("#results-order");
    const emptyState = document.getElementById("empty-state");

    let selectedOrder = selectOrderEl.value;

    selectOrderEl.addEventListener("change", (e) => {
      if (e.target.value === selectOrderEl) {
        return;
      }

      // TODO: modificar orden.
    });

    const { error, data } = await getSnippets();
    if (error) {
      return;
    }

    if (data.length === 0) {
      emptyState.removeAttribute("hidden");
      return;
    }

    renderSnippets(data);
  },
});

async function getSnippets() {
  try {
    const response = await fetch(`${API_URL}/snippets`);
    if (!response.ok) {
      throw new Error("");
    }

    const snippets = await response.json();
    return { error: null, data: snippets.data };
  } catch (e) {
    return { error: e.message, data: [] };
  }
}

function renderSnippets(snippets) {
  const container = document.querySelector("#snippets-list");

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
