import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
  Box,
  Chip,
  CircularProgress,
  Alert,
  Rating,
  IconButton,
  Snackbar
} from '@mui/material';

// Import icons
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleIcon from '@mui/icons-material/People';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import StarIcon from '@mui/icons-material/Star';

const RecipeDetails = () => {
  const { recipeId } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasLiked, setHasLiked] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  useEffect(() => {
    fetchRecipeDetails();
    fetchUserInteraction();
  }, [recipeId]);

  const fetchRecipeDetails = async () => {
    try {
      console.log('Fetching recipe details for ID:', recipeId);
      const token = localStorage.getItem('token');
      console.log('Using token:', token ? 'Token exists' : 'No token');

      const response = await fetch(`http://localhost:5000/api/recipes/${recipeId}/details`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch recipe details');
      }

      setRecipe(data);
    } catch (err) {
      console.error('Detailed error:', err);
      setError(err.message || 'An error occurred while fetching recipe details');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserInteraction = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/recipes/${recipeId}/user-interaction`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user interaction');
      }

      const data = await response.json();
      setHasLiked(data.has_liked);
      setUserRating(data.rating || 0);
    } catch (err) {
      console.error('Error fetching user interaction:', err);
    }
  };

  const handleLike = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/recipes/${recipeId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to toggle like');
      }

      const data = await response.json();
      setHasLiked(data.liked);
      setRecipe(prev => ({
        ...prev,
        like_count: data.like_count
      }));
      setSnackbar({ 
        open: true, 
        message: data.liked ? 'Recipe liked!' : 'Recipe unliked' 
      });
    } catch (err) {
      console.error('Error toggling like:', err);
      setSnackbar({ 
        open: true, 
        message: 'Failed to update like status' 
      });
    }
  };

  const handleRating = async (value) => {
    try {
      const response = await fetch(`http://localhost:5000/api/recipes/${recipeId}/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ rating: value })
      });

      if (!response.ok) {
        throw new Error('Failed to update rating');
      }

      const data = await response.json();
      setUserRating(value);
      setRecipe(prev => ({
        ...prev,
        rating_average: data.rating_average
      }));
      setSnackbar({ 
        open: true, 
        message: 'Rating updated successfully!' 
      });
    } catch (err) {
      console.error('Error updating rating:', err);
      setSnackbar({ 
        open: true, 
        message: 'Failed to update rating' 
      });
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!recipe) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="info">Recipe not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4,
          backgroundColor: 'rgba(227, 242, 253, 0.8)',
          backdropFilter: 'blur(10px)',
          borderRadius: 2
        }}
      >
        <Grid container spacing={4}>
          {/* Recipe Header */}
          <Grid item xs={12}>
            <Typography 
              variant="h4" 
              gutterBottom
              sx={{ 
                color: 'primary.main',
                fontWeight: 600
              }}
            >
              {recipe.recipe_name}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Chip 
                icon={<RestaurantIcon />} 
                label={recipe.cuisine_type} 
                color="primary" 
                variant="outlined" 
                sx={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.6)',
                  borderRadius: 1
                }}
              />
              <Chip 
                icon={<AccessTimeIcon />} 
                label={`${recipe.preparation_time} mins`} 
                variant="outlined"
                sx={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.6)',
                  borderRadius: 1
                }}
              />
              <Chip 
                icon={<PeopleIcon />} 
                label={`Serves ${recipe.serving_size}`} 
                variant="outlined"
                sx={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.6)',
                  borderRadius: 1
                }}
              />
            </Box>
          </Grid>

          {/* Analytics Section - Views and Ratings */}
          <Grid item xs={12}>
            <Paper 
              variant="outlined" 
              sx={{ 
                p: 2, 
                mb: 3,
                backgroundColor: 'rgba(255, 255, 255, 0.6)',
                borderRadius: 1
              }}
            >
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <VisibilityIcon color="action" />
                    <Typography>
                      {recipe.view_count} Views
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Rating 
                      value={userRating}
                      onChange={(event, newValue) => {
                        handleRating(newValue);
                      }}
                      precision={0.5}
                    />
                    <Typography>
                      ({recipe.rating_average?.toFixed(1) || 'No ratings'})
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Ingredients List */}
          <Grid item xs={12} md={4}>
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{ 
                color: 'primary.main',
                fontWeight: 600
              }}
            >
              Ingredients
            </Typography>
            <Paper 
              sx={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.6)',
                borderRadius: 1
              }}
            >
              <List>
                {recipe.ingredients?.map((ingredient, index) => (
                  <ListItem 
                    key={index} 
                    divider={index !== recipe.ingredients.length - 1}
                  >
                    <ListItemText
                      primary={ingredient.name}
                      secondary={`${ingredient.amount_in_grams}g`}
                      primaryTypographyProps={{
                        fontWeight: 500
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Cooking Instructions */}
          <Grid item xs={12} md={8}>
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{ 
                color: 'primary.main',
                fontWeight: 600
              }}
            >
              Cooking Instructions
            </Typography>
            <Paper 
              variant="outlined" 
              sx={{ 
                p: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.6)',
                borderRadius: 1
              }}
            >
              {recipe.cooking_instructions?.split('\n').map((instruction, index) => (
                <Typography 
                  key={index} 
                  paragraph
                  sx={{
                    '&:last-child': {
                      mb: 0
                    }
                  }}
                >
                  {instruction}
                </Typography>
              ))}
            </Paper>
          </Grid>
        </Grid>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </Container>
  );

};

export default RecipeDetails;