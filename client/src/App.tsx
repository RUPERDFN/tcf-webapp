import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "react-hot-toast"; // Using hot-toast as requested
import NotFound from "@/pages/not-found";

// Pages
import Landing from "@/pages/Landing";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import OnboardingFlow from "@/pages/onboarding/OnboardingFlow";
import LoadingPage from "@/pages/loading";
import DashboardPage from "@/pages/dashboard";
import ShoppingPage from "@/pages/shopping";
import RewardsPage from "@/pages/rewards";
import { AchievementToast } from "@/components/gamification";
import { useAuthStore } from "@/lib/stores/authStore";

// Protected Route Wrapper
const ProtectedRoute = ({ component: Component }: { component: any }) => {
   const isAuthenticated = useAuthStore(state => state.isAuthenticated);
   // Simple client-side protection
   return isAuthenticated ? <Component /> : <Login />;
};

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      
      {/* Onboarding nested routes handled by OnboardingFlow component logic */}
      <Route path="/onboarding/:step*" component={OnboardingFlow} />
      
      <Route path="/loading" component={LoadingPage} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route path="/shopping" component={ShoppingPage} />
      <Route path="/rewards" component={RewardsPage} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-center" toastOptions={{
         style: {
            background: '#2D2D2D',
            color: '#F8F8F8',
            fontFamily: 'Nunito',
            border: '1px solid #404040'
         }
      }} />
      <AchievementToast />
      <Router />
    </QueryClientProvider>
  );
}

export default App;
