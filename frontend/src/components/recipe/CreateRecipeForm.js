// src/components/recipe/CreateRecipeForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Alert,
} from '@mui/material';

const CreateRecipeForm = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [recipe, setRecipe] = useState({
    recipe_name: '',
    cuisine_type: 'Indian',
    meal_type: 'Main Course',  // Default value
    cooking_instructions: '',
    preparation_time: '',
    serving_size: '',
    ingredients: []
  });

  const [currentIngredient, setCurrentIngredient] = useState({
    name: '',
    amount_in_grams: '',
    calories_per_100g: '0',
    proteins_per_100g: '0',
    fats_per_100g: '0',
    carbs_per_100g: '0'
  });

  const handleAddIngredient = () => {
    if (!currentIngredient.name || !currentIngredient.amount_in_grams) {
      setError('Please fill in ingredient name and amount');
      return;
    }

    const processedIngredient = {
      name: currentIngredient.name.trim(),
      amount_in_grams: parseFloat(currentIngredient.amount_in_grams) || 0,
      calories_per_100g: parseFloat(currentIngredient.calories_per_100g) || 0,
      proteins_per_100g: parseFloat(currentIngredient.proteins_per_100g) || 0,
      fats_per_100g: parseFloat(currentIngredient.fats_per_100g) || 0,
      carbs_per_100g: parseFloat(currentIngredient.carbs_per_100g) || 0
    };

    setRecipe(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, processedIngredient]
    }));

    setCurrentIngredient({
      name: '',
      amount_in_grams: '',
      calories_per_100g: '0',
      proteins_per_100g: '0',
      fats_per_100g: '0',
      carbs_per_100g: '0'
    });

    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!recipe.recipe_name || !recipe.cooking_instructions || !recipe.meal_type || recipe.ingredients.length === 0) {
      setError('Please fill in all required fields and add at least one ingredient');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      console.log('Sending recipe data:', recipe);  // Debug log

      const response = await fetch('http://localhost:5000/api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          recipe_name: recipe.recipe_name,
          cuisine_type: recipe.cuisine_type,
          meal_type: recipe.meal_type,
          cooking_instructions: recipe.cooking_instructions,
          preparation_time: parseInt(recipe.preparation_time),
          serving_size: parseInt(recipe.serving_size),
          ingredients: recipe.ingredients
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create recipe');
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/recipes');
      }, 2000);
    } catch (err) {
      console.error('Error creating recipe:', err);
      setError(err.message || 'Failed to create recipe');
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Create New Recipe
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Recipe created successfully! Redirecting...
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            required
            fullWidth
            label="Recipe Name"
            value={recipe.recipe_name}
            onChange={(e) => setRecipe({ ...recipe, recipe_name: e.target.value })}
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Cuisine Type</InputLabel>
            <Select
              value={recipe.cuisine_type}
              label="Cuisine Type"
              onChange={(e) => setRecipe({ ...recipe, cuisine_type: e.target.value })}
            >
              <MenuItem value="Indian">Indian</MenuItem>
              <MenuItem value="Chinese">Chinese</MenuItem>
              <MenuItem value="Italian">Italian</MenuItem>
              <MenuItem value="French">French</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="meal-type-label">Meal Type</InputLabel>
            <Select
              labelId="meal-type-label"
              required
              value={recipe.meal_type}
              label="Meal Type"
              onChange={(e) => setRecipe({ ...recipe, meal_type: e.target.value })}
            >
              <MenuItem value="Main Course">Main Course</MenuItem>
              <MenuItem value="Breakfast">Breakfast</MenuItem>
              <MenuItem value="Snack">Snack</MenuItem>
              <MenuItem value="Dessert">Dessert</MenuItem>
            </Select>
          </FormControl>

          <TextField
            required
            fullWidth
            label="Preparation Time (minutes)"
            type="number"
            value={recipe.preparation_time}
            onChange={(e) => setRecipe({ ...recipe, preparation_time: e.target.value })}
            sx={{ mb: 2 }}
          />

          <TextField
            required
            fullWidth
            label="Serving Size"
            type="number"
            value={recipe.serving_size}
            onChange={(e) => setRecipe({ ...recipe, serving_size: e.target.value })}
            sx={{ mb: 2 }}
          />

          <TextField
            required
            fullWidth
            multiline
            rows={4}
            label="Cooking Instructions"
            value={recipe.cooking_instructions}
            onChange={(e) => setRecipe({ ...recipe, cooking_instructions: e.target.value })}
            sx={{ mb: 4 }}
          />

          <Typography variant="h6" gutterBottom>
            Add Ingredients
          </Typography>

          <Box sx={{ mb: 3 }}>
            <TextField
              required
              fullWidth
              label="Ingredient Name"
              value={currentIngredient.name}
              onChange={(e) => setCurrentIngredient({
                ...currentIngredient,
                name: e.target.value
              })}
              sx={{ mb: 2 }}
            />

            <TextField
              required
              fullWidth
              label="Amount (grams)"
              type="number"
              value={currentIngredient.amount_in_grams}
              onChange={(e) => setCurrentIngredient({
                ...currentIngredient,
                amount_in_grams: e.target.value
              })}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Calories per 100g"
              type="number"
              value={currentIngredient.calories_per_100g}
              onChange={(e) => setCurrentIngredient({
                ...currentIngredient,
                calories_per_100g: e.target.value || '0'
              })}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Proteins per 100g"
              type="number"
              value={currentIngredient.proteins_per_100g}
              onChange={(e) => setCurrentIngredient({
                ...currentIngredient,
                proteins_per_100g: e.target.value || '0'
              })}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Fats per 100g"
              type="number"
              value={currentIngredient.fats_per_100g}
              onChange={(e) => setCurrentIngredient({
                ...currentIngredient,
                fats_per_100g: e.target.value || '0'
              })}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Carbs per 100g"
              type="number"
              value={currentIngredient.carbs_per_100g}
              onChange={(e) => setCurrentIngredient({
                ...currentIngredient,
                carbs_per_100g: e.target.value || '0'
              })}
              sx={{ mb: 2 }}
            />

            <Button
              variant="outlined"
              onClick={handleAddIngredient}
              sx={{ mb: 2 }}
            >
              Add Ingredient
            </Button>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Added Ingredients
            </Typography>
            {recipe.ingredients.length === 0 ? (
              <Typography color="text.secondary">
                No ingredients added yet
              </Typography>
            ) : (
              recipe.ingredients.map((ing, index) => (
                <Chip
                  key={index}
                  label={`${ing.name} (${ing.amount_in_grams}g)`}
                  onDelete={() => {
                    const newIngredients = recipe.ingredients.filter((_, i) => i !== index);
                    setRecipe(prev => ({ ...prev, ingredients: newIngredients }));
                  }}
                  sx={{ m: 0.5 }}
                />
              ))
            )}
          </Box>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
          >
            Create Recipe
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateRecipeForm;