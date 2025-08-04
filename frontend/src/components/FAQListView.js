import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api, handleApiError, highlightSearchText } from '../utils/api';
import LoadingSpinner, { CardSkeleton } from './LoadingSpinner';
import SearchBar from './SearchBar';
import { useUser } from '../contexts/UserContext';

const FAQListView = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useUser();
  
  const [faqItems, setFaqItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);

  // Decode category name from URL
  const decodedCategoryName = decodeURIComponent(categoryName);

  // Load FAQ items for category
  useEffect(() => {
    const loadFAQItems = async () => {
      try {
        setIsLoading(true);
        const items = await api.getFAQItems(decodedCategoryName);
        setFaqItems(items);
        setFilteredItems(items);
      } catch (err) {
        setError(handleApiError(err));
      } finally {
        setIsLoading(false);
      }
    };

    if (decodedCategoryName) {
      loadFAQItems();
    }
  }, [decodedCategoryName]);

  // Filter items based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredItems(faqItems);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = faqItems.filter(
      item =>
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query)
    );
    setFilteredItems(filtered);
  }, [searchQuery, faqItems]);

  const handleFAQClick = (faqId) => {
    navigate(`/faq/${faqId}`);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
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
    
    return cleanAnswer.length > 150 
      ? cleanAnswer.substring(0, 150) + '...'
      : cleanAnswer;
  };

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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center glass-card p-8 max-w-md"
        >
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            Fehler beim Laden
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <Link to="/" className="btn-primary px-4 py-2">
            Zurück zur Startseite
          </Link>
        </motion.div>
      </div>
    );
  }

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
              {decodedCategoryName}
            </span>
          </nav>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                {decodedCategoryName}
              </h1>
              {!isLoading && (
                <p className="text-gray-600 dark:text-gray-400">
                  {filteredItems.length} {filteredItems.length === 1 ? 'Artikel' : 'Artikel'}
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
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="relative z-10 px-4 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <SearchBar
              placeholder={`In ${decodedCategoryName} suchen...`}
              onSearch={handleSearch}
              showSuggestions={false}
            />
          </motion.div>

          {/* FAQ Items */}
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }, (_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              <AnimatePresence mode="wait">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      variants={itemVariants}
                      layout
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
                          
                          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
                            {getAnswerPreview(item.answer)}
                          </p>

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
                  ))
                ) : (
                  <motion.div
                    variants={itemVariants}
                    className="text-center py-12"
                  >
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                      Keine Ergebnisse gefunden
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      {searchQuery 
                        ? `Keine Artikel für "${searchQuery}" in dieser Kategorie gefunden.`
                        : 'In dieser Kategorie sind noch keine Artikel verfügbar.'
                      }
                    </p>
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="btn-secondary px-4 py-2"
                      >
                        Suche zurücksetzen
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default FAQListView;