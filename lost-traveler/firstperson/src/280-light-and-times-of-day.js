// ================================================================ light and times of day
const hemi = new THREE.HemisphereLight(0xffffff, 0x888888, 1); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xffffff, 2);
sun.castShadow = true;
sun.shadow.mapSize.set(4096, 4096);
Object.assign(sun.shadow.camera, { left: -45, right: 45, top: 45, bottom: -45, near: 1, far: 260 });
sun.shadow.bias = -0.0003; sun.shadow.normalBias = .04;
scene.add(sun, sun.target);
scene.fog = new THREE.Fog(0xffffff, 60, 380);

const TIMES = {
  // Soft, pale blue light, long shadows
  asa: { sun: [.75, .5, .42], sunColor: '#FFEBD2', sunI: 3.0, sky: '#B9D2F0', ground: '#C9B9A6', hemiI: 1.35,
         top: '#5E9BE0', horizon: '#E6EEF5', glow: '#FFE2BE', cloudLit: '#FFFFFF', cloudShade: '#BCC9DE', cover: .42, fog: '#DCE6F0',
         tint: [.98, 1.0, 1.04], sat: 1.12, bloom: .18, night: 0, stars: 0, exposure: 1.05 },
  // Bright, warm sun
  hiru: { sun: [-.5, .8, .35], sunColor: '#FFF2DC', sunI: 3.4, sky: '#A8CBF2', ground: '#D2C2A8', hemiI: 1.4,
          top: '#2F78DD', horizon: '#C3DEF6', glow: '#FFFFFF', cloudLit: '#FFFFFF', cloudShade: '#AFC2DA', cover: .48, fog: '#CCDDF0',
          tint: [1.02, 1.0, .97], sat: 1.2, bloom: .14, night: 0, stars: 0, exposure: 1.1 },
  // Orange sunset turning to blue night; signs, lanterns and vending machines glow
  yoru: { sun: [.12, .06, -1], sunColor: '#FF9050', sunI: 2.0, sky: '#6E6CB8', ground: '#4E4060', hemiI: .9,
          top: '#25306E', horizon: '#F79A6A', glow: '#FFAA66', cloudLit: '#FFB596', cloudShade: '#5E4F92', cover: .42, fog: '#77699A',
          tint: [1.0, .96, 1.06], sat: 1.15, bloom: .45, night: 1, stars: .7, exposure: 1.0 },
};
let current = 'hiru';
const grade = new ShaderPass({
  uniforms: { tDiffuse: { value: null }, tint: { value: new THREE.Vector3(1, 1, 1) }, sat: { value: 1 }, vignette: { value: .3 } },
  vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }`,
  fragmentShader: `uniform sampler2D tDiffuse; uniform vec3 tint; uniform float sat, vignette; varying vec2 vUv;
    void main(){ vec4 c = texture2D(tDiffuse, vUv); vec3 col = c.rgb * tint;
      float l = dot(col, vec3(.2126,.7152,.0722)); col = mix(vec3(l), col, sat);
      float v = smoothstep(.95, .3, length(vUv - .5)); col *= mix(1. - vignette, 1., v);
      gl_FragColor = vec4(col, c.a); }`
});

function setTime(t) {
  current = t;
  const T = TIMES[t];
  sun.color.set(T.sunColor); sun.intensity = T.sunI;
  hemi.color.set(T.sky); hemi.groundColor.set(T.ground); hemi.intensity = T.hemiI;
  const u = sky.material.uniforms;
  u.top.value.set(T.top); u.horizon.value.set(T.horizon); u.glow.value.set(T.glow);
  u.cloudLit.value.set(T.cloudLit); u.cloudShade.value.set(T.cloudShade); u.cover.value = T.cover; u.stars.value = T.stars;
  u.sunDir.value.set(...T.sun).normalize();
  scene.fog.color.set(T.fog);
  for (const g of glows) g.mat.emissiveIntensity = g.day + (g.night - g.day) * T.night;
  grade.uniforms.tint.value.set(...T.tint); grade.uniforms.sat.value = T.sat;
  bloom.strength = T.bloom;
  renderer.toneMappingExposure = T.exposure;
  for (const l of cafeLights) l.intensity = T.night ? 4.5 : 4;
  for (const l of schoolLights) l.intensity = (T.night ? 5 : 3.5) * l.userData.k;
  document.querySelectorAll('#tod button').forEach(b => b.setAttribute('aria-pressed', b.dataset.t === t));
}

