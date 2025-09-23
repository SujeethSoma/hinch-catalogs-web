import { CatalogItem } from '../_types';

// Interface for the raw JSON data from GitHub
interface RawCatalogData {
  uniqueId?: string;
  name?: string;
  'Catalogues Name'?: string;
  'Catalogues Name '?: string;
  brand?: string;
  Brand?: string;
  Brands?: string;
  category?: string;
  Category?: string;
  driveLink?: string;
  'Catalouge links'?: string;
  'Catalogues Links'?: string;
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
    // Fetch from the main catalogs.json file
    const response = await fetch('https://raw.githubusercontent.com/SujeethSoma/hinch-catalogs-web/main/app/catalogs/_data/real-catalogs.json');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }
    
    const rawData = await response.json();
    
    // Transform the JSON structure into our CatalogItem format
    return rawData.map((item: RawCatalogData, index: number) => {
      const driveLink = item.driveLink || item['Catalouge links'] || item['Catalogues Links'];
      const name = item.name || item['Catalogues Name'] || item['Catalogues Name '];
      const brand = item.brand || item.Brand || item.Brands;
      const category = item.category || item.Category;
      
      return {
        id: item.uniqueId || `catalog-${index}`,
        title: name || 'Untitled Catalog',
        brand: brand || 'Unknown Brand',
        category: category || 'Uncategorized',
        thumbnail: driveLink ? thumbUrl(driveLink) || undefined : undefined,
        previewUrl: driveLink ? previewUrl(driveLink) : undefined,
        downloadUrl: driveLink ? downloadUrl(driveLink) : undefined,
        description: `Explore our comprehensive ${category || 'Uncategorized'} collection from ${brand || 'Unknown Brand'}. This catalog showcases premium materials and finishes for modern interior design.`
      };
    });
  } catch (error) {
    console.error('Error loading catalog data from GitHub:', error);
    return [];
  }
}
  