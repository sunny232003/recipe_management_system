// src/components/recipe/RecipeCard.js
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Collapse,
  Box,
  CircularProgress,
  Chip,
  styled,
} from '@mui/material';
import {
  LocalFireDepartment as LocalFireDepartmentIcon,
  AccessTime as AccessTimeIcon,
  Restaurant as RestaurantIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import { Fade } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  cursor: 'pointer',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(10px)',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: theme.shape.borderRadius,
    background: 'linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.2))',
    opacity: 0,
    transition: 'opacity 0.3s ease-in-out',
  },
  '&:hover::before': {
    opacity: 1,
  },
}));

const InfoChip = styled(Chip)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(4px)',
  '& .MuiChip-icon': {
    color: theme.palette.primary.main,
  },
}));

const RecipeCard = ({ recipe }) => {
  const [showCalories, setShowCalories] = useState(false);
  const [calories, setCalories] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchCalories = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/recipes/${recipe.recipe_id}/calories`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch calories');
      
      const data = await response.json();
      setCalories(data.calories_per_100g);
    } catch (err) {
      console.error('Error fetching calories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleShowCalories = (e) => {
    e.stopPropagation(); // Prevent card click when clicking button
    if (!showCalories && calories === null) {
      fetchCalories();
    }
    setShowCalories(!showCalories);
  };

  const handleCardClick = (e) => {
    if (e.target.closest('button')) return;
    navigate(`/recipe/${recipe.recipe_id}`);
  };

  return (
    <StyledCard onClick={handleCardClick}>
      
      <Box
        sx={{
          position: 'absolute',
          top: 12,
          right: 12,
          display: 'flex',
          gap: 1,
          flexWrap: 'wrap',
          maxWidth: '80%',
        }}
      >
        <InfoChip
          icon={<AccessTimeIcon />}
          label={`${recipe.preparation_time} mins`}
          size="small"
        />
      </Box>

      <CardContent sx={{ pt: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography 
          variant="h6" 
          gutterBottom
          sx={{
            fontWeight: 600,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {recipe.recipe_name}
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          <InfoChip
            icon={<RestaurantIcon />}
            label={recipe.cuisine_type}
            size="small"
          />
          <InfoChip
            icon={<PeopleIcon />}
            label={`Serves ${recipe.serving_size}`}
            size="small"
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {recipe.meal_type}
          </Typography>
        </Box>
        
        <Box sx={{ mt: 'auto' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleShowCalories}
            startIcon={<LocalFireDepartmentIcon />}
            fullWidth
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              backdropFilter: 'blur(4px)',
              backgroundColor: 'rgba(46, 125, 50, 0.9)',
              '&:hover': {
                backgroundColor: 'rgba(46, 125, 50, 1)',
              }
            }}
          >
            {showCalories ? 'Hide Calories' : 'Show Calories'}
          </Button>

          <Collapse in={showCalories}>
            <Box
              sx={{
                mt: 2,
                p: 2,
                bgcolor: 'rgba(46, 125, 50, 0.1)',
                borderRadius: 2,
                backdropFilter: 'blur(4px)',
              }}
            >
              {loading ? (
                <Box display="flex" justifyContent="center">
                  <CircularProgress size={24} color="primary" />
                </Box>
              ) : (
                <Fade in={true}>
                  <Typography 
                    variant="h6" 
                    align="center"
                    color="primary"
                    sx={{ fontWeight: 600 }}
                  >
                    {calories !== null ? `${calories.toFixed(1)} cal/100g` : 'Calories not available'}
                  </Typography>
                </Fade>
              )}
            </Box>
          </Collapse>
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default RecipeCard;