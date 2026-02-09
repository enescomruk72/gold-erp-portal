/**
 * Currency Formatting Utilities
 * 
 * Helpers for formatting currency values in DataTable cells.
 */

/**
 * Format currency
 * 
 * @example
 * ```ts
 * formatCurrency(1234.56) // → '₺1,234.56'
 * formatCurrency(1234.56, 'tr-TR', 'TRY') // → '1.234,56 ₺'
 * formatCurrency(1234.56, 'en-US', 'USD') // → '$1,234.56'
 * ```
 */
export function formatCurrency(
    value: number | string | null | undefined,
    locale: string = 'tr-TR',
    currency: string = 'TRY',
    options?: Intl.NumberFormatOptions
): string {
    if (value === null || value === undefined || value === '') return '-';

    try {
        const num = typeof value === 'string' ? parseFloat(value) : value;

        if (isNaN(num)) return '-';

        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency,
            ...options,
        }).format(num);
    } catch {
        return '-';
    }
}

/**
 * Format Turkish Lira (TRY)
 * 
 * @example
 * ```ts
 * formatTRY(1234.56) // → '1.234,56 ₺'
 * ```
 */
export function formatTRY(
    value: number | string | null | undefined,
    options?: Intl.NumberFormatOptions
): string {
    return formatCurrency(value, 'tr-TR', 'TRY', options);
}

/**
 * Format US Dollar (USD)
 * 
 * @example
 * ```ts
 * formatUSD(1234.56) // → '$1,234.56'
 * ```
 */
export function formatUSD(
    value: number | string | null | undefined,
    options?: Intl.NumberFormatOptions
): string {
    return formatCurrency(value, 'en-US', 'USD', options);
}

/**
 * Format Euro (EUR)
 * 
 * @example
 * ```ts
 * formatEUR(1234.56) // → '€1,234.56'
 * ```
 */
export function formatEUR(
    value: number | string | null | undefined,
    options?: Intl.NumberFormatOptions
): string {
    return formatCurrency(value, 'de-DE', 'EUR', options);
}

/**
 * Format currency with custom symbol
 * 
 * @example
 * ```ts
 * formatCurrencyWithSymbol(1234.56, '₺') // → '₺ 1,234.56'
 * formatCurrencyWithSymbol(1234.56, '$', 'prefix') // → '$1,234.56'
 * formatCurrencyWithSymbol(1234.56, '₺', 'suffix') // → '1,234.56 ₺'
 * ```
 */
export function formatCurrencyWithSymbol(
    value: number | string | null | undefined,
    symbol: string,
    position: 'prefix' | 'suffix' = 'prefix',
    locale: string = 'tr-TR'
): string {
    if (value === null || value === undefined || value === '') return '-';

    try {
        const num = typeof value === 'string' ? parseFloat(value) : value;

        if (isNaN(num)) return '-';

        const formatted = new Intl.NumberFormat(locale, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(num);

        return position === 'prefix' ? `${symbol}${formatted}` : `${formatted} ${symbol}`;
    } catch {
        return '-';
    }
}

/**
 * Format currency compact (1.2K, 1.5M, etc.)
 * 
 * @example
 * ```ts
 * formatCurrencyCompact(1234) // → '₺1.2K'
 * formatCurrencyCompact(1234567) // → '₺1.2M'
 * ```
 */
export function formatCurrencyCompact(
    value: number | string | null | undefined,
    locale: string = 'tr-TR',
    currency: string = 'TRY'
): string {
    if (value === null || value === undefined || value === '') return '-';

    try {
        const num = typeof value === 'string' ? parseFloat(value) : value;

        if (isNaN(num)) return '-';

        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency,
            notation: 'compact',
            compactDisplay: 'short',
        }).format(num);
    } catch {
        return '-';
    }
}

/**
 * Parse currency string to number
 * 
 * @example
 * ```ts
 * parseCurrency('₺1,234.56') // → 1234.56
 * parseCurrency('$1,234.56') // → 1234.56
 * parseCurrency('1.234,56 ₺') // → 1234.56
 * ```
 */
export function parseCurrency(value: string | null | undefined): number | null {
    if (!value || !value.trim()) return null;

    try {
        // Remove currency symbols and whitespace
        let cleaned = value.replace(/[^0-9,.-]/g, '');

        // Handle different decimal separators
        // Turkish format: 1.234,56 → 1234.56
        // US format: 1,234.56 → 1234.56
        const lastComma = cleaned.lastIndexOf(',');
        const lastDot = cleaned.lastIndexOf('.');

        if (lastComma > lastDot) {
            // Turkish format (comma is decimal separator)
            cleaned = cleaned.replace(/\./g, '').replace(',', '.');
        } else {
            // US format (dot is decimal separator)
            cleaned = cleaned.replace(/,/g, '');
        }

        const num = parseFloat(cleaned);
        return isNaN(num) ? null : num;
    } catch {
        return null;
    }
}

/**
 * Format price range
 * 
 * @example
 * ```ts
 * formatPriceRange(100, 500) // → '₺100 - ₺500'
 * formatPriceRange(100, 500, 'en-US', 'USD') // → '$100 - $500'
 * ```
 */
export function formatPriceRange(
    minValue: number | string | null | undefined,
    maxValue: number | string | null | undefined,
    locale: string = 'tr-TR',
    currency: string = 'TRY'
): string {
    const min = formatCurrency(minValue, locale, currency);
    const max = formatCurrency(maxValue, locale, currency);

    if (min === '-' || max === '-') return '-';

    return `${min} - ${max}`;
}
