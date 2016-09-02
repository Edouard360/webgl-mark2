varying vec2 vUv;
varying vec2 vUv3;

void main() {
	vUv = uv * 8.0;
	vUv3 = uv;
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

	// gl_Position.z = 0.9;
	// gl_Position.w = 1.0;

}
