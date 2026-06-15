'use client';

import { AlertTriangle } from 'lucide-react';
import { useGetPublicAyarlar } from '../api/use-get-public-ayarlar';

export function PortalMaintenanceBanner() {
    const { isMaintenanceMode, maintenanceMessage, isLoading } = useGetPublicAyarlar();

    if (isLoading || !isMaintenanceMode) return null;

    return (
        <div className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
            <div className="mx-auto flex max-w-7xl items-start gap-2">
                <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                <p>{maintenanceMessage}</p>
            </div>
        </div>
    );
}
