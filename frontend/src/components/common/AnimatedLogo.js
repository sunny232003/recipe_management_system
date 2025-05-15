// src/components/common/AnimatedLogo.js
import React from 'react';
import Lottie from 'react-lottie-player';
import { Box } from '@mui/material';

const logoAnimation = {
  v: "5.7.4",
  fr: 60,
  ip: 0,
  op: 180,
  w: 400,
  h: 400,
  nm: "Recipe Hub",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Text",
      sr: 1,
      ks: {
        o: {
          a: 1,
          k: [
            {
              t: 0,
              s: [0],
              h: 1
            },
            {
              t: 30,
              s: [100],
              h: 1
            }
          ]
        },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [200, 200, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] }
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ty: "st",
              c: { a: 0, k: [0.18, 0.49, 0.2, 1] },
              o: { a: 0, k: 100 },
              w: { a: 0, k: 4 },
              lc: 2,
              lj: 2
            },
            {
              ty: "sh",
              ks: {
                a: 0,
                k: {
                  i: [[0, 0], [0, 0]],
                  o: [[0, 0], [0, 0]],
                  v: [[-80, 0], [80, 0]]
                }
              }
            }
          ]
        }
      ]
    }
  ]
};

const AnimatedLogo = ({ height = 40, className }) => {
  return (
    <Box
      sx={{
        height: height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      className={className}
    >
      <Lottie
        animationData={logoAnimation}
        loop
        play
        style={{ height: '100%' }}
      />
    </Box>
  );
};

export default AnimatedLogo;