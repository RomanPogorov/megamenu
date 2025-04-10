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
  ICON_CONSOLE,
  ICON_SETTINGS,
} from "../assets/icons/icon-map";
import { useMenu } from "../hooks/useMenu";
import { useSearch } from "../hooks/useSearch";
import MenuItem from "./MenuItem";
import SearchResults from "./SearchResults";
import { Category, MenuItem as MenuItemType } from "../types/menu";
import CategoryPinButton from "./CategoryPinButton";
import { ICON_STYLES } from "../styles/iconStyles"; // Импортируем стили из отдельного файла

// Централизованные стили для MegaMenu
const MENU_STYLES = {
  // Цвета
  colors: {
    primary: "text-red-500",
    border: "border-red-500",
    hover: "hover:text-red-600",
    navigationButton: "text-gray-700",
    navigationButtonHover: "hover:bg-gray-50",
    headerText: "text-gray-900",
    itemText: "text-gray-700",
    divider: "bg-gray-200",
    searchPlaceholder: "text-gray-400",
    icon: ICON_STYLES.navigation.icon, // Используем централизованный стиль
  },

  // Размеры
  sizes: {
    iconSize: ICON_STYLES.categories.size, // Используем централизованный размер
    pinIcon: ICON_STYLES.pin.size, // Используем централизованный размер
    categoryHeaderSpacing: "mb-4", // Отступ для заголовков категорий
    categoryItemSpacing: "mb-2", // Отступ для элементов категорий
    dividerHeight: "h-px", // Высота разделителя
    gridGap: "gap-x-8 gap-y-10", // Отступы в сетке категорий
    columnWidth: "235px", // Ширина колонки в сетке
  },

  // Стили компонентов
  components: {
    // Заголовок категории
    categoryHeader: "mb-4 flex items-center justify-between group pl-2",
    categoryTitle: "flex items-center flex-1 min-w-0",
    categoryName: "font-medium text-gray-900 truncate",

    // Навигационные кнопки
    navigationButton:
      "px-5 py-3 bg-white border border-gray-200 rounded-lg flex items-center text-gray-700 hover:bg-gray-50 transition-colors shadow-sm",

    // Контейнеры
    container: "px-16 pb-8 container mx-auto",
    resourcesColumn: "w-60 flex-shrink-0",
    categoriesGrid: "grid grid-cols-3 gap-x-8 gap-y-10",

    // Поиск
    searchContainer: "pt-3 px-6 pb-4",
    searchInput:
      "w-full px-4 py-2 pl-12 pr-12 border border-red-500 rounded-full focus:outline-none focus:ring-1 focus:ring-red-500 text-gray-800 transition-all duration-300",
  },
};

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

// Навигационные кнопки как элементы меню
interface NavButton {
  id: string;
  name: string;
  iconName: string; // Имя иконки для компонента Icon
  category: string;
}

// Добавляем ID для навигационных кнопок
const NAV_BUTTONS: NavButton[] = [
  {
    id: "resource-browser",
    name: "Resource Browser",
    iconName: ICON_RESOURCES,
    category: "navigation",
  },
  {
    id: "rest-console",
    name: "REST Console",
    iconName: ICON_CONSOLE,
    category: "navigation",
  },
  {
    id: "db-console",
    name: "DB Console",
    iconName: ICON_DATABASE,
    category: "navigation",
  },
  {
    id: "settings",
    name: "Settings",
    iconName: ICON_SETTINGS,
    category: "navigation",
  },
];

// Добавляем функцию-помощник для создания MenuItem из NavButton
const createMenuItemFromNavButton = (button: NavButton): MenuItemType => {
  // Маппинг от имен констант иконок (ICON_XXX) к именам файлов для боковой панели
  const iconNameMapping: Record<string, string> = {
    [ICON_RESOURCES]: "folder-open",
    [ICON_CONSOLE]: "console",
    [ICON_DATABASE]: "database",
    [ICON_SETTINGS]: "Settings",
    [ICON_API]: "code",
    [ICON_NOTEBOOKS]: "book",
    [ICON_IAM]: "user-shield",
    [ICON_FAR]: "tasks",
    [ICON_PLUGINS]: "puzzle-piece",
  };

  return {
    id: button.id,
    name: button.name,
    // Преобразуем константу иконки в имя файла
    icon: iconNameMapping[button.iconName] || button.iconName,
    category: button.category,
  };
};

