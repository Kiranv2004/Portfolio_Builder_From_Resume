import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PublicPortfolio from './pages/PublicPortfolio';
import DemoPortfolio from './pages/DemoPortfolio';
import LandingPage from './pages/LandingPage';
import PrivateRoute from './components/PrivateRoute';

// Placeholder for Dashboard
// const Dashboard = () => <div>Dashboard</div>;

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard/*"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<LandingPage />} />
          <Route path="/demo" element={<DemoPortfolio />} />
          <Route path="/p/:username" element={<PublicPortfolio />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
