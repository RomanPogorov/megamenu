import { Switch, Route, Router, useParams } from "wouter";
import { useState, useEffect } from "react";
import SidebarMenu from "./components/SidebarMenu";
import MegaMenu from "./components/MegaMenu";
import ResourceTypeView from "./pages/ResourceTypeView";
import ResourcePage from "./pages/ResourcePage";
import NotFound from "./pages/not-found";
import { MenuProvider } from "./hooks/useMenu";
import { useShortcut } from "./hooks/useShortcut";
import { useHashLocation } from "wouter/use-hash-location";
import { useSearch, SearchProvider } from "./hooks/useSearch";

// Компонент, который решает, что отображать в зависимости от ID ресурса
const ResourceRouter = () => {
  const params = useParams<{ id?: string }>();

  // Если id равен "getting-started" - показываем ResourceTypeView (таблицу)
  if (params.id === "getting-started") {
    return <ResourceTypeView />;
  }

  // Иначе отображаем страницу ресурса
  return <ResourcePage />;
};

// Выносим функциональность с поиском в отдельный компонент внутри MenuProvider и SearchProvider
function AppWithSearch({
  isMegaMenuOpen,
  setIsMegaMenuOpen,
}: {
  isMegaMenuOpen: boolean;
  setIsMegaMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { searchQuery, setSearchQuery } = useSearch();

  // Обрабатываем ESC - сначала очистка поиска, потом закрытие меню
  useShortcut(
    () => setIsMegaMenuOpen((prev) => !prev), // Для Command+K
    () => {
      // Если поиск не пустой, очищаем его, иначе закрываем меню
      if (searchQuery) {
        setSearchQuery("");
      } else {
        setIsMegaMenuOpen(false);
      }
    }
  );

  return (
    <div className="bg-gray-50 h-screen flex overflow-hidden">
      <SidebarMenu
        toggleMegaMenu={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
        isMegaMenuOpen={isMegaMenuOpen}
      />

      <div className="flex-1 overflow-x-hidden overflow-y-auto ml-[80px] h-full">
        <Switch>
          <Route path="/" component={ResourceTypeView} />
          <Route path="/resource/:id" component={ResourceRouter} />
          <Route component={NotFound} />
        </Switch>
      </div>

      <MegaMenu
        isOpen={isMegaMenuOpen}
        onClose={() => setIsMegaMenuOpen(false)}
      />
    </div>
  );
}

function AppContent() {
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);

  return (
    <MenuProvider>
      <SearchProvider>
        <AppWithSearch
          isMegaMenuOpen={isMegaMenuOpen}
          setIsMegaMenuOpen={setIsMegaMenuOpen}
        />
      </SearchProvider>
    </MenuProvider>
  );
}

function App() {
  return (
    <Router hook={useHashLocation}>
      <AppContent />
    </Router>
  );
}

export default App;
