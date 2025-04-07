import * as Icons from '../assets/icons';

/**
 * Получает компонент иконки по ID категории
 */
export const getCategoryIconComponent = (categoryId: string) => {
  switch (categoryId) {
    case 'resources':
      return Icons.ResourceIcon;
    case 'database':
      return Icons.DatabaseIcon;
    case 'api':
      return Icons.ApiIcon;
    case 'notebooks':
      return Icons.NotebookIcon;
    case 'far':
      return Icons.TasksIcon;
    case 'plugins':
      return Icons.PluginsIcon;
    case 'iam':
      return Icons.UserShieldIcon;
    default:
      return Icons.LayerGroupIcon;
  }
};