import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { Box, Container } from '@mui/material';

const Layout = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Container component="main" sx={{ flex: 1, py: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
};

export default Layout;