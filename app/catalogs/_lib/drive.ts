import { CatalogItem } from '../_types';

// Interface for the raw JSON data from GitHub
interface RawCatalogData {
  title?: string;
  brand?: string;
  category?: string;
  driveLink?: string;
  image?: string;
  previewUrl?: string;
  downloadUrl?: string;
}

export function extractDriveId(url: string): string {
    if (!url) return "";
    const m1 = url.match(/\/file\/d\/([\w-]+)/);
    if (m1) return m1[1];
    const m2 = url.match(/[?&]id=([\w-]+)/);
    if (m2) return m2[1];
    const m3 = url.match(/[-\w]{25,}/);
    return m3 ? m3[0] : "";
  }
  export function previewUrl(url: string): string {
    const id = extractDriveId(url);
    return id ? `https://drive.google.com/file/d/${id}/preview` : url;
  }
  export function downloadUrl(url: string): string {
    const id = extractDriveId(url);
    return id ? `https://drive.google.com/uc?export=download&id=${id}` : url;
  }
  export function thumbUrl(url: string): string | null {
    const id = extractDriveId(url);
    return id ? `https://drive.google.com/thumbnail?id=${id}&sz=w1000` : null;
  }

export function toDriveDirectPdf(url: string): string {
    const id = extractDriveId(url);
    if (!id) return url;
    
    // Convert Google Drive viewer links to direct PDF download links
    if (url.includes('drive.google.com')) {
      return `https://drive.google.com/uc?export=download&id=${id}`;
    }
    
    return url;
  }

export async function loadCatalogData(): Promise<CatalogItem[]> {
  try {
    // For localhost: use local file, for production: use GitHub
    const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
    const url = isLocalhost 
      ? '/all_catalogs.json' 
      : 'https://raw.githubusercontent.com/SujeethSoma/hinch-catalogs-web/main/all_catalogs.json';
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error(`Failed to fetch all_catalogs.json: ${response.status}`);
      return [];
    }
    
    const rawData = await response.json();

    // Transform the JSON structure into our CatalogItem format
    return rawData.map((item: RawCatalogData, index: number) => {
      return {
        id: `catalog-${index}`,
        title: item.title || 'Untitled Catalog',
        brand: item.brand || 'Unknown Brand',
        category: item.category || 'Uncategorized',
        thumbnail: item.image || (item.driveLink ? thumbUrl(item.driveLink) || undefined : undefined),
        previewUrl: item.previewUrl || (item.driveLink ? previewUrl(item.driveLink) : undefined),
        downloadUrl: item.downloadUrl || (item.driveLink ? downloadUrl(item.driveLink) : undefined),
        description: `Explore our comprehensive ${item.category || 'Uncategorized'} collection from ${item.brand || 'Unknown Brand'}. This catalog showcases premium materials and finishes for modern interior design.`
      };
    });
  } catch (error) {
    console.error('Error loading catalog data from all_catalogs.json:', error);
    return [];
  }
}
  