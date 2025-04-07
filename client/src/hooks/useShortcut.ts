import { useEffect } from "react";

export const useShortcut = (callback: () => void, onEscape?: () => void) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Проверяем Command+K (Mac) или Ctrl+K (Windows/Linux)
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault(); // Предотвращаем стандартное поведение
        callback();
      }

      // Проверяем ESC
      if (event.key === "Escape" && onEscape) {
        event.preventDefault();
        onEscape();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [callback, onEscape]);
};
