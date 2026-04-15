varying vec3 vNormal;
varying vec3 vFragPos;

void main() {
    
  
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    vFragPos=vec3(modelMatrix * vec4(position,1.0));
    vNormal=normalize(normalMatrix * normal);
    
}