import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import { AppLoadingOverlay } from "./components/AppLoadingOverlay";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import ComingSoonPage from "./pages/ComingSoonPage";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/cidades/:citySlug/locais/:itemSlug" component={ComingSoonPage} />
      <Route path="/cidades/:slug" component={ComingSoonPage} />
      <Route path="/roteiros/:slug" component={ComingSoonPage} />
      <Route path="/destinos/:slug" component={ComingSoonPage} />
      <Route path="/admin/destinos" component={ComingSoonPage} />
      <Route path="/admin/editorial" component={ComingSoonPage} />
      <Route path="/patrimonios" component={ComingSoonPage} />
      <Route path="/sabores" component={ComingSoonPage} />
      <Route path="/dados" component={ComingSoonPage} />
      <Route path="/agenda" component={ComingSoonPage} />
      <Route path="/parceiros" component={ComingSoonPage} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" switchable>
        <TooltipProvider>
          <AppLoadingOverlay />
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
