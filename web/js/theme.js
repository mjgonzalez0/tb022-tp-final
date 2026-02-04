export const THEME_EVENT = "THEME_CHANGED";

function applyTheme(matches) {
  matches
    ? document.body.classList.add("theme-dark")
    : document.body.classList.remove("theme-dark");

  const event = new CustomEvent(THEME_EVENT, {
    detail: {
      isDark: matches,
    },
  });

  document.dispatchEvent(event);
}

export function setThemeFromSystem() {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  applyTheme(mediaQuery.matches);
  mediaQuery.addEventListener("change", (e) => applyTheme(e.matches));
}
