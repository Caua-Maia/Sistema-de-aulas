/** E-mail autorizado a acessar o painel do monitor. */
export const MONITOR_EMAIL = "cauamaia488@gmail.com";

export function isMonitorEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return email.toLowerCase().trim() === MONITOR_EMAIL;
}

export function getHomePathForEmail(email: string | null | undefined): string {
  return isMonitorEmail(email) ? "/monitor" : "/dashboard";
}
