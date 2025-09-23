"use client";

import { useState, useMemo, useEffect } from 'react';
import { loadCatalogData } from './_lib/drive';
import { CatalogItem } from './_types';
import Toolbar from './_components/Toolbar';
import CatalogCard from './_components/CatalogCard';
import CategoryTabs from './_components/CategoryTabs';

export default function CatalogsPage() {
  const [search, setSearch] = useState('');
  const [brand, setBrand] = useState('All');
  const [category, setCategory] = useState('All');
  const [view, setView] = useState<'Preview' | 'Details'>('Preview');
  const [catalogs, setCatalogs] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load catalog data from GitHub
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Page: Starting to fetch catalog data...');
        setLoading(true);
        setError(null);
        const data = await loadCatalogData();
        console.log('Page: Received data:', data.length, 'items');
        console.log('Page: First few items:', data.slice(0, 3));
        setCatalogs(data);
      } catch (error) {
        console.error('Page: Failed to load catalog data:', error);
        setError('Failed to load catalog data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  // Get unique brands and categories from data
  const brands = useMemo(() => {
    const brands = Array.from(new Set(catalogs.map(item => item.brand))).sort();
    return ['All', ...brands];
  }, [catalogs]);
  
  const categories = useMemo(() => {
    const categoryOrder = [
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
    
    const categories = Array.from(new Set(catalogs.map(item => item.category)));
    const orderedCategories = categoryOrder.filter(cat => categories.includes(cat as string));
    const remainingCategories = categories.filter(cat => !categoryOrder.includes(cat as typeof categoryOrder[number])).sort();
    return ['All', ...orderedCategories, ...remainingCategories];
  }, [catalogs]);

  // Calculate category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    
    // Count items for each category based on current search and brand filters
    categories.forEach((cat) => {
      if (cat === 'All') {
        counts[cat] = catalogs.filter((item: CatalogItem) => {
          const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
          const matchesBrand = brand === 'All' || item.brand === brand;
          return matchesSearch && matchesBrand;
        }).length;
      } else {
        counts[cat] = catalogs.filter((item: CatalogItem) => {
          const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
          const matchesBrand = brand === 'All' || item.brand === brand;
          const matchesCategory = item.category === cat;
          return matchesSearch && matchesBrand && matchesCategory;
        }).length;
      }
    });
    
    return counts;
  }, [catalogs, categories, search, brand]);

  // Filter items based on search, brand, and category
  const filteredItems = useMemo(() => {
    return catalogs.filter((item: CatalogItem) => {
      const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
      const matchesBrand = brand === 'All' || item.brand === brand;
      const matchesCategory = category === 'All' || item.category === category;
      
      return matchesSearch && matchesBrand && matchesCategory;
    });
  }, [catalogs, search, brand, category]);

  if (loading) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 bg-[#F8FAFC] min-h-screen">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-[#FF7A1A]">HINCH</h1>
          <button className="bg-[#FF7A1A] hover:bg-[#FF8F40] text-white rounded-xl px-4 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF7A1A] focus:ring-offset-2">
            Get a Quote
          </button>
        </div>
        
        {/* Loading State */}
        <div className="flex flex-col items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF7A1A] mb-4"></div>
          <h2 className="text-xl font-semibold text-[#111827] mb-2">Loading Catalogs</h2>
          <p className="text-[#6B7280] text-center max-w-md">
            Fetching the latest catalog data from our repository...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 bg-[#F8FAFC] min-h-screen">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-[#FF7A1A]">HINCH</h1>
          <button className="bg-[#FF7A1A] hover:bg-[#FF8F40] text-white rounded-xl px-4 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF7A1A] focus:ring-offset-2">
            Get a Quote
          </button>
        </div>
        
        {/* Error State */}
        <div className="flex flex-col items-center justify-center py-16">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-[#111827] mb-2">Error Loading Catalogs</h2>
          <p className="text-[#6B7280] text-center max-w-md mb-4">
            {error}
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-[#FF7A1A] hover:bg-[#FF8F40] text-white rounded-xl px-4 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF7A1A] focus:ring-offset-2"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 bg-[#F8FAFC] min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-[#FF7A1A]">HINCH</h1>
        <button className="bg-[#FF7A1A] hover:bg-[#FF8F40] text-white rounded-xl px-4 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF7A1A] focus:ring-offset-2">
          Get a Quote
        </button>
      </div>

      {/* Search and Brand Filter */}
      <Toolbar
        valueSearch={search}
        onSearchChange={setSearch}
        brand={brand}
        onBrandChange={setBrand}
        view={view}
        onViewChange={setView}
        brands={brands}
      />

      {/* Category Tabs */}
      <CategoryTabs
        categories={categories}
        selectedCategory={category}
        onCategoryChange={setCategory}
        categoryCounts={categoryCounts}
      />

      {/* Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <CatalogCard
              key={item.id}
              item={item}
              view={view}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-16">
          <div className="text-6xl mb-4">📋</div>
          <h2 className="text-xl font-semibold text-[#111827] mb-2">No catalogs found</h2>
          <p className="text-[#6B7280] text-center max-w-md">
            Try adjusting your search terms or filters to find what you&apos;re looking for.
          </p>
        </div>
      )}
    </div>
  );
}