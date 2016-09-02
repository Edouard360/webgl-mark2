// #extension GL_EXT_frag_depth : enable

precision mediump float;

uniform vec3 sunPosition;
uniform vec3 sunColor;
uniform vec3 colorTop;
uniform vec3 colorBottom;
varying vec3 vWorldPosition;

// New uniforms
//uniform sampler2D skySampler; apparently not used
vec3 cameraPos = vec3(0., 0., 0.);
uniform float luminance;
uniform float turbidity;
uniform float reileigh;
uniform float mieCoefficient;
uniform float mieDirectionalG;
uniform float sunSize;

// constants for atmospheric scattering
const float e = 2.71828182845904523536028747135266249775724709369995957;
const float pi = 3.141592653589793238462643383279502884197169;

const float n = 1.0003; // refractive index of air
const float N = 2.545E25; // number of molecules per unit volume for air 
const float pn = 0.035;	// depolatization factor for standard air
const vec3 lambda = vec3(680E-9, 550E-9, 450E-9); // wavelength 
const vec3 K = vec3(0.686, 0.678, 0.666); // K coefficient for the primaries (mie stuff)
const float v = 4.0;

const float rayleighZenithLength = 8.4E3; // optical length at zenith for molecules
const float mieZenithLength = 1.25E3;
const vec3 up = vec3(0.0, 1.0, 0.0);

const float EE = 1000.0;
const float sunAngularDiameterCos = 0.999956676946448443553574619906976478926848692873900859324; // 66 arc seconds -> degrees, and the cosine of that

// earth shadow hack
const float cutoffAngle = pi/1.95;
const float steepness = 1.5;


vec3 totalRayleigh(vec3 lambda)
{
	return (8.0 * pow(pi, 3.0) * pow(pow(n, 2.0) - 1.0, 2.0) * (6.0 + 3.0 * pn)) / (3.0 * N * pow(lambda, vec3(4.0)) * (6.0 - 7.0 * pn));
}

vec3 simplifiedRayleigh()
{
	return 0.0005 / vec3(94, 40, 18);
}

float rayleighPhase(float cosTheta)
{	 
	return (3.0 / (16.0*pi)) * (1.0 + pow(cosTheta, 2.0));
}

vec3 totalMie(vec3 lambda, vec3 K, float T)
{
	float c = (0.2 * T ) * 10E-18;
	return 0.434 * c * pi * pow((2.0 * pi) / lambda, vec3(v - 2.0)) * K;
}

float hgPhase(float cosTheta, float g)
{
	return (1.0 / (4.0*pi)) * ((1.0 - pow(g, 2.0)) / pow(1.0 - 2.0*g*cosTheta + pow(g, 2.0), 1.5));
}

float sunIntensity(float zenithAngleCos)
{
	return EE * max(0.0, 1.0 - pow(e, -((cutoffAngle - acos(zenithAngleCos))/steepness)));
}

float A = 0.15;
float B = 0.50;
float C = 0.10;
float D = 0.20;
float E = 0.02;
float F = 0.30;
float W = 1000.0;

vec3 Uncharted2Tonemap(vec3 x)
{
   return ((x*(A*x+C*B)+D*E)/(x*(A*x+B)+D*F))-E/F;
}


