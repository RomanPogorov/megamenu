import React from "react";

// Импортируем SVG как строки
import resourcesIcon from "../assets/icons/svg/folder-open.svg?raw";
import notebooksIcon from "../assets/icons/svg/book.svg?raw";
import apiIcon from "../assets/icons/svg/code.svg?raw";
import databaseIcon from "../assets/icons/svg/database.svg?raw";
import iamIcon from "../assets/icons/svg/user-shield.svg?raw";
import farIcon from "../assets/icons/svg/tasks.svg?raw";
import pluginsIcon from "../assets/icons/svg/puzzle-piece.svg?raw";
import searchIcon from "../assets/icons/svg/search.svg?raw";
import pinIcon from "../assets/icons/svg/thumbtack.svg?raw";
import pinFilledIcon from "../assets/icons/svg/thumbtack-filled.svg?raw";
import clockIcon from "../assets/icons/svg/clock.svg?raw";
import logoIcon from "../assets/icons/svg/logo.svg?raw";
import menuIcon from "../assets/icons/svg/menu.svg?raw";
import closeMenuIcon from "../assets/icons/svg/close-menu.svg?raw";
import layerGroupIcon from "../assets/icons/svg/layer-group.svg?raw";

// Карта SVG иконок
const SVG_MAP: Record<string, string> = {
  "icon-resources": resourcesIcon,
  "icon-notebooks": notebooksIcon,
  "icon-api": apiIcon,
  "icon-database": databaseIcon,
  "icon-iam": iamIcon,
  "icon-far": farIcon,
  "icon-plugins": pluginsIcon,
  "icon-search": searchIcon,
  "icon-pin": pinIcon,
  "icon-pin-filled": pinFilledIcon,
  "icon-clock": clockIcon,
  "icon-logo": logoIcon,
  "icon-menu": menuIcon,
  "icon-close-menu": closeMenuIcon,
  "icon-layer-group": layerGroupIcon,
};

interface IconProps {
  name: string;
  className?: string;
  size?: number;
}

export const Icon: React.FC<IconProps> = ({ name, className = "", size }) => {
  const svgContent = SVG_MAP[name];

  if (!svgContent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  const style = size ? { width: `${size}px`, height: `${size}px` } : undefined;

  return (
    <span
      className={className}
      style={style}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
};
