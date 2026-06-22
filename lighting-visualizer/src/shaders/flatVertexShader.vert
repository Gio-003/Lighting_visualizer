varying vec3 vFragPos;
varying vec2 vUv;

void main()
{
    vFragPos = vec3(modelMatrix * vec4(position, 1.0));
    vUv = uv;

    gl_Position =
        projectionMatrix *
        modelViewMatrix *
        vec4(position, 1.0);
}