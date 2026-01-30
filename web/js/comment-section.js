import { getRelativeTimeString } from "./date.js";
import { ROUTES } from "./routes.js";
import { $fetch } from "./fetch.js";

export async function renderComments(id, target, user) {
  const { hasError, data: comments } = await $fetch(`/snippets/${id}/comments`);

  target.innerHTML = "";

  if (hasError || !comments || comments.length < 1) {
    return;
  }

  comments.forEach((comment) => {
    const item = document.createElement("li");
    const isOwner = user.id === comment.user_id;
    const creationDate = getRelativeTimeString(new Date(comment.created_at));
    const lastModification = getRelativeTimeString(
      new Date(comment.updated_at),
    );
    const href = ROUTES.EDIT_COMMENT(comment.id);

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
