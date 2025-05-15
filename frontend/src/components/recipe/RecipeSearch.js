// src/components/recipe/RecipeSearch.js
import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Typography,
  Alert,
  Box
} from '@mui/material';
import RecipeList from './RecipeList';
import SearchIcon from '@mui/icons-material/Search';

const RecipeSearch = () => {
  const [searchParams, setSearchParams] = useState({
    name: '',
    ingredient: '',
    cuisine_type: '',
    meal_type: '',
    preparation_time: ''
  });

  const [searchResults, setSearchResults] = useState(null); // Changed to null for initial state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await fetch(`http://localhost:5000/api/recipes/search?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recipes');
      }

      const data = await response.json();
      setSearchResults(data);
    } catch (err) {
      setError(err.message);
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          mb: 3,
          backgroundColor: 'rgba(227, 242, 253, 0.8)',
          backdropFilter: 'blur(10px)',
          borderRadius: 2
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
          Search Recipes
        </Typography>
        <form onSubmit={handleSearch}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Recipe Name"
                value={searchParams.name}
                onChange={(e) => setSearchParams({
                  ...searchParams,
                  name: e.target.value
                })}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.6)',
                  borderRadius: 1,
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Ingredient"
                value={searchParams.ingredient}
                onChange={(e) => setSearchParams({
                  ...searchParams,
                  ingredient: e.target.value
                })}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.6)',
                  borderRadius: 1,
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel>Cuisine Type</InputLabel>
                <Select
                  value={searchParams.cuisine_type}
                  label="Cuisine Type"
                  onChange={(e) => setSearchParams({
                    ...searchParams,
                    cuisine_type: e.target.value
                  })}
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.6)',
                    borderRadius: 1,
                  }}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="Indian">Indian</MenuItem>
                  <MenuItem value="Chinese">Chinese</MenuItem>
                  <MenuItem value="Italian">Italian</MenuItem>
                  <MenuItem value="French">French</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel>Meal Type</InputLabel>
                <Select
                  value={searchParams.meal_type}
                  label="Meal Type"
                  onChange={(e) => setSearchParams({
                    ...searchParams,
                    meal_type: e.target.value
                  })}
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.6)',
                    borderRadius: 1,
                  }}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="Main Course">Main Course</MenuItem>
                  <MenuItem value="Breakfast">Breakfast</MenuItem>
                  <MenuItem value="Snack">Snack</MenuItem>
                  <MenuItem value="Dessert">Dessert</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Max Preparation Time (minutes)"
                value={searchParams.preparation_time}
                onChange={(e) => setSearchParams({
                  ...searchParams,
                  preparation_time: e.target.value
                })}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.6)',
                  borderRadius: 1,
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                startIcon={<SearchIcon />}
                sx={{
                  py: 1.5,
                  backgroundColor: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                }}
              >
                {loading ? 'Searching...' : 'Search Recipes'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {searchResults !== null && (
        searchResults.length > 0 ? (
          <RecipeList recipes={searchResults} loading={loading} error={error} />
        ) : (
          <Box sx={{ 
            p: 3, 
            textAlign: 'center',
            backgroundColor: 'rgba(227, 242, 253, 0.8)',
            borderRadius: 2,
            backdropFilter: 'blur(10px)'
          }}>
            <Typography variant="h6" color="text.secondary">
              No recipes found matching your criteria.
            </Typography>
          </Box>
        )
      )}
    </Container>
  );
};

export default RecipeSearch;