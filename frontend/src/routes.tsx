import { useAuth } from "@/components/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import DashboardPage from "@/pages/dashboard";
import LandingPage from "@/pages/landing";
import NotFoundPage from "@/pages/not-found";
import SeminarPage from "@/pages/seminar";
import { Route, Routes } from "react-router";

const AppRoutes = () => {
  const { isLoggedIn } = useAuth();

  return (
    <Routes>
      <Route index={!isLoggedIn()} path="/" element={<LandingPage />} />
      <Route
        index={isLoggedIn()}
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/:slug"
        element={
          <ProtectedRoute>
            <SeminarPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