void main(){

	vec3 pointOnSphere = normalize(vWorldPosition - cameraPos);
	vec3 sunOnSphere = normalize(sunPosition - cameraPos);

	float fGradient = sin(pointOnSphere.y);

	vec3 underwaterColor = mix(colorBottom,colorTop, fGradient );
	gl_FragColor.xyz = underwaterColor;
	gl_FragColor.w = 1.0;

	
	float sunfade = 1.0-clamp(1.0-exp((sunPosition.y/450000.0)),0.0,1.0); // Function of sunPosition in y
	float reileighCoefficient = reileigh - (1.0* (1.0-sunfade)); // Function of sunPosition in y
	vec3 sunDirection = normalize(sunPosition);
	float sunE = sunIntensity(dot(sunDirection, up)); // Function of sunPosition in y

	// vec3 betaR = totalRayleigh(lambda) * reileighCoefficient;
	// mie coefficients
	vec3 betaR = simplifiedRayleigh() * reileighCoefficient;
	vec3 betaM = totalMie(lambda, K, turbidity) * mieCoefficient;

	// Direction - depend on the fragment posiiton
	vec3 direction = normalize(vWorldPosition - cameraPos);

	// Depend on the fragment position
	float zenithAngle = acos(max(0.0, dot(up, direction))); 
	float sR = rayleighZenithLength / (cos(zenithAngle) + 0.15 * pow(93.885 - ((zenithAngle * 180.0) / pi), -1.253));
	float sM = mieZenithLength / (cos(zenithAngle) + 0.15 * pow(93.885 - ((zenithAngle * 180.0) / pi), -1.253));

	// combined extinction factor	
	vec3 Fex = exp(-(betaR * sR + betaM * sM));

	// in scattering
	float cosTheta = dot(direction, sunDirection);

	float rPhase = rayleighPhase(cosTheta*0.5+0.5);
	vec3 betaRTheta = betaR * rPhase;

	float mPhase = hgPhase(cosTheta, mieDirectionalG);
	vec3 betaMTheta = betaM * mPhase;

	// Depend on the fragment position : Lin is the only variable used afterwards
	vec3 Lin = pow(sunE * ((betaRTheta + betaMTheta) / (betaR + betaM)) * (1.0 - Fex),vec3(1.5));
	Lin *= mix(vec3(1.0),pow(sunE * ((betaRTheta + betaMTheta) / (betaR + betaM)) * Fex,vec3(1.0/2.0)),clamp(pow(1.0-dot(up, sunDirection),5.0),0.0,1.0));

	//nightsky
	float phi = atan(direction.z, direction.x); // azimuth --> x-axis [-pi/2, pi/2]
	float theta = acos(direction.y); // elevation --> y-axis, [0, pi]
	vec2 uv = vec2(phi, theta) / vec2(2.0*pi, pi) + vec2(0.5, 0.0); // uv is not used yet ...
	// vec3 L0 = texture2D(skySampler, uv).rgb+0.1 * Fex;
	vec3 L0 = vec3(0.1) * Fex;

	// composition + solar disc
	//if (cosTheta > sunAngularDiameterCos)
	float sunAngularDiameterCos = sunAngularDiameterCos * sunSize;
	float sundisk = smoothstep(sunAngularDiameterCos,sunAngularDiameterCos+0.00002,cosTheta);
	// if (direction.y>0.0)
	L0 += (sunE * 19000.0 * Fex)*sundisk;

	// FINAL STEPS COMPOSITION
	vec3 whiteScale = 1.0/Uncharted2Tonemap(vec3(W));

	vec3 texColor = (Lin+L0);   
	texColor *= 0.04 ;
	texColor += vec3(0.0,0.001,0.0025)*0.3;

	float g_fMaxLuminance = 1.0;
	float fLumScaled = 0.1 / luminance;     
	float fLumCompressed = (fLumScaled * (1.0 + (fLumScaled / (g_fMaxLuminance * g_fMaxLuminance)))) / (1.0 + fLumScaled); 

	float ExposureBias = fLumCompressed;

	vec3 curr = Uncharted2Tonemap((log2(2.0/pow(luminance,4.0)))*texColor);
	vec3 skyColor = curr*whiteScale;

	vec3 retColor = pow(skyColor,vec3(1.0/(1.2+(1.2*sunfade))));

	float fSun = sin(dot(pointOnSphere,sunOnSphere));
	//smoothstep(0.0,sunOnSphere,,)sunOnSphere.y>0

	float aroundSun = smoothstep(0.45,0.85,fSun);
	float clampUp = clamp(fGradient,0.0,1.0);

	gl_FragColor.rgb = mix(underwaterColor, retColor, aroundSun*clampUp );

	gl_FragColor.a = 1.0;
	
	
}


