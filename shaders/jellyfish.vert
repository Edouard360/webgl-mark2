attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;

varying vec3 vColor;

/*
    attribute vec3 aVertexColor;
    attribute vec3 aTextureCoord;

    uniform mat4 uWorld;
    uniform mat4 uWorldViewProj;
    uniform mat4 uWorldInvTranspose;
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

*/
  
void main(void)
{ 
    vColor = normalize(aVertexNormal);
    gl_Position = vec4(aVertexPosition, 1.0);

/*
    gl_PointSize = 5.0;
    //Vertex Animation
    float speed = uCurrentTime / 15.0;
    float offset = smoothstep(0.0, 1.0, max(0.0, -aVertexPosition.y-0.8) / 10.0);
    vec3 pos = aVertexPosition +  aVertexColor / 12.0 * sin(speed * 15.0 + aVertexPosition.y / 2.0) * (1.0 - offset);
    pos = pos + aVertexColor / 8.0 * sin(speed * 30.0 + aVertexPosition.y / 0.5) * (1.0 - offset);
    vec4 pos4 = vec4(pos, 1.0);
    gl_Position = vec4(pos, 1.0); uWorldViewProj * pos4; 
    vWorld = uWorld * pos4;
    vColor = aVertexNormal; 
    //vec3 vVertexNormal = aVertexNormal;
    //vec3 vVertexNormal = normalize((uWorldInvTranspose * vec4(aVertexNormal, 1.0)).xyz);
    //diffuse
    //vec3 lightDir = normalize(uLightPos - vWorld.xyz);
    //float diffuseProduct = max(dot(normalize(vVertexNormal.xyz), lightDir), 0.0);
    //float lightFalloff = pow(max(1.0-(distance(uLightPos, vWorld.xyz)/uLightRadius), 0.0),2.0);
*/
}