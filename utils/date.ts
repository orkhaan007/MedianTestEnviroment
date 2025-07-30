/**
 * Formats a date string into a human-readable format
 * @param dateString ISO date string
 * @returns Formatted date string
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  
  // Format: Month Day, Year
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}
