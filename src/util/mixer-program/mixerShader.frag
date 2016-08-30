varying vec2 vUv;

uniform sampler2D tColors;
uniform sampler2D tEffect;

uniform float fIntensity;
uniform float fAmbient;

void main() {
	gl_FragColor = texture2D( tColors, vUv ) + fIntensity * (vec4(texture2D( tEffect, vUv ).r )- vec4(vec3(fAmbient), 0.0));
	gl_FragColor.a = 1.0;

}