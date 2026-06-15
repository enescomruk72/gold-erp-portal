import dynamic from 'next/dynamic';
import { STOREFRONT_CONTENT_CONTAINER_CLASS } from '@/constants/storefront/layout';
import { LegalHubSkeleton } from '@/features/contracts/components/legal-hub/legal-hub-skeleton';

const LegalHubView = dynamic(
    () =>
        import('@/features/contracts/components/legal-hub/legal-hub-view').then(
            (mod) => mod.LegalHubView,
        ),
    {
        loading: () => (
            <div className={STOREFRONT_CONTENT_CONTAINER_CLASS}>
                <LegalHubSkeleton />
            </div>
        ),
    },
);

type YasalSlugPageProps = {
    params: Promise<{ slug: string }>;
};

export default async function YasalSlugPage({ params }: YasalSlugPageProps) {
    const { slug } = await params;
    return <LegalHubView slug={slug} />;
}
