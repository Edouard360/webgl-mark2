/**
  * The addDefines function - inspried from Three.js
  * @param {string} shader - The input shader that needs to be added some define.
  * @param {object} defines - An object of {name:value} that we want to be defined in the shader.
  * @return {string} shader - The modified shader with the #define.
  */
export function addDefines(shader,defines){
  var chunks = [];
  for ( var name in defines ) {
    var value = defines[ name ];
    if ( value === false ) continue;
    chunks.push( '#define ' + name + ' ' + value );
  }
  chunks = chunks.join( '\n' );
  return chunks + '\n' + shader;
};