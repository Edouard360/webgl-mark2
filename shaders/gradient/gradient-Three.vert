// attribute vec2 uvIn;

varying vec2 uv2;

void main()
{
    uv2 = uv;
    gl_Position = vec4(position.xy,0., 1.0);
}
