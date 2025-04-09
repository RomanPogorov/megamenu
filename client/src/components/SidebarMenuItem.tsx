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
} from "../assets/icons/icon-map";
import * as Tooltip from "@radix-ui/react-tooltip";

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
  isCentral?: boolean;
  activeCategoryId?: string | null;
}

const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({
  item,
  onClick,
  isCentral = true,
  activeCategoryId,
}) => {
  // Access the getParentIcon function from the menu context
  const { getParentIcon, getParentName } = useMenu();

  const renderIcon = (iconName: string | React.ReactNode) => {
    if (typeof iconName === "string") {
      return ICON_MAP[iconName] ? (
        <Icon name={ICON_MAP[iconName]} size={20} />
      ) : (
        <FaCircle className="text-xl" />
      );
    }
    return iconName;
  };

  const tooltipContent = item.parentId
    ? `${item.name} (${getParentName(item)})`
    : item.name;

  return (
    <Tooltip.Provider delayDuration={50}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button
            className={`px-3 ${isCentral ? "py-2" : "py-3"} rounded-lg text-gray-900 hover:bg-gray-100 transition-colors`}
            onClick={onClick}
          >
            <div className="relative">
              {item.isPinned && (
                <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-blue-500/20 border border-blue-500 rounded-full shadow-[0_0_4px_rgba(59,130,246,0.5)]" />
              )}
              {item.parentId ? (
                <div className="relative">
                  {renderIcon(getParentIcon(item))}
                  <span className="absolute top-5 -right-1 flex h-5 w-8">
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
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="rounded-lg bg-gray-900 px-3 py-2 text-sm leading-none text-white shadow-lg z-[9999] data-[state=delayed-open]:data-[side=right]:animate-slideRightAndFade"
            sideOffset={5}
            side="right"
          >
            {tooltipContent}
            <Tooltip.Arrow className="fill-gray-900" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

export default SidebarMenuItem;
