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
    "fixed left-0 top-0 h-screen w-[80px] bg-white border-r border-gray-200 flex flex-col items-center py-4",
  innerContainer: "w-full flex flex-col items-center h-full",

  // Верхняя зона (логотип и pinned items)
  upperZone: "w-full flex flex-col items-center flex-grow overflow-y-auto",
  logo: {
    button:
      "p-3 rounded-lg text-gray-900 hover:bg-gray-100 transition-all duration-300 group relative",
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

  // Зона профиля (теперь внизу)
  profileZone: "w-full flex justify-center mt-6 pb-2",
  profileButton:
    "p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors",

  // Зона recent items
  recentZone: "w-full flex flex-col items-center border-t border-gray-200",
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
    // Дополнительная логика навигации, если требуется
  };

  return (
    <aside className={SIDEBAR_MENU_STYLES.container}>
      <div className={SIDEBAR_MENU_STYLES.innerContainer}>
        {/* ВЕРХНЯЯ ЗОНА: Логотип и Pinned Items */}
        <div className={SIDEBAR_MENU_STYLES.upperZone}>
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
                <div className="transform transition-all duration-300 group-hover:opacity-0 group-hover:scale-0 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <Icon name={ICON_LOGO} size={32} preserveColors={true} />
                </div>
              )}

              {/* Menu icon - shown on hover when closed */}
              {!isMegaMenuOpen && (
                <Icon
                  name={ICON_MENU}
                  size={20}
                  className="text-gray-900 transform transition-all duration-300 opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100 relative pointer-events-none"
                />
              )}

              {/* Close (X) icon - shown when menu is open */}
              {isMegaMenuOpen && (
                <Icon
                  name={ICON_CLOSE_MENU}
                  size={20}
                  className="text-gray-900 relative"
                />
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
          <div className={SIDEBAR_MENU_STYLES.divider}></div>

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
            <div className={SIDEBAR_MENU_STYLES.sectionHeader.divider}></div>
          </div>

          {/* Системные припиненные элементы (теперь включая Getting Started) */}
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

        {/* НИЖНЯЯ ЗОНА: Recent Items */}
        <div className={SIDEBAR_MENU_STYLES.recentZone}>
          {/* Заголовок RECENT */}
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

          {/* Отображаем 3 последних элемента из recentItems */}
          <div className={SIDEBAR_MENU_STYLES.recentItems}>
            {recentItems.slice(0, 3).map((item) => (
              <SidebarMenuItem
                key={item.id}
                item={item}
                onClick={() => handleItemClick(item)}
                isCentral={true}
                isActive={isActiveItem(item.id)}
              />
            ))}
          </div>
        </div>

        {/* САМАЯ НИЖНЯЯ ЗОНА: Profile */}
        <div className={SIDEBAR_MENU_STYLES.profileZone}>
          <button
            className={SIDEBAR_MENU_STYLES.profileButton}
            aria-label="Профиль пользователя"
            title="Профиль пользователя"
          >
            <Icon name={ICON_PROFILE} size={24} className="text-gray-700" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default SidebarMenu;
