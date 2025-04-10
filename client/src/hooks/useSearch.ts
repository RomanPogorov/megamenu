import { useState, useMemo, createContext, useContext } from "react";
import { useMenu } from "./useMenu";
import { MenuItem } from "../types/menu";
import * as React from "react";

// Определяем тип для контекста поиска
interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: (MenuItem & { categoryName: string })[];
  searchResultsByCategory: Record<string, MenuItem[]>;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  filterOptions: { id: string; name: string; count: number }[];
}

// Создаем контекст
const SearchContext = createContext<SearchContextType | undefined>(undefined);

type SearchProviderProps = {
  children: React.ReactNode;
};

// Provider компонент для поиска
export const SearchProvider = ({ children }: SearchProviderProps) => {
  const searchHook = useSearchHook();

  return React.createElement(
    SearchContext.Provider,
    { value: searchHook },
    children
  );
};

// Хук для использования контекста поиска
export const useSearch = (): SearchContextType => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};

// Внутренний хук для работы с поисковыми данными
const useSearchHook = (): SearchContextType => {
  const { allMenuItems, categories } = useMenu();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  // Search results filtered by query
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    return allMenuItems
      .filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .map((item) => ({
        ...item,
        categoryName:
          categories.find((c) => c.id === item.category)?.name || "",
      }));
  }, [searchQuery, allMenuItems, categories]);

  // Group search results by category
  const searchResultsByCategory = useMemo(() => {
    return searchResults.reduce(
      (acc, item) => {
        if (!acc[item.category]) {
          acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
      },
      {} as Record<string, MenuItem[]>
    );
  }, [searchResults]);

  // Create filter options with counts
  const filterOptions = useMemo(() => {
    const filters = [{ id: "all", name: "All", count: searchResults.length }];

    // Add categories that have results
    Object.entries(searchResultsByCategory).forEach(([categoryId, items]) => {
      const category = categories.find((c) => c.id === categoryId);
      if (category) {
        filters.push({
          id: categoryId,
          name: category.name,
          count: items.length,
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
    filterOptions,
  };
};
