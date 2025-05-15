// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Components
import Layout from './components/layout/Layout';
import AnimatedBackground from './components/common/AnimatedBackground';
import LoginForm from './components/auth/LoginForm';
import SearchRecipes from './components/recipe/RecipeSearch';
import CreateRecipeForm from './components/recipe/CreateRecipeForm';
import RecipeList from './components/recipe/RecipeList';
import MyRecipes from './components/recipe/MyRecipes';
import RecipeDetails from './components/recipe/RecipeDetails';
import NotificationCenter from './components/notifications/NotificationCenter';

// Define theme for the app
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const isAuthenticated = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/recipes" />;
  }

  return children;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AnimatedBackground />
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          
          {/* Layout wrapper for all routes requiring navbar and footer */}
          <Route element={<Layout />}>
            <Route
              path="/recipes"
              element={
                <ProtectedRoute>
                  <>
                    <SearchRecipes />
                    <RecipeList />
                  </>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/create-recipe"
              element={
                <ProtectedRoute allowedRoles={['chef']}>
                  <CreateRecipeForm />
                </ProtectedRoute>
              }
            />

            <Route
              path="/my-recipes"
              element={
                <ProtectedRoute allowedRoles={['chef']}>
                  <MyRecipes />
                </ProtectedRoute>
              }
            />

            <Route
              path="/recipe/:recipeId"
              element={
                <ProtectedRoute>
                  <RecipeDetails />
                </ProtectedRoute>
              }
            />

            <Route
              path="/notifications"
              element={
                <ProtectedRoute allowedRoles={['chef']}>
                  <NotificationCenter />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Redirect root to recipes if logged in, otherwise to login */}
          <Route
            path="/"
            element={
              localStorage.getItem('token') ? 
              <Navigate to="/recipes" /> : 
              <Navigate to="/login" />
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
