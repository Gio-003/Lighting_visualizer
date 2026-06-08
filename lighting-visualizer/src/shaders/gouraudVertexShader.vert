precision mediump float;

uniform float uAmbientStrength;
uniform float uDiffuse;
uniform float uLightStrength;
uniform float uSpecularStrength;
uniform float uShininess;

uniform vec3 uColor;
uniform vec3 uLightColor;
uniform vec3 uLightPos;
uniform vec3 uViewPos;

varying vec3 vColor;

void main()
{
    vec3 fragPos = vec3(modelMatrix * vec4(position, 1.0));
    vec3 norm = normalize(normalMatrix * normal);

    // Ambient
    vec3 ambient = uAmbientStrength * uLightColor;

    // Diffuse
    vec3 lightDir = normalize(uLightPos - fragPos);
    float diff = max(dot(norm, lightDir), 0.0);

    vec3 diffuse = uDiffuse * diff * uLightColor;

    // Specular
    vec3 viewDir = normalize(uViewPos - fragPos);

    vec3 reflectDir = reflect(-lightDir, norm);

    float spec = pow( max(dot(viewDir, reflectDir), 0.0),uShininess);

    vec3 specular =uSpecularStrength *spec *uLightColor;

    vColor = ((ambient + diffuse) * uColor + specular) * uLightStrength;

    gl_Position =
        projectionMatrix *
        modelViewMatrix *
        vec4(position, 1.0);
}