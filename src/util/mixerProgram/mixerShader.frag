varying vec2 vUv;

uniform sampler2D tColors;
uniform sampler2D tGodrays;
uniform sampler2D tGlow;

uniform float fGodraysIntensity;
uniform float fGodraysAmbient;
uniform float fGlowIntensity;

void main() {
	gl_FragColor = texture2D( tColors, vUv ) + fGodraysIntensity * (vec4(texture2D( tGodrays, vUv ).r )- vec4(vec3(fGodraysAmbient), 0.0));

	gl_FragColor *= (vec4(1.0) - fGlowIntensity * texture2D(tGlow, vUv));

	gl_FragColor.a = 1.0;

}