/**
 * Export utilities for DataTable
 * CSV, JSON format support. Excel/PDF deferred.
 */

/**
 * Escape CSV value (handle quotes, newlines)
 */
function escapeCSVValue(value: unknown): string {
    if (value == null) return '';
    const str = String(value);
    if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
}

/**
 * Convert rows to CSV string
 */
export function rowsToCSV<T extends Record<string, unknown>>(rows: T[]): string {
    if (rows.length === 0) return '';

    const headers = Object.keys(rows[0] as object);
    const headerLine = headers.map(escapeCSVValue).join(',');
    const dataLines = rows.map((row) =>
        headers.map((h) => escapeCSVValue((row as Record<string, unknown>)[h])).join(',')
    );
    return [headerLine, ...dataLines].join('\n');
}

/**
 * Convert rows to JSON string
 */
export function rowsToJSON<T>(rows: T[]): string {
    return JSON.stringify(rows, null, 2);
}

/**
 * Trigger file download from blob
 */
export function downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * Export rows to CSV file
 */
export function exportToCSV<T extends Record<string, unknown>>(
    rows: T[],
    baseFilename = 'export'
): void {
    const csv = rowsToCSV(rows);
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
    downloadBlob(blob, `${baseFilename}.csv`);
}

/**
 * Export rows to JSON file
 */
export function exportToJSON<T>(rows: T[], baseFilename = 'export'): void {
    const json = rowsToJSON(rows);
    const blob = new Blob([json], { type: 'application/json' });
    downloadBlob(blob, `${baseFilename}.json`);
}

export type ExportFormat = 'csv' | 'json';
