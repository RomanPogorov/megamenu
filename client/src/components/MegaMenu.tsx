import React, { useState, useEffect, useRef } from "react";
import { useHashLocation } from "wouter/use-hash-location";
import { Icon } from "./Icon";
import { FaPuzzlePiece } from "react-icons/fa";
import {
  ICON_SEARCH,
  ICON_RESOURCES,
  ICON_NOTEBOOKS,
  ICON_API,
  ICON_DATABASE,
  ICON_IAM,
  ICON_FAR,
  ICON_PLUGINS,
  ICON_PIN,
  ICON_PIN_FILLED,
  ICON_CLOSE_MENU,
  ICON_CLOCK,
} from "../assets/icons";
import { useMenu } from "../hooks/useMenu";
import { useSearch } from "../hooks/useSearch";
import { useCustomization } from "../hooks/useCustomization";
import MenuItem from "./MenuItem";
import SearchResults from "./SearchResults";
import { Category, MenuItem as MenuItemType } from "../types/menu";
import CustomizationControls from "./CustomizationControls";
import CategoryPinButton from "./CategoryPinButton";

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MegaMenu: React.FC<MegaMenuProps> = ({ isOpen, onClose }) => {
  const [, setLocation] = useHashLocation();
  const {
    allMenuItems,
    categories,
    pinnedItems,
    addToPinned,
    removeFromPinned,
    trackRecentItem,
    isPinned,
    getCategoryIcon,
    recentItems,
  } = useMenu();
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    searchResultsByCategory,
    activeFilter,
    setActiveFilter,
    filterOptions,
  } = useSearch();
  const { isCustomizationEnabled, resetToDefault } = useCustomization();

  const menuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Close mega menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  // Reset search when closing the menu
  useEffect(() => {
    if (!isOpen) {
      setActiveFilter("all");
    }
  }, [isOpen, setActiveFilter]);

  const handleItemClick = (categoryId: string, itemId: string) => {
    // Track the item in recent history
    trackRecentItem({
      id: itemId,
      name: allMenuItems.find((item) => item.id === itemId)?.name || "",
      category: categoryId,
      icon: allMenuItems.find((item) => item.id === itemId)?.icon || "",
    });

    // Navigate to the item page
    setLocation(`/resource/${itemId}`);
    onClose();
  };

  const handlePinToggle = (item: MenuItemType) => {
    if (isPinned(item.id)) {
      removeFromPinned(item.id);
    } else {
      addToPinned(item);
    }
  };

  const handleCategoryPinToggle = (category: Category) => {
    const categoryId = `category-${category.id}`;
    if (isPinned(categoryId)) {
      removeFromPinned(categoryId);
    } else {
      addToPinned({
        id: categoryId,
        name: category.name,
        icon: category.icon,
        category: category.id,
        isParent: true,
      });
    }
  };

  // Animation flags
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let contentTimer: NodeJS.Timeout;
    let focusTimer: NodeJS.Timeout;

    if (isOpen) {
      setIsVisible(true);
      // Show search bar immediately
      setShowSearchBar(true);

      // Focus search input after it appears
      focusTimer = setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 50);

      // Delay content appearance
      contentTimer = setTimeout(() => {
        setShowContent(true);
      }, 100);
    } else {
      // Reset states when closed
      setShowSearchBar(false);
      setShowContent(false);
    }

    return () => {
      clearTimeout(focusTimer);
      clearTimeout(contentTimer);
    };
  }, [isOpen]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 bg-white z-40 ml-[60px] transition-opacity duration-100 ${isOpen ? "opacity-100" : "opacity-0"}`}
    >
      <div ref={menuRef} className="w-full h-full overflow-auto relative">
        {/* Убираем крестик из мегаменю, оставляем только в боковом меню */}

        {/* Основная часть мегаменю */}
        <div className="w-full">
          {/* Header section with search */}
          <div
            className={`transition-all duration-100 transform ${
              showSearchBar
                ? "translate-y-0 opacity-100"
                : "-translate-y-4 opacity-0"
            }`}
          >
            {/* Поисковая строка */}
            <div className="pt-3 px-6 pb-4">
              <div
                className="relative max-w-5xl mx-auto mt-4"
                onClick={(event) => event.stopPropagation()}
              >
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Поиск в меню..."
                  className="w-full px-4 py-2 pl-12 pr-12 border border-red-500 rounded-full focus:outline-none focus:ring-1 focus:ring-red-500 text-gray-800 transition-all duration-300"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Icon
                  name={ICON_SEARCH}
                  size={20}
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-red-500"
                />
                {searchQuery && (
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      setSearchQuery("");
                    }}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Icon name={ICON_CLOSE_MENU} size={20} />
                  </button>
                )}
              </div>
            </div>

            {/* Навигационные кнопки */}
            {!searchQuery && (
              <div className="flex justify-center items-center px-16 pb-11 mt-6">
                <div className="flex gap-4">
                  <button className="px-5 py-3 bg-white border border-gray-200 rounded-lg flex items-center text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                    <Icon name={ICON_RESOURCES} className="mr-2 text-red-500" />
                    Resource Browser
                  </button>
                  <button className="px-5 py-3 bg-white border border-gray-200 rounded-lg flex items-center text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                    <Icon name={ICON_API} className="mr-2 text-red-500" />
                    REST Console
                  </button>
                  <button className="px-5 py-3 bg-white border border-gray-200 rounded-lg flex items-center text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                    <Icon name={ICON_DATABASE} className="mr-2 text-red-500" />
                    DB Console
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Content section */}
          <div
            className={`transition-all duration-100 transform pb-24 ${
              showContent
                ? "translate-y-0 opacity-100"
                : "-translate-y-4 opacity-0"
            }`}
          >
            {searchQuery ? (
              // Search Results State
              <SearchResults
                results={searchResults}
                resultsByCategory={searchResultsByCategory}
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
                filterOptions={filterOptions}
                onItemClick={handleItemClick}
              />
            ) : (
              // Initial Menu State - Fullscreen version
              <div className="px-16 pb-8 container mx-auto">
                {/* Menu Categories Grid - новая структура */}
                <div
                  className="flex gap-20 mx-auto"
                  style={{ width: "fit-content" }}
                >
                  {/* Resources колонка */}
                  <div className="w-[202px]">
                    {categories
                      .filter((category) => category.id === "resources")
                      .map((category: Category) => (
                        <div key={category.id} className="mb-8">
                          <div className="mb-4 flex items-center justify-between group">
                            <div className="flex items-center flex-1 min-w-0">
                              <Icon
                                name={ICON_RESOURCES}
                                className="text-red-500 mr-2"
                                size={24}
                              />
                              <h3 className="font-medium text-gray-900 truncate">
                                {category.name}
                              </h3>
                            </div>
                            <div className="ml-2 flex-shrink-0">
                              <CategoryPinButton
                                category={category}
                                isPinned={isPinned}
                                handlePinToggle={handleCategoryPinToggle}
                              />
                            </div>
                          </div>
                          <div className="h-px bg-gray-200 mb-4" />

                          {allMenuItems
                            .filter(
                              (item) =>
                                item.category === category.id && item.parentId
                            )
                            .map((item) => (
                              <MenuItem
                                key={item.id}
                                item={item}
                                isPinned={isPinned(item.id)}
                                onPinToggle={() => handlePinToggle(item)}
                                onClick={() =>
                                  handleItemClick(category.id, item.id)
                                }
                                isChild={!!item.parentId}
                                parentIcon={getCategoryIcon(item.category)}
                              />
                            ))}
                        </div>
                      ))}
                  </div>

                  {/* Остальные категории (в правой части) */}
                  <div
                    className="grid grid-cols-3 gap-x-20 gap-y-10"
                    style={{
                      width: "fit-content",
                      gridTemplateColumns: "repeat(3, 235px)",
                    }}
                  >
                    {/* Верхний ряд (Notebooks, API, Database) */}
                    <div className="mb-2">
                      {categories
                        .filter((category) => category.id === "notebooks")
                        .map((category: Category) => (
                          <div key={category.id} className="mb-8">
                            <div className="mb-4 flex items-center justify-between group">
                              <div className="flex items-center flex-1 min-w-0">
                                <Icon
                                  name={ICON_NOTEBOOKS}
                                  className="text-red-500 mr-2"
                                  size={24}
                                />
                                <h3 className="font-medium text-gray-900 truncate">
                                  {category.name}
                                </h3>
                              </div>
                              <div className="ml-2 flex-shrink-0">
                                <CategoryPinButton
                                  category={category}
                                  isPinned={isPinned}
                                  handlePinToggle={handleCategoryPinToggle}
                                />
                              </div>
                            </div>
                            <div className="h-px bg-gray-200 mb-4" />

                            {allMenuItems
                              .filter(
                                (item) =>
                                  item.category === category.id && item.parentId
                              )
                              .map((item) => (
                                <MenuItem
                                  key={item.id}
                                  item={item}
                                  isPinned={isPinned(item.id)}
                                  onPinToggle={() => handlePinToggle(item)}
                                  onClick={() =>
                                    handleItemClick(category.id, item.id)
                                  }
                                  isChild={!!item.parentId}
                                  parentIcon={getCategoryIcon(item.category)}
                                />
                              ))}
                          </div>
                        ))}
                    </div>

                    <div className="mb-2">
                      {categories
                        .filter((category) => category.id === "api")
                        .map((category: Category) => (
                          <div key={category.id} className="mb-8">
                            <div className="mb-4 flex items-center justify-between group">
                              <div className="flex items-center flex-1 min-w-0">
                                <Icon
                                  name={ICON_API}
                                  className="text-red-500 mr-2"
                                  size={24}
                                />
                                <h3 className="font-medium text-gray-900 truncate">
                                  {category.name}
                                </h3>
                              </div>
                              <div className="ml-2 flex-shrink-0">
                                <CategoryPinButton
                                  category={category}
                                  isPinned={isPinned}
                                  handlePinToggle={handleCategoryPinToggle}
                                />
                              </div>
                            </div>
                            <div className="h-px bg-gray-200 mb-4" />

                            {allMenuItems
                              .filter(
                                (item) =>
                                  item.category === category.id && item.parentId
                              )
                              .map((item) => (
                                <MenuItem
                                  key={item.id}
                                  item={item}
                                  isPinned={isPinned(item.id)}
                                  onPinToggle={() => handlePinToggle(item)}
                                  onClick={() =>
                                    handleItemClick(category.id, item.id)
                                  }
                                  isChild={!!item.parentId}
                                  parentIcon={getCategoryIcon(item.category)}
                                />
                              ))}
                          </div>
                        ))}
                    </div>

                    <div className="mb-2">
                      {categories
                        .filter((category) => category.id === "database")
                        .map((category: Category) => (
                          <div key={category.id} className="mb-8">
                            <div className="mb-4 flex items-center justify-between group">
                              <div className="flex items-center flex-1 min-w-0">
                                <Icon
                                  name={ICON_DATABASE}
                                  className="text-red-500 mr-2"
                                  size={24}
                                />
                                <h3 className="font-medium text-gray-900 truncate">
                                  {category.name}
                                </h3>
                              </div>
                              <div className="ml-2 flex-shrink-0">
                                <CategoryPinButton
                                  category={category}
                                  isPinned={isPinned}
                                  handlePinToggle={handleCategoryPinToggle}
                                />
                              </div>
                            </div>
                            <div className="h-px bg-gray-200 mb-4" />

                            {allMenuItems
                              .filter(
                                (item) =>
                                  item.category === category.id && item.parentId
                              )
                              .map((item) => (
                                <MenuItem
                                  key={item.id}
                                  item={item}
                                  isPinned={isPinned(item.id)}
                                  onPinToggle={() => handlePinToggle(item)}
                                  onClick={() =>
                                    handleItemClick(category.id, item.id)
                                  }
                                  isChild={!!item.parentId}
                                  parentIcon={getCategoryIcon(item.category)}
                                />
                              ))}
                          </div>
                        ))}
                    </div>

                    {/* Нижний ряд (IAM, FAR, Plugins & Modules) */}
                    <div className="mb-2">
                      {categories
                        .filter((category) => category.id === "iam")
                        .map((category: Category) => (
                          <div key={category.id} className="mb-8">
                            <div className="mb-4 flex items-center justify-between group">
                              <div className="flex items-center flex-1 min-w-0">
                                <Icon
                                  name={ICON_IAM}
                                  className="text-red-500 mr-2"
                                  size={24}
                                />
                                <h3 className="font-medium text-gray-900 truncate">
                                  {category.name}
                                </h3>
                              </div>
                              <div className="ml-2 flex-shrink-0">
                                <CategoryPinButton
                                  category={category}
                                  isPinned={isPinned}
                                  handlePinToggle={handleCategoryPinToggle}
                                />
                              </div>
                            </div>
                            <div className="h-px bg-gray-200 mb-4" />

                            {allMenuItems
                              .filter(
                                (item) =>
                                  item.category === category.id && item.parentId
                              )
                              .map((item) => (
                                <MenuItem
                                  key={item.id}
                                  item={item}
                                  isPinned={isPinned(item.id)}
                                  onPinToggle={() => handlePinToggle(item)}
                                  onClick={() =>
                                    handleItemClick(category.id, item.id)
                                  }
                                  isChild={!!item.parentId}
                                  parentIcon={getCategoryIcon(item.category)}
                                />
                              ))}
                          </div>
                        ))}
                    </div>

                    <div className="mb-2">
                      {categories
                        .filter((category) => category.id === "far")
                        .map((category: Category) => (
                          <div key={category.id} className="mb-8">
                            <div className="mb-4 flex items-center justify-between group">
                              <div className="flex items-center flex-1 min-w-0">
                                <Icon
                                  name={ICON_FAR}
                                  className="text-red-500 mr-2"
                                  size={24}
                                />
                                <h3 className="font-medium text-gray-900 truncate">
                                  {category.name}
                                </h3>
                              </div>
                              <div className="ml-2 flex-shrink-0">
                                <CategoryPinButton
                                  category={category}
                                  isPinned={isPinned}
                                  handlePinToggle={handleCategoryPinToggle}
                                />
                              </div>
                            </div>
                            <div className="h-px bg-gray-200 mb-4" />

                            {allMenuItems
                              .filter(
                                (item) =>
                                  item.category === category.id && item.parentId
                              )
                              .map((item) => (
                                <MenuItem
                                  key={item.id}
                                  item={item}
                                  isPinned={isPinned(item.id)}
                                  onPinToggle={() => handlePinToggle(item)}
                                  onClick={() =>
                                    handleItemClick(category.id, item.id)
                                  }
                                  isChild={!!item.parentId}
                                  parentIcon={getCategoryIcon(item.category)}
                                />
                              ))}
                          </div>
                        ))}
                    </div>

                    <div className="mb-2">
                      {categories
                        .filter((category) => category.id === "plugins")
                        .map((category: Category) => (
                          <div key={category.id} className="mb-8">
                            <div className="mb-4 flex items-center justify-between group">
                              <div className="flex items-center flex-1 min-w-0">
                                <Icon
                                  name={ICON_PLUGINS}
                                  className="text-red-500 mr-2"
                                  size={24}
                                />
                                <h3 className="font-medium text-gray-900 truncate">
                                  {category.name}
                                </h3>
                              </div>
                              <div className="ml-2 flex-shrink-0">
                                <CategoryPinButton
                                  category={category}
                                  isPinned={isPinned}
                                  handlePinToggle={handleCategoryPinToggle}
                                />
                              </div>
                            </div>
                            <div className="h-px bg-gray-200 mb-4" />

                            {allMenuItems
                              .filter(
                                (item) =>
                                  item.category === category.id && item.parentId
                              )
                              .map((item) => (
                                <MenuItem
                                  key={item.id}
                                  item={item}
                                  isPinned={isPinned(item.id)}
                                  onPinToggle={() => handlePinToggle(item)}
                                  onClick={() =>
                                    handleItemClick(category.id, item.id)
                                  }
                                  isChild={!!item.parentId}
                                  parentIcon={getCategoryIcon(item.category)}
                                />
                              ))}
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Recent Search колонка */}
                  <div className="w-[202px]">
                    <div className="mb-8">
                      <div className="mb-4 flex items-center justify-between group">
                        <div className="flex items-center flex-1 min-w-0">
                          <Icon
                            name={ICON_CLOCK}
                            className="text-red-500 mr-2"
                            size={24}
                          />
                          <h3 className="font-medium text-gray-900 truncate">
                            Recent
                          </h3>
                        </div>
                        <div className="ml-2 flex-shrink-0">
                          <CategoryPinButton
                            category={{
                              id: "recent-search",
                              name: "Recent",
                              icon: "clock",
                              order: 7,
                            }}
                            isPinned={isPinned}
                            handlePinToggle={handleCategoryPinToggle}
                          />
                        </div>
                      </div>
                      <div className="h-px bg-gray-200 mb-4" />

                      {/* Здесь будут элементы Recent Search */}
                      {recentItems.map((item) => (
                        <MenuItem
                          key={item.id}
                          item={item}
                          isPinned={isPinned(item.id)}
                          onPinToggle={() => handlePinToggle(item)}
                          onClick={() =>
                            handleItemClick(item.category, item.id)
                          }
                          isChild={!!item.parentId}
                          parentIcon={getCategoryIcon(item.category)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Fixed bottom controls */}
        <div className="fixed bottom-0 left-[60px] right-0 bg-gray-50 py-4 border-t border-gray-200">
          <div className="container mx-auto flex justify-center items-center gap-8">
            <CustomizationControls />
            <button
              onClick={resetToDefault}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
            >
              Reset to Default
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;
