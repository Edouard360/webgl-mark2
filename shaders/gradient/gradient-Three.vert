attribute vec2 uvIn;
attribute vec2 position2;

varying vec2 uv2;

void main()
{
    uv2 = uvIn;
    gl_Position = vec4(position2,1., 1.0);
}
