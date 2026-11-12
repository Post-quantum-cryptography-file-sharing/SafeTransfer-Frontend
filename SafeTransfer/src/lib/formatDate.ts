const DEFAULT_OPTIONS: Intl.DateTimeFormatOptions = {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
};

export function formatDate(
  value: string | Date,
  options: Intl.DateTimeFormatOptions = DEFAULT_OPTIONS
): string {
  return new Date(value).toLocaleString('en-GB', options);
}
