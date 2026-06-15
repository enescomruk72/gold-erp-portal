/** Altın sektörü — kategori / story mock görselleri (Unsplash) */
const GOLD_MOCK_IMAGES = [
    'https://cdn03.ciceksepeti.com/cicek/kc813544-1/L/dorika-tasli-hasir-14-ayar-altin-kelepce-kc813544-1-a5863ac349fa456586be23c4972ee8ea.jpg',
    'https://images.unsplash.com/photo-1705326452395-1d35e6add570?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://www.bilezikci.com/shop/zr/36/myassets/products/045/hint-isi-kalp-22-ayar-altin-kolye-26-gr-245216.jpg?revision=1755594847',
    'https://media.istockphoto.com/id/1325493603/photo/gold-bracelet-on-white-background-stock-photo.webp?a=1&b=1&s=612x612&w=0&k=20&c=rIAQ6WqnhL4zPkuPOJjTo6cKJybKwe_XF8-MyC5Ogsw=',
    'https://cdn.qukasoft.com/f/415000/cDR6WmFtNG0vcUp3ZTJGb0g4OXJKYndQSWNEeFJBPT0/p/dorikali-yonca-22-ayar-altin-kolye-ucu-97004390-sw1280sh1280.webp',
    'https://www.altinplaza.com/images/urunler/Altin-Kalin-Halat-Bayan-Bileklik-KN03721-resim-22702.jpg',
    'https://92d339.cdn.akinoncloud.com/products/2024/02/23/211633/24993bd9-1c1d-49bd-b5d0-ef91140f4da2_size800x800_cropTop.jpg',
    'https://www.ceyrekci.com/yasam-cicegi-22-ayar-altin-kolye-ucu-3-cm-capli-165159-20-B.jpg',
    'https://www.artuklutelkari.com/wp-content/uploads/2025/12/altin-dorika-gerdanlik.jpeg',
    'https://www.ceyrekci.com/22-ayar-kaburga-altin-yuzuk-162858-19-B.jpg',
    'https://cdn-s3.pttavm.com/pimages/592/232/333/64030af1d7141.jpg',
    'https://images.unsplash.com/photo-1611085583191-a3b181a33101?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop',
] as const;

export function getCategoryMockImageUrl(index: number): string {
    return GOLD_MOCK_IMAGES[index % GOLD_MOCK_IMAGES.length];
}

export function getStoryMockImageUrl(index: number): string {
    return GOLD_MOCK_IMAGES[index % GOLD_MOCK_IMAGES.length];
}
