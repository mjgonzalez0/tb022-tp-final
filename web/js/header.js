import { ROUTES } from "./routes.js";
import { deleteAccessToken } from "./token.js";

export function initializeHeader(user) {
  const header = document.createElement("header");

  header.innerHTML = /* html */`
    <nav class="container">
      <a href="/" class="logo">Snippets</a>

      <div>
        ${user
      ? `
            <a href=${ROUTES.PROFILE} type="button" class="button is-ghost">Perfil</a>
            <button type="button" class="button" id="logout-btn">Cerrar sesión</button>
          `
      : `<a href=${ROUTES.LOGIN} class="button is-ghost">Iniciar sesión</a>`
    }
      </div>
    </nav>
  `;

  document.body.insertAdjacentElement("afterbegin", header);

  if (!user) {
    return;
  }

  const logoutBtn = document.querySelector("#logout-btn");
  logoutBtn.addEventListener("click", async () => {
    deleteAccessToken();
    window.location = ROUTES.LOGIN;
  }, { once: true });
}
