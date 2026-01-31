import { $fetch } from "./fetch.js";

export async function getCurrentUser() {
  const { data, hasError } = await $fetch("/users");
  if (hasError) {
    return {};
  }

  return data ?? {};
}
