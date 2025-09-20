export type CatalogItem = {
  id: string;
  title: string;
  brand: string;           // e.g., "Euro Pathik", "ACRYGOLD", "Laica Decor"
  category: string;        // e.g., "Acrylic Laminates", "Solid Colour Laminates", "Louvers", "PVC Laminates"
  thumbnail?: string;      // optional image
  previewUrl?: string;     // opens in new tab
  downloadUrl?: string;    // direct file link
  description?: string;
};
