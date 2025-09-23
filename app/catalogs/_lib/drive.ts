import { CatalogItem } from '../_types';

// Interface for the raw JSON data from GitHub
interface RawCatalogData {
  Catalogues_Name?: string;
  Catalogues_Links?: string;
  Category?: string;
  Brands?: string;
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
    // List of all category JSON files from GitHub
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

    // Fetch all category files and combine the data
    const allPromises = categoryFiles.map(async (filename) => {
      try {
        const response = await fetch(`https://raw.githubusercontent.com/SujeethSoma/hinch-catalogs-web/main/catalogue_json/${filename}`);
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
      const name = item.Catalogues_Name;
      const brand = item.Brands;
      const category = item.Category;
      const downloadLink = item.Catalogues_Links;
      
      return {
        id: `catalog-${index}`,
        title: name || 'Untitled Catalog',
        brand: brand || 'Unknown Brand',
        category: category || 'Uncategorized',
        thumbnail: downloadLink ? thumbUrl(downloadLink) || undefined : undefined,
        previewUrl: downloadLink ? previewUrl(downloadLink) : undefined,
        downloadUrl: downloadLink ? downloadUrl(downloadLink) : undefined,
        description: `Explore our comprehensive ${category || 'Uncategorized'} collection from ${brand || 'Unknown Brand'}. This catalog showcases premium materials and finishes for modern interior design.`
      };
    });
  } catch (error) {
    console.error('Error loading catalog data from GitHub:', error);
    return [];
  }
}
  