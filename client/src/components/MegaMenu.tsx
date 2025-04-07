import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
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
} from "../assets/icons";
import { useMenu } from "../hooks/useMenu";
import { useSearch } from "../hooks/useSearch";
import MenuItem from "./MenuItem";
import SearchResults from "./SearchResults";
import { Category } from "../types/menu";

// Компонент кнопки закрепления категории
const CategoryPinButton = ({
  category,
  isPinned,
  handlePinToggle,
}: {
  category: Category;
  isPinned: (id: string) => boolean;
  handlePinToggle: (category: Category) => void;
}) => {
  const categoryId = `category-${category.id}`;
  const isPinnedValue = isPinned(categoryId);

  return (
    <button
      className={`${isPinnedValue ? "text-red-500 hover:text-red-600" : "text-gray-300 hover:text-red-500"} 
        transition-colors flex items-center justify-center w-6 h-6`}
      aria-label={
        isPinnedValue
          ? `Открепить ${category.name}`
          : `Прикрепить ${category.name}`
      }
      title={
        isPinnedValue
          ? `Открепить ${category.name}`
          : `Прикрепить ${category.name}`
      }
      onClick={(e) => {
        e.stopPropagation();
        handlePinToggle(category);
      }}
    >
      <Icon name={isPinnedValue ? ICON_PIN_FILLED : ICON_PIN} size={16} />
    </button>
  );
};

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MegaMenu: React.FC<MegaMenuProps> = ({ isOpen, onClose }) => {
  const [, setLocation] = useLocation();
  const {
    allMenuItems,
    categories,
    pinnedItems,
    addToPinned,
    removeFromPinned,
    trackRecentItem,
    isPinned,
    getCategoryIcon,
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

  const menuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

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
      setSearchQuery("");
      setActiveFilter("all");
    }
  }, [isOpen, setSearchQuery, setActiveFilter]);

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

  const handlePinToggle = (itemId: string) => {
    if (isPinned(itemId)) {
      removeFromPinned(itemId);
    } else {
      const item = allMenuItems.find((item) => item.id === itemId);
      if (item) {
        addToPinned({
          id: item.id,
          name: item.name,
          icon: item.icon,
          category: item.category,
          parentId: item.parentId,
        });
      }
    }
  };

  const handleCategoryPinToggle = (category: Category) => {
    const categoryId = `category-${category.id}`;

    if (isPinned(categoryId)) {
      removeFromPinned(categoryId);
    } else {
      // Создаем родительский элемент и добавляем его в закрепленные
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
    let searchTimer: NodeJS.Timeout | undefined;
    let contentTimer: NodeJS.Timeout;
    let visibilityTimer: NodeJS.Timeout;

    if (isOpen) {
      setIsVisible(true);
      // Show search bar immediately
      setShowSearchBar(true);

      // Задержка появления контента
      contentTimer = setTimeout(() => {
        setShowContent(true);
      }, 100);
    } else {
      // Сначала скрываем контент
      setShowContent(false);
      // Затем скрываем поиск
      setTimeout(() => {
        setShowSearchBar(false);
      }, 50);
      // И только потом убираем компонент из DOM
      visibilityTimer = setTimeout(() => {
        setIsVisible(false);
      }, 200);
    }

    return () => {
      if (searchTimer) clearTimeout(searchTimer);
      clearTimeout(contentTimer);
      clearTimeout(visibilityTimer);
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
            {/* Search input - на всю ширину */}
            <div className="pt-3 px-6 pb-4">
              <div className="relative max-w-4xl mx-auto">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Поиск в меню..."
                  className="w-full px-4 py-2 pl-10 pr-10 border border-red-500 rounded-full focus:outline-none focus:ring-1 focus:ring-red-500 text-gray-800 transition-all duration-300"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Icon
                  name={ICON_SEARCH}
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Icon name={ICON_CLOSE_MENU} size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Content section */}
          <div
            className={`transition-all duration-100 transform ${
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
                {/* Top Navigation Buttons */}
                <div className="flex justify-center space-x-4 mb-8">
                  <button className="px-5 py-3 bg-white border border-gray-200 rounded-lg flex items-center text-red-500 transition-colors shadow-sm">
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

                {/* Menu Categories Grid - новая структура */}
                <div className="flex max-w-7xl mx-auto">
                  {/* Resources колонка (занимает всю высоту слева) */}
                  <div className="w-1/4 pr-8">
                    {categories
                      .filter((category) => category.id === "resources")
                      .map((category: Category) => (
                        <div key={category.id} className="mb-8">
                          <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center">
                              <Icon
                                name={ICON_RESOURCES}
                                className="text-red-500 mr-2"
                                size={24}
                              />
                              <h3 className="font-medium text-gray-900">
                                {category.name}
                              </h3>
                            </div>
                            <CategoryPinButton
                              category={category}
                              isPinned={isPinned}
                              handlePinToggle={handleCategoryPinToggle}
                            />
                          </div>
                          <div className="h-px bg-gray-200 mb-4" />

                          {allMenuItems
                            .filter((item) => item.category === category.id)
                            .map((item) => (
                              <MenuItem
                                key={item.id}
                                item={item}
                                isPinned={isPinned(item.id)}
                                onPinToggle={() => handlePinToggle(item.id)}
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
                  <div className="w-3/4 grid grid-cols-3 gap-8">
                    {/* Верхний ряд (Notebooks, API, Database) */}
                    <div className="mb-8">
                      {categories
                        .filter((category) => category.id === "notebooks")
                        .map((category: Category) => (
                          <div key={category.id} className="mb-8">
                            <div className="mb-4 flex items-center justify-between">
                              <div className="flex items-center">
                                <Icon
                                  name={ICON_NOTEBOOKS}
                                  className="text-red-500 mr-2"
                                  size={24}
                                />
                                <h3 className="font-medium text-gray-900">
                                  {category.name}
                                </h3>
                              </div>
                              <CategoryPinButton
                                category={category}
                                isPinned={isPinned}
                                handlePinToggle={handleCategoryPinToggle}
                              />
                            </div>
                            <div className="h-px bg-gray-200 mb-4" />

                            {allMenuItems
                              .filter((item) => item.category === category.id)
                              .map((item) => (
                                <MenuItem
                                  key={item.id}
                                  item={item}
                                  isPinned={isPinned(item.id)}
                                  onPinToggle={() => handlePinToggle(item.id)}
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

                    <div className="mb-8">
                      {categories
                        .filter((category) => category.id === "api")
                        .map((category: Category) => (
                          <div key={category.id} className="mb-8">
                            <div className="mb-4 flex items-center justify-between">
                              <div className="flex items-center">
                                <Icon
                                  name={ICON_API}
                                  className="text-red-500 mr-2"
                                  size={24}
                                />
                                <h3 className="font-medium text-gray-900">
                                  {category.name}
                                </h3>
                              </div>
                              <CategoryPinButton
                                category={category}
                                isPinned={isPinned}
                                handlePinToggle={handleCategoryPinToggle}
                              />
                            </div>
                            <div className="h-px bg-gray-200 mb-4" />

                            {allMenuItems
                              .filter((item) => item.category === category.id)
                              .map((item) => (
                                <MenuItem
                                  key={item.id}
                                  item={item}
                                  isPinned={isPinned(item.id)}
                                  onPinToggle={() => handlePinToggle(item.id)}
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

                    <div className="mb-8">
                      {categories
                        .filter((category) => category.id === "database")
                        .map((category: Category) => (
                          <div key={category.id} className="mb-8">
                            <div className="mb-4 flex items-center justify-between">
                              <div className="flex items-center">
                                <Icon
                                  name={ICON_DATABASE}
                                  className="text-red-500 mr-2"
                                  size={24}
                                />
                                <h3 className="font-medium text-gray-900">
                                  {category.name}
                                </h3>
                              </div>
                              <CategoryPinButton
                                category={category}
                                isPinned={isPinned}
                                handlePinToggle={handleCategoryPinToggle}
                              />
                            </div>
                            <div className="h-px bg-gray-200 mb-4" />

                            {allMenuItems
                              .filter((item) => item.category === category.id)
                              .map((item) => (
                                <MenuItem
                                  key={item.id}
                                  item={item}
                                  isPinned={isPinned(item.id)}
                                  onPinToggle={() => handlePinToggle(item.id)}
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
                    <div className="mb-8">
                      {categories
                        .filter((category) => category.id === "iam")
                        .map((category: Category) => (
                          <div key={category.id} className="mb-8">
                            <div className="mb-4 flex items-center justify-between">
                              <div className="flex items-center">
                                <Icon
                                  name={ICON_IAM}
                                  className="text-red-500 mr-2"
                                  size={24}
                                />
                                <h3 className="font-medium text-gray-900">
                                  {category.name}
                                </h3>
                              </div>
                              <CategoryPinButton
                                category={category}
                                isPinned={isPinned}
                                handlePinToggle={handleCategoryPinToggle}
                              />
                            </div>
                            <div className="h-px bg-gray-200 mb-4" />

                            {allMenuItems
                              .filter((item) => item.category === category.id)
                              .map((item) => (
                                <MenuItem
                                  key={item.id}
                                  item={item}
                                  isPinned={isPinned(item.id)}
                                  onPinToggle={() => handlePinToggle(item.id)}
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

                    <div className="mb-8">
                      {categories
                        .filter((category) => category.id === "far")
                        .map((category: Category) => (
                          <div key={category.id} className="mb-8">
                            <div className="mb-4 flex items-center justify-between">
                              <div className="flex items-center">
                                <Icon
                                  name={ICON_FAR}
                                  className="text-red-500 mr-2"
                                  size={24}
                                />
                                <h3 className="font-medium text-gray-900">
                                  {category.name}
                                </h3>
                              </div>
                              <CategoryPinButton
                                category={category}
                                isPinned={isPinned}
                                handlePinToggle={handleCategoryPinToggle}
                              />
                            </div>
                            <div className="h-px bg-gray-200 mb-4" />

                            {allMenuItems
                              .filter((item) => item.category === category.id)
                              .map((item) => (
                                <MenuItem
                                  key={item.id}
                                  item={item}
                                  isPinned={isPinned(item.id)}
                                  onPinToggle={() => handlePinToggle(item.id)}
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

                    <div className="mb-8">
                      {categories
                        .filter((category) => category.id === "plugins")
                        .map((category: Category) => (
                          <div key={category.id} className="mb-8">
                            <div className="mb-4 flex items-center justify-between">
                              <div className="flex items-center">
                                <Icon
                                  name={ICON_PLUGINS}
                                  className="text-red-500 mr-2"
                                  size={24}
                                />
                                <h3 className="font-medium text-gray-900">
                                  {category.name}
                                </h3>
                              </div>
                              <CategoryPinButton
                                category={category}
                                isPinned={isPinned}
                                handlePinToggle={handleCategoryPinToggle}
                              />
                            </div>
                            <div className="h-px bg-gray-200 mb-4" />

                            {allMenuItems
                              .filter((item) => item.category === category.id)
                              .map((item) => (
                                <MenuItem
                                  key={item.id}
                                  item={item}
                                  isPinned={isPinned(item.id)}
                                  onPinToggle={() => handlePinToggle(item.id)}
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
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;
