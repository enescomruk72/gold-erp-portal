import { redirect } from 'next/navigation';
import { sozlesmeTipToSlug } from '@/features/contracts/lib/sozlesme-slug';

/** İlk yasal metne yönlendir — liste client'ta API'den gelir */
export default function YasalIndexPage() {
    redirect(`/yasal/${sozlesmeTipToSlug('KVKK')}`);
}
