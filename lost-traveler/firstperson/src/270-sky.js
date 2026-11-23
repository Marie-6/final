// ================================================================ sky
const sky = new THREE.Mesh(new THREE.SphereGeometry(500, 32, 16), new THREE.ShaderMaterial({
  side: THREE.BackSide, depthWrite: false, fog: false,
  uniforms: {
    top: { value: new THREE.Color() }, horizon: { value: new THREE.Color() }, glow: { value: new THREE.Color() },
    cloudLit: { value: new THREE.Color() }, cloudShade: { value: new THREE.Color() },
    sunDir: { value: new THREE.Vector3() }, time: { value: 0 }, cover: { value: .5 }, stars: { value: 0 }
  },
  vertexShader: `varying vec3 vDir; void main(){ vDir = normalize(position); vec4 p = projectionMatrix * modelViewMatrix * vec4(position,1.); gl_Position = p.xyww; }`,
  fragmentShader: `
    uniform vec3 top, horizon, glow, cloudLit, cloudShade, sunDir; uniform float time, cover, stars; varying vec3 vDir;
    float h(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
    float n(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f); return mix(mix(h(i),h(i+vec2(1,0)),f.x), mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x), f.y); }
    float fbm(vec2 p){ float v=0., a=.5; for(int i=0;i<6;i++){ v+=a*n(p); p=p*2.03+vec2(1.7,9.2); a*=.5; } return v; }
    void main(){
      vec3 d = normalize(vDir);
      float up = clamp(d.y, 0., 1.);
      vec3 col = mix(horizon, top, pow(up, .45));
      float sd = max(dot(d, normalize(sunDir)), 0.);
      col += glow * (pow(sd, 6.) * .55 + pow(sd, 90.) * 1.2) * (1. - up * .5);
      if (stars > 0.) { vec2 sp = floor(d.xz / (d.y + .05) * 160.); float s = step(.996, h(sp)); col += vec3(s) * stars * smoothstep(.1,.5,up); }
      // high soft clouds
      if (d.y > 0.) {
        vec2 uv = d.xz / (d.y + .1) * .8 + vec2(time * .003, 0.);
        float c = fbm(uv * 1.2);
        float c2 = fbm(uv * 1.2 + normalize(sunDir.xz + 1e-4) * .07);
        float m = smoothstep(1. - cover, 1. - cover + .2, c) * smoothstep(.02, .3, d.y);
        float lit = clamp((c - c2) * 7. + .6, 0., 1.);
        vec3 cc = mix(cloudShade, cloudLit, smoothstep(.3, .7, lit)) + glow * pow(sd, 5.) * .5;
        col = mix(col, cc, m * .9);
        // towering cumulus near the horizon, like anime skies
        float az = atan(d.x, d.z);
        float hgt = fbm(vec2(az * 3.2, 1.3)) * .55 + fbm(vec2(az * 9., 4.1)) * .18 - .2;
        float body = smoothstep(hgt, hgt - .03, d.y) * smoothstep(-.02, .04, d.y);
        float puff = fbm(vec2(az * 14., d.y * 18.)) ;
        vec3 cu = mix(cloudShade, cloudLit, clamp(d.y / max(hgt, .05) * .9 + puff * .5 - .1, 0., 1.)) + glow * pow(sd, 3.) * .35;
        col = mix(col, cu, body * .95);
      }
      gl_FragColor = vec4(col, 1.);
    }`
}));
sky.renderOrder = -1;
scene.add(sky);
dynamic.add(sky);

