import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Layout
import Layout from './components/common/Layout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Search from './pages/Search';
import CreateRecipe from './pages/CreateRecipe';
import ChefDashboard from './pages/ChefDashboard';
import RecipeDetails from './pages/RecipeDetails';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/search" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />

        {/* Protected Routes - Require Authentication */}
        <Route
          path="search"
          element={
            <ProtectedRoute>
              <Search />
            </ProtectedRoute>
          }
        />

        <Route
          path="recipe/:id"
          element={
            <ProtectedRoute>
              <RecipeDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Chef-only Routes */}
        <Route
          path="chef"
          element={
            <ProtectedRoute allowedRoles={['chef']}>
              <ChefDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="create-recipe"
          element={
            <ProtectedRoute allowedRoles={['chef']}>
              <CreateRecipe />
            </ProtectedRoute>
          }
        />

        <Route
          path="edit-recipe/:id"
          element={
            <ProtectedRoute allowedRoles={['chef']}>
              <CreateRecipe />
            </ProtectedRoute>
          }
        />

        {/* 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;