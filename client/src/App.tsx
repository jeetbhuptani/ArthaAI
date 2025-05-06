import { BrowserRouter } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import SmoothScroll from "./components/common/SmoothScroll";
import { AppRoutes } from "./routes/approutes";
import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  return (
    <BrowserRouter>
      <div className="w-full mx-auto p-4 min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <GoogleOAuthProvider clientId={googleClientId}>
            <SmoothScroll />
            <AppRoutes />
          </GoogleOAuthProvider>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
