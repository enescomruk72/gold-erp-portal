export type MaintenanceModeSetting = {
    enabled?: boolean;
    message?: string;
};

export type MinOrderAmountSetting = {
    amount?: number;
    currency?: string;
};

export type ToggleSetting = {
    enabled?: boolean;
};

export type TextValueSetting = {
    value?: string;
};

export type B2bPublicAyarlar = {
    B2B_PORTAL_MAINTENANCE_MODE?: MaintenanceModeSetting | null;
    B2B_PORTAL_MIN_ORDER_AMOUNT?: MinOrderAmountSetting | null;
    B2B_PORTAL_ALLOW_ORDERS?: ToggleSetting | null;
    B2B_PORTAL_SUPPORT_PHONE?: TextValueSetting | null;
    B2B_PORTAL_SUPPORT_EMAIL?: TextValueSetting | null;
    B2B_PORTAL_COMPANY_DISPLAY_NAME?: TextValueSetting | null;
};
