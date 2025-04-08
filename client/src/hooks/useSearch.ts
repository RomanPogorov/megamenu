import { useState, useMemo } from 'react';
import { useMenu } from './useMenu';
import { MenuItem } from '../types/menu';

export const useSearch = () => {
  const { allMenuItems, categories } = useMenu();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  // Search results filtered by query
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    return allMenuItems.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, allMenuItems]);

  // Group search results by category
  const searchResultsByCategory = useMemo(() => {
    return searchResults.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, MenuItem[]>);
  }, [searchResults]);

  // Create filter options with counts
  const filterOptions = useMemo(() => {
    const filters = [
      { id: 'all', name: 'All', count: searchResults.length }
    ];

    // Add categories that have results
    Object.entries(searchResultsByCategory).forEach(([categoryId, items]) => {
      const category = categories.find(c => c.id === categoryId);
      if (category) {
        filters.push({
          id: categoryId,
          name: category.name,
          count: items.length
        });
      }
    });

    return filters;
  }, [searchResultsByCategory, searchResults.length, categories]);

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    searchResultsByCategory,
    activeFilter,
    setActiveFilter,
    filterOptions
  };
};
