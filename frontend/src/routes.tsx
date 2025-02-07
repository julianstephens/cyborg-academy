import DashboardPage from "@/pages/dashboard";
import LandingPage from "@/pages/landing";
import { Route, Routes } from "react-router";
import { ProtectedRoute } from "./components/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route index element={<LandingPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            {/* @ts-expect-error 2741 */}
            <DashboardPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
