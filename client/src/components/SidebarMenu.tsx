import React, { useRef, useState, useEffect } from "react";
import { Icon } from "./Icon";
import {
  ICON_LOGO,
  ICON_MENU,
  ICON_CLOSE_MENU,
  ICON_CLOCK,
  ICON_GETTING_STARTED,
} from "../assets/icons/icon-map";
import { useMenu } from "../hooks/useMenu";
import SidebarMenuItem from "./SidebarMenuItem";
import RecentMenu from "./RecentMenu";
import { MenuItem } from "../types/menu";

interface SidebarMenuProps {
  toggleMegaMenu?: () => void;
  isMegaMenuOpen?: boolean;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({
  toggleMegaMenu,
  isMegaMenuOpen = false,
}) => {
  const [recentMenuOpen, setRecentMenuOpen] = useState(false);
  const recentButtonRef = useRef<HTMLButtonElement>(null);
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

  // Close recent menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        recentButtonRef.current &&
        !recentButtonRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest("#recentDropdown")
      ) {
        setRecentMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
    <aside className="fixed left-0 top-0 h-screen w-[80px] bg-white border-r border-gray-200 flex flex-col items-center py-4">
      <div className="w-full flex flex-col items-center">
        <div className="flex flex-col items-center gap-2 mb-2">
          <button
            className={`p-3 rounded-lg text-gray-900 hover:bg-gray-100 transition-all duration-300 group relative ${
              isMegaMenuOpen ? "bg-gray-100" : ""
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
          <div className="flex items-center gap-0.5 text-xs text-gray-600">
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

        <div className="w-full flex flex-col items-center flex-grow overflow-y-auto">
          {/* Разделитель после основного меню */}
          <div className="w-8 h-px bg-gray-200 my-2"></div>

          {/* Системные припиненные элементы (теперь включая Getting Started) */}
          {hasSystemItems && (
            <div className="w-full flex flex-col items-center space-y-1 mb-2">
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
            <div className="w-full flex flex-col items-center space-y-1 mb-2">
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

        {/* Нижняя часть с кнопкой Recent */}
        <div className="mt-auto w-full flex justify-center ">
          <div className="relative">
            <button
              ref={recentButtonRef}
              className="p-3 rounded-lg text-gray-900 hover:bg-gray-100 transition-colors"
              aria-label="Недавние элементы"
              title="Недавние элементы"
              onClick={() => setRecentMenuOpen(!recentMenuOpen)}
            >
              <Icon name={ICON_CLOCK} size={24} className="text-gray-900" />
            </button>

            {/* Recent Items Dropdown */}
            {recentMenuOpen && recentItems.length > 0 && (
              <RecentMenu
                items={recentItems}
                buttonRect={recentButtonRef.current?.getBoundingClientRect()}
              />
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SidebarMenu;
