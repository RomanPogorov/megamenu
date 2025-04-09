import React from "react";

// Импортируем SVG файлы как строки используя ?raw модификатор Vite
// Это позволяет получить содержимое SVG в виде строки для вставки в HTML
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
import gettingStartedIcon from "../assets/icons/svg/gettingstarted.svg?raw";

// Создаем словарь, где ключ - имя иконки, значение - содержимое SVG файла
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
  "icon-getting-started": gettingStartedIcon,
};

// Определяем типы для входных параметров компонента
interface IconProps {
  name: string; // Имя иконки из SVG_MAP
  className?: string; // Опциональные CSS классы
  size?: number; // Опциональный размер в пикселях
  preserveColors?: boolean; // Новый параметр - сохранять оригинальные цвета
}

// Компонент иконки
export const Icon: React.FC<IconProps> = ({
  name,
  className = "",
  size,
  preserveColors = false, // По умолчанию - не сохранять (применять цвет текста)
}) => {
  let svgContent = SVG_MAP[name];

  if (!svgContent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  // Модифицируем SVG корректно, чтобы сохранить пропорции
  if (size) {
    // Извлекаем ширину и высоту из оригинала для viewBox
    const widthMatch = svgContent.match(/width="(\d+)"/);
    const heightMatch = svgContent.match(/height="(\d+)"/);
    const viewBoxMatch = svgContent.match(/viewBox="([^"]+)"/);

    // Используем либо указанные атрибуты, либо стандартные значения
    const originalWidth = widthMatch ? widthMatch[1] : "16";
    const originalHeight = heightMatch ? heightMatch[1] : "16";

    // Полностью удаляем атрибуты width и height из SVG
    svgContent = svgContent
      .replace(/width="([^"]+)"/g, "")
      .replace(/height="([^"]+)"/g, "");

    // Добавляем viewBox, если его нет
    if (!viewBoxMatch) {
      svgContent = svgContent.replace(
        "<svg",
        `<svg viewBox="0 0 ${originalWidth} ${originalHeight}"`
      );
    }
  }

  // Модифицируем цвета только если не нужно сохранять оригинальные
  if (!preserveColors) {
    // Проверяем, содержит ли SVG группы g и clipPath
    const hasGroups = svgContent.includes("<g");
    const hasClipPath = svgContent.includes("<clipPath");

    // Если есть сложная структура с группами и clipPath, обрабатываем особым образом
    if (hasGroups && hasClipPath) {
      // Заменяем fill="black" на fill="currentColor" для корректного отображения
      svgContent = svgContent.replace(/fill="black"/g, 'fill="currentColor"');
      // Сохраняем fill="white" для clipPath и подобных элементов
      svgContent = svgContent.replace(/fill="white" \/>/g, 'fill="white" />');
    } else {
      // Обычная замена для простых SVG
      svgContent = svgContent
        .replace(/fill="(?!none)([^"]+)"/g, 'fill="currentColor"')
        .replace(/stroke="(?!none)([^"]+)"/g, 'stroke="currentColor"');
    }
  }

  // Встраиваем SVG напрямую для полного контроля над размером
  return (
    <div
      className={`inline-flex items-center justify-center overflow-hidden ${className}`}
      style={{
        width: size ? `${size}px` : "auto",
        height: size ? `${size}px` : "auto",
      }}
      aria-hidden="true"
      dangerouslySetInnerHTML={{
        __html: svgContent.replace("<svg", '<svg width="100%" height="100%"'),
      }}
    />
  );
};
