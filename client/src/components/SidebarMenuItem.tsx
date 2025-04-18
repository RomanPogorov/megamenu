import { FaCircle } from "react-icons/fa";
import { MenuItem } from "../types/menu";
import { useMenu } from "../hooks/useMenu";
import { Icon } from "./Icon";
import {
  ICON_RESOURCES,
  ICON_NOTEBOOKS,
  ICON_API,
  ICON_DATABASE,
  ICON_IAM,
  ICON_FAR,
  ICON_PLUGINS,
  ICON_LAYER_GROUP,
} from "../assets/icons";

// Map of icon strings to icon names for rendering
const ICON_MAP: Record<string, string> = {
  "folder-open": ICON_RESOURCES,
  book: ICON_NOTEBOOKS,
  code: ICON_API,
  database: ICON_DATABASE,
  "user-shield": ICON_IAM,
  tasks: ICON_FAR,
  "puzzle-piece": ICON_PLUGINS,
  "layer-group": ICON_LAYER_GROUP,
};

interface SidebarMenuItemProps {
  item: MenuItem;
  onClick: () => void;
  getCategoryIcon: (categoryId: string) => string;
  isCentral?: boolean;
}

const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({
  item,
  onClick,
  getCategoryIcon,
  isCentral = false,
}) => {
  // Access the getParentIcon function from the menu context
  const { getParentIcon } = useMenu();

  const renderIcon = (iconName: string) => {
    return ICON_MAP[iconName] ? (
      <Icon name={ICON_MAP[iconName]} size={20} className="text-gray-900" />
    ) : (
      <FaCircle className="text-gray-900 text-xl" />
    );
  };

  return (
    <button
      className={`px-3 ${isCentral ? "py-2" : "py-3"} rounded-lg text-gray-900 hover:bg-gray-100 transition-colors`}
      aria-label={item.name}
      title={item.name}
      onClick={onClick}
    >
      <div className="text-xl relative">
        {item.parentId ? (
          <div className="relative">
            {renderIcon(getParentIcon(item))}
            <span className="absolute -top-1 -right-1 flex h-5 w-5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-white border border-gray-200 shadow-xl flex items-center justify-center">
                <span className="text-[10px] font-bold text-gray-900">
                  {item.name.slice(0, 2).toUpperCase()}
                </span>
              </span>
            </span>
          </div>
        ) : (
          renderIcon(item.icon)
        )}
      </div>
    </button>
  );
};

export default SidebarMenuItem;
