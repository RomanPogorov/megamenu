import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { categories, menuItemsWithCategoryNames, menuItems } from '../data/menuData';
import { MenuItem } from '../types/menu';

type MenuContextType = {
  allMenuItems: MenuItem[];
  categories: typeof categories;
  pinnedItems: MenuItem[];
  recentItems: MenuItem[];
  addToPinned: (item: MenuItem) => void;
  removeFromPinned: (itemId: string) => void;
  trackRecentItem: (item: MenuItem) => void;
  addCategoryToPinned: (categoryId: string) => void;
  isPinned: (itemId: string) => boolean;
  getCategoryIcon: (categoryId: string) => string;
  getParentIcon: (item: MenuItem) => string;
};

// Create the context
const MenuContext = createContext<MenuContextType | undefined>(undefined);

// Create the provider component
export function MenuProvider({ children }: { children: ReactNode }) {
  const [pinnedItems, setPinnedItems] = useLocalStorage<MenuItem[]>('pinnedItems', []);
  const [recentItems, setRecentItems] = useLocalStorage<MenuItem[]>('recentItems', []);
  const [initializedPinned, setInitializedPinned] = useState(false);

  // Очистка временно отключена
  // useEffect(() => {
  //   localStorage.removeItem('pinnedItems');
  //   localStorage.removeItem('recentItems');
  //   console.log('Cleared localStorage');
  // }, []);
  
  // Функция для установки правильной связи элемента с родителем
  const setCorrectParentForItem = (item: MenuItem): MenuItem => {
    if (!item.isParent && !item.parentId) {
      // Найдем родителя по категории
      const parentItem = menuItems.find(
        (m) => m.isParent && m.category === item.category
      );
      
      if (parentItem) {
        return { ...item, parentId: parentItem.id };
      }
    }
    return item;
  };
  
  // Обработка закрепленных элементов при загрузке
  useEffect(() => {
    // Обработаем уже загруженные элементы в pinnedItems
    if (pinnedItems.length > 0 && !initializedPinned) {
      // Установка правильных родителей для всех элементов
      const updatedPinnedItems = pinnedItems.map(item => setCorrectParentForItem(item));
      
      // Обновление только если были изменения
      if (JSON.stringify(updatedPinnedItems) !== JSON.stringify(pinnedItems)) {
        setPinnedItems(updatedPinnedItems);
      }
      
      setInitializedPinned(true);
    }
    // Инициализация начальными элементами, если ничего нет
    else if (!initializedPinned && pinnedItems.length === 0) {
      // Initially pin items marked as important
      const importantItems = menuItemsWithCategoryNames
        .filter(item => item.important)
        .map(item => setCorrectParentForItem(item));
        
      setPinnedItems(importantItems);
      setInitializedPinned(true);
    }
  }, [initializedPinned, pinnedItems, setPinnedItems]);

  const addToPinned = (item: MenuItem) => {
    // Don't add duplicates
    if (!pinnedItems.some(pinnedItem => pinnedItem.id === item.id)) {
      const itemToAdd = { ...item };
      
      // Если это элемент из категории, нужно установить родителя
      if (!itemToAdd.isParent && !itemToAdd.parentId) {
        // Найдем родителя по категории
        const parentItem = menuItems.find(
          (m) => m.isParent && m.category === itemToAdd.category
        );
        
        if (parentItem) {
          // Устанавливаем связь с родителем
          itemToAdd.parentId = parentItem.id;
        }
      }
      
      setPinnedItems([...pinnedItems, itemToAdd]);
    }
  };

  const removeFromPinned = (itemId: string) => {
    setPinnedItems(pinnedItems.filter(item => item.id !== itemId));
  };

  const trackRecentItem = (item: MenuItem) => {
    // Create a copy without the recent items that match this ID
    const filteredRecents = recentItems.filter(recentItem => recentItem.id !== item.id);
    
    // Add the new item to the beginning
    const updatedRecents = [item, ...filteredRecents];
    
    // Limit to most recent 10 items
    setRecentItems(updatedRecents.slice(0, 10));
  };

  // Check if an item is pinned
  const isPinned = (itemId: string): boolean => {
    return pinnedItems.some(item => item.id === itemId);
  };

  // Get category icon by category id
  const getCategoryIcon = (categoryId: string): string => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.icon : 'folder-open';
  };
  
  // Get parent icon for a child item
  const getParentIcon = (item: MenuItem): string => {
    // Если у элемента есть родитель (parentId), находим его в меню
    if (item.parentId) {
      // Найдем родителя
      const parent = menuItems.find((m: MenuItem) => m.id === item.parentId);
      if (parent) {
        // Используем иконку родителя
        return parent.icon;
      }
      
      // Если родитель не найден, пробуем найти иконку категории
      return getCategoryIcon(item.category);
    }
    
    // Если элемент не дочерний, возвращаем его собственную иконку
    return item.icon;
  };

  // Add only the category parent item to pinned (without its children)
  const addCategoryToPinned = (categoryId: string) => {
    // Get the category
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) return;
    
    // Add the category as a parent item
    const parentItem: MenuItem = {
      id: `category-${categoryId}`,
      name: category.name,
      icon: category.icon,
      category: categoryId,
      isParent: true
    };

    // Only add if not already pinned
    if (!isPinned(parentItem.id)) {
      // Add only the parent to pinned
      setPinnedItems([...pinnedItems, parentItem]);
    }
  };

  // Create the value object to be passed to consumers
  const contextValue: MenuContextType = {
    allMenuItems: menuItemsWithCategoryNames,
    categories,
    pinnedItems,
    recentItems,
    addToPinned,
    removeFromPinned,
    trackRecentItem,
    addCategoryToPinned,
    isPinned,
    getCategoryIcon,
    getParentIcon
  };
  
  // Return the Provider component with the value
  return React.createElement(MenuContext.Provider, { value: contextValue }, children);
}

// Create the hook to use the context
export function useMenu(): MenuContextType {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
}
