import { initializePage } from "./setup-page.js";
import { initializeHeader } from "./header.js";
import { redirect, ROUTES } from "./routes.js";
import { $fetch } from "./fetch.js";
import { getUsernameFromParam } from "./params.js";
import { renderSnippets } from "./snippet-section.js";

await initializePage({
  onReady: async (user) => {
    initializeHeader(user);

    const username = getUsernameFromParam();
    if (!username && !user) {
      redirect(ROUTES.HOME);
      return;
    }

    const currentUser = username || user.username;
    await renderUserInfo(currentUser, user.id);
    await loadUserSnippets(currentUser);
  },
});

async function renderUserInfo(username, currentUserId) {
  const { hasError, data: userProfile } = await $fetch(
    `/users/${encodeURIComponent(username)}`,
  );

  if (hasError) {
    redirect(ROUTES.HOME);
    return;
  }

  const elements = {
    username: document.querySelector("#user-username"),
    bio: document.querySelector("#user-bio"),
    joinedDate: document.querySelector("#user-joined-date"),
  };

  elements.username.textContent = userProfile.username;
  elements.bio.textContent = userProfile.bio || "Sin biografía";

  const formattedDate = new Intl.DateTimeFormat("es-ES", {
    year: "numeric",
    month: "long",
  }).format(new Date(userProfile.created_at));

  elements.joinedDate.textContent = `Se unió el ${formattedDate}`;

  if (userProfile.id === currentUserId) {
    const editProfileBtn = document.querySelector("#edit-profile-btn");
    editProfileBtn.removeAttribute("hidden");
  }
}

async function loadUserSnippets(username) {
  const errorState = document.querySelector("#error-state");
  const emptyState = document.querySelector("#empty-state");

  const { hasError, data } = await $fetch(`/users/${username}/snippets`);
  if (hasError) {
    errorState.removeAttribute("hidden");

    document.querySelector("#retry-btn").addEventListener("click", () => {
      window.location.reload();
    });

    return;
  }

  if (!data || data.length === 0) {
    emptyState.removeAttribute("hidden");
    return;
  }

  renderSnippets(data);
}
