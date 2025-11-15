import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Dashboard from "./pages/Dashboard";
import ReportIssue from "./pages/ReportIssue";
import Analytics from "./pages/Analytics";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import WhatsAppAI from "./pages/WhatsAppAI";
import ProfileComplete from "./pages/ProfileComplete";
import Profile from "./pages/Profile";
import SuperAdmin from "./pages/SuperAdmin";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!cancelled) {
        const mock = (() => {
          try { return JSON.parse(localStorage.getItem("mockAuth") || "null"); } catch { return null; }
        })();
        setAuthed(!!session || !!mock);
        setLoading(false);
      }
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!cancelled) {
        const mock = (() => {
          try { return JSON.parse(localStorage.getItem("mockAuth") || "null"); } catch { return null; }
        })();
        setAuthed(!!session || !!mock);
      }
    });
    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  if (loading) return null;
  return authed ? children : <Navigate to="/signin" replace />;
};

const SuperAdminRoute = ({ children }: { children: JSX.Element }) => {
  const mock = (() => {
    try { return JSON.parse(localStorage.getItem("mockAuth") || "null"); } catch { return null; }
  })();
  if (mock && mock.role === "superadmin") return children;
  return <Navigate to="/signin" replace />;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/signin" replace />} />
          <Route
            path="/dashboard"
            element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
          />
          <Route
            path="/report"
            element={<ProtectedRoute><ReportIssue /></ProtectedRoute>}
          />
          <Route
            path="/analytics"
            element={<ProtectedRoute><Analytics /></ProtectedRoute>}
          />
          <Route
            path="/superadmin"
            element={<SuperAdminRoute><SuperAdmin /></SuperAdminRoute>}
          />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/whatsapp-ai" element={<WhatsAppAI />} />
          <Route
            path="/profile-complete"
            element={<ProtectedRoute><ProfileComplete /></ProtectedRoute>}
          />
          <Route
            path="/profile"
            element={<ProtectedRoute><Profile /></ProtectedRoute>}
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
