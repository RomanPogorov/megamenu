import React from "react";
import { Icon } from "./Icon";
import { ICON_PIN, ICON_PIN_FILLED } from "../assets/icons";
import { MenuItem as MenuItemType } from "../types/menu";

interface MenuItemProps {
  item: MenuItemType;
  isPinned: boolean;
  onPinToggle: () => void;
  onClick: () => void;
  isChild?: boolean;
  parentIcon?: string;
}

const MenuItem: React.FC<MenuItemProps> = ({
  item,
  isPinned,
  onPinToggle,
  onClick,
  isChild = false,
  parentIcon = "",
}) => {
  const handlePinClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPinToggle();
  };

  return (
    <li
      className="flex items-center group cursor-pointer hover:bg-gray-50 py-1 rounded transition-colors"
      onClick={onClick}
    >
      <button
        className={`${
          isPinned
            ? "text-red-500 hover:text-red-600"
            : "text-gray-300 hover:text-red-500"
        } transition-colors flex items-center justify-center w-6 h-6`}
        aria-label={
          isPinned ? `Открепить ${item.name}` : `Прикрепить ${item.name}`
        }
        title={isPinned ? `Открепить ${item.name}` : `Прикрепить ${item.name}`}
        onClick={handlePinClick}
      >
        <Icon name={isPinned ? ICON_PIN_FILLED : ICON_PIN} size={16} />
      </button>
      <div className="flex items-center min-w-0 ml-2">
        <span className="text-gray-800 truncate">{item.name}</span>
      </div>
    </li>
  );
};

export default MenuItem;
