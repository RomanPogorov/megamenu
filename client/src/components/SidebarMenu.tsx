import React, { useEffect } from "react";
import { Icon } from "./Icon";
import {
  ICON_LOGO,
  ICON_MENU,
  ICON_CLOSE_MENU,
  ICON_CLOCK,
  ICON_GETTING_STARTED,
  ICON_PIN_FILLED,
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
    "w-full flex-1 overflow-y-auto flex flex-col items-center px-2 py-2 scrollbar-hide",

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
  profileZone: "w-full flex justify-center mt-2 pb-4",
  profileButton:
    "p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors",

  // Зона recent items
  recentItems: "w-full flex flex-col items-center space-y-1 pb-2",
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
  } = useMenu();

  // Добавляем Getting Started при первой загрузке и делаем активным
  useEffect(() => {
    const gettingStartedItem = {
      id: "getting-started",
      name: "Start",
      icon: "getting-started",
      category: "system",
      isParent: true,
    };

    // Проверяем, есть ли уже такой элемент
    const existingIndex = pinnedItems.findIndex(
      (item) => item.id === "getting-started"
    );

    if (existingIndex === -1) {
      // Если элемента нет, добавляем его
      addToPinned(gettingStartedItem);
    } else {
      // Если элемент уже существует, обновляем его имя
      const updatedItems = [...pinnedItems];
      updatedItems[existingIndex] = {
        ...updatedItems[existingIndex],
        name: gettingStartedItem.name,
      };
      // Обновляем pinnedItems с обновленным именем
      setPinnedItems(updatedItems);
    }

    // Устанавливаем элемент активным
    setActiveItem("getting-started");
  }, []);

  // Разделяем pinnedItems по типам
  const systemPinnedItems = pinnedItems
    .filter((item) => item.isParent || item.id.startsWith("category-"))
    .sort((a, b) => {
      // getting-started всегда будет первым элементом
      if (a.id === "getting-started") return -1;
      if (b.id === "getting-started") return 1;
      return 0;
    });
  const userPinnedItems = pinnedItems.filter(
    (item) => !item.isParent && !item.id.startsWith("category-")
  );

  // Проверяем наличие разных типов элементов
  const hasSystemItems = systemPinnedItems.length > 0;
  const hasUserItems = userPinnedItems.length > 0;

  // console.log("System pinned items:", systemPinnedItems);
  // console.log("User pinned items:", userPinnedItems);

  // Обработчик клика на элемент меню
  const handleItemClick = (item: MenuItem) => {
    setActiveItem(item.id);

    // Отслеживаем элемент в недавних
    trackRecentItem(item);

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

          {/* Разделитель после основного меню */}

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

        {/* СКРОЛЛИРУЕМАЯ ЗОНА: только припиненные элементы */}
        <div className={SIDEBAR_MENU_STYLES.scrollableZone}>
          {/* Системные припиненные элементы */}
          {hasSystemItems && (
            <div className={SIDEBAR_MENU_STYLES.itemsContainer}>
              {systemPinnedItems.map((item) => (
                <SidebarMenuItem
                  key={item.id}
                  item={item}
                  onClick={() => handleItemClick(item)}
                  isCentral={true}
                  isActive={isActiveItem(item.id)}
                />
              ))}
            </div>
          )}

          {/* Пользовательские припиненные элементы */}
          {hasUserItems && (
            <div className={SIDEBAR_MENU_STYLES.itemsContainer}>
              {userPinnedItems.map((item) => (
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
          {/* Заголовок RECENT с кнопкой очистки */}
          <div className="w-full relative">
            <div className={SIDEBAR_MENU_STYLES.sectionHeader.container}>
              <div className={SIDEBAR_MENU_STYLES.sectionHeader.titleContainer}>
                <Icon
                  name={ICON_CLOCK}
                  size={10}
                  className={SIDEBAR_MENU_STYLES.sectionHeader.icon}
                />
                <span className={SIDEBAR_MENU_STYLES.sectionHeader.title}>
                  RECENT
                </span>
              </div>
              <div className={SIDEBAR_MENU_STYLES.sectionHeader.divider}></div>
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

          {/* Отображаем 3 последних элемента из recentItems */}
          <div className={SIDEBAR_MENU_STYLES.recentItems}>
            {recentItems.slice(0, 3).map((item) => (
              <SidebarMenuItem
                key={item.id}
                item={item}
                onClick={() => handleItemClick(item)}
                isCentral={true}
                isActive={
                  isActiveItem(item.id) &&
                  !pinnedItems.some((pinnedItem) => pinnedItem.id === item.id)
                }
              />
            ))}
          </div>

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
