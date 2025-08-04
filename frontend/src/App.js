import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import OnboardingView from './components/OnboardingView';
import HelpHomeView from './components/HelpHomeView';
import FAQListView from './components/FAQListView';
import FAQDetailView from './components/FAQDetailView';
import SearchView from './components/SearchView';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { UserProvider, useUser } from './contexts/UserContext';
import './App.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

function AppContent() {
  const { theme } = useTheme();
  const { hasSeenIntro, markIntroComplete } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Apply theme class to document
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    // Check backend health and initialize app
    const initializeApp = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/health`);
        if (!response.ok) {
          throw new Error('Backend service unavailable');
        }
        const health = await response.json();
        console.log('Backend health:', health);
        
        // Small delay for smooth loading experience
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setIsLoading(false);
      } catch (err) {
        console.error('App initialization error:', err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 dark:from-gray-900 dark:to-gray-800">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 glass-card max-w-md"
        >
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            Verbindungsfehler
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Die Anwendung konnte nicht gestartet werden.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary px-4 py-2 mt-4"
          >
            Erneut versuchen
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
        <AnimatePresence mode="wait">
          {!hasSeenIntro ? (
            <motion.div
              key="onboarding"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <OnboardingView onContinue={markIntroComplete} />
            </motion.div>
          ) : (
            <motion.div
              key="main-app"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Routes>
                <Route path="/" element={<HelpHomeView />} />
                <Route path="/category/:categoryName" element={<FAQListView />} />
                <Route path="/faq/:faqId" element={<FAQDetailView />} />
                <Route path="/search" element={<SearchView />} />
                <Route path="*" element={<HelpHomeView />} />
              </Routes>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Router>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <UserProvider>
          <AppContent />
        </UserProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;