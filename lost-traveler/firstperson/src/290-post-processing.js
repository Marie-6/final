// ================================================================ post-processing
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const gtao = new GTAOPass(scene, camera, innerWidth, innerHeight);
gtao.updateGtaoMaterial({ radius: .9, distanceExponent: 1.6, thickness: 1.5, scale: 1.4, samples: 12, distanceFallOff: 1 });
gtao.updatePdMaterial({ lumaPhi: 10, depthPhi: 2, normalPhi: 3, radius: 6, rings: 2, samples: 12 });
gtao.blendIntensity = .9;

// (ambient occlusion off: it can't see cut-out leaf shapes and printed square shadows behind trees)
const bloom = new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), .3, .5, .95);
composer.addPass(bloom);
composer.addPass(grade);
composer.addPass(new OutputPass());

