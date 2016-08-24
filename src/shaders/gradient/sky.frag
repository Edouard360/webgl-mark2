precision mediump float;

uniform vec3 colorTop;
uniform vec3 colorBottom;

varying vec3 vWorldPosition;

void main(){
  vec3 pointOnSphere = normalize(vWorldPosition.xyz);
  float f = sin(pointOnSphere.y);
  gl_FragColor = vec4(mix(colorBottom,colorTop, f ), 1.0);

}