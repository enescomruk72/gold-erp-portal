/**
 * Number Formatting Utilities
 * 
 * Helpers for formatting numbers in DataTable cells.
 */

/**
 * Format number with thousands separator
 * 
 * @example
 * ```ts
 * formatNumber(1234567) // → '1,234,567'
 * formatNumber(1234567.89, 'tr-TR') // → '1.234.567,89'
 * ```
 */
export function formatNumber(
    value: number | string | null | undefined,
    locale: string = 'tr-TR',
    options?: Intl.NumberFormatOptions
): string {
    if (value === null || value === undefined || value === '') return '-';

    try {
        const num = typeof value === 'string' ? parseFloat(value) : value;

        if (isNaN(num)) return '-';

        return new Intl.NumberFormat(locale, options).format(num);
    } catch {
        return '-';
    }
}

/**
 * Format percentage
 * 
 * @example
 * ```ts
 * formatPercentage(0.1534) // → '15.34%'
 * formatPercentage(0.5, 'tr-TR', 0) // → '%50'
 * ```
 */
export function formatPercentage(
    value: number | string | null | undefined,
    locale: string = 'tr-TR',
    decimals: number = 2
): string {
    if (value === null || value === undefined || value === '') return '-';

    try {
        const num = typeof value === 'string' ? parseFloat(value) : value;

        if (isNaN(num)) return '-';

        return new Intl.NumberFormat(locale, {
            style: 'percent',
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        }).format(num);
    } catch {
        return '-';
    }
}

/**
 * Format compact number (1.2K, 1.5M, etc.)
 * 
 * @example
 * ```ts
 * formatCompactNumber(1234) // → '1.2K'
 * formatCompactNumber(1234567) // → '1.2M'
 * formatCompactNumber(1234567890) // → '1.2B'
 * ```
 */
export function formatCompactNumber(
    value: number | string | null | undefined,
    locale: string = 'tr-TR'
): string {
    if (value === null || value === undefined || value === '') return '-';

    try {
        const num = typeof value === 'string' ? parseFloat(value) : value;

        if (isNaN(num)) return '-';

        return new Intl.NumberFormat(locale, {
            notation: 'compact',
            compactDisplay: 'short',
        }).format(num);
    } catch {
        return '-';
    }
}

/**
 * Format file size (bytes to KB, MB, GB)
 * 
 * @example
 * ```ts
 * formatFileSize(1024) // → '1 KB'
 * formatFileSize(1048576) // → '1 MB'
 * formatFileSize(1073741824) // → '1 GB'
 * ```
 */
export function formatFileSize(
    bytes: number | string | null | undefined,
    decimals: number = 2
): string {
    if (bytes === null || bytes === undefined || bytes === '') return '-';

    try {
        const num = typeof bytes === 'string' ? parseFloat(bytes) : bytes;

        if (isNaN(num) || num === 0) return '0 Bytes';

        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(num) / Math.log(k));

        return `${parseFloat((num / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
    } catch {
        return '-';
    }
}

/**
 * Format decimal number
 * 
 * @example
 * ```ts
 * formatDecimal(1234.5678) // → '1,234.57'
 * formatDecimal(1234.5678, 'tr-TR', 3) // → '1.234,568'
 * ```
 */
export function formatDecimal(
    value: number | string | null | undefined,
    locale: string = 'tr-TR',
    decimals: number = 2
): string {
    if (value === null || value === undefined || value === '') return '-';

    try {
        const num = typeof value === 'string' ? parseFloat(value) : value;

        if (isNaN(num)) return '-';

        return new Intl.NumberFormat(locale, {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        }).format(num);
    } catch {
        return '-';
    }
}

/**
 * Format integer (no decimals)
 * 
 * @example
 * ```ts
 * formatInteger(1234.5678) // → '1,235'
 * ```
 */
export function formatInteger(
    value: number | string | null | undefined,
    locale: string = 'tr-TR'
): string {
    if (value === null || value === undefined || value === '') return '-';

    try {
        const num = typeof value === 'string' ? parseFloat(value) : value;

        if (isNaN(num)) return '-';

        return new Intl.NumberFormat(locale, {
            maximumFractionDigits: 0,
        }).format(Math.round(num));
    } catch {
        return '-';
    }
}

/**
 * Format ordinal number (1st, 2nd, 3rd, etc.)
 * 
 * @example
 * ```ts
 * formatOrdinal(1) // → '1st'
 * formatOrdinal(2) // → '2nd'
 * formatOrdinal(3) // → '3rd'
 * formatOrdinal(21) // → '21st'
 * ```
 */
export function formatOrdinal(
    value: number | string | null | undefined,
    locale: string = 'en-US'
): string {
    if (value === null || value === undefined || value === '') return '-';

    try {
        const num = typeof value === 'string' ? parseInt(value, 10) : value;

        if (isNaN(num)) return '-';

        // Use Intl.PluralRules for ordinal formatting
        const pr = new Intl.PluralRules(locale, { type: 'ordinal' });
        const suffixes: Record<string, string> = {
            one: 'st',
            two: 'nd',
            few: 'rd',
            other: 'th',
        };
        const rule = pr.select(num);
        const suffix = suffixes[rule];

        return `${num}${suffix}`;
    } catch {
        return '-';
    }
}
