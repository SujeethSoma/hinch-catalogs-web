"use client";

interface ToolbarProps {
  valueSearch: string;
  onSearchChange: (value: string) => void;
  brand: string;
  onBrandChange: (value: string) => void;
  view: "Preview" | "Details";
  onViewChange: (value: "Preview" | "Details") => void;
  brands: string[];
}

export default function Toolbar({
  valueSearch,
  onSearchChange,
  brand,
  onBrandChange,
  view,
  onViewChange,
  brands,
}: ToolbarProps) {
  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-4 items-center">
        {/* Search Input */}
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search catalogs…"
            value={valueSearch}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7A1A] focus:border-[#FF7A1A] hover:border-orange-200"
          />
        </div>

        {/* Brand Select */}
        <div className="min-w-[150px]">
          <select
            value={brand}
            onChange={(e) => onBrandChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7A1A] focus:border-[#FF7A1A] hover:border-orange-200 bg-white"
          >
            {brands.map((brandOption) => (
              <option key={brandOption} value={brandOption}>
                {brandOption}
              </option>
            ))}
          </select>
        </div>


        {/* View Select */}
        <div className="min-w-[120px]">
          <select
            value={view}
            onChange={(e) => onViewChange(e.target.value as "Preview" | "Details")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7A1A] focus:border-[#FF7A1A] hover:border-orange-200 bg-white"
          >
            <option value="Preview">Preview</option>
            <option value="Details">Details</option>
          </select>
        </div>
      </div>
    </div>
  );
}
