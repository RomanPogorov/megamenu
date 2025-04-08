import { Switch, Route } from "wouter";
import { useState, useEffect } from "react";
import SidebarMenu from "./components/SidebarMenu";
import MegaMenu from "./components/MegaMenu";
import ResourceTypeView from "./pages/ResourceTypeView";
import NotFound from "./pages/not-found";
import { MenuProvider } from "./hooks/useMenu";

function App() {
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);

  const toggleMegaMenu = () => {
    setMegaMenuOpen(!megaMenuOpen);
  };

  const closeMegaMenu = () => {
    setMegaMenuOpen(false);
  };

  // Close mega menu on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMegaMenu();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <MenuProvider>
      <div className="bg-gray-50 h-screen flex overflow-hidden">
        {/* Передаем состояние мегаменю в SidebarMenu */}
        <SidebarMenu toggleMegaMenu={toggleMegaMenu} isMegaMenuOpen={megaMenuOpen} />
        
        <div className="flex-1 overflow-x-hidden overflow-y-auto ml-[60px] h-full">
          <Switch>
            <Route path="/" component={ResourceTypeView} />
            <Route path="/resource/:id" component={ResourceTypeView} />
            <Route component={NotFound} />
          </Switch>
        </div>

        <MegaMenu isOpen={megaMenuOpen} onClose={closeMegaMenu} />
      </div>
    </MenuProvider>
  );
}

export default App;
