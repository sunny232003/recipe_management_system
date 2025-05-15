// src/components/common/AnimatedBackground.js
import React from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

// Create styled components for the animations
const StarsContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '120%',
  transform: 'rotate(-45deg)',
  zIndex: -1,
}));

const Star = styled('div')(({ delay, duration, offset, tailLength }) => ({
  '--star-color': '#ffffff',
  '--star-tail-length': `${tailLength}em`,
  '--star-tail-height': '2px',
  '--star-width': 'calc(var(--star-tail-length) / 6)',
  '--fall-duration': `${duration}s`,
  '--tail-fade-duration': `${duration}s`,
  position: 'absolute',
  top: `${offset}vh`,
  left: 0,
  width: 'var(--star-tail-length)',
  height: 'var(--star-tail-height)',
  color: 'var(--star-color)',
  background: 'linear-gradient(45deg, currentColor, transparent)',
  borderRadius: '50%',
  filter: 'drop-shadow(0 0 6px currentColor)',
  transform: 'translate3d(104em, 0, 0)',
  animation: `fall ${duration}s ${delay}s linear infinite, tail-fade ${duration}s ${delay}s ease-out infinite`,

  '&::before, &::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 'calc(var(--star-width) / -2)',
    width: 'var(--star-width)',
    height: '100%',
    background: 'linear-gradient(45deg, transparent, currentColor, transparent)',
    borderRadius: 'inherit',
    animation: 'blink 2s linear infinite',
  },

  '&::before': {
    transform: 'rotate(45deg)',
  },

  '&::after': {
    transform: 'rotate(-45deg)',
  },

  '@keyframes fall': {
    to: {
      transform: 'translate3d(-30em, 0, 0)',
    },
  },

  '@keyframes tail-fade': {
    '0%, 50%': {
      width: 'var(--star-tail-length)',
      opacity: 1,
    },
    '70%, 80%': {
      width: 0,
      opacity: 0.4,
    },
    '100%': {
      width: 0,
      opacity: 0,
    },
  },

  '@keyframes blink': {
    '50%': {
      opacity: 0.6,
    },
  },
}));

const AnimatedBackground = () => {
  // Generate random values for stars
  const generateStars = (count) => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      tailLength: Math.random() * 2.5 + 5, // 5-7.5em
      offset: Math.random() * 100, // 0-100vh
      duration: Math.random() * 6 + 6, // 6-12s
      delay: Math.random() * 10, // 0-10s
    }));
  };

  const stars = generateStars(50);

  return (
    <Box sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'transparent',
      background: 'radial-gradient(ellipse at bottom, #0d1d31 0%, #0c0d13 100%)',
      zIndex: -2,
    }}>
      <StarsContainer>
        {stars.map((star) => (
          <Star
            key={star.id}
            tailLength={star.tailLength}
            offset={star.offset}
            duration={star.duration}
            delay={star.delay}
          />
        ))}
      </StarsContainer>
    </Box>
  );
};

export default AnimatedBackground;