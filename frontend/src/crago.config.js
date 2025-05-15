// craco.config.js
module.exports = {
    webpack: {
      configure: {
        module: {
          rules: [
            {
              test: /\.(mp4|webm)$/,
              use: {
                loader: 'file-loader',
                options: {
                  name: '[name].[hash].[ext]',
                },
              },
            },
          ],
        },
      },
    },
  };