#ifndef THREE_JS
attribute vec3 position;
attribute vec3 normal;
#endif

attribute vec3 color;
attribute vec3 texture;
#ifdef USE_INSTANCED
    attribute vec3 offset;
#endif

#ifndef THREE_JS
uniform mat4 modelMatrix;// uWorld -> modelMatrix
uniform mat4 modelViewMatrix;// -> projectionMatrix * modelViewMatrix
uniform mat4 projectionMatrix; // -> projectionMatrix * modelViewMatrix
uniform mat4 normalMatrix; // -> normalMatrix
#endif

uniform vec3 uLightPos;
uniform float uLightRadius;
uniform vec4 uLightCol;
uniform vec4 uAmbientCol;
uniform vec4 uFresnelCol;
uniform float uFresnelPower;
uniform float uCurrentTime;

varying vec2 vTextureCoord;
varying vec4 vWorld;
varying vec3 vDiffuse;
varying vec3 vAmbient;
varying vec3 vFresnel;
  
void main(void)
{ 
    #ifndef USE_INSTANCED
        vec3 offset = vec3(0.);
    #endif
    //Vertex Animation
    float speed = uCurrentTime / 15.0;
    float localoffset = smoothstep(0.0, 1.0, max(0.0, -position.y-0.8) / 10.0);
    vec3 pos = position + offset +
        color / 12.0 *
        sin(speed * 15.0 + position.y / 2.0) * (1.0 - localoffset);
    pos = pos + color / 8.0 *
        sin(speed * 30.0 + position.y / 0.5) * (1.0 - localoffset);
    vec4 pos4 = vec4(pos, 1.0);
    gl_Position = projectionMatrix * modelViewMatrix * pos4; 

    vWorld = modelMatrix * pos4;
    #ifndef THREE_JS
    vec3 vVertexNormal = normalize(normalMatrix * vec4(normal.xyz,1.0)).xyz;
    #else
    vec3 vVertexNormal = normalize(normalMatrix * normal);
    #endif

    //diffuse
    vec3 lightDir = normalize(uLightPos - vWorld.xyz);
    float diffuseProduct = max(dot(normalize(vVertexNormal.xyz), lightDir), 0.0);
    float lightFalloff = pow(max(1.0-(distance(uLightPos, vWorld.xyz)/uLightRadius), 0.0),2.0);
    vDiffuse = uLightCol.rgb * vec3(diffuseProduct * lightFalloff * uLightCol.a);

    //ambient (top)
    vAmbient = uAmbientCol.rgb * vec3(uAmbientCol.a) * vVertexNormal.y;

    //fresnel
    vec4 worldPos = modelMatrix * pos4;
    vec3 vWorldEyeVec = normalize(worldPos.xyz/worldPos.w); 
    float fresnelProduct = pow(abs(1.0 - max(abs(dot(vVertexNormal, -vWorldEyeVec)), 0.0)), uFresnelPower);
    vFresnel = uFresnelCol.rgb * vec3(uFresnelCol.a * fresnelProduct);

    // texcoord
    vTextureCoord = texture.xy;
}