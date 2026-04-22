import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div>
      <nav className="nav">
        <h2>🚲 Bikepool</h2>
        <div className="nav-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/post-ride">Post Ride</Link>
          <Link to="/find-ride">Find Ride</Link>
          <Link to="/requests">Requests</Link>
          <button onClick={onLogout}>Logout</button>
        </div>
      </nav>
      <main className="container">
        <p className="muted">Logged in as {user?.name}</p>
        {children}
      </main>
    </div>
  );
}
