precision mediump float;

varying vec3 vFragPos;

uniform float uAmbientStrength;
uniform float uDiffuse;
uniform float uLightStrength;

uniform vec3 uColor;
uniform vec3 uLightColor;
uniform vec3 uLightPos; // Koristićemo ga kao SMER svetla (beskonačno udaljeno)

void main()
{

    vec3 dx = dFdx(vFragPos);
    vec3 dy = dFdy(vFragPos);
    vec3 norm = normalize(cross(dx, dy));

    vec3 lightDir = normalize(uLightPos); 

    // 3. Ambijentalna komponenta
    vec3 ambient = uAmbientStrength * uLightColor;

    // 4. Difuzna komponenta (Lambertov zakon - jedna vrednost po poligonu)
    float diff = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = uDiffuse * diff * uLightColor;
    // Konačna boja (Lambertov model)
    vec3 color = (ambient + diffuse) * uColor * uLightStrength;

    gl_FragColor = vec4(color, 1.0);
}