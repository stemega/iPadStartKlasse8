import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [userId] = useState(() => {
    // Generate or retrieve user ID
    let id = localStorage.getItem('userId');
    if (!id) {
      id = 'user_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('userId', id);
    }
    return id;
  });

  const [hasSeenIntro, setHasSeenIntro] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

  // Load user preferences from backend
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/preferences/${userId}`);
        if (response.ok) {
          const prefs = await response.json();
          setHasSeenIntro(prefs.has_seen_intro);
          setFavorites(prefs.favorites || []);
        } else {
          console.warn('Could not load user preferences, using defaults');
        }
      } catch (error) {
        console.error('Error loading user preferences:', error);
        // Use localStorage as fallback
        const localIntro = localStorage.getItem('hasSeenIntro');
        if (localIntro) {
          setHasSeenIntro(JSON.parse(localIntro));
        }
        const localFavorites = localStorage.getItem('favorites');
        if (localFavorites) {
          setFavorites(JSON.parse(localFavorites));
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, [userId, BACKEND_URL]);

  // Save preferences to backend
  const savePreferences = async (updates) => {
    try {
      const preferences = {
        user_id: userId,
        has_seen_intro: hasSeenIntro,
        favorites: favorites,
        theme: 'light', // Will be updated when theme context is integrated
        ...updates
      };

      const response = await fetch(`${BACKEND_URL}/api/preferences/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences)
      });

      if (!response.ok) {
        throw new Error('Failed to save preferences');
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      // Save to localStorage as fallback
      if (updates.has_seen_intro !== undefined) {
        localStorage.setItem('hasSeenIntro', JSON.stringify(updates.has_seen_intro));
      }
      if (updates.favorites !== undefined) {
        localStorage.setItem('favorites', JSON.stringify(updates.favorites));
      }
    }
  };

  const markIntroComplete = async () => {
    setHasSeenIntro(true);
    await savePreferences({ has_seen_intro: true });
  };

  const toggleFavorite = async (faqId) => {
    const newFavorites = favorites.includes(faqId)
      ? favorites.filter(id => id !== faqId)
      : [...favorites, faqId];
    
    setFavorites(newFavorites);
    await savePreferences({ favorites: newFavorites });
  };

  const isFavorite = (faqId) => {
    return favorites.includes(faqId);
  };

  const resetOnboarding = async () => {
    setHasSeenIntro(false);
    await savePreferences({ has_seen_intro: false });
  };

  const value = {
    userId,
    hasSeenIntro,
    favorites,
    isLoading,
    markIntroComplete,
    toggleFavorite,
    isFavorite,
    resetOnboarding
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};