#include <packing>

#define TAPS_PER_PASS 6.0

varying vec2 vUv;

uniform sampler2D tInput;

uniform vec2 vSunPositionScreenSpace;
uniform float fStepSize; // filter step size
uniform bool firstPass;

float readDepth (sampler2D depthSampler, vec2 coord) {
	float fragCoordZ = texture2D(depthSampler, coord).x;
	float viewZ = perspectiveDepthToViewZ( fragCoordZ, 0.1, 50.0 );
	return viewZToOrthographicDepth( viewZ, 0.1, 50.0 );
}

// vec3 diffuse = texture2D(tDiffuse, vUv).rgb;
// float depth = readDepth(tDepth, vUv);

void main() {



	// delta from current pixel to sun position

	vec2 delta = vSunPositionScreenSpace - vUv;
	float dist = length( delta );

	// Step vector (uv space)

	vec2 stepv = fStepSize * delta / dist;

	// Number of iterations between pixel and sun

	float iters = dist/fStepSize;

	vec2 uv = vUv.xy;
	float col = 1.0;//readDepth(tInput,uv);

	// Unrolling loop manually makes it work in ANGLE

	if ( 0.0 <= iters ) col += (0.05*readDepth(tInput,uv)-0.05);
	uv += stepv;

	if ( 1.0 <= iters ) col += (0.05*readDepth(tInput,uv)-0.05);
	uv += stepv;
	
	if ( 2.0 <= iters ) col += (0.05*readDepth(tInput,uv)-0.05);
	uv += stepv;

	if ( 3.0 <= iters ) col += (0.05*readDepth(tInput,uv)-0.05);
	uv += stepv;

	if ( 4.0 <= iters ) col += (0.05*readDepth(tInput,uv)-0.05);
	uv += stepv;

	if ( 5.0 <= iters ) col += (0.05*readDepth(tInput,uv)-0.05);
	uv += stepv;
/*

	if ( 0.0 <= iters && uv.y < 1.0 ) col += (1.0*readDepth(tInput,uv)-1.0);
	uv += stepv;

	if ( 1.0 <= iters && uv.y < 1.0 ) col += (1.0*readDepth(tInput,uv)-1.0);
	uv += stepv;

	if ( 2.0 <= iters && uv.y < 1.0 ) col += (1.0*readDepth(tInput,uv)-1.0);
	uv += stepv;

	if ( 3.0 <= iters && uv.y < 1.0 ) col += (1.0*readDepth(tInput,uv)-1.0);
	uv += stepv;

	if ( 4.0 <= iters && uv.y < 1.0 ) col += (1.0*readDepth(tInput,uv)-1.0);
	uv += stepv;

	if ( 5.0 <= iters && uv.y < 1.0 ) col += (1.0*readDepth(tInput,uv)-1.0);
	uv += stepv;
*/
	// Should technically be dividing by 'iters', but 'TAPS_PER_PASS' smooths out
	// objectionable artifacts, in particular near the sun position. The side
	// effect is that the result is darker than it should be around the sun, as
	// TAPS_PER_PASS is greater than the number of samples actually accumulated.
	// When the result is inverted (in the shader 'godrays_combine', this produces
	// a slight bright spot at the position of the sun, even when it is occluded.

	if(col>0.95){col=1.0;}else{col = (col + 2.0*1.0)/3.0;}



	gl_FragColor = vec4( col );//vec4(readDepth(tInput,vUv));//
	gl_FragColor.a = 1.0;

}