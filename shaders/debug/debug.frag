precision mediump float;

uniform sampler2D uSampler;
varying vec2 uv;

void main()
{
    gl_FragColor = texture2D(uSampler, uv);
}
