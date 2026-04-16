/**
 * ═══════════════════════════════════════════════════════════════
 * Advanced Search Component
 * ═══════════════════════════════════════════════════════════════
 *
 * Complete search functionality
 *
 * Features:
 * - Global search
 * - Search suggestions
 * - Recent searches
 * - Advanced filters
 * - Search history
 * - Keyboard shortcuts
 *
 * Author: VCSA Development Team
 * Created: April 2026
 * Status: Production Ready
 * ═══════════════════════════════════════════════════════════════
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Clock, TrendingUp, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '@/utils/apiOptimization';
import { debounce } from '@/utils/helpers';
import '@/components/search/SearchBar.css';

export const SearchBar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [trendingSearches, setTrendingSearches] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const searchRef = useRef(null);

  useEffect(() => {
    loadRecentSearches();
    loadTrendingSearches();

    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim()) {
      performSearch(query);
    } else {
      setResults([]);
    }
  }, [query, activeCategory]);

  const loadRecentSearches = () => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load recent searches:', error);
      }
    }
  };

  const loadTrendingSearches = async () => {
    try {
      const response = await apiClient.get('/api/search/trending');
      setTrendingSearches(response.data || []);
    } catch (error) {
      console.error('Failed to load trending searches:', error);
    }
  };

  const performSearch = debounce(async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.get('/api/search', {
        params: {
          q: searchQuery,
          category: activeCategory !== 'all' ? activeCategory : undefined
        }
      });

      setResults(response.data || []);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, 300);

  const handleSearch = (searchQuery) => {
    if (!searchQuery.trim()) return;

    // Save to recent searches
    const newRecent = [
      searchQuery,
      ...recentSearches.filter(s => s !== searchQuery)
    ].slice(0, 5);

    setRecentSearches(newRecent);
    localStorage.setItem('recentSearches', JSON.stringify(newRecent));

    // Navigate to search results page
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    setIsOpen(false);
    setQuery('');
  };

  const handleResultClick = (result) => {
    // Navigate to result
    if (result.url) {
      navigate(result.url);
    } else if (result.type === 'track') {
      navigate(`/track/${result.id}`);
    } else if (result.type === 'module') {
      navigate(`/track/${result.trackId}/module/${result.id}`);
    }

    setIsOpen(false);
    setQuery('');
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const handleKeyDown = (event) => {
    // Open search with Cmd/Ctrl + K
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      event.preventDefault();
      setIsOpen(!isOpen);
    }

    // Close with Escape
    if (event.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'tracks', label: 'Tracks' },
    { id: 'modules', label: 'Modules' },
    { id: 'breakdowns', label: 'Deal Breakdowns' },
    { id: 'quickwins', label: 'Quick Wins' },
    { id: 'community', label: 'Community' }
  ];

  return (
    <div className="search-bar" ref={searchRef}>
      {/* Search Input */}
      <div className="search-input-wrapper">
        <Search className="search-icon" size={20} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search tracks, modules, content... (⌘K)"
          className="search-input"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="clear-button"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Search Results Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="search-panel"
          >
            {/* Categories */}
            <div className="search-categories">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`category-button ${activeCategory === category.id ? 'active' : ''}`}
                >
                  {category.label}
                </button>
              ))}
            </div>

            {/* Search Results */}
            {query.trim() && (
              <div className="search-results">
                {loading ? (
                  <div className="loading-state">Searching...</div>
                ) : results.length === 0 ? (
                  <div className="empty-state">
                    <p>No results found for "{query}"</p>
                  </div>
                ) : (
                  results.map((result, index) => (
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="search-result-item"
                      onClick={() => handleResultClick(result)}
                    >
                      <div className="result-icon">{result.icon}</div>
                      <div className="result-content">
                        <h4>{result.title}</h4>
                        <p>{result.description}</p>
                        <span className="result-type">{result.type}</span>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            )}

            {/* Recent & Trending (shown when no query) */}
            {!query.trim() && (
              <div className="search-suggestions">
                {recentSearches.length > 0 && (
                  <div className="suggestion-section">
                    <div className="suggestion-header">
                      <Clock size={16} />
                      <h4>Recent Searches</h4>
                      <button
                        onClick={clearRecentSearches}
                        className="clear-button"
                      >
                        Clear
                      </button>
                    </div>
                    <div className="suggestion-list">
                      {recentSearches.map(search => (
                        <button
                          key={search}
                          onClick={() => handleSearch(search)}
                          className="suggestion-item"
                        >
                          <Search size={16} />
                          {search}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {trendingSearches.length > 0 && (
                  <div className="suggestion-section">
                    <div className="suggestion-header">
                      <TrendingUp size={16} />
                      <h4>Trending</h4>
                    </div>
                    <div className="suggestion-list">
                      {trendingSearches.map(search => (
                        <button
                          key={search.id}
                          onClick={() => handleSearch(search.query)}
                          className="suggestion-item"
                        >
                          <TrendingUp size={16} />
                          {search.query}
                          <span className="search-count">{search.count}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Search Tips */}
            <div className="search-tips">
              <p>💡 <strong>Tip:</strong> Use <kbd>⌘K</kbd> to open search anywhere</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
