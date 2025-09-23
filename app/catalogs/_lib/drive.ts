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
    // List of all category JSON files from the local catalogue_json directory
    const categoryFiles = [
      '360_Louvers.json',
      'Acrylic_Laminates.json',
      'Decorative_Laminates.json',
      'Doors.json',
      'Edge_Banding.json',
      'Hardware.json',
      'Liners.json',
      'Louvers.json',
      'Moulders.json',
      'PVC_Laminates.json',
      'Solid_Colour_Laminates.json',
      'Thermo_Laminates.json',
      'Ti_Patti.json',
      'Veeners.json',
      'Wall_Panels.json'
    ];

    // Fetch all category files from local directory and combine the data
    const allPromises = categoryFiles.map(async (filename) => {
      try {
        const response = await fetch(`/catalogue_json/${filename}`);
        if (!response.ok) {
          console.warn(`Failed to fetch ${filename}: ${response.status}`);
          return [];
        }
        return await response.json();
      } catch (error) {
        console.warn(`Error fetching ${filename}:`, error);
        return [];
      }
    });

    const allCategoryData = await Promise.all(allPromises);
    const rawData = allCategoryData.flat();

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
    console.error('Error loading catalog data from GitHub:', error);
    return [];
  }
}
  