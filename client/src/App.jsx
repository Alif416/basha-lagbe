import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PublicLayout from "./components/PublicLayout";
import Dashboard from "./components/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import About from "./pages/About";
import Profile from "./pages/Profile";
import ExplorePage from "./pages/ExplorePage";
import Features from "./pages/Features";
import LandlordPage from "./pages/LandlordPage";
import PropertyDetail from "./pages/PropertyDetail";
import AdminDashboard from "./Admin/AdminDash";
import AdminSignIn from "./Admin/SignIn";
import AdminSignUp from "./Admin/SignUp";
import AdminControl from "./Admin/AdminControl";
import UserControl from "./Admin/UserControl";
import PropertyControl from "./Admin/propertyControl";
import AdminAnalytics from "./Admin/Analytics";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes with Header/Navbar */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/about" element={<About />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
        </Route>

        {/* Protected User Dashboard Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />}>
            <Route path="profile" element={<Profile />} />
            <Route path="features" element={<Features />} />
            <Route path="landlord" element={<LandlordPage />} />
            <Route path="explore" element={<ExplorePage />} />
          </Route>
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/signin" element={<AdminSignIn />} />
        <Route path="/admin/signup" element={<AdminSignUp />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />}>
          <Route index element={<AdminControl />} />
          <Route path="users" element={<UserControl />} />
          <Route path="properties" element={<PropertyControl />} />
          <Route path="analytics" element={<AdminAnalytics />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
