// Централизованные стили для всех иконок в приложении
export const ICON_STYLES = {
  // Стили для иконок пинов
  pin: {
    active: "text-gray-500 hover:text-gray-900", // Стиль для активного/закрепленного пина с эффектом при наведении
    inactive: "text-gray-300 hover:text-gray-500", // Стиль для неактивного пина с эффектом при наведении
    size: 16, // Стандартный размер иконок пинов
  },

  // Стили для категорий
  categories: {
    resources: "text-gray-600", // Цвет иконки Resources
    notebooks: "text-red-500", // Цвет иконки Notebooks
    api: "text-red-500", // Цвет иконки API
    database: "text-red-500", // Цвет иконки Database
    iam: "text-red-500", // Цвет иконки IAM
    far: "text-red-500", // Цвет иконки FAR
    plugins: "text-red-500", // Цвет иконки Plugins
    settings: "text-red-500", // Цвет иконки Settings
    size: 20, // Стандартный размер иконок категорий
  },

  // Стили для навигационных кнопок
  navigation: {
    icon: "text-red-500", // Основной цвет иконок навигации
    text: "text-gray-700", // Цвет текста навигации
    hover: "hover:text-red-600", // Цвет иконок при наведении
    active: "text-red-600", // Цвет активной иконки
  },

  // Стили для иконок поиска и закрытия
  utility: {
    search: "text-red-500", // Цвет иконки поиска
    close: "text-gray-400", // Цвет иконки закрытия
    closeHover: "hover:text-gray-600", // Цвет иконки закрытия при наведении
    size: {
      search: 20, // Размер иконки поиска
      close: 16, // Размер иконки закрытия
    },
  },
};
