import { Skeleton } from '@/components/ui/skeleton';

export function LegalHubSkeleton() {
    return (
        <div className="mt-base flex flex-col gap-6 lg:flex-row">
            <div className="w-full shrink-0 space-y-2 lg:w-72">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
            <div className="min-w-0 flex-1 space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
        </div>
    );
}
