import { useRef, useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useMenu } from "../hooks/useMenu";
import RecentMenu from "./RecentMenu";
import SidebarMenuItem from "./SidebarMenuItem";
import { Icon } from "./Icon";
import {
  ICON_CLOCK,
  ICON_LOGO,
  ICON_MENU,
  ICON_CLOSE_MENU,
} from "../assets/icons";

interface SidebarMenuProps {
  toggleMegaMenu: () => void;
  isMegaMenuOpen?: boolean;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({
  toggleMegaMenu,
  isMegaMenuOpen = false,
}) => {
  const [recentMenuOpen, setRecentMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [, setLocation] = useLocation();
  const recentButtonRef = useRef<HTMLButtonElement>(null);
  const { pinnedItems, recentItems, getCategoryIcon } = useMenu();

  // Разделяем pinnedItems на две группы
  const regularPinnedItems = pinnedItems.filter((item) => !item.fromRecent);
  const recentPinnedItems = pinnedItems.filter((item) => item.fromRecent);

  const toggleRecentMenu = () => {
    setRecentMenuOpen(!recentMenuOpen);
  };

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

  const handleItemClick = (itemId: string) => {
    setLocation(`/resource/${itemId}`);
  };

  const handleMenuClick = () => {
    if (isClosing) return;

    if (isMegaMenuOpen) {
      setIsClosing(true);
      setTimeout(() => {
        setIsClosing(false);
      }, 300);
    }

    toggleMegaMenu();
  };

  return (
    <aside className="w-[60px] bg-white h-full border-r border-gray-200 flex flex-col fixed left-0 top-0 z-50 transition-all duration-300">
      <div className="flex flex-col items-center pt-4 h-full">
        {/* Logo/Menu/Close icon with appropriate states */}
        <button
          className={`p-3 mb-4 rounded-lg text-gray-900 hover:bg-gray-100 transition-all duration-300 group relative ${
            isMegaMenuOpen ? "bg-gray-100" : ""
          }`}
          aria-label={isMegaMenuOpen ? "Закрыть меню" : "Открыть меню"}
          onClick={handleMenuClick}
        >
          {/* Logo (SVG) - visible only in default state when closed and not hovering */}
          {!isMegaMenuOpen && (
            <div
              className={`transform transition-all duration-300 ${
                isMegaMenuOpen
                  ? "opacity-0 scale-0"
                  : "group-hover:opacity-0 group-hover:scale-0"
              } absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2`}
            >
              <Icon name={ICON_LOGO} size={20} className="text-red-500" />
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

        {/* Divider */}
        <div className="w-8 h-px bg-gray-200 my-2"></div>

        {/* Regular Pinned Items Section */}
        <div className="flex flex-col items-center overflow-y-auto hide-scrollbar flex-grow">
          {pinnedItems.length === 0 && (
            <div className="text-gray-400 text-xs text-center px-2 py-2">
              Прикрепите элементы из меню
            </div>
          )}

          {regularPinnedItems.map((item) => (
            <div key={item.id} className="relative group">
              <SidebarMenuItem
                item={item}
                onClick={() => handleItemClick(item.id)}
                getCategoryIcon={getCategoryIcon}
                isCentral={true}
              />
            </div>
          ))}

          {/* Divider before Recent Search */}
          <div className="w-8 h-px bg-gray-200 mb-2"></div>

          {/* Recent Items Button */}
          <div className="relative">
            <button
              ref={recentButtonRef}
              className="p-3 rounded-lg text-gray-900 hover:bg-gray-100 transition-colors"
              aria-label="Недавние элементы"
              title="Недавние элементы"
              onClick={toggleRecentMenu}
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

          {/* Recent Pinned Items */}
          {recentPinnedItems.map((item) => (
            <div key={item.id} className="relative group">
              <SidebarMenuItem
                item={item}
                onClick={() => handleItemClick(item.id)}
                getCategoryIcon={getCategoryIcon}
              />
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default SidebarMenu;
