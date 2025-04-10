import React, { useEffect, useMemo, useState } from "react";
import { Icon } from "./Icon";
import {
  ICON_LOGO,
  ICON_MENU,
  ICON_CLOSE_MENU,
  ICON_CLOCK,
  ICON_GETTING_STARTED,
  ICON_PIN_FILLED,
  ICON_PIN,
  ICON_PROFILE,
} from "../assets/icons/icon-map";
import { useMenu } from "../hooks/useMenu";
import SidebarMenuItem from "./SidebarMenuItem";
import { MenuItem } from "../types/menu";

// Стили для бокового меню
const SIDEBAR_MENU_STYLES = {
  // Основные контейнеры
  container:
    "fixed left-0 top-0 h-screen w-[80px] bg-white border-r border-gray-200 flex flex-col items-center",
  innerContainer: "w-full flex flex-col items-center h-full relative",

  // Фиксированная верхняя зона
  fixedTopZone: "w-full flex flex-col items-center pt-4 px-2",

  // Скроллируемая зона для элементов
  scrollableZone:
    "w-full flex-1 overflow-y-auto flex flex-col items-center px-2 scrollbar-hide mb-5",

  // Фиксированная нижняя зона
  fixedBottomZone: "w-full flex flex-col items-center pt-2",

  // Стили логотипа
  logo: {
    button:
      "px-5 py-5 mt-2 rounded-lg text-gray-900 hover:bg-gray-100 transition-all duration-300 group relative",
    buttonActive: "bg-gray-100",
    keyboardHint: "flex items-center gap-0.5 text-xs text-gray-600",
  },

  // Разделители и заголовки
  divider: "w-8 h-px bg-gray-200 my-2",

  sectionHeader: {
    container: "flex flex-col items-center w-full py-2",
    titleContainer: "flex items-center justify-center mb-2",
    icon: "text-gray-500 mr-1",
    title: "text-xs uppercase text-gray-500 font-normal tracking-wider",
    divider: "w-[60px] h-px bg-gray-200",
  },

  // Контейнеры для элементов
  itemsContainer: "w-full flex flex-col items-center space-y-1 mb-2",

  // Зона профиля
  profileZone:
    "w-full flex justify-center mt-2 pb-4 border-t border-gray-200 pt-4",
  profileButton:
    "p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors flex items-center justify-center",

  // Зона recent items
  recentItems: "w-full flex flex-col items-center space-y-1 pb-2 h-[200px]",
  recentItemsPlaceholder: {
    container: "w-full flex flex-col items-center justify-center h-full",
    item: "w-[64px] h-[64px] rounded-md bg-gray-100 mb-2",
  },
};

