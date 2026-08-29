import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import { AppLoadingOverlay } from "./components/AppLoadingOverlay";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import AdminDestinations from "./pages/AdminDestinations";
import AdminEditorial from "@/pages/AdminEditorial";
import AdminFeedbacks from "@/pages/AdminFeedbacks";
import AgendaPage from "./pages/AgendaPage";
import CityPage from "./pages/CityPage";
import DadosPage from "./pages/DadosPage";
import FeedbackPage from "./pages/FeedbackPage";
import DestinationPage from "./pages/DestinationPage";
import Home from "./pages/Home";
import ItineraryPage from "./pages/ItineraryPage";
import LoginPage from "./pages/LoginPage";
import PatrimoniosPage from "./pages/PatrimoniosPage";
import PartnersPage from "./pages/PartnersPage";
import PilotPlacePage from "./pages/PilotPlacePage";
import SaboresPage from "./pages/SaboresPage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/cidades/:citySlug/locais/:itemSlug" component={PilotPlacePage} />
      <Route path="/cidades/:slug" component={CityPage} />
      <Route path="/roteiros/:slug" component={ItineraryPage} />
      <Route path="/destinos/:slug" component={DestinationPage} />
      <Route path="/admin/destinos" component={AdminDestinations} />
      <Route path="/admin/editorial" component={AdminEditorial} />
      <Route path="/admin/feedbacks" component={AdminFeedbacks} />
      <Route path="/login" component={LoginPage} />
      <Route path="/patrimonios" component={PatrimoniosPage} />
      <Route path="/sabores" component={SaboresPage} />
      <Route path="/dados" component={DadosPage} />
      <Route path="/feedback" component={FeedbackPage} />
      <Route path="/agenda" component={AgendaPage} />
      <Route path="/parceiros" component={PartnersPage} />
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
