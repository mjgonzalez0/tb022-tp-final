import { initializePage } from "./setup-page.js";
import { initializeHeader } from "./header.js";
import { API_URL } from "./constants.js";
import { redirect, ROUTES } from "./routes.js";
import { $fetch } from "./fetch.js";

await initializePage({
  requiresAuth: true,
  onReady: async (user) => {
    initializeHeader(user);

    const fields = {
      email: document.querySelector("#email"),
      username: document.querySelector("#username"),
      bio: document.querySelector("#bio"),
    };

    fields.username.value = user.username;
    fields.bio.value = user.bio;
    fields.email.value = user.email;

    document
      .querySelector("#profile-form")
      .addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);

        const { hasError } = await $fetch("/users", {
          method: "PATCH",
          body: {
            username: formData.get("username"),
            bio: formData.get("bio"),
          },
        });

        if (!hasError) {
          redirect(ROUTES.PROFILE);
        }
      });

    const dialog = document.querySelector("#confirmation-modal");
    const cancelBtn = document.querySelector("#cancel-btn");
    const openModalBtn = document.querySelector("#show-delete-modal");
    const deleteAccountForm = document.querySelector("#delete-account-form");

    deleteAccountForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = new FormData(event.target);

      const { hasError } = await $fetch("/users", {
        method: "DELETE",
        body: {
          password: formData.get("password"),
        },
      });

      if (hasError) {
        dialog.close();
        console.log("No se pudo borrar la cuenta.");
        accountDeletionForm.reset();
        return;
      }

      redirect(ROUTES.HOME);
    });

    openModalBtn.addEventListener("click", async () => {
      dialog.showModal();
    });

    cancelBtn.addEventListener("click", async () => {
      dialog.close();
    });
  },
});
