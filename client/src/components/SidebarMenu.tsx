import { useRef, useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useMenu } from "../hooks/useMenu";
import RecentMenu from "./RecentMenu";
import SidebarMenuItem from "./SidebarMenuItem";
import { 
  FaBars, 
  FaClock,
  FaTimes
} from "react-icons/fa";

interface SidebarMenuProps {
  toggleMegaMenu: () => void;
  isMegaMenuOpen?: boolean;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ toggleMegaMenu, isMegaMenuOpen = false }) => {
  const [recentMenuOpen, setRecentMenuOpen] = useState(false);
  const [, setLocation] = useLocation();
  const recentButtonRef = useRef<HTMLButtonElement>(null);
  const { pinnedItems, recentItems, getCategoryIcon } = useMenu();

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

  return (
    <aside className="w-[60px] bg-white h-full border-r border-gray-200 flex flex-col fixed left-0 top-0 z-50 transition-all duration-300">
      <div className="flex flex-col items-center pt-4 h-full">
        {/* Logo/Menu/Close icon with appropriate states */}
        <button 
          className={`p-3 mb-4 rounded-lg text-red-500 hover:bg-gray-100 transition-all duration-300 group relative ${isMegaMenuOpen ? 'bg-gray-100' : ''}`}
          aria-label={isMegaMenuOpen ? "Закрыть меню" : "Открыть меню"}
          onClick={toggleMegaMenu}
        >
          {/* Logo (SVG) - visible only in default state when closed and not hovering */}
          {!isMegaMenuOpen && (
            <div className={`transform transition-all duration-300 ${isMegaMenuOpen ? 'opacity-0 scale-0' : 'group-hover:opacity-0 group-hover:scale-0'} absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2`}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#E53E3E" />
                <path d="M2 17L12 22L22 17L12 12L2 17Z" fill="#E53E3E" opacity="0.7" />
              </svg>
            </div>
          )}
          
          {/* Menu icon - shown on hover when closed */}
          {!isMegaMenuOpen && (
            <FaBars className="text-xl transform transition-all duration-300 opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100 relative" />
          )}
          
          {/* Close (X) icon - shown when menu is open */}
          {isMegaMenuOpen && (
            <FaTimes className="text-xl relative" />
          )}
        </button>
        
        {/* Divider */}
        <div className="w-8 h-px bg-gray-200 my-2"></div>
        
        {/* Pinned Items Section */}
        <div className="flex flex-col items-center space-y-4 overflow-y-auto hide-scrollbar flex-grow py-2">
          {pinnedItems.length === 0 && (
            <div className="text-gray-400 text-xs text-center px-2 py-4">
              Прикрепите элементы из меню
            </div>
          )}
          
          {pinnedItems.map((item) => (
            <div
              key={item.id}
              className="relative group"
            >
              <SidebarMenuItem 
                item={item}
                onClick={() => handleItemClick(item.id)}
                getCategoryIcon={getCategoryIcon}
              />
              {/* Unpin button overlay временно скрыт (по требованию) */}
            </div>
          ))}
        </div>
        
        {/* Recent Items Button */}
        <div className="mt-auto mb-2 relative">
          <button 
            ref={recentButtonRef}
            className="p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Недавние элементы"
            title="Недавние элементы"
            onClick={toggleRecentMenu}
          >
            <FaClock className="text-xl" />
          </button>
          
          {/* Recent Items Dropdown */}
          {recentMenuOpen && recentItems.length > 0 && (
            <RecentMenu items={recentItems} />
          )}
        </div>
      </div>
    </aside>
  );
};

export default SidebarMenu;
