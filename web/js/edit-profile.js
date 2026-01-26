import { initializePage } from "./setup-page.js";
import { initializeHeader } from "./header.js";
import { getAccessToken } from "./token.js";
import { API_URL } from "./constants.js";
import { redirect, ROUTES } from "./routes.js";

await initializePage({
  requiresAuth: true,
  onReady: async (user) => {
    initializeHeader(user);

    const fields = {
      username: document.querySelector("#username"),
      bio: document.querySelector("#bio"),
    };

    fields.username.value = user.data.username;
    fields.bio.value = user.data.bio;

    document
      .querySelector("#profile-form")
      .addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const accessToken = getAccessToken();

        try {
          const response = await fetch(`${API_URL}/users`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              username: formData.get("username"),
              bio: formData.get("bio"),
            }),
          });

          if (!response.ok) {
            return;
          }

          redirect(ROUTES.PROFILE);
        } catch (e) {
          console.error(`HUBO UN ERROR: msg=${e.message}`);
        }
      });

    const dialog = document.querySelector("#confirmation-modal");
    const cancelBtn = document.querySelector("#cancel-btn");
    const openModalBtn = document.querySelector("#show-delete-modal");
    const deleteAccountForm = document.querySelector("#delete-account-form");

    deleteAccountForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = new FormData(event.target);
      const accessToken = getAccessToken();

      fetch(`${API_URL}/users`, {
        method: "DELETE",
        body: JSON.stringify({
          password: formData.get("password"),
        }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((res) => {
          if (!res.ok) {
            dialog.close();
            console.log("No se pudo borrar la cuenta.");
            accountDeletionForm.reset();
            return;
          }

          redirect(ROUTES.HOME);
        })
        .catch(() => {
          dialog.close();
          accountDeletionForm.reset();
          console.log("No se pudo borrar la cuenta.");
        });
    });

    openModalBtn.addEventListener("click", async () => {
      dialog.showModal();
    });

    cancelBtn.addEventListener("click", async () => {
      dialog.close();
    });
  },
});
