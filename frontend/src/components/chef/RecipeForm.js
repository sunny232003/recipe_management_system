import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
  Divider,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import ErrorMessage from '../common/ErrorMessage';
import Loading from '../common/Loading';

const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert'];

const RecipeForm = ({ mode = 'create' }) => {
  const [loading, setLoading] = useState(mode === 'edit');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { recipeId } = useParams();

  const [formData, setFormData] = useState({
    recipe_name: '',
    cuisine_type: '',
    meal_type: '',
    cooking_instructions: '',
    preparation_time: '',
    serving_size: '',
    ingredients: []
  });

  const [currentIngredient, setCurrentIngredient] = useState({
    name: '',
    amount_in_grams: '',
    calories_per_100g: '',
    proteins_per_100g: '',
    fats_per_100g: '',
    carbs_per_100g: ''
  });

  useEffect(() => {
    if (mode === 'edit' && recipeId) {
      fetchRecipeData();
    }
  }, [recipeId]);

  const fetchRecipeData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/recipes/${recipeId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setFormData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const url = mode === 'edit' 
        ? `http://localhost:5000/api/recipes/${recipeId}`
        : 'http://localhost:5000/api/recipes';
        
      const method = mode === 'edit' ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      navigate('/chef/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  const validateForm = () => {
    if (!formData.recipe_name || !formData.cooking_instructions || formData.ingredients.length === 0) {
      setError('Please fill in all required fields and add at least one ingredient');
      return false;
    }
    return true;
  };

  const addIngredient = () => {
    if (!currentIngredient.name || !currentIngredient.amount_in_grams) {
      setError('Please fill in ingredient name and amount');
      return;
    }

    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, currentIngredient]
    });

    setCurrentIngredient({
      name: '',
      amount_in_grams: '',
      calories_per_100g: '',
      proteins_per_100g: '',
      fats_per_100g: '',
      carbs_per_100g: ''
    });

    setError('');
  };

  if (loading) return <Loading />;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          {mode === 'edit' ? 'Edit Recipe' : 'Create New Recipe'}
        </Typography>
        <Divider sx={{ mb: 4 }} />

        <form onSubmit={handleSubmit}>
          {/* Form fields from previous CreateRecipeForm */}
          {/* ... (same as before) ... */}
          
          <Grid container spacing={3}>
            {/* Add error message display */}
            {error && (
              <Grid item xs={12}>
                <ErrorMessage message={error} />
              </Grid>
            )}

            {/* Submit button */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                >
                  {mode === 'edit' ? 'Update Recipe' : 'Create Recipe'}
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/chef/dashboard')}
                >
                  Cancel
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default RecipeForm;