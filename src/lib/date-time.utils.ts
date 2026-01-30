/**
 * Date and time formatting utilities
 * Used for consistent display across the app (Spanish locale)
 */

const SPANISH_DAYS = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
];
const SPANISH_MONTHS = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
];

/**
 * Formats a date string (YYYY-MM-DD) for display in Spanish
 * @param dateString - ISO date string
 * @returns Formatted string e.g. "Lunes, 2 de febrero de 2026"
 */
export function formatDisplayDate(dateString: string): string {
  try {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const dayName = SPANISH_DAYS[date.getDay()];
    const monthName = SPANISH_MONTHS[date.getMonth()];
    return `${dayName}, ${day} de ${monthName} de ${year}`;
  } catch {
    return dateString;
  }
}

/**
 * Formats a time string (HH:mm) to 12h AM/PM for display
 * @param timeString - Time in HH:mm format
 */
export function formatDisplayTime(timeString: string): string {
  try {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  } catch {
    return timeString;
  }
}
