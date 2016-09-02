#include <packing>

varying vec2 vUv;
uniform sampler2D tInput;
uniform float near;
uniform float far;

uniform float smoothstepLow;
uniform float smoothstepHigh;

float fromDepthMap(in sampler2D tInput,in vec2 vUv) {
    float fragCoordZ, viewZ;
    fragCoordZ = texture2D(tInput, vUv).x;
    viewZ = perspectiveDepthToViewZ( fragCoordZ, near, far );
    return smoothstep(smoothstepLow,smoothstepHigh,viewZToOrthographicDepth( viewZ, near, far ));
}

void main() {
	gl_FragColor = vec4(fromDepthMap(tInput,vUv));
	gl_FragColor.a = 1.0;
}