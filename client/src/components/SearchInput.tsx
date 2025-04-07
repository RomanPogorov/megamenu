import React from "react";
import { Icon } from "./Icon";
import { ICON_SEARCH, ICON_CLOSE_MENU } from "../assets/icons";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  onFocus,
}) => {
  return (
    <div className="relative" onClick={(event) => event.stopPropagation()}>
      <input
        type="text"
        placeholder="Поиск в меню..."
        className="w-full px-4 py-2 pl-10 pr-10 border border-red-500 rounded-full focus:outline-none focus:ring-1 focus:ring-red-500 text-gray-800 transition-all duration-300"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
      />
      <Icon
        name={ICON_SEARCH}
        size={16}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500"
      />
      {value && (
        <button
          onClick={(event) => {
            event.stopPropagation();
            onChange("");
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <Icon name={ICON_CLOSE_MENU} size={16} />
        </button>
      )}
    </div>
  );
};

export default SearchInput;
