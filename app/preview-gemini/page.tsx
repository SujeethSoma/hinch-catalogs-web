"use client";

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { CATALOGS, getUniqueCategories } from '../catalogs/_data/catalogs';
import { CatalogItem } from '../catalogs/_types';
import styles from './gemini.module.css';

export default function PreviewGeminiPage() {
  const [search, setSearch] = useState('');
  const [currentFilter, setCurrentFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showPreviewBanner, setShowPreviewBanner] = useState(false);

  const itemsPerPage = 6;

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

  // Filter and paginate catalogs
  const filteredCatalogs = useMemo(() => {
    return CATALOGS.filter((catalog: CatalogItem) => {
      const matchesCategory = currentFilter === 'all' || catalog.category === currentFilter;
      const matchesSearch = catalog.title.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [search, currentFilter]);

  const totalPages = Math.ceil(filteredCatalogs.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedCatalogs = filteredCatalogs.slice(start, end);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
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
          <a href="/" className={`text-3xl ${styles.fontSerif} font-bold tracking-wider text-gray-800`}>
            HINCH
          </a>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-10">
            <a href="/" className={`${styles.linkUnderline} text-gray-700 font-medium`}>Home</a>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
              {paginatedCatalogs.length === 0 ? (
                <p className="text-center text-gray-500 col-span-full">No catalogs found.</p>
              ) : (
                paginatedCatalogs.map((catalog) => (
                  <div key={catalog.id} className={`${styles.catalogCard} rounded-lg overflow-hidden bg-white`}>
                    {catalog.thumbnail ? (
                      <Image
                        src={catalog.thumbnail}
                        alt={catalog.title}
                        width={400}
                        height={384}
                        className="w-full h-96 object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://placehold.co/600x800/e5e7eb/1f2937?text=Hinch+Catalog';
                        }}
                      />
                    ) : (
                      <div className="w-full h-96 bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                        <span className="text-gray-500 text-lg">No Preview</span>
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className={`${styles.fontSerif} text-xl font-bold text-gray-800 mb-2`}>
                        {catalog.title}
                      </h3>
                      <p className="text-gray-600 mb-2 text-sm">{catalog.brand}</p>
                      <p className="text-gray-600 mb-4 text-sm">{catalog.category}</p>
                      {catalog.description && (
                        <p className="text-gray-600 mb-4 text-sm line-clamp-2">{catalog.description}</p>
                      )}
                      <div className="flex gap-2">
                        {catalog.previewUrl && (
                          <button
                            onClick={() => handlePreview(catalog)}
                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
                          >
                            Preview
                          </button>
                        )}
                        {catalog.downloadUrl && (
                          <button
                            onClick={() => handleDownload(catalog)}
                            className="flex-1 bg-orange-600 hover:bg-orange-700 text-white rounded-lg px-3 py-2 text-sm font-medium transition-colors"
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

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-16">
                <button 
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="font-bold text-gray-500 hover:text-orange-600 disabled:text-gray-300 disabled:cursor-not-allowed"
                >
                  ← Previous
                </button>
                <span className="text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button 
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="font-bold text-gray-500 hover:text-orange-600 disabled:text-gray-300 disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="contact" className="bg-white">
        <div className="container mx-auto px-6 py-16 text-center">
          <h3 className={`${styles.fontSerif} text-3xl font-bold`}>HINCH</h3>
          <p className="text-gray-600 mt-3 mb-6">Designing the future of living spaces.</p>
          <div className="flex justify-center space-x-6">
            <a href="#" className="text-gray-500 hover:text-orange-600 transition">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 1.4 3.3 4.9 3.3 4.9s-1.4-1.5-3-2.1c-.5 2.4-2 4.1-3.5 5.2-1.7 1.2-4.1 1.7-6.2 1.3-2.1-.4-3.9-1.5-5.2-3.2-1.3-1.7-2-3.8-1.9-5.9.1-2 1.1-3.8 2.8-5.2 1.7-1.4 3.8-2.2 6.1-2.2h.5c1.6 0 3.2.4 4.6 1.2s2.5 1.9 3.5 3.5c0 0 2.1-1.2 3.4-2.2z"/>
              </svg>
            </a>
            <a href="#" className="text-gray-500 hover:text-orange-600 transition">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
            </a>
            <a href="#" className="text-gray-500 hover:text-orange-600 transition">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
          </div>
          <div className="mt-12 border-t border-gray-100 pt-8 text-sm text-gray-500">
            <p>&copy; 2024 Hinch Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
