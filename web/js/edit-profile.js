import { initializePage } from "./setup-page.js";
import { initializeHeader } from "./header.js";
import { getAccessToken } from "./token.js";
import { API_URL } from "./constants.js";
import { redirect, ROUTES } from "./routes.js";

await initializePage({
  requiresAuth: true,
  onReady: async (user) => {
    initializeHeader(user);

    const form = document.querySelector("#profile-form");
    const fields = {
      username: document.querySelector("#username"),
      bio: document.querySelector("#bio"),
    };

    fields.username.value = user.data.username;
    fields.bio.value = user.data.bio;

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = new FormData(form);
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
  },
});
