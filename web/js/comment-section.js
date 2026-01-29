import { API_URL } from "./constants.js";
import { getRelativeTimeString } from "./date.js";
import { ROUTES } from "./routes.js";

export async function renderComments(id, target, user) {
  const comments = await getComments(id);

  target.innerHTML = "";

  if (!comments || comments.length < 1) {
    return;
  }

  comments.forEach((comment) => {
    const item = document.createElement("li");
    const isOwner = user.id === comment.user_id;
    const creationDate = getRelativeTimeString(new Date(comment.created_at));
    const lastModification = getRelativeTimeString(
      new Date(comment.updated_at),
    );
    const href = ROUTES.EDIT_COMMENT(id);

    item.innerHTML = /* html */ `
        <article class="comment">
            <div class="u-flex-vertical u-gap-8">
                <div class="comment-header">
                    <a href="${ROUTES.USER_PROFILE(comment.username)}" class="u-color-text-success">@${comment.username}</a>
                    <span class="u-color-text-offline">${creationDate} ${comment.updated_at ? `(Editado ${lastModification})` : ""}</span>
                </div>

                <p class="text">${comment.content}</p>
            </div>

             ${
               isOwner
                 ? /*html */ `
                 <a href="${href}" class="button is-only-icon is-secondary" aria-label="Editar comentario">
                         <span class="icon-pencil-alt" aria-hidden="true"></span>
                </a>`
                 : ""
             }
        </article>
      `;

    target.insertAdjacentElement("beforeend", item);
  });
}

export async function getComments(id) {
  try {
    const response = await fetch(`${API_URL}/snippets/${id}/comments`);

    if (!response.ok) {
      return null;
    }

    return response.json().then((c) => c.data);
  } catch (_) {
    return null;
  }
}
