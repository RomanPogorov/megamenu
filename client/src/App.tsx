import { Switch, Route } from "wouter";
import { useState, useEffect } from "react";
import SidebarMenu from "./components/SidebarMenu";
import MegaMenu from "./components/MegaMenu";
import ResourceTypeView from "./pages/ResourceTypeView";
import NotFound from "./pages/not-found";
import { MenuProvider } from "./hooks/useMenu";
import { useShortcut } from "./hooks/useShortcut";

function App() {
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);

  useShortcut(() => setIsMegaMenuOpen((prev) => !prev));

  return (
    <MenuProvider>
      <div className="bg-gray-50 h-screen flex overflow-hidden">
        <SidebarMenu
          toggleMegaMenu={() => setIsMegaMenuOpen((prev) => !prev)}
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
    </MenuProvider>
  );
}

export default App;
