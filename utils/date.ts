/**
 * Formats a Date object or string into an elegant human-readable date format:
 * e.g., "June 29, 2026"
 */
export function formatDate(dateInput: Date | string | number): string {
  try {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return 'N/A';
    
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  } catch (error) {
    return 'N/A';
  }
}

/**
 * Formats a Date into a simple numeric style:
 * e.g., "29/06/2026"
 */
export function formatNumericDate(dateInput: Date | string | number): string {
  try {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return 'N/A';

    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  } catch (error) {
    return 'N/A';
  }
}
