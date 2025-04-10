import React from "react";
import { Icon } from "./Icon";
import { ICON_PIN, ICON_PIN_FILLED } from "../assets/icons/icon-map";
import { MenuItem as MenuItemType } from "../types/menu";
import { ICON_STYLES } from "../styles/iconStyles";

interface MenuItemProps {
  item: MenuItemType;
  isPinned: boolean;
  onPinToggle: () => void;
  onClick: () => void;
  isChild?: boolean;
  parentIcon?: string | React.ReactNode;
  showPinButton?: boolean;
  pinIconSize?: number;
}

const MenuItem: React.FC<MenuItemProps> = ({
  item,
  isPinned,
  onPinToggle,
  onClick,
  isChild = false,
  parentIcon = "",
  showPinButton = true,
  pinIconSize = 16,
}) => {
  const handlePinClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPinToggle();
  };

  return (
    <li
      className="flex items-center justify-between group cursor-pointer hover:bg-gray-50 py-1 pl-2 rounded transition-colors"
      onClick={onClick}
    >
      <div className={`flex items-center min-w-0 flex-1 cursor-pointer`}>
        <span className="text-gray-800 truncate">{item.name}</span>
      </div>
      {showPinButton && (
        <button
          className={`${
            isPinned ? ICON_STYLES.pin.active : ICON_STYLES.pin.inactive
          } transition-colors flex items-center justify-center cursor-pointer`}
          aria-label={
            isPinned ? `Открепить ${item.name}` : `Прикрепить ${item.name}`
          }
          title={
            isPinned ? `Открепить ${item.name}` : `Прикрепить ${item.name}`
          }
          onClick={handlePinClick}
        >
          <Icon
            name={isPinned ? ICON_PIN_FILLED : ICON_PIN}
            size={pinIconSize}
            className="pointer-events-auto"
          />
        </button>
      )}
    </li>
  );
};

export default MenuItem;
