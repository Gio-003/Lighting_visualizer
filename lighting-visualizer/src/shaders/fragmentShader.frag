precision mediump float;

uniform float uAmbientStrength; //io*ka ambijentalno svetlo
uniform float uDiffuse;
uniform float uLightStrength;

uniform vec3 uColor;
uniform vec3 uLightColor;
uniform vec3 uLightPos;


varying vec3 vNormal;
varying vec3 vFragPos;

void main() {
    //Ambijentalno svetlo
    vec3 ambient= uAmbientStrength* uLightColor; //ka *ia

    vec3 norm = normalize(vNormal);
    vec3 lightDir = normalize(uLightPos - vFragPos);
    float diff= max(dot(norm, lightDir), 0.0);
    vec3 diffuse= (uDiffuse*diff * uLightColor);
    vec3 res= (ambient+ diffuse)*uColor*uLightStrength;
    gl_FragColor = vec4(res,1.0); // crveno
}