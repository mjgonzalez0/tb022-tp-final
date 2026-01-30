import { getRelativeTimeString } from "./date.js";
import { ROUTES } from "./routes.js";

export function renderSnippets(snippets, target = "#snippets-list") {
  const container = document.querySelector(target);
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
