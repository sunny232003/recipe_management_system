import api from './api';

export const recipeService = {
  getAllRecipes: () => api.get('/recipes'),
  
  getRecipeById: (id) => api.get(`/recipes/${id}`),
  
  searchRecipes: (params) => api.get('/recipes/search', { params }),
  
  createRecipe: (recipe) => api.post('/recipes', recipe),
  
  updateRecipe: (id, recipe) => api.put(`/recipes/${id}`, recipe),
  
  deleteRecipe: (id) => api.delete(`/recipes/${id}`),
  
  getChefRecipes: (chefId) => api.get(`/recipes/chef/${chefId}`),
  
  getRecipeIngredients: (recipeId) => api.get(`/recipes/${recipeId}/ingredients`)
};