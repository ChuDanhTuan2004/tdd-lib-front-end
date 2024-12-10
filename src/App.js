import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { getCookie } from './service/CookieService';
import LandingPage from "./component/guest/home/LandingPage";
import EBookReader from "./component/guest/research/EBookReader";
import AdminDashboard from "./component/admin/manage/AdminDashboard";
import LoginPage from "./component/guest/home/LoginPage";
import ResearchAchievements from "./component/guest/home/ResearchAchievements";
import FeaturedCategories from "./component/guest/home/FeaturedCategories";
import LibraryServices from "./component/guest/home/LibraryServices";
import LibraryIntroduction from "./component/guest/home/LibraryIntroduction";

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const token = getCookie('token');
  console.log('Token:', token);
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/reader" element={<EBookReader />} />
        <Route path="/research" element={<ResearchAchievements />} />
        <Route path="/categories" element={<FeaturedCategories />} />
        <Route path="/services" element={<LibraryServices />} />
        <Route path="/introduction" element={<LibraryIntroduction />} />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
