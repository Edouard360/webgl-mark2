precision highp float;

varying vec2 vUv;
varying vec2 vUv3;
uniform sampler2D map;
uniform sampler2D alphaMap;
uniform float opacity;

void main() {
	vec4 texelColor = texture2D( map, vUv );
	texelColor = mapTexelToLinear( texelColor );
	texelColor.a *= texture2D( alphaMap, vUv3 ).g;
	texelColor.a *= opacity;
	gl_FragColor = texelColor;
}
