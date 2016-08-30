varying vec3 vWorldPosition;

void main() {

  vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
  vWorldPosition = worldPosition.xyz;

  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

  // gl_Position.z += 0.155;
  // gl_Position.z = 1.0;
  // gl_Position.w = 1.0;

}