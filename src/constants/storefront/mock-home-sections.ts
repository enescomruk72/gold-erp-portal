import { getStoryMockImageUrl } from '@/constants/storefront/mock-category-images';

export type HomeStoryItem = {
    id: string;
    label: string;
    tone: 'primary' | 'muted' | 'accent';
    imageUrl: string;
};

const STORY_LABELS: Array<{ label: string; tone: HomeStoryItem['tone'] }> = [
    { label: 'Bugün Fiyatı Düşenler', tone: 'primary' },
    { label: 'Yeni Koleksiyon', tone: 'accent' },
    { label: 'Çok Satanlar', tone: 'muted' },
    { label: '22 Ayar', tone: 'primary' },
    { label: 'Kampanyalar', tone: 'accent' },
    { label: 'Set Ürünler', tone: 'muted' },
    { label: 'Hediye Önerileri', tone: 'primary' },
    { label: 'Outlet', tone: 'accent' },
    { label: 'Özel Fiyatlar', tone: 'primary' },
    { label: 'Yeni Ürünler', tone: 'accent' },
    { label: 'Özel Fiyatlar', tone: 'accent' },
    { label: 'Yeni Ürünler', tone: 'primary' },
];

export const HOME_STORIES: HomeStoryItem[] = STORY_LABELS.map((item, index) => ({
    id: String(index + 1),
    ...item,
    imageUrl: getStoryMockImageUrl(index),
}));
