precision mediump float;

uniform vec3 vSunPosition;
uniform vec3 sunColor;
uniform vec3 colorTop;
uniform vec3 colorBottom;

varying vec3 vWorldPosition;

void main(){
  vec3 pointOnSphere = normalize(vWorldPosition.xyz);
  vec3 vSunPosition = normalize(vSunPosition);

  float f = sin(pointOnSphere.y);

  float prop = clamp(length(pointOnSphere - vSunPosition)/2.0,0.03,1.0)-0.03;
  prop = 0.45 * pow( 1.0 - prop, 7.0 );


  vec3 color = mix(colorBottom,colorTop, f );
  gl_FragColor.xyz = mix( sunColor, color, 1.0 - prop );
  gl_FragColor.w = 1.0;
}
