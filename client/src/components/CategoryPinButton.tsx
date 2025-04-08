import React from "react";
import { Icon } from "./Icon";
import { ICON_PIN, ICON_PIN_FILLED } from "../assets/icons";
import { Category } from "../types/menu";

interface CategoryPinButtonProps {
  category: Category;
  isPinned: (id: string) => boolean;
  handlePinToggle: (category: Category) => void;
}

const CategoryPinButton: React.FC<CategoryPinButtonProps> = ({
  category,
  isPinned,
  handlePinToggle,
}) => {
  const categoryId = `category-${category.id}`;
  const isPinnedValue = isPinned(categoryId);

  return (
    <button
      className={`${
        isPinnedValue
          ? "text-red-500 hover:text-red-600"
          : "text-gray-300 hover:text-red-500"
      } transition-colors flex items-center justify-center w-6 h-6`}
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
      <Icon name={isPinnedValue ? ICON_PIN_FILLED : ICON_PIN} size={16} />
    </button>
  );
};

export default CategoryPinButton;
