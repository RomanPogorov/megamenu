import React from "react";
import { Icon } from "./Icon";
import { ICON_PIN, ICON_PIN_FILLED } from "../assets/icons/icon-map";
import { Category } from "../types/menu";
import { ICON_STYLES } from "../styles/iconStyles";

interface CategoryPinButtonProps {
  category: Category;
  isPinned: (id: string) => boolean;
  handlePinToggle: (category: Category) => void;
  pinIconSize?: number;
}

const CategoryPinButton: React.FC<CategoryPinButtonProps> = ({
  category,
  isPinned,
  handlePinToggle,
  pinIconSize = 16,
}) => {
  const categoryId = `category-${category.id}`;
  const isPinnedValue = isPinned(categoryId);

  return (
    <button
      className={`${
        isPinnedValue ? ICON_STYLES.pin.active : ICON_STYLES.pin.inactive
      } transition-colors flex items-center justify-center relative `}
      aria-label={
        isPinnedValue
          ? `Открепить ${category.name}`
          : `Прикрепить ${category.name}`
      }
      title={
        isPinnedValue
          ? `Открепить ${category.name}`
          : `Прикрепить ${category.name}`
      }
      onClick={(e) => {
        e.stopPropagation();
        handlePinToggle(category);
      }}
    >
      <Icon
        name={isPinnedValue ? ICON_PIN_FILLED : ICON_PIN}
        size={pinIconSize}
        className="pointer-events-auto cursor-pointer"
      />
    </button>
  );
};

export default CategoryPinButton;
