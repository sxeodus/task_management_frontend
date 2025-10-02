import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './App.css'
import { Login, Register } from './components/Auth';
import useAuthStore from './store/authStore';
import TaskManagerDashboard from './components/Dashboard/TaskManagerDashboard';

function App() {
  const { isAuthenticated, initializeAuth } = useAuthStore();

  // Initialize auth state on app load
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Toaster position="top-right" />
        
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/login" 
            element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/register" 
            element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} 
          />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={isAuthenticated ? <TaskManagerDashboard /> : <Navigate to="/login" />} 
          />
          
          {/* Default redirect */}
          <Route 
            path="/" 
            element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} 
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App
