import React, { useRef, useState, useEffect } from "react";
import { Icon } from "./Icon";
import {
  ICON_LOGO,
  ICON_MENU,
  ICON_CLOSE_MENU,
  ICON_CLOCK,
} from "../assets/icons";
import { useMenu } from "../hooks/useMenu";
import SidebarMenuItem from "./SidebarMenuItem";
import RecentMenu from "./RecentMenu";

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
  const { pinnedItems, recentItems, getCategoryIcon } = useMenu();

  // Разделяем pinnedItems на две группы
  const regularPinnedItems = pinnedItems.filter((item) => !item.fromRecent);
  const recentPinnedItems = pinnedItems.filter((item) => item.fromRecent);

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

  return (
    <aside className="fixed left-0 top-0 h-screen w-[60px] bg-white border-r border-gray-200 flex flex-col items-center py-4">
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
                <Icon name={ICON_LOGO} size={32} className="text-gray-900" />
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
          <div className="flex items-center gap-0.5 text-xs text-gray-400">
            {!isMegaMenuOpen ? (
              <>
                <span className="flex items-center justify-center w-4 h-4 bg-gray-100 rounded">
                  ⌘
                </span>
                <span>+</span>
                <span className="flex items-center justify-center w-4 h-4 bg-gray-100 rounded">
                  K
                </span>
              </>
            ) : (
              <span className="flex items-center justify-center w-[26px] h-4 bg-gray-100 rounded text-[10px]">
                ESC
              </span>
            )}
          </div>
        </div>
        <div className="w-8 h-px bg-gray-200 my-2"></div>

        {/* Regular Pinned Items */}
        <div className="w-full flex flex-col items-center space-y-1">
          {regularPinnedItems.map((item) => (
            <SidebarMenuItem
              key={item.id}
              item={item}
              onClick={() => {}}
              getCategoryIcon={getCategoryIcon}
              isCentral={true}
            />
          ))}
        </div>

        {/* Divider before Recent Search */}
        <div className="w-8 h-px bg-gray-200 my-2"></div>

        {/* Recent Search Button */}
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

        {/* Recent Pinned Items */}
        {recentPinnedItems.map((item) => (
          <SidebarMenuItem
            key={item.id}
            item={item}
            onClick={() => {}}
            getCategoryIcon={getCategoryIcon}
          />
        ))}
      </div>
    </aside>
  );
};

export default SidebarMenu;
