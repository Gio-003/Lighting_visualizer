
// Izlazne promenljive koje se interpoliraju i šalju u fragment šader
varying vec3 vNormal;
varying vec3 vFragPos;
varying vec2 vUv;

void main() {
    // 1. Izračunavanje pozicije u prostoru ekrana
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    
    // 2. Prospeđivanje pozicije u svetskom prostoru (World Space)
    vFragPos = vec3(modelMatrix * vec4(position, 1.0));
    
    // 3. Transformacija i normalizacija normale temena
    vNormal = normalize(normalMatrix * normal);

    // 4. UV koordinate za teksturisanje
    vUv = uv;
}