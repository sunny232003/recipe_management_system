import React, { createContext, useState } from 'react';

export const RecipeContext = createContext(null);

export const RecipeProvider = ({ children }) => {
  const [recipes, setRecipes] = useState([]);
  const [searchParams, setSearchParams] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const value = {
    recipes,
    setRecipes,
    searchParams,
    setSearchParams,
    loading,
    setLoading,
    error,
    setError
  };

  return (
    <RecipeContext.Provider value={value}>
      {children}
    </RecipeContext.Provider>
  );
};