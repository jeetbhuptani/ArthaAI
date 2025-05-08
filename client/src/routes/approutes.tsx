import { Route, Routes } from "react-router-dom";
import About from "../pages/About";
import LearningChat from "../pages/LearningChat";
import FinancialFormWizard from "../pages/FinancialFormWizard";
import Authentication from "../pages/Authentication";
import { ProtectedRoute } from "./ProtectedRoute";
import Dashboard from "../pages/Dashboard";
import BillsAnalyzer from "@/pages/BillAnalyzer";
import TaxFilingWizard from "@/pages/TaxFillingWizard";
import InvestmentComparator from "@/pages/InvestmentComparator";
import News from "@/pages/News";
import Profile from "@/pages/Profile";
export const AppRoutes = () => {
  return (
    <Routes>
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
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/analyzer" element={<BillsAnalyzer />} />
      <Route
        path="/tax"
        element={
          <ProtectedRoute>
            <TaxFilingWizard />
          </ProtectedRoute>
        }
      />
      <Route path="/comparator" element={<InvestmentComparator />} />
      <Route path="/news" element={<News />} />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};
