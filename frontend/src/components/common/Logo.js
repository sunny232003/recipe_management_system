// First create Logo.js in src/components/common/Logo.js
import React from 'react';
import { Box } from '@mui/material';
import logoImage from '../../assets/logo.png'; // Make sure to add your logo image in src/assets/

const Logo = ({ height = 50 }) => {
  return (
    <Box sx={{ 
      height: height, 
      mr: 2,
      display: 'flex',
      alignItems: 'center'
    }}>
      <img
        src={logoImage}
        alt="Recipe Hub"
        style={{ 
          height: '100%', 
          objectFit: 'contain',
          borderRadius: '4px'
        }}
      />
    </Box>
  );
};

export default Logo;