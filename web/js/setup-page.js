import { getCurrentUser } from "./auth.js";
import { redirect, ROUTES } from "./routes.js";

// Inicializa la página siguiendo este flujo:
// 
// 1. Obtener el usuario actual (si existe)
// 2. Si la página requiere autenticación y no hay usuario → redirigir al login
// 3. Si la página es solo para invitados y hay usuario → redirigir al inicio
// 4. Eliminar la pantalla de carga (si existe)
// 5. Ejecutar la lógica específica de la página ejecutando `onReady()` pasando el usuario como primer parametro.
export async function initializePage({
  requiresAuth = false,
  guestOnly = false,
  onReady = async () => {},
}) {
  const loader = document.querySelector("#loading-state");

  const user = await getCurrentUser();
  if (requiresAuth && !user) {
    redirect(ROUTES.LOGIN);
    return;
  }

  if (guestOnly && user) {
    redirect(ROUTES.HOME);
    return;
  }

  loader?.remove();
  await onReady(user);
}
