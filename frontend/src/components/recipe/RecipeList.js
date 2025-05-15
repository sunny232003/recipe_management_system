// src/components/recipe/RecipeList.js
import React from 'react';
import {
  Grid,
  CircularProgress,
  Alert,
  Container
} from '@mui/material';
import RecipeCard from './RecipeCard';

const RecipeList = ({ recipes, loading, error }) => {
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

  if (!recipes?.length) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="info">No recipes found matching your criteria.</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Grid container spacing={3}>
        {recipes.map((recipe) => (
          <Grid item xs={12} sm={6} md={4} key={recipe.recipe_id}>
            <RecipeCard recipe={recipe} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default RecipeList;