interface SidebarMenuProps {
  toggleMegaMenu?: () => void;
  isMegaMenuOpen?: boolean;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({
  toggleMegaMenu,
  isMegaMenuOpen = false,
}) => {
  const {
    pinnedItems,
    recentItems,
    getCategoryIcon,
    isActiveItem,
    setActiveItem,
    addToPinned,
    setPinnedItems,
    trackRecentItem,
    clearRecentItems,
    isRecentSectionVisible,
    activeItemId,
    allMenuItems,
  } = useMenu();

  // Добавляем состояние для отслеживания наведения на активный контекстный элемент
  const [isActiveItemHovered, setIsActiveItemHovered] = useState(false);

  // Отслеживаем изменение URL и устанавливаем активный элемент
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith("#/resource/")) {
        const resourceId = hash.replace("#/resource/", "");

        // Проверяем, начинается ли resourceId с category-
        if (!resourceId.startsWith("category-")) {
          // Проверяем, является ли это навигационной кнопкой (resource-browser, rest-console и т.д.)
          // Для них нужно установить активный элемент

          // Проверяем, существует ли элемент с таким ID в allMenuItems
          const menuItem = allMenuItems.find((item) => item.id === resourceId);
          if (
            menuItem ||
            resourceId === "resource-browser" ||
            resourceId === "rest-console" ||
            resourceId === "db-console" ||
            resourceId === "settings"
          ) {
            // Устанавливаем элемент активным
            setActiveItem(resourceId);
          }
        }
      }
    };

    // Вызываем один раз при монтировании для установки начального состояния
    handleHashChange();

    // Подписываемся на изменения хэша (URL)
    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [setActiveItem, allMenuItems]);

  // Убираем разделение на системные и пользовательские элементы
  // Теперь все элементы будут отображаться в одном списке
  const hasPinnedItems = pinnedItems.length > 0;

  // Обработчик клика на элемент меню
  const handleItemClick = (item: MenuItem) => {
    setActiveItem(item.id);

    // Отслеживаем элемент в недавних
    // Добавляем свойство fromSidebar для избежания дублирования в Recent
    const itemToTrack = { ...item, fromSidebar: true };
    trackRecentItem(itemToTrack);

    // Переходим по ссылке
    if (item.id.startsWith("category-")) {
      // Для категорий используем ID без префикса
      const categoryId = item.id.replace("category-", "");
      window.location.hash = `/resource/${categoryId}`;
    } else {
      // Для обычных элементов используем ID как есть
      window.location.hash = `/resource/${item.id}`;
    }
  };

  // Получаем активный элемент, который будет отображаться в контекстном блоке
  const activeContextItem = useMemo(() => {
    // Если нет активного элемента, то нечего показывать
    if (!activeItemId) return null;

    // Если активный элемент уже есть в закрепленных, не показываем его дополнительно
    const isPinnedActive = pinnedItems.some((item) => item.id === activeItemId);
    if (isPinnedActive) return null;

    // Ищем активный элемент во всех доступных списках
    const activeItem = allMenuItems.find((item) => item.id === activeItemId);

    // Если нашли, возвращаем для отображения
    return activeItem || null;
  }, [activeItemId, pinnedItems, allMenuItems]);

  // Функция закрепления активного контекстного элемента
  const pinActiveContextItem = () => {
    if (activeContextItem) {
      // Если у элемента есть родитель, нужно сохранить информацию об иконке родителя
      if (activeContextItem.parentId) {
        // Создаем копию элемента с явным указанием использовать иконку родителя
        const itemToPin = {
          ...activeContextItem,
          icon: "parent", // Специальное значение, указывающее на использование иконки родителя
        };
        addToPinned(itemToPin);
      } else {
        // Если родителя нет, добавляем как есть
        addToPinned(activeContextItem);
      }
    }
  };

  // В конце файла, прямо перед export default SidebarMenu
  // Добавляем стили для скрытия скроллбара через CSS
  const scrollbarHideStyles = `
    /* Для WebKit (Chrome, Safari, новые версии Edge) */
    .scrollbar-hide::-webkit-scrollbar {
      display: none;
    }
    
    /* Для Firefox */
    .scrollbar-hide {
      scrollbar-width: none;
    }
    
    /* Для IE и Edge */
    .scrollbar-hide {
      -ms-overflow-style: none;
    }
  `;

  // Вставляем стили в head при монтировании компонента
  useEffect(() => {
    // Проверяем, существует ли уже стиль
    if (!document.getElementById("scrollbar-hide-styles")) {
      const style = document.createElement("style");
      style.id = "scrollbar-hide-styles";
      style.innerHTML = scrollbarHideStyles;
      document.head.appendChild(style);
    }

    return () => {
      // Cleanup при размонтировании
      const style = document.getElementById("scrollbar-hide-styles");
      if (style) {
        document.head.removeChild(style);
      }
    };
  }, []);

  return (
    <aside className={SIDEBAR_MENU_STYLES.container}>
      <div className={SIDEBAR_MENU_STYLES.innerContainer}>
        {/* ФИКСИРОВАННАЯ ВЕРХНЯЯ ЗОНА: Логотип и заголовок PINNED */}
        <div className={SIDEBAR_MENU_STYLES.fixedTopZone}>
          {/* Логотип и переключатель меню */}
          <div className="flex flex-col items-center gap-2 mb-2">
            <button
              className={`${SIDEBAR_MENU_STYLES.logo.button} ${
                isMegaMenuOpen ? SIDEBAR_MENU_STYLES.logo.buttonActive : ""
              }`}
              onClick={toggleMegaMenu}
            >
              {/* Logo (SVG) - visible only in default state when closed and not hovering */}
              {!isMegaMenuOpen && (
                <div className="transform transition-all duration-300 group-hover:opacity-0 group-hover:scale-0 flex justify-center items-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <Icon name={ICON_LOGO} size={32} preserveColors={true} />
                </div>
              )}

              {/* Menu icon - shown on hover when closed */}
              {!isMegaMenuOpen && (
                <div className="transform transition-all duration-300 opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100 flex justify-center items-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <Icon
                    name={ICON_MENU}
                    size={20}
                    className="text-gray-900 pointer-events-none"
                  />
                </div>
              )}

              {/* Close (X) icon - shown when menu is open */}
              {isMegaMenuOpen && (
                <div className="flex justify-center items-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <Icon
                    name={ICON_CLOSE_MENU}
                    size={20}
                    className="text-gray-900"
                  />
                </div>
              )}
            </button>
            <div className={SIDEBAR_MENU_STYLES.logo.keyboardHint}>
              {!isMegaMenuOpen ? (
                <>
                  <span className="flex items-center justify-center w-4 h-4 bg-gray-200 rounded shadow-sm font-medium">
                    ⌘
                  </span>
                  <span className="font-medium">+</span>
                  <span className="flex items-center justify-center w-4 h-4 bg-gray-200 rounded shadow-sm font-medium">
                    K
                  </span>
                </>
              ) : (
                <span className="flex items-center justify-center w-[26px] h-4 bg-gray-200 rounded shadow-sm font-medium text-[10px]">
                  ESC
                </span>
              )}
            </div>
          </div>

          {/* Активный контекстный элемент - показываем только если он не в закрепленных */}
          {activeContextItem && (
            <div
              className="w-full px-2 mt-4 mb-2 flex justify-center relative"
              onMouseEnter={() => setIsActiveItemHovered(true)}
              onMouseLeave={() => setIsActiveItemHovered(false)}
            >
              <SidebarMenuItem
                key={`context-${activeContextItem.id}`}
                item={activeContextItem}
                onClick={() => handleItemClick(activeContextItem)}
                isCentral={true}
                isActive={true}
                showParent={!!activeContextItem.parentId}
              />

              {/* Кнопка для закрепления активного элемента */}
              {isActiveItemHovered && (
                <button
                  className="absolute top-0 right-0.5 transform -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-sm flex items-center justify-center hover:bg-gray-100 transition-colors border border-gray-200 cursor-pointer z-10"
                  onClick={pinActiveContextItem}
                  title="Закрепить элемент"
                >
                  <Icon name={ICON_PIN} size={12} className="text-gray-500" />
                </button>
              )}
            </div>
          )}

          {/* Заголовок PINNED */}
          <div className={SIDEBAR_MENU_STYLES.sectionHeader.container}>
            <div className={SIDEBAR_MENU_STYLES.sectionHeader.titleContainer}>
              <Icon
                name={ICON_PIN_FILLED}
                size={10}
                className={SIDEBAR_MENU_STYLES.sectionHeader.icon}
              />
              <span className={SIDEBAR_MENU_STYLES.sectionHeader.title}>
                PINNED
              </span>
            </div>
            {/* Центрируем разделитель независимо от других элементов */}
            <div className="flex justify-center w-full">
              <div className={SIDEBAR_MENU_STYLES.sectionHeader.divider}></div>
            </div>
          </div>
        </div>

        {/* СКРОЛЛИРУЕМАЯ ЗОНА: все припиненные элементы в одном списке */}
        <div className={SIDEBAR_MENU_STYLES.scrollableZone}>
          {/* Все закрепленные элементы вместе */}
          {hasPinnedItems && (
            <div className={SIDEBAR_MENU_STYLES.itemsContainer}>
              {pinnedItems.map((item) => (
                <SidebarMenuItem
                  key={item.id}
                  item={item}
                  onClick={() => handleItemClick(item)}
                  isCentral={!item.fromRecent}
                  isActive={isActiveItem(item.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* ФИКСИРОВАННАЯ НИЖНЯЯ ЗОНА: RECENT и Profile */}
        <div className={SIDEBAR_MENU_STYLES.fixedBottomZone}>
          {/* Заголовок RECENT с кнопкой очистки - отображаем только если isRecentSectionVisible=true */}
          {isRecentSectionVisible && (
            <div className="w-full relative">
              <div className={SIDEBAR_MENU_STYLES.sectionHeader.container}>
                <div
                  className={SIDEBAR_MENU_STYLES.sectionHeader.titleContainer}
                >
                  <Icon
                    name={ICON_CLOCK}
                    size={10}
                    className={SIDEBAR_MENU_STYLES.sectionHeader.icon}
                  />
                  <span className={SIDEBAR_MENU_STYLES.sectionHeader.title}>
                    RECENT
                  </span>
                </div>
                <div
                  className={SIDEBAR_MENU_STYLES.sectionHeader.divider}
                ></div>
              </div>

              {/* Кнопка очистки недавних элементов (абсолютно позиционирована) */}
              {recentItems.length > 0 && (
                <button
                  onClick={() => clearRecentItems()}
                  className="absolute right-4 top-2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                  title="Очистить недавние элементы"
                >
                  <Icon name={ICON_CLOSE_MENU} size={10} />
                </button>
              )}
            </div>
          )}

          {/* Отображаем 3 последних элемента из recentItems или placeholder - только если isRecentSectionVisible=true */}
          {isRecentSectionVisible && (
            <div className={SIDEBAR_MENU_STYLES.recentItems}>
              {recentItems.length > 0 ? (
                recentItems.slice(0, 3).map((item) => {
                  // Проверяем, есть ли этот элемент в приколотых (pinned)
                  const isPinnedItem = pinnedItems.some(
                    (pinnedItem) => pinnedItem.id === item.id
                  );

                  return (
                    <SidebarMenuItem
                      key={item.id}
                      item={item}
                      onClick={() => handleItemClick(item)}
                      isCentral={true}
                      showParent={true}
                      // Элемент в Recent активен только если он активен И НЕ приколот
                      isActive={isActiveItem(item.id) && !isPinnedItem}
                    />
                  );
                })
              ) : (
                <div
                  className={
                    SIDEBAR_MENU_STYLES.recentItemsPlaceholder.container
                  }
                >
                  <div
                    className={SIDEBAR_MENU_STYLES.recentItemsPlaceholder.item}
                  ></div>
                  <div
                    className={SIDEBAR_MENU_STYLES.recentItemsPlaceholder.item}
                  ></div>
                  <div
                    className={SIDEBAR_MENU_STYLES.recentItemsPlaceholder.item}
                  ></div>
                </div>
              )}
            </div>
          )}

          {/* Профиль пользователя */}
          <div className={SIDEBAR_MENU_STYLES.profileZone}>
            <button
              className={SIDEBAR_MENU_STYLES.profileButton}
              aria-label="Профиль пользователя"
              title="Профиль пользователя"
            >
              <Icon name={ICON_PROFILE} size={20} className="text-gray-500" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SidebarMenu;
