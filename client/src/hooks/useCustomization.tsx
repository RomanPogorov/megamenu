import React, { createContext, useContext, useState, useEffect } from "react";
import { useMenu } from "./useMenu";
import { menuItems } from "../data/menuData";

interface CustomizationContextType {
  isCustomizationEnabled: boolean;
  toggleCustomization: () => void;
  resetToDefault: () => void;
}

const CustomizationContext = createContext<
  CustomizationContextType | undefined
>(undefined);

export const CustomizationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isCustomizationEnabled, setIsCustomizationEnabled] = useState(false);
  const { setPinnedItems } = useMenu();

  // Функция для установки родительских элементов
  const setParentItems = () => {
    const parentItems = menuItems
      .filter((item) => item.isParent)
      .map((item) => ({
        id: `category-${item.id}`,
        name: item.name,
        icon: item.icon,
        category: item.id,
        isParent: true,
      }));

    setPinnedItems(parentItems);
  };

  // При первом рендере устанавливаем родительские элементы
  useEffect(() => {
    setParentItems();
  }, []);

  const toggleCustomization = () => {
    setIsCustomizationEnabled(!isCustomizationEnabled);
  };

  const resetToDefault = () => {
    setParentItems();
  };

  return (
    <CustomizationContext.Provider
      value={{
        isCustomizationEnabled,
        toggleCustomization,
        resetToDefault,
      }}
    >
      {children}
    </CustomizationContext.Provider>
  );
};

export const useCustomization = () => {
  const context = useContext(CustomizationContext);
  if (!context) {
    throw new Error(
      "useCustomization must be used within a CustomizationProvider"
    );
  }
  return context;
};
