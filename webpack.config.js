 module.exports = {
    entry: {
      webgl:'./src/script-webgl.js',
      three:'./src/script-three.js',
      aframe:'./src/script-aframe.js',
      register:'./src/jellyfish/aframe/aframe-register.js'
    },
    output: {
      path: './public/dist',
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
    },
    devtool:'eval',
    debug: true
 };