precision mediump float;

varying vec3 vFragPos;
varying vec2 vUv;

uniform float uAmbientStrength;
uniform float uDiffuse;
uniform float uLightStrength;

uniform vec3 uColor;
uniform vec3 uLightColor;
uniform vec3 uLightPos; // Koristićemo ga kao SMER svetla (beskonačno udaljeno)
uniform sampler2D uTexture;
uniform float uUseTexture;

void main()
{

    vec3 dx = dFdx(vFragPos);
    vec3 dy = dFdy(vFragPos);
    vec3 norm = normalize(cross(dx, dy));

    vec3 lightDir = normalize(uLightPos); 

    vec3 texColor = texture2D(uTexture, vUv).rgb;
    vec3 baseColor = mix(uColor, texColor, uUseTexture);

    // 3. Ambijentalna komponenta
    vec3 ambient = uAmbientStrength * uLightColor;

    // 4. Difuzna komponenta (Lambertov zakon - jedna vrednost po poligonu)
    float diff = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = uDiffuse * diff * uLightColor;
    // Konačna boja (Lambertov model)
    vec3 color = (ambient + diffuse) * baseColor * uLightStrength;

    gl_FragColor = vec4(color, 1.0);
}