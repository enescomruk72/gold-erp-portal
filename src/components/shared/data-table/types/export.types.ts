/**
 * Export Types
 * 
 * Type definitions for data export functionality.
 */

/**
 * ============================================
 * EXPORT FORMATS
 * ============================================
 */

export type ExportFormat = 'csv' | 'excel' | 'pdf' | 'json';

/**
 * ============================================
 * EXPORT CONFIG
 * ============================================
 */

export interface ExportConfig {
    /** Export format */
    format: ExportFormat;

    /** File name (without extension) */
    fileName?: string;

    /** Include headers */
    includeHeaders?: boolean;

    /** Columns to export (defaults to visible columns) */
    columns?: string[];

    /** Export only selected rows */
    onlySelected?: boolean;

    /** Export current page or all data */
    scope?: 'current' | 'all';

    /** Custom formatters for specific columns */
    formatters?: Record<string, (value: unknown) => string>;
}

/**
 * ============================================
 * CSV EXPORT
 * ============================================
 */

export interface CSVExportConfig extends ExportConfig {
    format: 'csv';

    /** Delimiter */
    delimiter?: ',' | ';' | '\t';

    /** Quote character */
    quote?: '"' | "'";

    /** Line break character */
    lineBreak?: '\n' | '\r\n';

    /** Encoding */
    encoding?: 'utf-8' | 'utf-16';

    /** Include BOM (Byte Order Mark) */
    includeBOM?: boolean;
}

/**
 * ============================================
 * EXCEL EXPORT
 * ============================================
 */

export interface ExcelExportConfig extends ExportConfig {
    format: 'excel';

    /** Sheet name */
    sheetName?: string;

    /** Auto-size columns */
    autoSize?: boolean;

    /** Freeze header row */
    freezeHeader?: boolean;

    /** Apply filters */
    applyFilters?: boolean;

    /** Cell styling */
    styling?: {
        headerBold?: boolean;
        headerBackground?: string;
        alternateRows?: boolean;
        alternateRowColor?: string;
    };
}

/**
 * ============================================
 * PDF EXPORT
 * ============================================
 */

export interface PDFExportConfig extends ExportConfig {
    format: 'pdf';

    /** Page orientation */
    orientation?: 'portrait' | 'landscape';

    /** Page size */
    pageSize?: 'a4' | 'letter' | 'legal';

    /** Title */
    title?: string;

    /** Subtitle */
    subtitle?: string;

    /** Footer text */
    footer?: string;

    /** Show page numbers */
    showPageNumbers?: boolean;

    /** Table styling */
    styling?: {
        headerBackground?: string;
        headerColor?: string;
        alternateRows?: boolean;
        fontSize?: number;
    };
}

/**
 * ============================================
 * JSON EXPORT
 * ============================================
 */

export interface JSONExportConfig extends ExportConfig {
    format: 'json';

    /** Indent (pretty print) */
    indent?: number;

    /** Include metadata */
    includeMetadata?: boolean;
}

/**
 * ============================================
 * EXPORT OPTIONS (Union)
 * ============================================
 */

export type ExportOptions =
    | CSVExportConfig
    | ExcelExportConfig
    | PDFExportConfig
    | JSONExportConfig;

/**
 * ============================================
 * EXPORT RESULT
 * ============================================
 */

export interface ExportResult {
    /** Success flag */
    success: boolean;

    /** File name */
    fileName: string;

    /** File size (bytes) */
    fileSize?: number;

    /** Row count */
    rowCount: number;

    /** Column count */
    columnCount: number;

    /** Error message (if failed) */
    error?: string;

    /** Blob (for download) */
    blob?: Blob;
}

/**
 * ============================================
 * EXPORT PROGRESS
 * ============================================
 */

export interface ExportProgress {
    /** Progress percentage (0-100) */
    progress: number;

    /** Current step */
    step: 'preparing' | 'processing' | 'generating' | 'complete';

    /** Step description */
    message: string;

    /** Processed rows */
    processedRows: number;

    /** Total rows */
    totalRows: number;
}

/**
 * ============================================
 * EXPORT HOOKS
 * ============================================
 */

export interface UseExportReturn {
    /** Export function */
    exportData: (options: ExportOptions) => Promise<ExportResult>;

    /** Export state */
    isExporting: boolean;

    /** Export progress */
    progress?: ExportProgress;

    /** Last export result */
    result?: ExportResult;

    /** Error */
    error?: Error;

    /** Reset */
    reset: () => void;
}

/**
 * ============================================
 * EXPORT COMPONENT PROPS
 * ============================================
 */

export interface ExportDropdownProps {
    /** Available export formats */
    formats?: ExportFormat[];

    /** On export handler */
    onExport?: (options: ExportOptions) => void;

    /** Disabled state */
    disabled?: boolean;

    /** Default config */
    defaultConfig?: Partial<ExportConfig>;

    /** Custom class name */
    className?: string;

    /** Show progress */
    showProgress?: boolean;
}

/**
 * ============================================
 * COLUMN EXPORT METADATA
 * ============================================
 */

export interface ColumnExportMeta {
    /** Include in export */
    exportable?: boolean;

    /** Export header label (different from display label) */
    exportLabel?: string;

    /** Custom export formatter */
    exportFormatter?: (value: unknown, row: unknown) => string;

    /** Export width (for Excel/PDF) */
    exportWidth?: number;
}

/**
 * ============================================
 * UTILITY TYPES
 * ============================================
 */

/**
 * Format row data for export
 */
export type FormatRowForExport<TData> = (
    row: TData,
    columns: string[],
    formatters?: Record<string, (value: unknown) => string>
) => Record<string, string>;

/**
 * Generate file name
 */
export type GenerateFileName = (
    baseName: string,
    format: ExportFormat,
    timestamp?: boolean
) => string;

/**
 * Download blob
 */
export type DownloadBlob = (
    blob: Blob,
    fileName: string
) => void;
