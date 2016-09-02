#pragma glslify: blendVividLight = require(glsl-blend/vivid-light)
#pragma glslify: blendAverage = require(glsl-blend/average)

varying vec2 vUv;

uniform sampler2D tColors;
uniform sampler2D tGodrays;
uniform sampler2D tGlow;

uniform float fGodraysIntensity;
uniform float fGodraysAmbient;
uniform float fGlowIntensity;


void main() {
	gl_FragColor.xyz = texture2D( tColors, vUv ).xyz;

	gl_FragColor.xyz = blendAverage(gl_FragColor.xyz,texture2D( tGodrays, vUv ).xyz,fGodraysIntensity);

	gl_FragColor.xyz = blendVividLight(gl_FragColor.xyz,vec3(1.0)-texture2D(tGlow,vUv).xyz,fGlowIntensity);

	gl_FragColor.a = 1.0;

}

