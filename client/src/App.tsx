import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";

import LoginPage from "@/pages/login";
import OnboardingPage from "@/pages/onboarding";
import LoadingPage from "@/pages/loading";
import DashboardPage from "@/pages/dashboard";
import PremiumPage from "@/pages/premium";
import ProfilePage from "@/pages/profile";
import { Layout } from "./components/layout";

// Placeholder pages
const HistoryPage = () => <Layout><div className="text-center py-20 text-2xl font-display">Menu History (Coming Soon)</div></Layout>;

function Router() {
  return (
    <Switch>
      <Route path="/" component={LoginPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/onboarding" component={OnboardingPage} />
      <Route path="/loading" component={LoadingPage} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route path="/premium" component={PremiumPage} />
      <Route path="/profile" component={ProfilePage} />
      <Route path="/history" component={HistoryPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Router />
    </QueryClientProvider>
  );
}

export default App;