const MegaMenu: React.FC<MegaMenuProps> = ({ isOpen, onClose }) => {
  const [, setLocation] = useHashLocation();
  const {
    allMenuItems,
    categories,
    pinnedItems,
    recentItems,
    isPinned,
    addToPinned,
    removeFromPinned,
    activeItemId,
    trackRecentItem,
    setActiveItem,
    getCategoryIcon,
    isRecentSectionVisible,
    toggleRecentSectionVisibility,
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

  // Используем эту функцию в обработчике клика
  const handleItemClick = (categoryId: string, itemId: string) => {
    // Для навигационных кнопок
    if (categoryId === "navigation") {
      const navButton = NAV_BUTTONS.find((btn) => btn.id === itemId);
      if (navButton) {
        // Используем функцию-помощник и добавляем parentId
        const menuItem = createMenuItemFromNavButton(navButton);
        trackRecentItem({
          ...menuItem,
          parentId: "navigation", // Добавляем parentId для правильного отображения
        });
      }
    } else {
      // Для обычных пунктов меню - стандартная логика
      const menuItem = allMenuItems.find((item) => item.id === itemId);
      if (menuItem) {
        // Track the item in recent history и добавляем parentId
        trackRecentItem({
          id: itemId,
          name: menuItem.name,
          category: categoryId,
          icon: menuItem.icon,
          parentId: menuItem.parentId || categoryId, // Добавляем parentId - берем существующий или используем categoryId
        });
      }
    }

    // Set the item as active
    setActiveItem(itemId);

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

  // Добавим функцию для обработки клика на заголовок категории
  const handleCategoryTitleClick = (category: Category) => {
    // Создаем объект элемента для трекинга
    const categoryItem: MenuItemType = {
      id: category.id,
      name: category.name,
      icon: category.icon,
      category: category.id,
      isParent: true,
      parentId: "categories", // Добавляем parentId для отображения родителя в тултипах
    };

    // Добавляем в недавние
    trackRecentItem(categoryItem);

    // Устанавливаем активный элемент
    setActiveItem(category.id);

    // Переходим по ссылке
    setLocation(`/resource/${category.id}`);
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 bg-white z-40 ml-[80px] transition-opacity duration-100 ${isOpen ? "opacity-100" : "opacity-0"}`}
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
            <div className={MENU_STYLES.components.searchContainer}>
              <div
                className="relative max-w-5xl mx-auto mt-4"
                onClick={(event) => event.stopPropagation()}
              >
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Поиск в меню..."
                  className={MENU_STYLES.components.searchInput}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Icon
                  name={ICON_SEARCH}
                  size={ICON_STYLES.utility.size.search}
                  className={`absolute left-5 top-1/2 -translate-y-1/2 ${ICON_STYLES.utility.search}`}
                />
                {searchQuery && (
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      setSearchQuery("");
                    }}
                    className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center justify-center h-5 w-5"
                  >
                    <Icon
                      name={ICON_CLOSE_MENU}
                      size={ICON_STYLES.utility.size.close}
                      className={ICON_STYLES.utility.close}
                    />
                  </button>
                )}
              </div>
            </div>

            {/* Навигационные кнопки */}
            {!searchQuery && (
              <div className="flex justify-center items-center px-16 pb-11 mt-6">
                <div className="flex gap-4">
                  {NAV_BUTTONS.map((button) => (
                    <button
                      key={button.id}
                      className={`${MENU_STYLES.components.navigationButton} group relative`}
                      onClick={() =>
                        handleItemClick(button.category, button.id)
                      }
                    >
                      <Icon
                        name={button.iconName}
                        className={`mr-2 ${ICON_STYLES.navigation.icon}`}
                        size={ICON_STYLES.categories.size}
                      />
                      <span className="mr-8">{button.name}</span>
                      {/* Размещаем иконку пина в абсолютно позиционированном контейнере с высоким z-index */}
                      <div
                        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 hover:opacity-75 flex items-center justify-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Используем функцию-помощник для создания MenuItem
                          handlePinToggle(createMenuItemFromNavButton(button));
                        }}
                      >
                        <Icon
                          name={
                            isPinned(button.id) ? ICON_PIN_FILLED : ICON_PIN
                          }
                          size={ICON_STYLES.pin.size}
                          className={
                            isPinned(button.id)
                              ? ICON_STYLES.pin.active
                              : ICON_STYLES.pin.inactive
                          }
                        />
                      </div>
                    </button>
                  ))}
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
              <div className={MENU_STYLES.components.container}>
                <div className="flex gap-16 justify-center">
                  {/* Resources колонка */}
                  <div className={MENU_STYLES.components.resourcesColumn}>
                    {categories
                      .filter((category) => category.id === "resources")
                      .map((category: Category) => (
                        <div key={category.id} className="mb-8">
                          <div
                            className={MENU_STYLES.components.categoryHeader}
                          >
                            <div
                              className={MENU_STYLES.components.categoryTitle}
                              onClick={() => handleCategoryTitleClick(category)}
                              style={{ cursor: "pointer" }}
                            >
                              <Icon
                                name={ICON_RESOURCES}
                                className={`mr-2 ${ICON_STYLES.categories.resources}`}
                                size={ICON_STYLES.categories.size}
                              />
                              <h3
                                className={MENU_STYLES.components.categoryName}
                              >
                                {category.name}
                              </h3>
                            </div>
                          </div>
                          <div
                            className={`${MENU_STYLES.sizes.dividerHeight} ${MENU_STYLES.colors.divider} ${MENU_STYLES.sizes.categoryHeaderSpacing}`}
                          />

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
                                pinIconSize={ICON_STYLES.pin.size}
                              />
                            ))}
                        </div>
                      ))}
                  </div>

                  {/* Остальные категории (сетка справа) */}
                  <div
                    className={MENU_STYLES.components.categoriesGrid}
                    style={{
                      width: "fit-content",
                      gridTemplateColumns: `repeat(3, ${MENU_STYLES.sizes.columnWidth})`,
                    }}
                  >
                    {/* Верхний ряд (API, IAM, Database) */}
                    <div className="mb-2">
                      {categories
                        .filter((category) => category.id === "api")
                        .map((category: Category) => (
                          <div key={category.id} className="mb-8">
                            <div
                              className={MENU_STYLES.components.categoryHeader}
                            >
                              <div
                                className={MENU_STYLES.components.categoryTitle}
                                onClick={() =>
                                  handleCategoryTitleClick(category)
                                }
                                style={{ cursor: "pointer" }}
                              >
                                <Icon
                                  name={ICON_API}
                                  className={`mr-2 ${ICON_STYLES.categories.api}`}
                                  size={ICON_STYLES.categories.size}
                                />
                                <h3
                                  className={
                                    MENU_STYLES.components.categoryName
                                  }
                                >
                                  {category.name}
                                </h3>
                              </div>
                              <div className="ml-2 flex-shrink-0">
                                <CategoryPinButton
                                  category={category}
                                  isPinned={isPinned}
                                  handlePinToggle={handleCategoryPinToggle}
                                  pinIconSize={ICON_STYLES.pin.size}
                                />
                              </div>
                            </div>
                            <div
                              className={`${MENU_STYLES.sizes.dividerHeight} ${MENU_STYLES.colors.divider} ${MENU_STYLES.sizes.categoryHeaderSpacing}`}
                            />

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
                                  pinIconSize={ICON_STYLES.pin.size}
                                />
                              ))}
                          </div>
                        ))}
                    </div>

                    <div className="mb-2">
                      {categories
                        .filter((category) => category.id === "iam")
                        .map((category: Category) => (
                          <div key={category.id} className="mb-8">
                            <div
                              className={MENU_STYLES.components.categoryHeader}
                            >
                              <div
                                className={MENU_STYLES.components.categoryTitle}
                                onClick={() =>
                                  handleCategoryTitleClick(category)
                                }
                                style={{ cursor: "pointer" }}
                              >
                                <Icon
                                  name={ICON_IAM}
                                  className={`mr-2 ${ICON_STYLES.categories.iam}`}
                                  size={ICON_STYLES.categories.size}
                                />
                                <h3
                                  className={
                                    MENU_STYLES.components.categoryName
                                  }
                                >
                                  {category.name}
                                </h3>
                              </div>
                              <div className="ml-2 flex-shrink-0">
                                <CategoryPinButton
                                  category={category}
                                  isPinned={isPinned}
                                  handlePinToggle={handleCategoryPinToggle}
                                  pinIconSize={ICON_STYLES.pin.size}
                                />
                              </div>
                            </div>
                            <div
                              className={`${MENU_STYLES.sizes.dividerHeight} ${MENU_STYLES.colors.divider} ${MENU_STYLES.sizes.categoryHeaderSpacing}`}
                            />

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
                                  pinIconSize={ICON_STYLES.pin.size}
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
                            <div
                              className={MENU_STYLES.components.categoryHeader}
                            >
                              <div
                                className={MENU_STYLES.components.categoryTitle}
                                onClick={() =>
                                  handleCategoryTitleClick(category)
                                }
                                style={{ cursor: "pointer" }}
                              >
                                <Icon
                                  name={ICON_DATABASE}
                                  className={`mr-2 ${ICON_STYLES.categories.database}`}
                                  size={ICON_STYLES.categories.size}
                                />
                                <h3
                                  className={
                                    MENU_STYLES.components.categoryName
                                  }
                                >
                                  {category.name}
                                </h3>
                              </div>
                              <div className="ml-2 flex-shrink-0">
                                <CategoryPinButton
                                  category={category}
                                  isPinned={isPinned}
                                  handlePinToggle={handleCategoryPinToggle}
                                  pinIconSize={ICON_STYLES.pin.size}
                                />
                              </div>
                            </div>
                            <div
                              className={`${MENU_STYLES.sizes.dividerHeight} ${MENU_STYLES.colors.divider} ${MENU_STYLES.sizes.categoryHeaderSpacing}`}
                            />

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
                                  pinIconSize={ICON_STYLES.pin.size}
                                />
                              ))}
                          </div>
                        ))}
                    </div>

                    {/* Нижний ряд (FAR, Plugins, SDK) */}
                    <div className="mb-2">
                      {categories
                        .filter((category) => category.id === "far")
                        .map((category: Category) => (
                          <div key={category.id} className="mb-8">
                            <div
                              className={MENU_STYLES.components.categoryHeader}
                            >
                              <div
                                className={MENU_STYLES.components.categoryTitle}
                                onClick={() =>
                                  handleCategoryTitleClick(category)
                                }
                                style={{ cursor: "pointer" }}
                              >
                                <Icon
                                  name={ICON_FAR}
                                  className={`mr-2 ${ICON_STYLES.categories.far}`}
                                  size={ICON_STYLES.categories.size}
                                />
                                <h3
                                  className={
                                    MENU_STYLES.components.categoryName
                                  }
                                >
                                  {category.name}
                                </h3>
                              </div>
                              <div className="ml-2 flex-shrink-0">
                                <CategoryPinButton
                                  category={category}
                                  isPinned={isPinned}
                                  handlePinToggle={handleCategoryPinToggle}
                                  pinIconSize={ICON_STYLES.pin.size}
                                />
                              </div>
                            </div>
                            <div
                              className={`${MENU_STYLES.sizes.dividerHeight} ${MENU_STYLES.colors.divider} ${MENU_STYLES.sizes.categoryHeaderSpacing}`}
                            />

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
                                  pinIconSize={ICON_STYLES.pin.size}
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
                            <div
                              className={MENU_STYLES.components.categoryHeader}
                            >
                              <div
                                className={MENU_STYLES.components.categoryTitle}
                                onClick={() =>
                                  handleCategoryTitleClick(category)
                                }
                                style={{ cursor: "pointer" }}
                              >
                                <Icon
                                  name={ICON_PLUGINS}
                                  className={`mr-2 ${ICON_STYLES.categories.plugins}`}
                                  size={ICON_STYLES.categories.size}
                                />
                                <h3
                                  className={
                                    MENU_STYLES.components.categoryName
                                  }
                                >
                                  {category.name}
                                </h3>
                              </div>
                              <div className="ml-2 flex-shrink-0">
                                <CategoryPinButton
                                  category={category}
                                  isPinned={isPinned}
                                  handlePinToggle={handleCategoryPinToggle}
                                  pinIconSize={ICON_STYLES.pin.size}
                                />
                              </div>
                            </div>
                            <div
                              className={`${MENU_STYLES.sizes.dividerHeight} ${MENU_STYLES.colors.divider} ${MENU_STYLES.sizes.categoryHeaderSpacing}`}
                            />

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
                                  pinIconSize={ICON_STYLES.pin.size}
                                />
                              ))}
                          </div>
                        ))}
                    </div>

                    <div className="mb-2">
                      {categories
                        .filter((category) => category.id === "sdk")
                        .map((category: Category) => (
                          <div key={category.id} className="mb-8">
                            <div
                              className={MENU_STYLES.components.categoryHeader}
                            >
                              <div
                                className={MENU_STYLES.components.categoryTitle}
                                onClick={() =>
                                  handleCategoryTitleClick(category)
                                }
                                style={{ cursor: "pointer" }}
                              >
                                <Icon
                                  name={ICON_API}
                                  className={`mr-2 ${ICON_STYLES.categories.api}`}
                                  size={ICON_STYLES.categories.size}
                                />
                                <h3
                                  className={
                                    MENU_STYLES.components.categoryName
                                  }
                                >
                                  {category.name}
                                </h3>
                              </div>
                              <div className="ml-2 flex-shrink-0">
                                <CategoryPinButton
                                  category={category}
                                  isPinned={isPinned}
                                  handlePinToggle={handleCategoryPinToggle}
                                  pinIconSize={ICON_STYLES.pin.size}
                                />
                              </div>
                            </div>
                            <div
                              className={`${MENU_STYLES.sizes.dividerHeight} ${MENU_STYLES.colors.divider} ${MENU_STYLES.sizes.categoryHeaderSpacing}`}
                            />

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
                                  pinIconSize={ICON_STYLES.pin.size}
                                />
                              ))}
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Notebooks колонка (отдельная справа) */}
                  <div style={{ width: MENU_STYLES.sizes.columnWidth }}>
                    <div className="mb-8">
                      <div className="mb-4 flex items-center justify-between group pl-2">
                        <div className="flex items-center">
                          <Icon
                            name={ICON_NOTEBOOKS}
                            className={`mr-2 ${ICON_STYLES.categories.notebooks}`}
                            size={ICON_STYLES.categories.size}
                          />
                          <h3 className="font-medium text-gray-900">
                            Notebooks
                          </h3>
                        </div>
                        {/* Кнопка для закрепления категории notebooks */}
                        <div className="ml-2 flex-shrink-0">
                          <CategoryPinButton
                            category={{
                              id: "notebooks",
                              name: "Notebooks",
                              icon: ICON_NOTEBOOKS,
                              order: 2,
                            }}
                            isPinned={() => isPinned("category-notebooks")}
                            handlePinToggle={() =>
                              handleCategoryPinToggle({
                                id: "notebooks",
                                name: "Notebooks",
                                icon: ICON_NOTEBOOKS,
                                order: 2,
                              })
                            }
                            pinIconSize={ICON_STYLES.pin.size}
                          />
                        </div>
                      </div>
                      <div
                        className={`${MENU_STYLES.sizes.dividerHeight} ${MENU_STYLES.colors.divider} ${MENU_STYLES.sizes.categoryHeaderSpacing}`}
                      />

                      {/* Отображаем элементы Notebooks */}
                      {allMenuItems
                        .filter(
                          (item) =>
                            item.category === "notebooks" && item.parentId
                        )
                        .map((item) => (
                          <MenuItem
                            key={item.id}
                            item={item}
                            isPinned={isPinned(item.id)}
                            onPinToggle={() => handlePinToggle(item)}
                            onClick={() =>
                              handleItemClick("notebooks", item.id)
                            }
                            isChild={!!item.parentId}
                            parentIcon={getCategoryIcon("notebooks")}
                            pinIconSize={ICON_STYLES.pin.size}
                          />
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer с информацией о системе */}
      <div className="fixed bottom-0 left-0 right-0 ml-[80px] h-12 bg-gray-100 border-t border-gray-200 flex items-center justify-between px-6 z-50">
        <div className="flex items-center space-x-1">
          <span className="text-sm text-gray-600">Aidbox name:</span>
          <span className="text-sm font-medium text-red-500 mr-2">Skynet</span>
          <span className="text-sm text-gray-600">Version:</span>
          <span className="text-sm font-medium text-gray-800 mr-2">
            Edge(eafe6dc78)
          </span>
          <span className="text-sm text-gray-600">Licence:</span>
          <span className="text-sm font-medium text-gray-800">Development</span>
        </div>
        <div className="flex items-center space-x-5 ">
          <a
            href="#"
            className="flex items-center text-gray-600 hover:text-gray-900 mx-2 "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M2.4974 3.125C2.44214 3.125 2.38915 3.14695 2.35008 3.18602C2.31101 3.22509 2.28906 3.27808 2.28906 3.33333V14.1667C2.28906 14.2219 2.31101 14.2749 2.35008 14.314C2.38915 14.3531 2.44214 14.375 2.4974 14.375H7.4974C8.3262 14.375 9.12105 14.7042 9.7071 15.2903C9.81228 15.3955 9.90918 15.5074 9.9974 15.625C10.0856 15.5074 10.1825 15.3955 10.2877 15.2903C10.8737 14.7042 11.6686 14.375 12.4974 14.375H17.4974C17.5526 14.375 17.6056 14.3531 17.6447 14.314C17.6838 14.2749 17.7057 14.2219 17.7057 14.1667V3.33333C17.7057 3.27808 17.6838 3.22509 17.6447 3.18602C17.6056 3.14695 17.5526 3.125 17.4974 3.125H13.3307C12.6124 3.125 11.9236 3.41034 11.4156 3.91825C10.9077 4.42616 10.6224 5.11504 10.6224 5.83333C10.6224 6.17851 10.3426 6.45833 9.9974 6.45833C9.65222 6.45833 9.3724 6.17851 9.3724 5.83333C9.3724 5.11504 9.08705 4.42616 8.57914 3.91825C8.07123 3.41034 7.38236 3.125 6.66406 3.125H2.4974ZM9.9974 3.69853C9.84488 3.46037 9.66613 3.23747 9.46303 3.03437C8.7207 2.29204 7.71388 1.875 6.66406 1.875H2.4974C2.11062 1.875 1.73969 2.02865 1.4662 2.30214C1.19271 2.57563 1.03906 2.94656 1.03906 3.33333V14.1667C1.03906 14.5534 1.19271 14.9244 1.4662 15.1979C1.73969 15.4714 2.11062 15.625 2.4974 15.625H7.4974C7.99468 15.625 8.47159 15.8225 8.82322 16.1742C9.17485 16.5258 9.3724 17.0027 9.3724 17.5C9.3724 17.8452 9.65222 18.125 9.9974 18.125C10.3426 18.125 10.6224 17.8452 10.6224 17.5C10.6224 17.0027 10.8199 16.5258 11.1716 16.1742C11.5232 15.8225 12.0001 15.625 12.4974 15.625H17.4974C17.8842 15.625 18.2551 15.4714 18.5286 15.1979C18.8021 14.9244 18.9557 14.5534 18.9557 14.1667V3.33333C18.9557 2.94656 18.8021 2.57563 18.5286 2.30214C18.2551 2.02864 17.8842 1.875 17.4974 1.875H13.3307C12.2809 1.875 11.2741 2.29204 10.5318 3.03437C10.3287 3.23747 10.1499 3.46037 9.9974 3.69853Z"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M10.0022 6.10352C10.3249 6.10352 10.5864 6.33087 10.5864 6.61133V16.0905C10.5864 16.371 10.3249 16.5983 10.0022 16.5983C9.67954 16.5983 9.41797 16.371 9.41797 16.0905V6.61133C9.41797 6.33087 9.67954 6.10352 10.0022 6.10352Z"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M12.3965 10C12.3965 9.71954 12.6581 9.49219 12.9807 9.49219H14.4738C14.7964 9.49219 15.058 9.71954 15.058 10C15.058 10.2805 14.7964 10.5078 14.4738 10.5078H12.9807C12.6581 10.5078 12.3965 10.2805 12.3965 10Z"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M12.3965 7.29492C12.3965 7.01446 12.6581 6.78711 12.9807 6.78711H14.4738C14.7964 6.78711 15.058 7.01446 15.058 7.29492C15.058 7.57538 14.7964 7.80273 14.4738 7.80273H12.9807C12.6581 7.80273 12.3965 7.57538 12.3965 7.29492Z"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M4.93555 10C4.93555 9.71954 5.19712 9.49219 5.51979 9.49219H7.01284C7.33551 9.49219 7.59708 9.71954 7.59708 10C7.59708 10.2805 7.33551 10.5078 7.01284 10.5078H5.51979C5.19712 10.5078 4.93555 10.2805 4.93555 10Z"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M4.93555 7.29492C4.93555 7.01446 5.19712 6.78711 5.51979 6.78711H7.01284C7.33551 6.78711 7.59708 7.01446 7.59708 7.29492C7.59708 7.57538 7.33551 7.80273 7.01284 7.80273H5.51979C5.19712 7.80273 4.93555 7.57538 4.93555 7.29492Z"
              />
            </svg>
            <span className="text-sm mx-1 text-gray-900">Documentation</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14 8.66667V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V3.33333C2 2.97971 2.14048 2.64057 2.39052 2.39052C2.64057 2.14048 2.97971 2 3.33333 2H7.33333"
                stroke="#717684"
                stroke-width="1.2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M14 2L8 8"
                stroke="#717684"
                stroke-width="1.2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10 2H14V6"
                stroke="#717684"
                stroke-width="1.2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </a>
          <a
            href="#"
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M5.22311 3.42548C6.78821 2.28509 8.70916 1.7412 10.6398 1.89181C12.5704 2.04243 14.3838 2.87764 15.7531 4.24696C17.1224 5.61627 17.9576 7.42963 18.1082 9.36026C18.2589 11.2909 17.715 13.2118 16.5746 14.7769C15.4342 16.342 13.7723 17.4484 11.8884 17.8966C10.0918 18.324 8.20595 18.1261 6.54063 17.3403L1.86864 18.924C1.64335 19.0004 1.39425 18.9422 1.22604 18.774C1.05784 18.6058 0.999702 18.3567 1.07607 18.1314L2.6598 13.4594C1.87396 11.7941 1.67605 9.90827 2.10348 8.11168C2.55168 6.22776 3.65801 4.56587 5.22311 3.42548ZM10.5426 3.13802C8.90896 3.01058 7.28354 3.4708 5.95923 4.43574C4.63491 5.40069 3.69878 6.8069 3.31953 8.40099C2.94029 9.99507 3.14286 11.6722 3.89075 13.1301C3.96793 13.2806 3.98086 13.4559 3.92657 13.6161L2.66635 17.3337L6.384 16.0735C6.54415 16.0192 6.71946 16.0321 6.86992 16.1093C8.32786 16.8572 10.005 17.0598 11.5991 16.6805C13.1932 16.3013 14.5994 15.3651 15.5643 14.0408C16.5293 12.7165 16.9895 11.0911 16.862 9.45748C16.7346 7.82387 16.0279 6.28949 14.8692 5.13084C13.7106 3.97219 12.1762 3.26547 10.5426 3.13802Z"
                fill="#717684"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M10.2497 6.48012C9.81328 6.40526 9.36445 6.48727 8.98269 6.71163C8.60094 6.93599 8.31091 7.28822 8.16397 7.70593C8.04943 8.03154 7.69261 8.20265 7.36699 8.08811C7.04137 7.97356 6.87026 7.61674 6.98481 7.29112C7.22971 6.59494 7.71309 6.0079 8.34934 5.63397C8.98559 5.26004 9.73365 5.12335 10.461 5.24811C11.1884 5.37288 11.8482 5.75104 12.3234 6.31563C12.7986 6.88012 13.0587 7.59455 13.0577 8.33242C13.0574 9.49723 12.1921 10.2851 11.5294 10.7269C11.179 10.9605 10.8331 11.133 10.5772 11.2467C10.4484 11.304 10.3401 11.3473 10.2626 11.3768C10.2238 11.3916 10.1926 11.403 10.1702 11.411L10.1432 11.4204L10.135 11.4232L10.1322 11.4242L10.1307 11.4247C10.1305 11.4247 10.1304 11.4248 9.93272 10.8319L10.1307 11.4247C9.80328 11.5338 9.44895 11.357 9.3398 11.0295C9.23075 10.7024 9.40725 10.3488 9.73408 10.2393L9.73654 10.2384L9.75142 10.2332C9.76561 10.2282 9.78808 10.22 9.81765 10.2087C9.87688 10.1862 9.96397 10.1514 10.0695 10.1045C10.2824 10.0099 10.5614 9.8699 10.836 9.68683C11.4233 9.29533 11.8077 8.8334 11.8077 8.33186C11.8084 7.88906 11.6523 7.45938 11.3671 7.12063C11.082 6.78188 10.6861 6.55498 10.2497 6.48012Z"
                fill="#717684"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M9.375 14.1641C9.375 13.8189 9.65482 13.5391 10 13.5391H10.0083C10.3535 13.5391 10.6333 13.8189 10.6333 14.1641C10.6333 14.5092 10.3535 14.7891 10.0083 14.7891H10C9.65482 14.7891 9.375 14.5092 9.375 14.1641Z"
                fill="#717684"
              />
            </svg>

            <span className="text-sm mx-1 text-gray-900">Support</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14 8.66667V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V3.33333C2 2.97971 2.14048 2.64057 2.39052 2.39052C2.64057 2.14048 2.97971 2 3.33333 2H7.33333"
                stroke="#717684"
                stroke-width="1.2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M14 2L8 8"
                stroke="#717684"
                stroke-width="1.2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10 2H14V6"
                stroke="#717684"
                stroke-width="1.2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </a>
          <button className="flex items-center text-gray-600 hover:text-gray-900">
            <span className="text-sm mr-1 text-gray-900">Log out</span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.41667 3.12583C4.97833 3.12583 4.375 3.65083 4.375 4.64333V15.3592C4.375 16.3525 4.97833 16.8767 5.41667 16.8767H11.2467C11.4124 16.8767 11.5714 16.9425 11.6886 17.0597C11.8058 17.1769 11.8717 17.3359 11.8717 17.5017C11.8717 17.6674 11.8058 17.8264 11.6886 17.9436C11.5714 18.0608 11.4124 18.1267 11.2467 18.1267H5.41667C4.01417 18.1267 3.125 16.7325 3.125 15.3592V4.6425C3.125 3.26917 4.01417 1.875 5.41667 1.875H11.25C11.4158 1.875 11.5747 1.94085 11.6919 2.05806C11.8092 2.17527 11.875 2.33424 11.875 2.5C11.875 2.66576 11.8092 2.82473 11.6919 2.94194C11.5747 3.05915 11.4158 3.125 11.25 3.125L5.41667 3.12583Z"
                fill="#717684"
              />
              <path
                d="M13.7763 6.64372C13.6591 6.52668 13.5003 6.46094 13.3346 6.46094C13.169 6.46094 13.0102 6.52668 12.893 6.64372V9.37372H7.91797C7.75221 9.37372 7.59324 9.43957 7.47603 9.55678C7.35882 9.67399 7.29297 9.83296 7.29297 9.99872C7.29297 10.1645 7.35882 10.3235 7.47603 10.4407C7.59324 10.5579 7.75221 10.6237 7.91797 10.6237H12.893V13.3604C13.0102 13.4774 13.169 13.5432 13.3346 13.5432C13.5003 13.5432 13.6591 13.4774 13.7763 13.3604L16.693 10.4437C16.7512 10.3855 16.7974 10.3164 16.8289 10.2403C16.8603 10.1643 16.8764 10.0827 16.8763 10.0004V9.99872C16.8762 9.90732 16.8561 9.81704 16.8174 9.73425C16.7787 9.65146 16.7223 9.57817 16.6521 9.51955L13.7763 6.64372Z"
                fill="#717684"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;
