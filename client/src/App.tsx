import { BrowserRouter } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import SmoothScroll from "./components/common/SmoothScroll";
import { AppRoutes } from "./routes/approutes";
import { AuthProvider } from "./context/AuthContext";
import { LoadingProvider } from "./context/LoadingProvider";
import GTTranslator from "./components/GTTranslator";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <BrowserRouter basename="/client/dist/">
      <LoadingProvider>
          <AuthProvider>
            <div className="w-full mx-auto min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                  <AppRoutes />
                  <SmoothScroll />
              </main>
              <Footer />
              <GTTranslator />
              <Toaster position="top-right" richColors/>
            </div>
          </AuthProvider>
      </LoadingProvider>
    </BrowserRouter>
  );
}

export default App;
