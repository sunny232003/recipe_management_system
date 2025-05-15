export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateRecipe = (recipe) => {
  const errors = {};

  if (!recipe.recipe_name) {
    errors.recipe_name = 'Recipe name is required';
  }

  if (!recipe.cooking_instructions) {
    errors.cooking_instructions = 'Cooking instructions are required';
  }

  if (!recipe.preparation_time) {
    errors.preparation_time = 'Preparation time is required';
  }

  if (!recipe.serving_size) {
    errors.serving_size = 'Serving size is required';
  }

  if (!recipe.ingredients || recipe.ingredients.length === 0) {
    errors.ingredients = 'At least one ingredient is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};