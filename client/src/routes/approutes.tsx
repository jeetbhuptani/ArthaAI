import { Route, Routes } from "react-router-dom";
import About from "../pages/About";
import LearningChat from "../pages/LearningChat";
import FinancialFormWizard from "../pages/FinancialFormWizard";
import Authentication from "../pages/Authentication";
import { ProtectedRoute } from "./ProtectedRoute";
export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<div>Welcome to Artha AI</div>} />
      <Route path="/about" element={<About />} />
      <Route path="/learning" element={<LearningChat />} />
      <Route
        path="/form"
        element={
          <ProtectedRoute>
            <FinancialFormWizard />
          </ProtectedRoute>
        }
      />
      <Route path="/authentication" element={<Authentication />} />
    </Routes>
  );
};
