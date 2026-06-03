precision mediump float;

varying vec3 vFragPos;

uniform float uAmbientStrength;
uniform float uDiffuse;
uniform float uLightStrength;
uniform float uSpecularStrength;
uniform float uShininess;

uniform vec3 uColor;
uniform vec3 uLightColor;
uniform vec3 uLightPos;
uniform vec3 uViewPos;

void main()
{
    vec3 dx = dFdx(vFragPos);
    vec3 dy = dFdy(vFragPos);
    vec3 norm = normalize(cross(dx, dy));

    // light direction
    vec3 lightDir = normalize(uLightPos - vFragPos);

    // ambient
    vec3 ambient = uAmbientStrength * uLightColor;

    // diffuse
    float diff = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = uDiffuse * diff * uLightColor;

    // specular
    vec3 viewDir = normalize(uViewPos - vFragPos);
    vec3 reflectDir = reflect(-lightDir, norm);

    float spec = pow(max(dot(viewDir, reflectDir), 0.0), uShininess);
    vec3 specular = uSpecularStrength * spec * uLightColor;

    vec3 color =
        ((diffuse + specular) * uLightStrength)
        + ambient* uColor;

    gl_FragColor = vec4(color , 1.0);
}