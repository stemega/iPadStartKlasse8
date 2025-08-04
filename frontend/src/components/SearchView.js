import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { api, handleApiError, highlightSearchText } from '../utils/api';
import LoadingSpinner, { CardSkeleton } from './LoadingSpinner';
import SearchBar from './SearchBar';
import { useUser } from '../contexts/UserContext';

const SearchView = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useUser();
  
  const initialQuery = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  // Perform search
  const performSearch = async (query) => {
    if (!query.trim() || query.length < 2) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setHasSearched(true);
      
      const results = await api.searchFAQ(query);
      setSearchResults(results);
    } catch (err) {
      setError(handleApiError(err));
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search from search bar
  const handleSearch = (query) => {
    setSearchQuery(query);
    // Update URL with search query
    navigate(`/search?q=${encodeURIComponent(query)}`, { replace: true });
    performSearch(query);
  };

  // Load initial search if query in URL
  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleFAQClick = (faqId) => {
    navigate(`/faq/${faqId}`);
  };

  const handleFavoriteToggle = async (e, faqId) => {
    e.stopPropagation();
    await toggleFavorite(faqId);
  };

  // Get preview text for FAQ answer
  const getAnswerPreview = (answer) => {
    const cleanAnswer = answer
      .replace(/\*\*/g, '')
      .replace(/\n/g, ' ')
      .trim();
    
    return cleanAnswer.length > 200 
      ? cleanAnswer.substring(0, 200) + '...'
      : cleanAnswer;
  };

  // Group results by category
  const groupedResults = searchResults.reduce((groups, item) => {
    const category = item.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {});

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen">
      {/* Background */}
      <div className="absolute inset-0 gradient-mesh"></div>
      
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 px-4 py-6"
      >
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
            <Link 
              to="/" 
              className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              iPad-Hilfe
            </Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-800 dark:text-gray-200 font-medium">
              Suche
            </span>
          </nav>

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                Suche
              </h1>
              {hasSearched && (
                <p className="text-gray-600 dark:text-gray-400">
                  {searchResults.length} {searchResults.length === 1 ? 'Ergebnis' : 'Ergebnisse'}
                  {searchQuery && ` für "${searchQuery}"`}
                </p>
              )}
            </div>
            
            <Link
              to="/"
              className="btn-secondary px-4 py-2"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Zurück
            </Link>
          </div>

          {/* Search Bar */}
          <SearchBar
            placeholder="FAQ durchsuchen..."
            onSearch={handleSearch}
            showSuggestions={false}
            autoFocus={!initialQuery}
          />
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="relative z-10 px-4 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Loading State */}
          {isLoading && (
            <div className="space-y-4">
              {Array.from({ length: 3 }, (_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Error State */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-8 text-center"
            >
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                Suchfehler
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{error}</p>
            </motion.div>
          )}

          {/* Results */}
          {!isLoading && !error && (
            <AnimatePresence mode="wait">
              {hasSearched && searchResults.length === 0 ? (
                // No Results
                <motion.div
                  key="no-results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center py-12"
                >
                  <div className="text-6xl mb-6">🔍</div>
                  <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                    Keine Ergebnisse gefunden
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">
                    {searchQuery 
                      ? `Wir konnten keine Artikel für "${searchQuery}" finden. Versuche es mit anderen Suchbegriffen.`
                      : 'Gib einen Suchbegriff ein, um FAQ-Artikel zu finden.'
                    }
                  </p>
                  
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-gray-700 dark:text-gray-300">
                      Beliebte Suchbegriffe:
                    </h4>
                    <div className="flex flex-wrap justify-center gap-2">
                      {['Apple-ID', 'WLAN', 'Screenshot', 'GoodNotes', 'Pages', 'mebis', 'iCloud'].map((term) => (
                        <button
                          key={term}
                          onClick={() => handleSearch(term)}
                          className="px-4 py-2 bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 rounded-full hover:bg-primary-200 dark:hover:bg-primary-900/70 transition-colors text-sm font-medium"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : searchResults.length > 0 ? (
                // Results
                <motion.div
                  key="results"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {Object.entries(groupedResults).map(([category, items]) => (
                    <motion.section
                      key={category}
                      variants={itemVariants}
                      className="mb-10"
                    >
                      <div className="flex items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                          {category}
                        </h2>
                        <span className="ml-3 bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 text-sm font-medium px-3 py-1 rounded-full">
                          {items.length}
                        </span>
                      </div>
                      
                      <div className="space-y-4">
                        {items.map((item) => (
                          <motion.div
                            key={item.id}
                            variants={itemVariants}
                            whileHover={{ scale: 1.01, y: -2 }}
                            onClick={() => handleFAQClick(item.id)}
                            className="faq-card group cursor-pointer"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1 mr-4">
                                <h3 
                                  className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3 leading-tight"
                                  dangerouslySetInnerHTML={{
                                    __html: highlightSearchText(item.question, searchQuery)
                                  }}
                                />
                                
                                <p 
                                  className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4"
                                  dangerouslySetInnerHTML={{
                                    __html: highlightSearchText(getAnswerPreview(item.answer), searchQuery)
                                  }}
                                />

                                <div className="flex items-center space-x-4">
                                  <span className="inline-block text-xs font-medium text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/50 px-3 py-1 rounded-full">
                                    {item.category}
                                  </span>
                                  
                                  <div className="flex items-center text-primary-600 dark:text-primary-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <span>Weiterlesen</span>
                                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                  </div>
                                </div>
                              </div>

                              {/* Favorite Button */}
                              <button
                                onClick={(e) => handleFavoriteToggle(e, item.id)}
                                className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ${
                                  isFavorite(item.id) 
                                    ? 'text-red-500 hover:text-red-600' 
                                    : 'text-gray-400 hover:text-red-500'
                                }`}
                                title={isFavorite(item.id) ? 'Von Favoriten entfernen' : 'Zu Favoriten hinzufügen'}
                              >
                                <svg className="w-5 h-5" fill={isFavorite(item.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.section>
                  ))}
                </motion.div>
              ) : !hasSearched ? (
                // Initial State - Search Suggestions
                <motion.div
                  key="initial"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12"
                >
                  <div className="text-6xl mb-6">🔍</div>
                  <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                    Wonach suchst du?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">
                    Durchsuche unsere umfassende FAQ-Sammlung nach Antworten auf deine iPad-Fragen.
                  </p>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">
                        Beliebte Themen:
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
                        {[
                          { term: 'Apple-ID', icon: '👤' },
                          { term: 'WLAN', icon: '📶' },
                          { term: 'Screenshot', icon: '📸' },
                          { term: 'GoodNotes', icon: '📝' },
                          { term: 'Pages', icon: '📄' },
                          { term: 'mebis', icon: '🎓' },
                          { term: 'iCloud', icon: '☁️' },
                          { term: 'Troubleshooting', icon: '🔧' }
                        ].map(({ term, icon }) => (
                          <button
                            key={term}
                            onClick={() => handleSearch(term)}
                            className="p-4 glass-card hover:scale-105 transition-transform duration-200 group"
                          >
                            <div className="text-2xl mb-2">{icon}</div>
                            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                              {term}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          )}
        </div>
      </main>
    </div>
  );
};

export default SearchView;