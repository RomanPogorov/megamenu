import React from "react";
import { FaThumbtack } from "react-icons/fa";
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
      className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors relative"
      onClick={onClick}
    >
      <div className="flex items-center flex-grow gap-2">
        <span className="text-gray-800">{item.name}</span>
      </div>
      <button
        className={`${isPinned ? "text-red-500 hover:text-red-600" : "text-gray-300 hover:text-red-500"} 
          transition-colors flex-shrink-0 p-1 absolute right-2 top-1/2 transform -translate-y-1/2`}
        aria-label={
          isPinned ? `Открепить ${item.name}` : `Прикрепить ${item.name}`
        }
        title={isPinned ? `Открепить ${item.name}` : `Прикрепить ${item.name}`}
        onClick={handlePinClick}
      >
        <FaThumbtack size={14} />
      </button>
    </li>
  );
};

export default MenuItem;
