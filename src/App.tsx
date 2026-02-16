import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ErrorBoundary from "@/components/ErrorBoundary";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy-loaded pages
const Guides = lazy(() => import("./pages/Guides"));
const Contact = lazy(() => import("./pages/Contact"));
const App = lazy(() => import("./pages/App"));
const MangerAuComptoir = lazy(() => import("./pages/MangerAuComptoir"));
const DynamicGuidePage = lazy(() => import("./components/DynamicGuidePage"));
const Admin = lazy(() => import("./pages/Admin"));
const Login = lazy(() => import("./pages/Login"));
const MentionsLegales = lazy(() => import("./pages/MentionsLegales"));
const PolitiqueConfidentialite = lazy(() => import("./pages/PolitiqueConfidentialite"));

const queryClient = new QueryClient();

const Loading = () => (
  <div className="min-h-screen bg-[#F1F0EB] flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black" />
  </div>
);

const AppRouter = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<Loading />}>
              <Routes>
                <Route path="/" element={<Index />} />
                {/* Guides routes hidden for now
                <Route path="/guides" element={<Guides />} />
                <Route path="/guides/manger-au-comptoir" element={<MangerAuComptoir />} />
                <Route path="/guides/:guideSlug" element={<DynamicGuidePage />} />
                */}
                <Route path="/app" element={<App />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
                <Route path="/mentions-legales" element={<MentionsLegales />} />
                <Route path="/politique-de-confidentialite" element={<PolitiqueConfidentialite />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default AppRouter;
