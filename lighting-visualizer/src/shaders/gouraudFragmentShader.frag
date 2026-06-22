precision mediump float;

uniform sampler2D uTexture;
uniform float uUseTexture;

varying vec3 vColor;
varying vec2 vUv;

void main() {
    vec3 texColor = texture2D(uTexture, vUv).rgb;
    vec3 color = mix(vColor, vColor * texColor, uUseTexture);
    gl_FragColor = vec4(color, 1.0);
}
