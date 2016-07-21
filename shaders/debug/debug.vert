attribute vec2 position;
attribute vec2 uvCoordinates;

varying vec2 uv;

void main()
{
    uv = uvCoordinates;
    gl_Position = vec4(position, 1.0, 1.0);
}
