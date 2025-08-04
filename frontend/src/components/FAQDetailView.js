import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { api, handleApiError, shareContent, copyToClipboard } from '../utils/api';
import LoadingSpinner from './LoadingSpinner';
import { useUser } from '../contexts/UserContext';

const FAQDetailView = () => {
  const { faqId } = useParams();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useUser();
  
  const [faqItem, setFaqItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Load FAQ item
  useEffect(() => {
    const loadFAQItem = async () => {
      try {
        setIsLoading(true);
        const item = await api.getFAQItem(faqId);
        setFaqItem(item);
      } catch (err) {
        setError(handleApiError(err));
      } finally {
        setIsLoading(false);
      }
    };

    if (faqId) {
      loadFAQItem();
    }
  }, [faqId]);

  const handleFavoriteToggle = async () => {
    if (faqItem) {
      await toggleFavorite(faqItem.id);
    }
  };

  const handleShare = async () => {
    if (!faqItem) return;

    const success = await shareContent(
      faqItem.question,
      faqItem.answer,
      window.location.href
    );

    if (success) {
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2000);
    }
  };

  const handleCopy = async () => {
    if (!faqItem) return;

    const text = `${faqItem.question}\n\n${faqItem.answer}`;
    const success = await copyToClipboard(text);

    if (success) {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  // Custom components for ReactMarkdown
  const markdownComponents = {
    h1: ({ children }) => (
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 mt-6 first:mt-0">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3 mt-5 first:mt-0">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2 mt-4 first:mt-0">
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
        {children}
      </p>
    ),
    ul: ({ children }) => (
      <ul className="list-disc list-inside space-y-2 mb-4 text-gray-600 dark:text-gray-400">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside space-y-2 mb-4 text-gray-600 dark:text-gray-400">
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="leading-relaxed">{children}</li>
    ),
    strong: ({ children }) => (
      <strong className="font-semibold text-gray-800 dark:text-gray-200">
        {children}
      </strong>
    ),
    code: ({ children }) => (
      <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono text-gray-800 dark:text-gray-200">
        {children}
      </code>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary-500 pl-4 my-4 bg-primary-50 dark:bg-primary-900/20 py-3 rounded-r-lg">
        <div className="text-gray-700 dark:text-gray-300">{children}</div>
      </blockquote>
    )
  };

  // Process answer text to highlight special sections
  const processAnswerText = (text) => {
    // Replace **text** with headers
    text = text.replace(/\*\*(.*?)\*\*/g, '## $1');
    
    // Process "Tipp:" sections
    text = text.replace(/^Tipp: (.*)$/gm, '> 💡 **Tipp:** $1');
    
    // Process "Wichtig:" sections
    text = text.replace(/^Wichtig: (.*)$/gm, '> ⚠️ **Wichtig:** $1');
    
    // Process "Achtung:" sections
    text = text.replace(/^Achtung: (.*)$/gm, '> ⚠️ **Achtung:** $1');

    return text;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="FAQ wird geladen..." />
      </div>
    );
  }

  if (error || !faqItem) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center glass-card p-8 max-w-md"
        >
          <div className="text-red-500 text-6xl mb-4">❓</div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            Artikel nicht gefunden
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {error || 'Der angeforderte Artikel konnte nicht gefunden werden.'}
          </p>
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
            <Link 
              to={`/category/${encodeURIComponent(faqItem.category)}`}
              className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              {faqItem.category}
            </Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-800 dark:text-gray-200 font-medium truncate">
              {faqItem.question.length > 50 
                ? faqItem.question.substring(0, 50) + '...' 
                : faqItem.question
              }
            </span>
          </nav>

          <div className="flex items-start justify-between">
            <button
              onClick={() => navigate(-1)}
              className="btn-secondary px-4 py-2 mr-4"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Zurück
            </button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="relative z-10 px-4 pb-12">
        <div className="max-w-4xl mx-auto">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-8"
          >
            {/* Question Header */}
            <header className="mb-8">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 leading-tight flex-1 mr-4">
                  {faqItem.question}
                </h1>
                
                <button
                  onClick={handleFavoriteToggle}
                  className={`p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ${
                    isFavorite(faqItem.id) 
                      ? 'text-red-500 hover:text-red-600' 
                      : 'text-gray-400 hover:text-red-500'
                  }`}
                  title={isFavorite(faqItem.id) ? 'Von Favoriten entfernen' : 'Zu Favoriten hinzufügen'}
                >
                  <svg className="w-6 h-6" fill={isFavorite(faqItem.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>

              <div className="flex items-center space-x-4">
                <span className="inline-block text-sm font-medium text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/50 px-4 py-2 rounded-full">
                  {faqItem.category}
                </span>
              </div>
            </header>

            {/* Answer Content */}
            <div className="markdown-content">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={markdownComponents}
              >
                {processAnswerText(faqItem.answer)}
              </ReactMarkdown>
            </div>

            {/* Actions */}
            <footer className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  War diese Antwort hilfreich?
                </span>
                
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleShare}
                    className={`btn-secondary px-4 py-2 ${shareSuccess ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' : ''}`}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                    {shareSuccess ? 'Geteilt!' : 'Teilen'}
                  </button>
                  
                  <button
                    onClick={handleCopy}
                    className={`btn-secondary px-4 py-2 ${copySuccess ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' : ''}`}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    {copySuccess ? 'Kopiert!' : 'Kopieren'}
                  </button>
                </div>
              </div>
            </footer>
          </motion.article>
        </div>
      </main>
    </div>
  );
};

export default FAQDetailView;