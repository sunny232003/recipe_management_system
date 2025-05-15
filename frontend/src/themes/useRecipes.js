import { useContext } from 'react';
import { RecipeContext } from '../context/RecipeContext';
import { recipeService } from '../services/recipeService';

export const useRecipes = () => {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error('useRecipes must be used within a RecipeProvider');
  }

  const { setRecipes, setLoading, setError } = context;

  const fetchRecipes = async (searchParams = {}) => {
    setLoading(true);
    try {
      const response = await recipeService.searchRecipes(searchParams);
      setRecipes(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    ...context,
    fetchRecipes,
  };
};