attribute vec2 uvIn;

varying vec2 uv2;

void main()
{
    uv2 = uvIn;
    gl_Position = vec4(position.x,position.y,1., 1.0);
}
