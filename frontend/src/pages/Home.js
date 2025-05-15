import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Container maxWidth="md">
      <Box sx={{ 
        mt: 8, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center' 
      }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Recipe Hub
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom color="text.secondary">
          Discover, Create, and Share Amazing Recipes
        </Typography>
        {user ? (
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/search')}
            sx={{ mt: 4 }}
          >
            Explore Recipes
          </Button>
        ) : (
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/login')}
            sx={{ mt: 4 }}
          >
            Get Started
          </Button>
        )}
      </Box>
    </Container>
  );
};

export default Home;