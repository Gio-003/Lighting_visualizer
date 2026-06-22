precision mediump float;

uniform float uAmbientStrength; //io*ka ambijentalno svetlo
uniform float uDiffuse;
uniform float uLightStrength;
uniform float uSpecularStrength;
uniform float uShininess;

uniform vec3 uColor;
uniform vec3 uLightColor;
uniform vec3 uLightPos;
uniform vec3 uViewPos;
uniform sampler2D uTexture;
uniform float uUseTexture;

varying vec3 vNormal;
varying vec3 vFragPos;
varying vec2 vUv;

void main() {
    vec3 texColor = texture2D(uTexture, vUv).rgb;
    vec3 baseColor = mix(uColor, texColor, uUseTexture);

    //Ambijentalno svetlo
    vec3 ambient= uAmbientStrength* uLightColor; //ka *ia

//diffuse
    vec3 norm = normalize(vNormal);
    vec3 lightDir = normalize(uLightPos - vFragPos);
    float diff= max(dot(norm, lightDir), 0.0);
    vec3 diffuse= (uDiffuse*diff * uLightColor);
//specular
    vec3 viewDir=normalize(uViewPos-vFragPos);
    vec3 reflectDir=reflect(-lightDir,norm);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), uShininess);
    vec3 specular=uSpecularStrength*spec*uLightColor;

    vec3 finalColor = ((ambient + diffuse) * baseColor + specular) * uLightStrength;
    gl_FragColor = vec4(finalColor,1.0);
}