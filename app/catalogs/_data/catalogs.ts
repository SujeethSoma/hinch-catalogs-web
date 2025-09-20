import { CatalogItem } from '../_types';
import { previewUrl, downloadUrl, thumbUrl } from '../_lib/drive';

// Import the real catalog data
import realCatalogsData from './real-catalogs.json';

// Type for the imported JSON data
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

// Transform the real data into our CatalogItem format
export const CATALOGS: CatalogItem[] = realCatalogsData.map((item: RawCatalogData, index: number) => {
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

// Export categories in the order they should appear
export const CATEGORY_ORDER = [
  "All",
  "Acrylic Laminates",
  "Solid Colour Laminates", 
  "360 Louvers",
  "Decorative Laminates",
  "Doors",
  "Edge Banding",
  "Hardware",
  "Liners",
  "Louvers",
  "Mouldings",
  "PVC Laminates",
  "Thermo Laminates",
  "Veneers",
  "Wall Panels"
] as const;

// Get unique brands from the data
export const getUniqueBrands = (): string[] => {
  const brands = Array.from(new Set(CATALOGS.map(item => item.brand))).sort();
  return ['All', ...brands];
};

// Get unique categories from the data in the specified order
export const getUniqueCategories = (): string[] => {
  const categories = Array.from(new Set(CATALOGS.map(item => item.category)));
  const orderedCategories = CATEGORY_ORDER.filter(cat => categories.includes(cat as string));
  const remainingCategories = categories.filter(cat => !CATEGORY_ORDER.includes(cat as typeof CATEGORY_ORDER[number])).sort();
  return ['All', ...orderedCategories, ...remainingCategories];
};