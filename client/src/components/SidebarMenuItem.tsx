import { FaCircle } from "react-icons/fa";
import { MenuItem } from "../types/menu";
import { useMenu } from "../hooks/useMenu";
import { Icon } from "./Icon";
import {
  ICON_RESOURCES,
  ICON_NOTEBOOKS,
  ICON_API,
  ICON_DATABASE,
  ICON_IAM,
  ICON_FAR,
  ICON_PLUGINS,
  ICON_LAYER_GROUP,
  ICON_GETTING_STARTED,
} from "../assets/icons/icon-map";
import * as Tooltip from "@radix-ui/react-tooltip";

// Маппинг строковых идентификаторов иконок на константы
const ICON_MAP: Record<string, string> = {
  "folder-open": ICON_RESOURCES,
  book: ICON_NOTEBOOKS,
  code: ICON_API,
  database: ICON_DATABASE,
  "user-shield": ICON_IAM,
  tasks: ICON_FAR,
  "puzzle-piece": ICON_PLUGINS,
  "layer-group": ICON_LAYER_GROUP,
  "getting-started": ICON_GETTING_STARTED,
};

// Пропсы компонента элемента бокового меню
interface SidebarMenuItemProps {
  item: MenuItem; // Данные элемента меню
  onClick: () => void; // Обработчик клика
  isCentral?: boolean; // Флаг центрального позиционирования
  activeCategoryId?: string | null; // ID активной категории
  iconSize?: number; // Добавляем опциональный пропс
  isActive?: boolean; // Новый параметр
}

// Основной компонент элемента бокового меню
const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({
  item,
  onClick,
  isCentral = true,
  activeCategoryId,
  iconSize = 24, // Значение по умолчанию
  isActive = false, // Активное состояние
}) => {
  // Получение методов работы с меню через хук
  const { getParentIcon, getParentName, getCategoryIcon } = useMenu();

  // Функция рендеринга иконки
  const renderIcon = (iconName: string | React.ReactNode) => {
    // Для строковых идентификаторов используем маппинг
    if (typeof iconName === "string") {
      // Проверяем наличие в маппинге
      if (ICON_MAP[iconName]) {
        return (
          <Icon
            name={ICON_MAP[iconName]}
            size={iconSize}
            className={isActive ? "text-red-500" : "text-icon-text"}
          />
        );
      } else {
        // Если иконки нет в маппинге, используем иконку категории
        const categoryIcon = item.category
          ? getCategoryIcon(item.category)
          : "folder-open";
        // Если категория вернула строку, рекурсивно вызываем renderIcon
        if (typeof categoryIcon === "string" && ICON_MAP[categoryIcon]) {
          return (
            <Icon
              name={ICON_MAP[categoryIcon]}
              size={iconSize}
              className={isActive ? "text-red-500" : "text-icon-text"}
            />
          );
        } else {
          // В крайнем случае показываем круг как заглушку
          return (
            <FaCircle
              className={isActive ? "text-red-500" : "text-icon-text text-xl"}
            />
          );
        }
      }
    }
    return iconName; // Возвращаем готовый React-элемент
  };

  // Формирование содержимого тултипа
  const tooltipContent = item.parentId
    ? `${item.name} (${getParentName(item)})` // Для дочерних элементов добавляем родителя
    : item.name; // Для родительских - только имя

  return (
    // Провайдер тултипов с настройкой задержки
    <Tooltip.Provider delayDuration={50}>
      <Tooltip.Root>
        {/* Триггер тултипа (сам элемент меню) */}
        <Tooltip.Trigger asChild>
          <button
            className={`px-1 ${isCentral ? "py-2" : "py-3"} rounded-lg w-16  text-icon-text hover:bg-gray-100 transition-colors flex flex-col items-center ${
              isActive ? "bg-gray-50" : ""
            }`}
            onClick={onClick}
          >
            <div className="relative">
              {/* Индикатор закрепленного элемента */}
              {item.isPinned && (
                <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-blue-500/20 border border-blue-500 rounded-full shadow-[0_0_4px_rgba(59,130,246,0.5)]" />
              )}

              {/* Отображаем иконку без метки с буквами */}
              {item.parentId
                ? renderIcon(getParentIcon(item))
                : renderIcon(item.icon)}
            </div>

            {/* Добавляем название под иконкой */}
            <span
              className={`text-xs text-[11px] tracking-[0.02em] mt-1 w-full text-center truncate ${
                isActive ? "text-gray-900 font-medium" : "text-icon-text"
              }`}
            >
              {item.name}
            </span>
          </button>
        </Tooltip.Trigger>

        {/* Контент тултипа с анимацией */}
        <Tooltip.Portal>
          <Tooltip.Content
            className="rounded-lg bg-gray-900 px-3 py-2  text-sm leading-none text-white shadow-lg z-[9999] data-[state=delayed-open]:data-[side=right]:animate-slideRightAndFade"
            sideOffset={5}
            side="right"
          >
            {tooltipContent}
            <Tooltip.Arrow className="fill-gray-900" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

export default SidebarMenuItem;
