precision highp float;

uniform sampler2D uSampler;
uniform sampler2D uSampler1;
uniform float uCurrentTime;

varying vec2 vTextureCoord;
varying vec4 vWorld;
varying vec3 vDiffuse;
varying vec3 vAmbient;
varying vec3 vFresnel;

#ifdef USE_SHADE
	uniform float shadeFactor;
    varying vec3 vShade;
#endif

#ifdef USE_FOG
	uniform vec3 fogColor;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif

void main(void)
{
    vec4 caustics = texture2D(uSampler1, vec2(vWorld.x / 24.0 + uCurrentTime / 20.0, (vWorld.z - vWorld.y)/48.0 + uCurrentTime / 40.0));
    vec4 colorMap = texture2D(uSampler, vTextureCoord);
    float transparency = colorMap.a + pow(vFresnel.r, 2.0) - 0.3;
    gl_FragColor = vec4(((vAmbient + vDiffuse + caustics.rgb) * colorMap.rgb), transparency);

    #ifdef USE_FOG
		#ifdef USE_LOGDEPTHBUF_EXT
			float depth = gl_FragDepthEXT / gl_FragCoord.w;
		#else
			float depth = gl_FragCoord.z / gl_FragCoord.w;
		#endif
		#ifdef FOG_EXP2
			float fogFactor = whiteCompliment( exp2( - fogDensity * fogDensity * depth * depth * LOG2 ) );
		#else
			float fogFactor = smoothstep( fogNear, fogFar, depth );
		#endif
		gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
	#endif

	#ifdef USE_SHADE
		gl_FragColor.rgb = mix( gl_FragColor.rgb, vShade, shadeFactor );
	#endif
}
