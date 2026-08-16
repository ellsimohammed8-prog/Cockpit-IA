/**
 * Formate une chaîne de date ISO au format élégant fr-FR sur une seule ligne
 * Exemple : 16 août 2026, 22:45
 */
export function formatCockpitDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;

    return d.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
}
