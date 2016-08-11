 module.exports = {
    entry: {
      WebGL:'./script-WebGL.js',
      Three:'./script-Three.js',
      AFrame:'./script-AFrame.js',
      AFrameRegister:'./jellyfish/AFrame/AFrameRegister.js'
    },
    output: {
      path: './dist',
      filename: 'script-[name].js',
    },
    module: {
       loaders: [
          {
              test: /\.glsl$/,
              loader: 'webpack-glsl'
          },
          {
              test: /\.vert$/,
              loader: 'webpack-glsl'
          },
          {
              test: /\.frag$/,
              loader: 'webpack-glsl'
          },
          {
             test: /\.js$/,
             exclude: /node_modules/,
             loader: 'babel-loader',
          },
          {
              test: /\.json$/,
              loader: 'json'
          }
      ]
    }
 };