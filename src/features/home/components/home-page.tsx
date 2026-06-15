import { HOME_STORIES } from '@/constants/storefront/mock-home-sections';
import { StoryStrip } from './story-strip';
import { HomeProductRails } from './home-product-rails';
import { CategoryGridSection } from './category-grid-section';

export function HomePage() {
    return (
        <div className="pb-10">
            <StoryStrip items={HOME_STORIES} />
            <HomeProductRails />
            <CategoryGridSection />
        </div>
    );
}
