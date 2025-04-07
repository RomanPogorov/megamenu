import React from "react";
import { Icon } from "./Icon";
import { ICON_LOGO, ICON_MENU, ICON_CLOSE_MENU } from "../assets/icons";
import { useMenu } from "../hooks/useMenu";
import SidebarMenuItem from "./SidebarMenuItem";

interface SidebarMenuProps {
  toggleMegaMenu?: () => void;
  isMegaMenuOpen?: boolean;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({
  toggleMegaMenu,
  isMegaMenuOpen = false,
}) => {
  const { pinnedItems, getCategoryIcon } = useMenu();

  return (
    <aside className="fixed left-0 top-0 h-screen w-[60px] bg-white border-r border-gray-200 flex flex-col items-center py-4">
      <div className="w-full flex flex-col items-center">
        <div className="flex flex-col items-center gap-2 mb-8">
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
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <span className="flex items-center justify-center w-4 h-4 bg-gray-100 rounded">
              ⌘
            </span>
            <span>+</span>
            <span className="flex items-center justify-center w-4 h-4 bg-gray-100 rounded">
              K
            </span>
          </div>
        </div>

        <div className="w-full flex flex-col items-center space-y-1">
          {pinnedItems.map((item) => (
            <SidebarMenuItem
              key={item.id}
              item={item}
              onClick={() => {}}
              getCategoryIcon={getCategoryIcon}
            />
          ))}
        </div>
      </div>
    </aside>
  );
};

export default SidebarMenu;
