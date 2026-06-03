varying vec3 vFragPos;

void main()
{
    vFragPos = vec3(modelMatrix * vec4(position, 1.0));

    gl_Position =
        projectionMatrix *
        modelViewMatrix *
        vec4(position, 1.0);
}