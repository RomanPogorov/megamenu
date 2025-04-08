import { MenuItem } from '../types/menu';
import { MAX_PINNED_ITEMS, MAX_RECENT_ITEMS } from './constants';

/**
 * Checks if adding a new item would exceed the maximum allowed pinned items
 */
export const canAddToPinned = (pinnedItems: MenuItem[]): boolean => {
  return pinnedItems.length < MAX_PINNED_ITEMS;
};

/**
 * Updates the recent items list by adding a new item to the beginning
 * and removing duplicates of the same item
 */
export const updateRecentItems = (
  recentItems: MenuItem[],
  newItem: MenuItem
): MenuItem[] => {
  // Remove existing item if present (to avoid duplicates)
  const filtered = recentItems.filter(item => item.id !== newItem.id);
  
  // Add new item to the beginning
  const updated = [newItem, ...filtered];
  
  // Limit to max items
  return updated.slice(0, MAX_RECENT_ITEMS);
};

/**
 * Get a human-readable category name from a category ID
 */
export const getCategoryNameById = (categoryId: string, categories: { id: string, name: string }[]): string => {
  const category = categories.find(cat => cat.id === categoryId);
  return category ? category.name : categoryId;
};

/**
 * Filter menu items by search query
 */
export const filterItemsByQuery = (items: MenuItem[], query: string): MenuItem[] => {
  if (!query.trim()) return [];
  
  const lowerQuery = query.toLowerCase();
  return items.filter(item => 
    item.name.toLowerCase().includes(lowerQuery)
  );
};
