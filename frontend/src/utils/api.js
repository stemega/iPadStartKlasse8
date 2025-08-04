const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

// API utility functions for the iPad Help App
export const api = {
  // Health check
  async healthCheck() {
    const response = await fetch(`${BACKEND_URL}/api/health`);
    if (!response.ok) {
      throw new Error(`Health check failed: ${response.status}`);
    }
    return response.json();
  },

  // Categories
  async getCategories() {
    const response = await fetch(`${BACKEND_URL}/api/categories`);
    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.status}`);
    }
    return response.json();
  },

  // FAQ Items
  async getFAQItems(category = null, search = null, limit = 100) {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    if (limit) params.append('limit', limit.toString());

    const response = await fetch(`${BACKEND_URL}/api/faq?${params}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch FAQ items: ${response.status}`);
    }
    return response.json();
  },

  // Single FAQ Item
  async getFAQItem(faqId) {
    const response = await fetch(`${BACKEND_URL}/api/faq/${faqId}`);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('FAQ item not found');
      }
      throw new Error(`Failed to fetch FAQ item: ${response.status}`);
    }
    return response.json();
  },

  // Advanced Search
  async searchFAQ(query, limit = 20) {
    const params = new URLSearchParams();
    params.append('q', query);
    if (limit) params.append('limit', limit.toString());

    const response = await fetch(`${BACKEND_URL}/api/search?${params}`);
    if (!response.ok) {
      throw new Error(`Search failed: ${response.status}`);
    }
    return response.json();
  },

  // User Preferences
  async getUserPreferences(userId) {
    const response = await fetch(`${BACKEND_URL}/api/preferences/${userId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch user preferences: ${response.status}`);
    }
    return response.json();
  },

  async updateUserPreferences(userId, preferences) {
    const response = await fetch(`${BACKEND_URL}/api/preferences/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preferences)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update user preferences: ${response.status}`);
    }
    return response.json();
  }
};

// Utility function to handle API errors
export const handleApiError = (error) => {
  console.error('API Error:', error);
  
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return 'Netzwerkfehler: Bitte prüfe deine Internetverbindung.';
  }
  
  if (error.message.includes('404')) {
    return 'Die angeforderte Ressource wurde nicht gefunden.';
  }
  
  if (error.message.includes('500')) {
    return 'Serverfehler: Bitte versuche es später erneut.';
  }
  
  return error.message || 'Ein unbekannter Fehler ist aufgetreten.';
};

// Debounce utility for search
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Format text highlighting for search results
export const highlightSearchText = (text, searchTerm) => {
  if (!searchTerm || !text) return text;
  
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">$1</mark>');
};

// Get category icon based on category name
export const getCategoryIcon = (categoryName) => {
  const iconMap = {
    'Erste Schritte': 'play-circle',
    'Apps & Tools': 'grid-3x3-gap',
    'Troubleshooting': 'tools',
    'Dateien & Organisation': 'folder',
    'Kommunikation & Zusammenarbeit': 'people',
    'Sicherheit & Verantwortung': 'shield-check',
    'Tipps & Tricks': 'lightbulb',
    'Multimedia & Projekte': 'play-btn'
  };
  
  return iconMap[categoryName] || 'question-mark';
};

// Format relative time
export const formatRelativeTime = (date) => {
  const now = new Date();
  const then = new Date(date);
  const diffInSeconds = Math.floor((now - then) / 1000);
  
  if (diffInSeconds < 60) return 'gerade eben';
  if (diffInSeconds < 3600) return `vor ${Math.floor(diffInSeconds / 60)} Minuten`;
  if (diffInSeconds < 86400) return `vor ${Math.floor(diffInSeconds / 3600)} Stunden`;
  if (diffInSeconds < 2592000) return `vor ${Math.floor(diffInSeconds / 86400)} Tagen`;
  
  return then.toLocaleDateString('de-DE', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

// Share content utility
export const shareContent = async (title, text, url = null) => {
  if (navigator.share) {
    try {
      await navigator.share({
        title,
        text,
        url: url || window.location.href
      });
      return true;
    } catch (error) {
      console.log('Native share failed:', error);
    }
  }
  
  // Fallback: copy to clipboard
  try {
    await navigator.clipboard.writeText(`${title}\n\n${text}\n\n${url || window.location.href}`);
    return true;
  } catch (error) {
    console.error('Clipboard write failed:', error);
    return false;
  }
};

// Copy to clipboard utility
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (fallbackError) {
      document.body.removeChild(textArea);
      return false;
    }
  }
};