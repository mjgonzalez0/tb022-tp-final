export function getUsernameFromParam() {
  const params = new URLSearchParams(window.location.search);

  const value = params.get("username");
  if (!value) {
    return null;
  }

  return value.trim();
}

export function getIdFromParam() {
  const params = new URLSearchParams(window.location.search);

  const value = params.get("id");
  if (!value) {
    return null;
  }

  const parsed = Number.parseInt(value);
  return Number.isNaN(parsed) ? null : parsed;
}
