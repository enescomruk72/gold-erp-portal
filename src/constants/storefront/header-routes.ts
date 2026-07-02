/** Favori ve koleksiyon sayfalarında mobil header arama/kategori barını gizlemek için */
export function isFavoritesOrCollectionsPath(pathname: string): boolean {
    return pathname.startsWith('/favorites') || pathname.startsWith('/collections');
}
