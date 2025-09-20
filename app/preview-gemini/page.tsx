"use client";

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CATALOGS, getUniqueCategories } from '../catalogs/_data/catalogs';
import { CatalogItem } from '../catalogs/_types';
import styles from './gemini.module.css';

export default function PreviewGeminiPage() {
  const [search, setSearch] = useState('');
  const [currentFilter, setCurrentFilter] = useState('all');
  const [isScrolled, setIsScrolled] = useState(false);
  const [showPreviewBanner, setShowPreviewBanner] = useState(false);

  // Get unique categories from data
  const categories = useMemo(() => getUniqueCategories(), []);

  // Show preview banner if environment variable is set
  useEffect(() => {
    setShowPreviewBanner(process.env.NEXT_PUBLIC_USE_GEMINI_PREVIEW === 'true');
  }, []);

  // Handle scroll for navbar effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter catalogs (no pagination)
  const filteredCatalogs = useMemo(() => {
    return CATALOGS.filter((catalog: CatalogItem) => {
      const matchesCategory = currentFilter === 'all' || catalog.category === currentFilter;
      const matchesSearch = catalog.title.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [search, currentFilter]);

  const handlePreview = (item: CatalogItem) => {
    if (item.previewUrl) {
      window.open(item.previewUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleDownload = (item: CatalogItem) => {
    if (item.downloadUrl) {
      window.open(item.downloadUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className={`${styles.geminiContainer} antialiased`}>
      {/* Preview Banner */}
      {showPreviewBanner && (
        <div className={styles.previewBanner}>
          🎨 Gemini UI Preview enabled - This is a test version of the new design
        </div>
      )}

      {/* Header & Navigation */}
      <header 
        id="header" 
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled ? styles.navbarScrolled : ''
        }`}
      >
        <nav className="container mx-auto px-6 py-5 flex justify-between items-center">
          <Link href="/" className={`text-3xl ${styles.fontSerif} font-bold tracking-wider text-gray-800`}>
            HINCH
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-10">
            <Link href="/" className={`${styles.linkUnderline} text-gray-700 font-medium`}>Home</Link>
            <a href="#catalogs" className={`${styles.linkUnderline} text-gray-700 font-medium`}>Catalogs</a>
            <a href="#contact" className={`${styles.linkUnderline} text-gray-700 font-medium`}>Contact</a>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" x2="20" y1="12" y2="12"/>
              <line x1="4" x2="20" y1="6" y2="6"/>
              <line x1="4" x2="20" y1="18" y2="18"/>
            </svg>
          </button>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section className="min-h-[75vh] flex items-center">
          <div className="container mx-auto px-6 text-center">
            <h1 className={`${styles.fontSerif} text-5xl md:text-7xl font-bold leading-tight md:leading-tight mb-6`}>
              Curated Spaces, <br className="hidden md:block" /> Inspired Living.
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto text-gray-600 mb-10">
              Discover our collection of catalogs, each a sourcebook for timeless and modern design.
            </p>
            <a href="#catalogs" className={`${styles.btn} ${styles.btnOrange}`}>
              Explore Catalogs
            </a>
          </div>
        </section>

        {/* Catalogs Section */}
        <section id="catalogs" className="py-20 md:py-28 bg-orange-50/50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-10">
              <h2 className={`${styles.fontSerif} text-4xl md:text-5xl font-bold`}>Collections</h2>
              <p className="text-gray-600 mt-3 max-w-xl mx-auto">A glimpse into our world of design and craftsmanship.</p>
            </div>
            
            {/* Filter & Search Controls */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
              <div className="flex flex-wrap justify-center gap-3">
                <button 
                  className={`${styles.filterBtn} ${currentFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setCurrentFilter('all')}
                >
                  All ({CATALOGS.length})
                </button>
                {categories.slice(1).map((category) => {
                  const count = CATALOGS.filter(item => item.category === category).length;
                  return (
                    <button 
                      key={category}
                      className={`${styles.filterBtn} ${currentFilter === category ? 'active' : ''}`}
                      onClick={() => setCurrentFilter(category)}
                    >
                      {category} ({count})
                    </button>
                  );
                })}
              </div>
              <input 
                type="text" 
                placeholder="Search catalogs..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`${styles.searchInput} w-full md:w-64`}
              />
            </div>
            
            {/* Catalog Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {filteredCatalogs.length === 0 ? (
                <p className="text-center text-gray-500 col-span-full">No catalogs found.</p>
              ) : (
                filteredCatalogs.map((catalog) => (
                  <div key={catalog.id} className={`${styles.catalogCard} rounded-lg overflow-hidden bg-white`}>
                    {catalog.thumbnail ? (
                      <Image
                        src={catalog.thumbnail}
                        alt={catalog.title}
                        width={300}
                        height={240}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://placehold.co/400x320/e5e7eb/1f2937?text=Hinch+Catalog';
                        }}
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                        <span className="text-gray-500 text-sm">No Preview</span>
                      </div>
                    )}
                    <div className="p-3">
                      <h3 className={`${styles.fontSerif} text-lg font-bold text-gray-800 mb-1 line-clamp-1`}>
                        {catalog.title}
                      </h3>
                      <p className="text-gray-600 mb-1 text-xs">{catalog.brand}</p>
                      <p className="text-gray-600 mb-2 text-xs">{catalog.category}</p>
                      {catalog.description && (
                        <p className="text-gray-600 mb-3 text-xs line-clamp-2">{catalog.description}</p>
                      )}
                      <div className="flex gap-1">
                        {catalog.previewUrl && (
                          <button
                            onClick={() => handlePreview(catalog)}
                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md px-2 py-1 text-xs font-medium transition-colors"
                          >
                            Preview
                          </button>
                        )}
                        {catalog.downloadUrl && (
                          <button
                            onClick={() => handleDownload(catalog)}
                            className="flex-1 bg-orange-600 hover:bg-orange-700 text-white rounded-md px-2 py-1 text-xs font-medium transition-colors"
                          >
                            Download
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="contact" className="bg-white">
        <div className="container mx-auto px-6 py-16 text-center">
          <h3 className={`${styles.fontSerif} text-3xl font-bold`}>HINCH</h3>
          <p className="text-gray-600 mt-3 mb-6">Designing the future of living spaces.</p>
          <div className="mt-12 border-t border-gray-100 pt-8 text-sm text-gray-500">
            <p>&copy; 2024 Hinch Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
