var JS_LOADERS = [
  'babel?cacheDirectory&presets[]=react,presets[]=es2015,presets[]=stage-0'
];

 module.exports = {
    entry: {
      webgl:'./src/script-webgl.js',
      three:'./src/script-three.js',
      aframe:'./src/script-aframe.js',
      react:'./src/script-aframe-react.js',
      register:'./src/jellyfish/aframe/aframe-register.js'
    },
    output: {
      path: './public/dist',
      filename: 'script-[name].js',
    },
    module: {
       loaders: [
          { 
              test: /\.(glsl|frag|vert)$/,
              loader: 'raw', exclude: /node_modules/ 
          },
          { 
              test: /\.(glsl|frag|vert)$/,
              loader: 'glslify', exclude: /node_modules/ 
          },
          {
              test: /\.js$/,
              exclude: /node_modules/,
              loaders: JS_LOADERS//'babel-loader',
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