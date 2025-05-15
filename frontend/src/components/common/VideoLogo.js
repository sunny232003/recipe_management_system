// src/components/common/VideoLogo.js
import React from 'react';
import { Box } from '@mui/material';

const VideoLogo = ({ height = 40 }) => {
  const videoSrc = require('../../assets/your-logo.mp4');
  console.log('Video source:', videoSrc);

  return (
    <Box sx={{ height: height, mr: 2 }}>
      <video
        autoPlay
        muted
        loop
        playsInline
        style={{ height: '100%', objectFit: 'contain' }}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
    </Box>
  );
};

export default VideoLogo;