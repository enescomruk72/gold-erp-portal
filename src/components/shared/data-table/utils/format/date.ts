/**
 * Date Formatting Utilities
 * 
 * Helpers for formatting dates and times in DataTable cells.
 */

/**
 * Format date to locale string
 * 
 * @example
 * ```ts
 * formatDate('2024-01-15') // → 'Jan 15, 2024'
 * formatDate(new Date(), 'tr-TR') // → '15 Oca 2024'
 * ```
 */
export function formatDate(
    date: string | Date | null | undefined,
    locale: string = 'tr-TR',
    options?: Intl.DateTimeFormatOptions
): string {
    if (!date) return '-';

    try {
        const dateObj = typeof date === 'string' ? new Date(date) : date;

        // Check if valid date
        if (isNaN(dateObj.getTime())) return '-';

        return dateObj.toLocaleDateString(locale, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            ...options,
        });
    } catch {
        return '-';
    }
}

/**
 * Format date and time to locale string
 * 
 * @example
 * ```ts
 * formatDateTime('2024-01-15T10:30:00') // → 'Jan 15, 2024, 10:30 AM'
 * ```
 */
export function formatDateTime(
    date: string | Date | null | undefined,
    locale: string = 'tr-TR',
    options?: Intl.DateTimeFormatOptions
): string {
    if (!date) return '-';

    try {
        const dateObj = typeof date === 'string' ? new Date(date) : date;

        if (isNaN(dateObj.getTime())) return '-';

        return dateObj.toLocaleString(locale, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            ...options,
        });
    } catch {
        return '-';
    }
}

/**
 * Format time only
 * 
 * @example
 * ```ts
 * formatTime('2024-01-15T10:30:00') // → '10:30 AM'
 * ```
 */
export function formatTime(
    date: string | Date | null | undefined,
    locale: string = 'tr-TR',
    options?: Intl.DateTimeFormatOptions
): string {
    if (!date) return '-';

    try {
        const dateObj = typeof date === 'string' ? new Date(date) : date;

        if (isNaN(dateObj.getTime())) return '-';

        return dateObj.toLocaleTimeString(locale, {
            hour: '2-digit',
            minute: '2-digit',
            ...options,
        });
    } catch {
        return '-';
    }
}

/**
 * Format relative time (e.g., '2 days ago', '3 hours ago')
 * 
 * @example
 * ```ts
 * formatRelativeTime('2024-01-13') // → '2 days ago'
 * formatRelativeTime(new Date()) // → 'just now'
 * ```
 */
export function formatRelativeTime(
    date: string | Date | null | undefined,
    locale: string = 'tr-TR'
): string {
    if (!date) return '-';

    try {
        const dateObj = typeof date === 'string' ? new Date(date) : date;

        if (isNaN(dateObj.getTime())) return '-';

        const now = new Date();
        const diff = now.getTime() - dateObj.getTime();
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30);
        const years = Math.floor(days / 365);

        const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

        if (seconds < 60) return rtf.format(-seconds, 'second');
        if (minutes < 60) return rtf.format(-minutes, 'minute');
        if (hours < 24) return rtf.format(-hours, 'hour');
        if (days < 30) return rtf.format(-days, 'day');
        if (months < 12) return rtf.format(-months, 'month');
        return rtf.format(-years, 'year');
    } catch {
        return '-';
    }
}

/**
 * Format date to ISO string
 * 
 * @example
 * ```ts
 * formatISO(new Date()) // → '2024-01-15T10:30:00.000Z'
 * ```
 */
export function formatISO(date: string | Date | null | undefined): string {
    if (!date) return '';

    try {
        const dateObj = typeof date === 'string' ? new Date(date) : date;

        if (isNaN(dateObj.getTime())) return '';

        return dateObj.toISOString();
    } catch {
        return '';
    }
}

/**
 * Format date range
 * 
 * @example
 * ```ts
 * formatDateRange('2024-01-15', '2024-01-20') // → 'Jan 15 - Jan 20, 2024'
 * ```
 */
export function formatDateRange(
    startDate: string | Date | null | undefined,
    endDate: string | Date | null | undefined,
    locale: string = 'tr-TR'
): string {
    if (!startDate || !endDate) return '-';

    const start = formatDate(startDate, locale);
    const end = formatDate(endDate, locale);

    if (start === '-' || end === '-') return '-';

    return `${start} - ${end}`;
}

/**
 * Check if date is today
 */
export function isToday(date: string | Date | null | undefined): boolean {
    if (!date) return false;

    try {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        const today = new Date();

        return (
            dateObj.getDate() === today.getDate() &&
            dateObj.getMonth() === today.getMonth() &&
            dateObj.getFullYear() === today.getFullYear()
        );
    } catch {
        return false;
    }
}

/**
 * Check if date is yesterday
 */
export function isYesterday(date: string | Date | null | undefined): boolean {
    if (!date) return false;

    try {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        return (
            dateObj.getDate() === yesterday.getDate() &&
            dateObj.getMonth() === yesterday.getMonth() &&
            dateObj.getFullYear() === yesterday.getFullYear()
        );
    } catch {
        return false;
    }
}
