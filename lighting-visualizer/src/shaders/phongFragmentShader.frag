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

varying vec3 vNormal;
varying vec3 vFragPos;

void main() {
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

    vec3 res= ((diffuse+specular)*uLightStrength)+ambient*uColor;
    gl_FragColor = vec4(res,1.0);
}