import { useMenu } from "../hooks/useMenu";
import { MenuItem } from "../types/menu";
import { Icon } from "./Icon";
import { createPortal } from "react-dom";
import {
  ICON_RESOURCES,
  ICON_NOTEBOOKS,
  ICON_API,
  ICON_DATABASE,
  ICON_IAM,
  ICON_FAR,
  ICON_PLUGINS,
  ICON_PIN,
  ICON_PIN_FILLED,
} from "../assets/icons/icon-map";

interface RecentMenuProps {
  items: MenuItem[];
  buttonRect?: DOMRect;
}

const RecentMenu: React.FC<RecentMenuProps> = ({ items, buttonRect }) => {
  const {
    addToPinned,
    removeFromPinned,
    pinnedItems,
    getCategoryIcon,
    getParentName,
  } = useMenu();

  const isPinned = (itemId: string) => {
    return pinnedItems.some((item) => item.id === itemId);
  };

  const handlePinToggle = (e: React.MouseEvent, item: MenuItem) => {
    e.stopPropagation();

    if (isPinned(item.id)) {
      removeFromPinned(item.id);
    } else {
      addToPinned({
        ...item,
        fromRecent: true,
      });
    }
  };

  const getIconComponent = (icon: string | React.ReactNode) => {
    if (typeof icon !== "string") {
      return icon;
    }

    switch (icon) {
      case "folder-open":
        return (
          <Icon
            name={ICON_RESOURCES}
            size={20}
            className="text-gray-900 mr-2"
          />
        );
      case "code":
        return (
          <Icon name={ICON_API} size={20} className="text-gray-900 mr-2" />
        );
      case "database":
        return (
          <Icon name={ICON_DATABASE} size={20} className="text-gray-900 mr-2" />
        );
      case "book":
        return (
          <Icon
            name={ICON_NOTEBOOKS}
            size={20}
            className="text-gray-900 mr-2"
          />
        );
      case "tasks":
        return (
          <Icon name={ICON_FAR} size={20} className="text-gray-900 mr-2" />
        );
      case "puzzle-piece":
        return (
          <Icon name={ICON_PLUGINS} size={20} className="text-gray-900 mr-2" />
        );
      case "user-shield":
        return (
          <Icon name={ICON_IAM} size={20} className="text-gray-900 mr-2" />
        );
      default:
        return (
          <Icon
            name={ICON_RESOURCES}
            size={20}
            className="text-gray-900 mr-2"
          />
        );
    }
  };

  return createPortal(
    <div
      id="recentDropdown"
      className="fixed bg-white shadow-lg rounded-lg w-56 border border-gray-200 z-[9999]"
      style={{
        left: buttonRect ? buttonRect.right + 8 : 0,
        top: buttonRect ? buttonRect.top - 8 : 0,
      }}
    >
      <div className="p-2 border-b border-gray-200 font-medium text-gray-800">
        RECENT
      </div>
      <div className="max-h-80 overflow-y-auto">
        {items.length === 0 ? (
          <div className="p-4 text-sm text-gray-500 text-center">
            No recent items
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-2 hover:bg-gray-50"
            >
              <div className="flex items-center">
                {item.parentId ? (
                  <div className="relative">
                    {getIconComponent(getCategoryIcon(item.category))}
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-none absolute inline-flex h-full w-full rounded-full bg-blue-500"></span>
                    </span>
                  </div>
                ) : typeof item.icon === "string" ? (
                  getIconComponent(item.icon)
                ) : (
                  <Icon
                    name={ICON_RESOURCES}
                    size={20}
                    className="text-gray-900 mr-2"
                  />
                )}
                <span className="text-sm text-gray-800 truncate max-w-[150px]">
                  {item.parentId
                    ? `${item.name} (${getParentName(item)})`
                    : item.name}
                </span>
              </div>
              <button
                className={`${isPinned(item.id) ? "text-red-500 hover:text-gray-500" : "text-gray-500 hover:text-red-500"} transition-colors flex items-center justify-center w-6 h-6`}
                onClick={(e) => {
                  e.stopPropagation();
                  handlePinToggle(e, item);
                }}
                aria-label={isPinned(item.id) ? "Открепить" : "Закрепить"}
              >
                <Icon
                  name={isPinned(item.id) ? ICON_PIN_FILLED : ICON_PIN}
                  size={16}
                />
              </button>
            </div>
          ))
        )}
      </div>
    </div>,
    document.body
  );
};

export default RecentMenu;
