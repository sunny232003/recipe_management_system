import React, { useState, useEffect } from 'react';
import RecipeSearch from '../components/recipe/RecipeSearch';
import RecipeList from '../components/recipe/RecipeList';
import { recipeService } from '../services/recipeService';
import { useSearchParams } from 'react-router-dom';

const Search = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.toString()) {
      handleSearch(Object.fromEntries(searchParams));
    }
  }, []);

  const handleSearch = async (params) => {
    setLoading(true);
    try {
      const response = await recipeService.searchRecipes(params);
      setRecipes(response.data);
      setSearchParams(params);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <RecipeSearch onSearch={handleSearch} />
      <RecipeList
        recipes={recipes}
        loading={loading}
        error={error}
      />
    </>
  );
};

export default Search;