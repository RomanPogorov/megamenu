import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { useLocalStorage } from "./useLocalStorage";
import {
  categories,
  menuItemsWithCategoryNames,
  menuItems,
} from "../data/menuData";
import { MenuItem } from "../types/menu";

type MenuContextType = {
  allMenuItems: MenuItem[];
  categories: typeof categories;
  pinnedItems: MenuItem[];
  recentItems: MenuItem[];
  setPinnedItems: (items: MenuItem[]) => void;
  addToPinned: (item: MenuItem) => void;
  removeFromPinned: (itemId: string) => void;
  removeAllPinned: () => void;
  trackRecentItem: (item: MenuItem) => void;
  addCategoryToPinned: (categoryId: string) => void;
  isPinned: (itemId: string) => boolean;
  getCategoryIcon: (categoryId: string) => string | React.ReactNode;
  getParentIcon: (item: MenuItem) => string | React.ReactNode;
  getParentName: (item: MenuItem) => string;
  activeItemId: string;
  isActiveItem: (id: string) => boolean;
  setActiveItem: (id: string) => void;
};

// Create the context
const MenuContext = createContext<MenuContextType | undefined>(undefined);

// Create the provider component
export function MenuProvider({ children }: { children: ReactNode }) {
  const [pinnedItems, setPinnedItems] = useLocalStorage<MenuItem[]>(
    "pinnedItems",
    []
  );
  const [recentItems, setRecentItems] = useLocalStorage<MenuItem[]>(
    "recentItems",
    []
  );

  // Синхронизация названий элементов в pinnedItems с menuData
  useEffect(() => {
    if (pinnedItems.length > 0) {
      const updatedItems = pinnedItems.map((pinnedItem) => {
        // Пытаемся найти соответствующий элемент в menuItems
        const sourceItem = menuItems.find((item) => item.id === pinnedItem.id);

        // Для категорий проверяем id в формате "category-..."
        const categoryId = pinnedItem.id.startsWith("category-")
          ? pinnedItem.id.replace("category-", "")
          : null;
        const sourceCategory = categoryId
          ? categories.find((cat) => cat.id === categoryId)
          : null;

        if (sourceItem) {
          // Обновляем название из оригинального источника
          return { ...pinnedItem, name: sourceItem.name };
        } else if (sourceCategory) {
          // Для элементов категорий используем имя из categories
          return { ...pinnedItem, name: sourceCategory.name };
        }

        return pinnedItem;
      });

      // Обновляем pinnedItems только если есть изменения
      const hasChanges =
        JSON.stringify(updatedItems) !== JSON.stringify(pinnedItems);
      if (hasChanges) {
        setPinnedItems(updatedItems);
      }
    }
  }, [menuItems, categories]); // Зависимости, чтобы эффект срабатывал при изменении исходных данных

  const addToPinned = (item: MenuItem) => {
    // Don't add duplicates
    if (!pinnedItems.some((pinnedItem) => pinnedItem.id === item.id)) {
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

      // Если это элемент 'getting-started', добавляем его в начало списка
      if (itemToAdd.id === "getting-started") {
        setPinnedItems([itemToAdd, ...pinnedItems]);
      } else {
        setPinnedItems([...pinnedItems, itemToAdd]);
      }
    }
  };

  const removeFromPinned = (itemId: string) => {
    setPinnedItems(pinnedItems.filter((item) => item.id !== itemId));
  };

  const trackRecentItem = (item: MenuItem) => {
    // Create a copy without the recent items that match this ID
    const filteredRecents = recentItems.filter(
      (recentItem) => recentItem.id !== item.id
    );

    // Add the new item to the beginning
    const updatedRecents = [item, ...filteredRecents];

    // Limit to most recent 10 items
    setRecentItems(updatedRecents.slice(0, 10));
  };

  // Check if an item is pinned
  const isPinned = (itemId: string): boolean => {
    // Если это ID с префиксом category-, проверяем точное совпадение
    if (itemId.startsWith("category-")) {
      return pinnedItems.some((item) => item.id === itemId);
    }

    // Для обычных элементов проверяем точное совпадение
    return pinnedItems.some((item) => item.id === itemId);
  };

  // Get category icon by category id
  const getCategoryIcon = (categoryId: string): string | React.ReactNode => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.icon : "folder-open";
  };

  // Get parent icon for a child item
  const getParentIcon = (item: MenuItem): string | React.ReactNode => {
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
    const category = categories.find((cat) => cat.id === categoryId);
    if (!category) return;

    // Add the category as a parent item
    const parentItem: MenuItem = {
      id: `category-${categoryId}`,
      name: category.name,
      icon: category.icon,
      category: categoryId,
      isParent: true,
    };

    // Only add if not already pinned
    if (!isPinned(parentItem.id)) {
      // Add only the parent to pinned
      setPinnedItems([...pinnedItems, parentItem]);
    }
  };

  const getParentName = (item: MenuItem) => {
    if (!item.parentId) return "";
    const parent = menuItems.find((i) => i.id === item.parentId);
    return parent?.name || "";
  };

  const removeAllPinned = useCallback(() => {
    setPinnedItems([]);
  }, []);

  // Состояние активного элемента
  const [activeItemId, setActiveItemId] = useState<string>("resources"); // По умолчанию раздел ресурсов

  // Функция проверки активности
  const isActiveItem = (id: string): boolean => {
    return id === activeItemId;
  };

  // Функция установки активного элемента
  const setActiveItem = (id: string) => {
    setActiveItemId(id);
  };

  // Create the value object to be passed to consumers
  const contextValue: MenuContextType = {
    allMenuItems: menuItems,
    categories,
    pinnedItems,
    recentItems,
    setPinnedItems,
    addToPinned,
    removeFromPinned,
    removeAllPinned,
    trackRecentItem,
    addCategoryToPinned,
    isPinned,
    getCategoryIcon,
    getParentIcon,
    getParentName,
    activeItemId,
    isActiveItem,
    setActiveItem,
  };

  // Return the Provider component with the value
  return React.createElement(
    MenuContext.Provider,
    { value: contextValue },
    children
  );
}

// Create the hook to use the context
export function useMenu(): MenuContextType {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error("useMenu must be used within a MenuProvider");
  }
  return context;
}
