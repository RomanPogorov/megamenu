import { Switch, Route, Router } from "wouter";
import { useState, useEffect } from "react";
import SidebarMenu from "./components/SidebarMenu";
import MegaMenu from "./components/MegaMenu";
import ResourceTypeView from "./pages/ResourceTypeView";
import NotFound from "./pages/not-found";
import { MenuProvider } from "./hooks/useMenu";
import { useShortcut } from "./hooks/useShortcut";
import { CustomizationProvider } from "./hooks/useCustomization";
import { useHashLocation } from "wouter/use-hash-location";

function AppContent() {
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);

  useShortcut(
    () => setIsMegaMenuOpen((prev) => !prev), // Для Command+K
    () => setIsMegaMenuOpen(false) // Для ESC
  );

  const toggleMegaMenu = () => {
    setIsMegaMenuOpen(!isMegaMenuOpen);
  };

  return (
    <MenuProvider>
      <CustomizationProvider>
        <div className="bg-gray-50 h-screen flex overflow-hidden">
          <SidebarMenu
            toggleMegaMenu={toggleMegaMenu}
            isMegaMenuOpen={isMegaMenuOpen}
          />

          <div className="flex-1 overflow-x-hidden overflow-y-auto ml-[60px] h-full">
            <Switch>
              <Route path="/" component={ResourceTypeView} />
              <Route path="/resource/:id" component={ResourceTypeView} />
              <Route component={NotFound} />
            </Switch>
          </div>

          <MegaMenu
            isOpen={isMegaMenuOpen}
            onClose={() => setIsMegaMenuOpen(false)}
          />
        </div>
      </CustomizationProvider>
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
