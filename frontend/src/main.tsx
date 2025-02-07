import { AuthProvider } from "@/components/AuthContext.tsx";
import { Provider } from "@/components/ui/provider";
import AppRoutes from "@/routes.tsx";
import { Box } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Provider>
            <Box w="vw" h="vh" p="11">
              <AppRoutes />
            </Box>
          </Provider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
);
