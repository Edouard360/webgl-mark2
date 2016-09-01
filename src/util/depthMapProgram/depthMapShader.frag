#include <packing>

varying vec2 vUv;
uniform sampler2D tInput;

float fromDepthMap(in sampler2D tInput,in vec2 vUv) {
    float fragCoordZ, viewZ;
    fragCoordZ = texture2D(tInput, vUv).x;
    viewZ = perspectiveDepthToViewZ( fragCoordZ, 0.1, 50.0 );
    return viewZToOrthographicDepth( viewZ, 0.1, 50.0 );
}

void main() {
	gl_FragColor = vec4(fromDepthMap(tInput,vUv));
	gl_FragColor.a = 1.0;
}