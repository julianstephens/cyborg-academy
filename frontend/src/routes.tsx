import { Route, Routes } from "react-router";
import App from "./App";

const AppRoutes = () => (
  <Routes>
    <Route index element={<App />} />
  </Routes>
);

export default AppRoutes;
