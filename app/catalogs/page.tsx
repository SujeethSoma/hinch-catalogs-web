"use client";

import { useState, useMemo } from 'react';
import { CATALOGS, getUniqueBrands, getUniqueCategories } from './_data/catalogs';
import { CatalogItem } from './_types';
import Toolbar from './_components/Toolbar';
import CatalogCard from './_components/CatalogCard';
import CategoryTabs from './_components/CategoryTabs';

export default function CatalogsPage() {
  const [search, setSearch] = useState('');
  const [brand, setBrand] = useState('All');
  const [category, setCategory] = useState('All');
  const [view, setView] = useState<'Preview' | 'Details'>('Preview');

  // Get unique brands and categories from data
  const brands = useMemo(() => getUniqueBrands(), []);
  const categories = useMemo(() => getUniqueCategories(), []);

  // Calculate category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    
    // Count items for each category based on current search and brand filters
    categories.forEach((cat) => {
      if (cat === 'All') {
        counts[cat] = CATALOGS.filter((item: CatalogItem) => {
          const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
          const matchesBrand = brand === 'All' || item.brand === brand;
          return matchesSearch && matchesBrand;
        }).length;
      } else {
        counts[cat] = CATALOGS.filter((item: CatalogItem) => {
          const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
          const matchesBrand = brand === 'All' || item.brand === brand;
          const matchesCategory = item.category === cat;
          return matchesSearch && matchesBrand && matchesCategory;
        }).length;
      }
    });
    
    return counts;
  }, [categories, search, brand]);

  // Filter items based on search, brand, and category
  const filteredItems = useMemo(() => {
    return CATALOGS.filter((item: CatalogItem) => {
      const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
      const matchesBrand = brand === 'All' || item.brand === brand;
      const matchesCategory = category === 'All' || item.category === category;
      
      return matchesSearch && matchesBrand && matchesCategory;
    });
  }, [search, brand, category]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 bg-[#F8FAFC] min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-[#111827]">HINCH</h1>
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
            Try adjusting your search terms or filters to find what you're looking for.
          </p>
        </div>
      )}
    </div>
  );
}
