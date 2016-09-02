#pragma glslify: blur9 = require('glsl-fast-gaussian-blur/9')

uniform sampler2D tInput;
uniform vec2 iResolution;
uniform vec2 direction;
varying vec2 vUv;

void main()
{ 
  vec2 uv = vec2(gl_FragCoord.xy / iResolution.xy);
  gl_FragColor = blur9(tInput,vUv,iResolution,direction);
}

