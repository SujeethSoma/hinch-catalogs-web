"use client";

import { CatalogItem } from '../_types';

interface CatalogCardProps {
  item: CatalogItem;
  view: "Preview" | "Details";
}

export default function CatalogCard({ item, view }: CatalogCardProps) {

  const handlePreview = () => {
    if (item.previewUrl) {
      window.open(item.previewUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleDownload = () => {
    if (item.downloadUrl) {
      window.open(item.downloadUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="relative min-h-[360px] pb-16 overflow-visible rounded-2xl bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      {/* Cover */}
      <div className="h-48 w-full rounded-t-2xl bg-gradient-to-b from-[#FF7A1A] to-[#FF8F40] overflow-hidden">
        {item.thumbnail ? (
          <img
            loading="lazy"
            alt={item.title}
            src={item.thumbnail}
            className="h-48 w-full object-cover rounded-t-2xl"
          />
        ) : null}
      </div>

      {/* Meta */}
      <div className="p-4">
        <h3 className="line-clamp-1 text-sm font-semibold text-[#111827]">
          {item.title}
        </h3>
        <p className="mt-1 text-xs text-[#6B7280]">
          {item.brand}
        </p>

        {/* Details View - Description */}
        {view === "Details" && item.description && (
          <p className="mt-2 line-clamp-2 text-xs text-[#374151]">
            {item.description}
          </p>
        )}
      </div>

      {/* Action Bar - Only visible in Preview mode */}
      {view === "Preview" && (item.previewUrl || item.downloadUrl) && (
        <div className="absolute inset-x-3 bottom-3 z-10 flex gap-2">
          {item.previewUrl && (
            <button
              onClick={handlePreview}
              aria-label={`Preview ${item.title}`}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl px-3 py-2 text-sm w-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF7A1A] focus:ring-offset-2"
            >
              Preview
            </button>
          )}
          {item.downloadUrl && (
            <button
              onClick={handleDownload}
              aria-label={`Download ${item.title}`}
              className="bg-[#FF7A1A] hover:bg-[#FF8F40] text-white rounded-xl px-3 py-2 text-sm w-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF7A1A] focus:ring-offset-2"
            >
              Download
            </button>
          )}
        </div>
      )}
    </div>
  );
}
