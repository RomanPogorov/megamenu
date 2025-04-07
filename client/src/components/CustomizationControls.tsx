import React from "react";
import { useCustomization } from "../hooks/useCustomization";

const CustomizationControls: React.FC = () => {
  const { isCustomizationEnabled, toggleCustomization, resetToDefault } =
    useCustomization();

  return (
    <div className="flex items-center gap-4">
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={isCustomizationEnabled}
          onChange={toggleCustomization}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        <span className="ml-2 text-sm font-medium text-gray-900">
          Customization
        </span>
      </label>
      <button
        onClick={resetToDefault}
        className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
      >
        Reset to Default
      </button>
    </div>
  );
};

export default CustomizationControls;
