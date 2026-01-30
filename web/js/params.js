export function getUsernameFromParam() {
  const params = new URLSearchParams(window.location.search);

  const value = params.get("username");
  if (!value) {
    return null;
  }

  return value.trim();
}
