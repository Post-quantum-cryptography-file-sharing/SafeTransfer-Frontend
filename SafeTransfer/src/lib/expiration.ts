export function getExpirationDate(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

export function formatExpirationDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

export function formatExpirationDateTime(date: Date): string {
  return date.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function toISOString(date: Date): string {
  return date.toISOString();
}

export function getExpirationISO(days: number): string {
  return toISOString(getExpirationDate(days));
}

export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const isPast = diffMs < 0;
  const absDiffMs = Math.abs(diffMs);

  const minutes = Math.floor(absDiffMs / (1000 * 60));
  const hours = Math.floor(absDiffMs / (1000 * 60 * 60));
  const days = Math.floor(absDiffMs / (1000 * 60 * 60 * 24));

  if (days > 0) {
    const remainingHours = hours % 24;
    if (remainingHours > 0) {
      return isPast
        ? `${days}d ${remainingHours}h ago`
        : `${days}d ${remainingHours}h`;
    }
    return isPast ? `${days}d ago` : `${days}d`;
  }

  if (hours > 0) {
    const remainingMinutes = minutes % 60;
    if (remainingMinutes > 0) {
      return isPast
        ? `${hours}h ${remainingMinutes}m ago`
        : `${hours}h ${remainingMinutes}m`;
    }
    return isPast ? `${hours}h ago` : `${hours}h`;
  }

  if (minutes > 0) {
    return isPast ? `${minutes}m ago` : `${minutes}m`;
  }

  return isPast ? "just now" : "< 1m";
}
