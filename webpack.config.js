 module.exports = {
    entry: {
      webgl:'./script-webgl.js',
      three:'./script-three.js',
      aframe:'./script-aframe.js',
      register:'./jellyfish/aframe/aframe-register.js'
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
    },
    devtool:'eval',
    debug: true
    
 };