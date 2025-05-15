// src/components/layout/Layout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from '../common/Navbar';
import AnimatedBackground from '../common/AnimatedBackground';

const Layout = () => {
  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        backgroundColor: '#0d1d31', // Dark background for stars
      }}
    >
      <AnimatedBackground />
      <Navbar />
      <Box
        component="main"
        sx={{
          flex: 1,
          position: 'relative',
          zIndex: 1,
          py: 4,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;