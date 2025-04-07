export interface Category {
  id: string;
  name: string;
  icon: string;
  order: number;
}

export interface MenuItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  category: string;
  important?: boolean;
  categoryName?: string;
  isParent?: boolean;
  parentId?: string;
  fromRecent?: boolean;
  isPinned?: boolean;
}

export interface SearchFilter {
  id: string;
  name: string;
  count: number;
}

export interface MenuState {
  pinnedItems: MenuItem[];
  recentItems: MenuItem[];
  searchQuery: string;
  searchResults: MenuItem[];
  activeFilter: string;
}
