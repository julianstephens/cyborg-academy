import AdminPage from "@/pages/admin";
import DashboardPage from "@/pages/dashboard";
import LandingPage from "@/pages/landing";
import NotFoundPage from "@/pages/not-found";
import SeminarPage from "@/pages/seminar";
import { Route, Routes } from "react-router";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/dashboard"
        // element={
        //   <ProtectedRoute>
        //     <DashboardPage />
        //   </ProtectedRoute>
        // }
        element={<DashboardPage />}
      />
      <Route
        path="/dashboard/:slug"
        // element={
        //   <ProtectedRoute>
        //     <SeminarPage />
        //   </ProtectedRoute>
        // }
        element={<SeminarPage />}
      />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
