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
    console.log('Starting to load catalog data...');
    
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

    console.log(`Fetching ${categoryFiles.length} category files...`);

    // Fetch all category files and combine the data
    const allPromises = categoryFiles.map(async (filename) => {
      try {
        const url = `https://raw.githubusercontent.com/SujeethSoma/hinch-catalogs-web/main/catalogue_json/${filename}`;
        console.log(`Fetching ${filename} from ${url}`);
        const response = await fetch(url);
        if (!response.ok) {
          console.warn(`Failed to fetch ${filename}: ${response.status}`);
          return [];
        }
        const data = await response.json();
        console.log(`Successfully fetched ${filename}: ${data.length} items`);
        return data;
      } catch (error) {
        console.warn(`Error fetching ${filename}:`, error);
        return [];
      }
    });

    const allCategoryData = await Promise.all(allPromises);
    const rawData = allCategoryData.flat();
    console.log(`Total raw data items: ${rawData.length}`);

    // Transform the JSON structure into our CatalogItem format
    console.log('Transforming data...');
    const transformedData = rawData.map((item: RawCatalogData, index: number) => {
      const transformed = {
        id: `catalog-${index}`,
        title: item.title || 'Untitled Catalog',
        brand: item.brand || 'Unknown Brand',
        category: item.category || 'Uncategorized',
        thumbnail: item.image || (item.driveLink ? thumbUrl(item.driveLink) || undefined : undefined),
        previewUrl: item.previewUrl || (item.driveLink ? previewUrl(item.driveLink) : undefined),
        downloadUrl: item.downloadUrl || (item.driveLink ? downloadUrl(item.driveLink) : undefined),
        description: `Explore our comprehensive ${item.category || 'Uncategorized'} collection from ${item.brand || 'Unknown Brand'}. This catalog showcases premium materials and finishes for modern interior design.`
      };
      
      if (index < 3) {
        console.log(`Transformed item ${index}:`, transformed);
      }
      
      return transformed;
    });
    
    console.log(`Successfully transformed ${transformedData.length} items`);
    return transformedData;
  } catch (error) {
    console.error('Error loading catalog data from GitHub:', error);
    return [];
  }
}
  