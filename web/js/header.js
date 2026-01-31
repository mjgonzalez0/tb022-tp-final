import { ROUTES, redirect } from "./routes.js";
import { deleteAccessToken } from "./token.js";

export function initializeHeader(user) {
  const header = document.createElement("header");
  const hasUser = Object.keys(user).length !== 0

  header.innerHTML = /* html */`
    <nav class="container">
      <a href="/" class="heading-level-6 u-flex u-gap-4 u-cross-center">
          <img src="/assets/icon.png" alt="Snippets logo" width="24" height="24">
          Snippets
      </a>

      <div class="u-flex u-gap-12">
        ${hasUser
      ? `
            <a href=${ROUTES.PROFILE} type="button" class="button is-secondary">Perfil</a>
            <button type="button" class="button" id="logout-btn">Cerrar sesión</button>
          `
      : `<a href=${ROUTES.LOGIN} class="button">Iniciar sesión</a>`
    }
      </div>
    </nav>
  `;

  document.body.insertAdjacentElement("afterbegin", header);

  if (!hasUser) {
    return;
  }

  const logoutBtn = document.querySelector("#logout-btn");
  logoutBtn.addEventListener(
    "click",
    async () => {
      deleteAccessToken();
      redirect(ROUTES.LOGIN);
    },
    { once: true },
  );
}
