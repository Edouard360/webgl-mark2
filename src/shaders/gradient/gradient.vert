#ifndef THREE_JS
	attribute vec2 position;
	attribute vec2 uv;
#endif

varying vec2 uv2;

void main()
{
    uv2 = uv;
    gl_Position = vec4(position.x, position.y,1.0, 1.0);
}
