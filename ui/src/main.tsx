import { AuthProvider } from "@/components/AuthProvider.tsx";
import { Provider } from "@/components/ui/provider";
import queryClient from "@/query-client";
import AppRoutes from "@/routes.tsx";
import { Box } from "@chakra-ui/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router";
import { ToastContainer } from "react-toastify";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Provider>
            <HelmetProvider>
              <Box w="vw" h="vh" p="11">
                <AppRoutes />
              </Box>
              <ToastContainer theme="dark" draggable={false} />
            </HelmetProvider>
          </Provider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
);
