import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import PostRidePage from './pages/PostRidePage';
import FindRidePage from './pages/FindRidePage';
import RideRequestsPage from './pages/RideRequestsPage';
import ActiveRidePage from './pages/ActiveRidePage';

function ProtectedLayout({ page }) {
  return (
    <ProtectedRoute>
      <Layout>{page}</Layout>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/dashboard" element={<ProtectedLayout page={<DashboardPage />} />} />
      <Route path="/post-ride" element={<ProtectedLayout page={<PostRidePage />} />} />
      <Route path="/find-ride" element={<ProtectedLayout page={<FindRidePage />} />} />
      <Route path="/requests" element={<ProtectedLayout page={<RideRequestsPage />} />} />
      <Route path="/active-ride" element={<ProtectedLayout page={<ActiveRidePage />} />} />
    </Routes>
  );
}
