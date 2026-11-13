// Anushka — a stylised 3D character built from soft primitives with three.js.
// Idle breathing, blinking, a gentle wave, hair sway and pointer-following head and eyes.
// Expressions: follow (default), baby (surprised, Creativity hover), happy (laughing, Please Click hover).
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export type Expression = 'follow' | 'baby' | 'happy';
export interface GirlOptions { expression?: Expression; animate?: boolean; pixelRatio?: number }
export interface Girl { setExpression(e: Expression): void; renderOnce(): void; dispose(): void; canvas: HTMLCanvasElement }

const C = {
  skin: 0xd99c79, skinShade: 0xb97a5c, blush: 0xf2878a, lip: 0xc4505a, mouth: 0x6e2430,
  hair: 0x24170f, hairHi: 0x3f2a20, iris: 0x5b3420, white: 0xfbf8f4, ink: 0x1c1f26,
  sweater: 0xd9434c, sweaterRib: 0xbb3640, tee: 0xf6efe4, gold: 0xe7b85a, clip: 0xf5b62b,
};

/* ---------- geometry helpers ---------- */
function taperedTube(points: THREE.Vector3[], r0: number, r1: number, opts: { seg?: number; rad?: number; flat?: number; bulge?: number; facing?: boolean } = {}) {
  const { seg = 40, rad = 14, flat = 1, bulge = 0.25, facing = false } = opts;
  const curve = new THREE.CatmullRomCurve3(points, false, 'centripetal');
  const frames = curve.computeFrenetFrames(seg, false);
  const pos: number[] = [], idx: number[] = [], uv: number[] = [];
  for (let i = 0; i <= seg; i++) {
    const t = i / seg, p = curve.getPointAt(t);
    // smooth taper with a soft swell near the root and rounded tip
    let r = THREE.MathUtils.lerp(r0, r1, t) * (1 + bulge * Math.sin(Math.PI * Math.min(1, t * 1.6)));
    if (t < 0.06) r *= Math.sqrt(t / 0.06) * 0.6 + 0.4;
    if (t > 0.9) r *= Math.max(0.05, Math.sqrt((1 - t) / 0.1));
    let N = frames.normals[i], B = frames.binormals[i];
    if (facing) { const T = curve.getTangentAt(t); N = new THREE.Vector3().crossVectors(T, new THREE.Vector3(0, 0, 1)).normalize(); B = new THREE.Vector3().crossVectors(T, N).normalize(); }
    for (let j = 0; j <= rad; j++) {
      const a = (j / rad) * Math.PI * 2;
      const cx = Math.cos(a) * r, cy = Math.sin(a) * r * flat;
      pos.push(p.x + N.x * cx + B.x * cy, p.y + N.y * cx + B.y * cy, p.z + N.z * cx + B.z * cy);
      uv.push(j / rad, t);
    }
  }
  for (let i = 0; i < seg; i++) for (let j = 0; j < rad; j++) {
    const a = i * (rad + 1) + j, b = a + rad + 1;
    idx.push(a, b, a + 1, b, b + 1, a + 1);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx); g.computeVertexNormals();
  return g;
}
const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

function ribTexture() {
  const c = document.createElement('canvas'); c.width = 64; c.height = 8;
  const x = c.getContext('2d')!;
  for (let i = 0; i < 64; i++) { const s = 128 + 110 * Math.sin((i / 64) * Math.PI * 2 * 4); x.fillStyle = `rgb(${s},${s},${s})`; x.fillRect(i, 0, 1, 8); }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(6, 1); return t;
}
function blushTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const x = c.getContext('2d')!, g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(242,135,138,0.75)'); g.addColorStop(1, 'rgba(242,135,138,0)');
  x.fillStyle = g; x.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

/* ---------- build ---------- */
export function createGirl(host: HTMLElement, o: GirlOptions = {}): Girl {
  const animate = o.animate !== false;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, premultipliedAlpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(o.pixelRatio ?? Math.min(devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 0.95;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const canvas = renderer.domElement;
  canvas.className = 'character__canvas';
  Object.assign(canvas.style, { display: 'block', width: '100%', height: '100%' });
  host.appendChild(canvas);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = env;
  scene.environmentIntensity = 0.55;

  const camera = new THREE.PerspectiveCamera(19, 400 / 520, 0.1, 50);
  camera.position.set(0, 1.3, 7.1);
  camera.lookAt(0, 1.2, 0);

  // Soft studio lighting: warm key, cool rim, gentle fill.
  scene.add(new THREE.HemisphereLight(0xfff4ea, 0xd7dcef, 0.5));
  const key = new THREE.DirectionalLight(0xfff1e2, 2.4);
  key.position.set(-2.2, 3.4, 4.2); key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024); key.shadow.radius = 6; key.shadow.bias = -0.0005; key.shadow.normalBias = 0.02;
  Object.assign(key.shadow.camera, { left: -1.4, right: 1.4, top: 2.4, bottom: 0, near: 1, far: 12 });
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xbcd2ff, 1.4); rim.position.set(2.6, 2.4, -2.5); scene.add(rim);
  const fill = new THREE.DirectionalLight(0xffe6d8, 0.45); fill.position.set(2.5, 0.8, 3); scene.add(fill);

  const M = {
    skin: new THREE.MeshPhysicalMaterial({ color: C.skin, roughness: 0.62, sheen: 0.35, sheenColor: new THREE.Color(0xffd2bf), sheenRoughness: 0.6 }),
    skinShade: new THREE.MeshPhysicalMaterial({ color: C.skinShade, roughness: 0.7 }),
    hair: new THREE.MeshPhysicalMaterial({ color: C.hair, roughness: 0.42, sheen: 0.6, sheenColor: new THREE.Color(0x7a5240), sheenRoughness: 0.35, clearcoat: 0.15, clearcoatRoughness: 0.5 }),
    hairHi: new THREE.MeshStandardMaterial({ color: C.hairHi, roughness: 0.4 }),
    white: new THREE.MeshPhysicalMaterial({ color: C.white, roughness: 0.25, clearcoat: 0.6 }),
    iris: new THREE.MeshPhysicalMaterial({ color: C.iris, roughness: 0.3, clearcoat: 1 }),
    pupil: new THREE.MeshStandardMaterial({ color: 0x120b08, roughness: 0.2 }),
    shine: new THREE.MeshBasicMaterial({ color: 0xffffff }),
    ink: new THREE.MeshStandardMaterial({ color: C.hair, roughness: 0.6 }),
    lip: new THREE.MeshPhysicalMaterial({ color: C.lip, roughness: 0.45, clearcoat: 0.3 }),
    mouth: new THREE.MeshStandardMaterial({ color: C.mouth, roughness: 0.8, side: THREE.DoubleSide }),
    teeth: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4, side: THREE.DoubleSide }),
    sweater: new THREE.MeshPhysicalMaterial({ color: C.sweater, roughness: 0.9, sheen: 0.8, sheenColor: new THREE.Color(0xffb3a8), sheenRoughness: 0.8, bumpMap: ribTexture(), bumpScale: 1.2 }),
    rib: new THREE.MeshPhysicalMaterial({ color: C.sweaterRib, roughness: 0.9, sheen: 0.6, sheenColor: new THREE.Color(0xff9d93) }),
    tee: new THREE.MeshStandardMaterial({ color: C.tee, roughness: 0.85 }),
    gold: new THREE.MeshPhysicalMaterial({ color: C.gold, metalness: 1, roughness: 0.28 }),
    pearl: new THREE.MeshPhysicalMaterial({ color: 0xfaf3ea, roughness: 0.15, clearcoat: 1, iridescence: 0.6, iridescenceIOR: 1.6 }),
    clip: new THREE.MeshPhysicalMaterial({ color: C.clip, roughness: 0.3, clearcoat: 0.8 }),
    blush: new THREE.MeshBasicMaterial({ map: blushTexture(), transparent: true, depthWrite: false, opacity: 0.55 }),
  };
  const mesh = (g: THREE.BufferGeometry, m: THREE.Material, shadow = true) => { const x = new THREE.Mesh(g, m); x.castShadow = shadow; x.receiveShadow = true; return x; };
  const sphere = (r: number, m: THREE.Material, w = 48, h = 32) => mesh(new THREE.SphereGeometry(r, w, h), m);

  const root = new THREE.Group(); scene.add(root);
  const bodyG = new THREE.Group(); root.add(bodyG);

  /* torso: lathe profile, flattened front-to-back */
  const prof = [[0, 0.0], [0.47, 0.0], [0.49, 0.3], [0.5, 0.56], [0.48, 0.72], [0.42, 0.83], [0.3, 0.91], [0.17, 0.95], [0, 0.96]].map(([r, y]) => new THREE.Vector2(r, y));
  const torso = mesh(new THREE.LatheGeometry(prof, 64), M.sweater); torso.scale.z = 0.64; bodyG.add(torso);
  const collar = mesh(new THREE.TorusGeometry(0.155, 0.038, 16, 48), M.rib); collar.rotation.x = Math.PI / 2; collar.position.set(0, 0.945, 0); collar.scale.set(1, 0.72, 1); bodyG.add(collar);
  const tee = mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.03, 32), M.tee); tee.position.set(0, 0.96, 0.01); tee.scale.z = 0.7; bodyG.add(tee);
  // necklace: thin gold chain with a small pendant
  const chain = mesh(new THREE.TorusGeometry(0.17, 0.006, 8, 64, Math.PI), M.gold, false);
  chain.rotation.set(0.35, 0, Math.PI); chain.position.set(0, 0.955, 0.1); chain.scale.set(1, 1.15, 1); bodyG.add(chain);
  const pendant = sphere(0.022, M.gold); pendant.position.set(0, 0.765, 0.17); bodyG.add(pendant);

  /* neck */
  const neck = mesh(new THREE.CylinderGeometry(0.095, 0.11, 0.42, 32), M.skin); neck.position.set(0, 1.12, -0.01); bodyG.add(neck);

  /* arms */
  const sleeve = (pts: THREE.Vector3[]) => mesh(taperedTube(pts, 0.13, 0.105, { bulge: 0.06, seg: 32 }), M.sweater);
  const armL = new THREE.Group(); armL.position.set(0.45, 0.8, -0.02); bodyG.add(armL); // her left = screen right, relaxed
  armL.add(sleeve([v(0, 0.02, 0), v(0.07, -0.3, 0.02), v(0.11, -0.62, 0.06), v(0.12, -1.0, 0.1)]));
  const shoulderL = sphere(0.135, M.sweater); shoulderL.scale.set(1, 0.9, 0.8); armL.add(shoulderL);

  // her right arm (screen left) waves: shoulder > elbow > hand
  const armR = new THREE.Group(); armR.position.set(-0.45, 0.8, -0.02); bodyG.add(armR);
  const shoulderR = sphere(0.135, M.sweater); shoulderR.scale.set(1, 0.9, 0.8); armR.add(shoulderR);
  const upper = mesh(taperedTube([v(0, 0, 0), v(0, -0.22, 0), v(0, -0.42, 0)], 0.13, 0.105, { bulge: 0.05, seg: 20 }), M.sweater); armR.add(upper);
  const elbow = new THREE.Group(); elbow.position.set(0, -0.42, 0); armR.add(elbow);
  const elbowBall = sphere(0.108, M.sweater); elbow.add(elbowBall);
  const fore = mesh(taperedTube([v(0, 0, 0), v(0, -0.2, 0), v(0, -0.36, 0)], 0.105, 0.088, { bulge: 0.02, seg: 20 }), M.sweater); elbow.add(fore);
  const cuff = mesh(new THREE.TorusGeometry(0.083, 0.026, 12, 32), M.rib); cuff.rotation.x = Math.PI / 2; cuff.position.y = -0.35; elbow.add(cuff);
  const wrist = new THREE.Group(); wrist.position.set(0, -0.38, 0); elbow.add(wrist);
  const palm = sphere(0.085, M.skin); palm.scale.set(1, 1.15, 0.55); palm.position.y = -0.07; wrist.add(palm);
  [-0.05, -0.017, 0.017, 0.05].forEach((x, i) => {
    const len = [0.1, 0.12, 0.115, 0.095][i];
    const f = mesh(new THREE.CapsuleGeometry(0.021, len, 6, 12), M.skin);
    f.position.set(x, -0.15 - len / 2, 0); f.rotation.z = x * 1.2; wrist.add(f);
  });
  const thumb = mesh(new THREE.CapsuleGeometry(0.024, 0.07, 6, 12), M.skin); thumb.position.set(-0.085, -0.07, 0.02); thumb.rotation.z = 0.9; wrist.add(thumb);

  /* head */
  const headG = new THREE.Group(); headG.position.set(0, 1.21, 0); bodyG.add(headG); // pivot at top of neck
  const H = (y: number) => y - 1.3; // world-y to head-local
  const skull = sphere(0.4, M.skin, 64, 48); skull.scale.set(0.98, 1.05, 0.95); skull.position.set(0, H(1.64), 0); headG.add(skull);
  const jaw = sphere(0.28, M.skin, 48, 32); jaw.scale.set(1.0, 0.94, 0.9); jaw.position.set(0, H(1.465), 0.06); headG.add(jaw);
  [-1, 1].forEach((s) => {
    const ear = sphere(0.07, M.skin); ear.scale.set(0.45, 1, 0.75); ear.position.set(s * 0.385, H(1.58), -0.02); headG.add(ear);
    const pearl = sphere(0.03, M.pearl); pearl.position.set(s * 0.392, H(1.49), 0.0); headG.add(pearl);
    const blush = new THREE.Mesh(new THREE.CircleGeometry(0.09, 32), M.blush);
    blush.position.set(s * 0.215, H(1.5), 0.335); blush.rotation.y = s * 0.6; blush.scale.y = 0.62; blush.renderOrder = 2; headG.add(blush);
  });
  const nose = sphere(0.04, M.skin); nose.scale.set(1.1, 0.85, 0.9); nose.position.set(0, H(1.52), 0.385); headG.add(nose);
  const noseShade = sphere(0.022, M.skinShade, 24, 16); noseShade.position.set(0, H(1.5), 0.388); noseShade.scale.set(1.6, 0.5, 0.6); headG.add(noseShade);

  /* eyes */
  type Eye = { g: THREE.Group; ball: THREE.Group; iris: THREE.Group; lash: THREE.Mesh; brow: THREE.Mesh; happyArc: THREE.Mesh; side: number };
  const eyes: Eye[] = [-1, 1].map((s) => {
    const g = new THREE.Group(); g.position.set(s * 0.145, H(1.6), 0.315); g.rotation.y = s * 0.3; headG.add(g);
    const ball = new THREE.Group(); g.add(ball);
    const white = sphere(0.088, M.white, 32, 24); white.scale.set(1, 1.18, 0.62); ball.add(white);
    const iris = new THREE.Group(); iris.position.z = 0.046; ball.add(iris);
    const ir = sphere(0.058, M.iris, 32, 24); ir.scale.set(1, 1.08, 0.35); iris.add(ir);
    const pu = sphere(0.032, M.pupil, 24, 16); pu.scale.set(1, 1.08, 0.3); pu.position.z = 0.012; iris.add(pu);
    const sh1 = sphere(0.015, M.shine, 12, 8); sh1.position.set(-0.02, 0.026, 0.026); iris.add(sh1);
    const sh2 = sphere(0.007, M.shine, 8, 6); sh2.position.set(0.022, -0.022, 0.024); iris.add(sh2);
    // upper lash line with a small flick at the outer corner
    const lash = mesh(new THREE.TorusGeometry(0.092, 0.013, 8, 32, Math.PI * 0.86), M.ink, false);
    lash.position.set(0, 0.005, 0.02); lash.rotation.z = Math.PI * 0.07; lash.scale.set(1, 1.15, 1); g.add(lash);
    const brow = mesh(taperedTube([v(-s * 0.075, 0.135, 0.02), v(-s * 0.01, 0.168, 0.03), v(s * 0.06, 0.168, 0.025), v(s * 0.105, 0.14, 0.0)], 0.017, 0.007, { seg: 16, rad: 8, bulge: 0 }), M.ink, false);
    g.add(brow);
    const happyArc = mesh(new THREE.TorusGeometry(0.065, 0.014, 8, 24, Math.PI * 0.8), M.ink, false);
    happyArc.position.set(0, -0.03, 0.05); happyArc.rotation.z = Math.PI * 0.1; happyArc.visible = false; g.add(happyArc);
    return { g, ball, iris, lash, brow, happyArc, side: s };
  });

  /* mouth: three shapes, one visible per expression */
  const mouthG = new THREE.Group(); mouthG.position.set(0, H(1.425), 0.335); mouthG.rotation.x = -0.18; headG.add(mouthG);
  const smile = mesh(new THREE.TorusGeometry(0.07, 0.016, 10, 32, Math.PI * 0.6), M.lip, false);
  smile.rotation.z = Math.PI + Math.PI * 0.19; smile.position.y = 0.045; mouthG.add(smile);
  const laughShape = new THREE.Shape(); laughShape.moveTo(-0.1, 0.02); laughShape.quadraticCurveTo(0, 0.045, 0.1, 0.02); laughShape.quadraticCurveTo(0.09, -0.11, 0, -0.115); laughShape.quadraticCurveTo(-0.09, -0.11, -0.1, 0.02);
  const laugh = new THREE.Group(); mouthG.add(laugh);
  laugh.add(mesh(new THREE.ShapeGeometry(laughShape, 24), M.mouth, false));
  const teethShape = new THREE.Shape(); teethShape.moveTo(-0.085, 0.018); teethShape.quadraticCurveTo(0, 0.04, 0.085, 0.018); teethShape.lineTo(0.075, -0.012); teethShape.quadraticCurveTo(0, 0.0, -0.075, -0.012);
  const teeth = mesh(new THREE.ShapeGeometry(teethShape, 16), M.teeth, false); teeth.position.z = 0.002; laugh.add(teeth);
  const tongue = sphere(0.045, M.lip, 24, 16); tongue.scale.set(1.3, 0.5, 0.2); tongue.position.set(0, -0.085, 0.002); laugh.add(tongue);
  const oh = mesh(new THREE.TorusGeometry(0.03, 0.012, 10, 24), M.lip, false); oh.scale.y = 1.25; mouthG.add(oh);
  const ohIn = mesh(new THREE.CircleGeometry(0.03, 20), M.mouth, false); ohIn.scale.y = 1.25; ohIn.position.z = -0.003; mouthG.add(ohIn);

  /* hair: a smooth cap, a full back volume and soft layered locks */
  const hairG = new THREE.Group(); headG.add(hairG);
  const cap = mesh(new THREE.SphereGeometry(0.425, 64, 48, 0, Math.PI * 2, 0, Math.PI * 0.5), M.hair);
  cap.position.set(0, H(1.66), -0.04); cap.scale.set(1.05, 1.07, 1.04); cap.rotation.x = -0.62; hairG.add(cap);
  const back = sphere(0.43, M.hair, 48, 32); back.position.set(0, H(1.6), -0.1); back.scale.set(1.06, 1.08, 0.95); hairG.add(back);
  const curtain = mesh(new THREE.CapsuleGeometry(0.4, 0.5, 12, 32), M.hair); curtain.position.set(0, H(1.2), -0.22); curtain.scale.set(1.15, 1, 0.4); hairG.add(curtain);

  const locks: { g: THREE.Group; phase: number; amp: number }[] = [];
  const lock = (pts: THREE.Vector3[], r0: number, r1: number, flat = 0.45, mat: THREE.Material = M.hair, amp = 1) => {
    const g = new THREE.Group(); const root0 = pts[0]; g.position.copy(root0);
    g.add(mesh(taperedTube(pts.map((p) => p.clone().sub(root0)), r0, r1, { flat, bulge: 0.12, facing: true, rad: 18 }), mat));
    hairG.add(g); locks.push({ g, phase: Math.random() * Math.PI * 2, amp }); return g;
  };
  [-1, 1].forEach((s) => {
    // centre-parted crown: two sweeping panels from the part over the top of the head
    lock([v(s * 0.01, H(2.07), 0.12), v(s * 0.14, H(2.04), 0.24), v(s * 0.28, H(1.94), 0.3), v(s * 0.38, H(1.76), 0.28)], 0.12, 0.08, 0.5, M.hair, 0.3);
    // curtain bangs framing the face down to the cheekbones, tips flicking out
    lock([v(s * 0.04, H(2.03), 0.24), v(s * 0.15, H(1.96), 0.36), v(s * 0.28, H(1.8), 0.37), v(s * 0.35, H(1.62), 0.31), v(s * 0.38, H(1.47), 0.24), v(s * 0.42, H(1.4), 0.22)], 0.075, 0.025, 0.55, M.hair, 0.45);
    // long layers falling over the shoulders, wider panels with curled tips
    lock([v(s * 0.36, H(1.72), 0.14), v(s * 0.41, H(1.5), 0.17), v(s * 0.41, H(1.25), 0.21), v(s * 0.38, H(1.02), 0.27), v(s * 0.31, H(0.82), 0.3), v(s * 0.27, H(0.76), 0.29)], 0.13, 0.04, 0.42, M.hair, 1);
    lock([v(s * 0.4, H(1.7), 0.04), v(s * 0.46, H(1.45), 0.08), v(s * 0.47, H(1.2), 0.13), v(s * 0.45, H(0.96), 0.19), v(s * 0.4, H(0.76), 0.22), v(s * 0.43, H(0.7), 0.21)], 0.14, 0.045, 0.42, M.hair, 1.1);
    lock([v(s * 0.38, H(1.74), -0.1), v(s * 0.47, H(1.45), -0.1), v(s * 0.51, H(1.15), -0.08), v(s * 0.5, H(0.88), -0.06), v(s * 0.53, H(0.78), -0.05)], 0.16, 0.06, 0.5, M.hair, 0.8);
    // subtle strand highlights following the front layers
    lock([v(s * 0.35, H(1.7), 0.2), v(s * 0.405, H(1.48), 0.23), v(s * 0.405, H(1.24), 0.27), v(s * 0.37, H(1.02), 0.33)], 0.012, 0.004, 0.5, M.hairHi, 1);
    lock([v(s * 0.1, H(2.0), 0.33), v(s * 0.24, H(1.88), 0.41), v(s * 0.33, H(1.7), 0.38)], 0.01, 0.003, 0.5, M.hairHi, 0.4);
  });
  // a yellow claw clip on her left side: the portfolio's folder colour
  const clip = mesh(new THREE.CapsuleGeometry(0.034, 0.1, 6, 16), M.clip); clip.position.set(0.3, H(1.95), 0.17); clip.rotation.set(0.5, 0.3, 1.05); hairG.add(clip);
  const clipBar = mesh(new THREE.CapsuleGeometry(0.017, 0.12, 4, 12), M.clip); clipBar.position.set(0.33, H(1.91), 0.15); clipBar.rotation.set(0.5, 0.3, 1.2); hairG.add(clipBar);

  /* state */
  let target: Expression = o.expression ?? 'follow';
  const st = { open: 1, wide: 0, happy: target === 'happy' ? 1 : 0, surprise: target === 'baby' ? 1 : 0, lookX: 0, lookY: 0, headX: 0, headY: 0 };
  const ptr = { x: 0, y: 0, active: false };
  let blinkUntil = 0, nextBlink = performance.now() + 2500, waveStart = performance.now() + 1200;

  const applyExpression = () => {
    const sp = st.surprise, hp = st.happy;
    eyes.forEach((e) => {
      const s = 1 + sp * 0.18;
      e.ball.scale.set(s, s * Math.max(0.06, st.open) , s);
      e.ball.visible = hp < 0.5;
      e.lash.visible = hp < 0.5;
      e.lash.position.y = 0.005 + (st.open - 1) * 0.09 + sp * 0.02;
      e.lash.scale.y = 1.15 * (0.4 + 0.6 * Math.max(0.06, st.open));
      e.happyArc.visible = hp >= 0.5;
      e.brow.position.y = sp * 0.045 + hp * 0.012;
      e.iris.position.x = st.lookX * 0.025; e.iris.position.y = st.lookY * 0.02;
    });
    smile.visible = hp < 0.5 && sp < 0.5;
    laugh.visible = hp >= 0.5;
    oh.visible = ohIn.visible = sp >= 0.5 && hp < 0.5;
    M.blush.opacity = 0.5 + hp * 0.35;
  };

  /* animation */
  const clock = new THREE.Clock();
  let raf = 0, running = false, disposed = false;
  const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

  const pose = (t: number, dt: number) => {
    const now = performance.now();
    const k = 1 - Math.pow(0.0015, dt);
    st.happy = lerp(st.happy, target === 'happy' ? 1 : 0, k);
    st.surprise = lerp(st.surprise, target === 'baby' ? 1 : 0, k);
    // blink
    if (now > nextBlink) { blinkUntil = now + 150; nextBlink = now + 3200 + Math.random() * 2600; }
    const blinking = now < blinkUntil;
    st.open = lerp(st.open, blinking ? 0.05 : 1, blinking ? 0.7 : 0.35);
    // look at pointer (or wander gently)
    const tx = ptr.active ? ptr.x : Math.sin(t * 0.35) * 0.35, ty = ptr.active ? ptr.y : Math.sin(t * 0.27) * 0.15;
    st.lookX = lerp(st.lookX, tx, k * 0.8); st.lookY = lerp(st.lookY, ty, k * 0.8);
    st.headX = lerp(st.headX, tx, k * 0.4); st.headY = lerp(st.headY, ty, k * 0.4);
    headG.rotation.y = st.headX * 0.28; headG.rotation.x = -st.headY * 0.12 + Math.sin(t * 0.9) * 0.012;
    headG.rotation.z = Math.sin(t * 0.6) * 0.025 - st.headX * 0.03 + st.happy * Math.sin(t * 7) * 0.02;
    // breathing + idle sway
    const br = Math.sin(t * 1.6);
    torso.scale.y = 1 + br * 0.008; torso.scale.x = 1 + br * 0.006;
    bodyG.rotation.z = Math.sin(t * 0.5) * 0.012; bodyG.position.y = br * 0.006;
    armL.rotation.z = 0.04 + br * 0.01;
    // wave: every ~9s raise the right hand beside the face and wave for ~2.6s
    const w = (now - waveStart) / 1000;
    let up = 0;
    if (w > 0 && w < 3.6) up = w < 0.6 ? THREE.MathUtils.smoothstep(w, 0, 0.6) : w > 3.0 ? 1 - THREE.MathUtils.smoothstep(w, 3.0, 3.6) : 1;
    else if (w >= 3.6) waveStart = now + 6000 + Math.random() * 3000;
    if (st.happy > 0.5) up = Math.max(up, 0.85);
    armR.rotation.z = lerp(0.04, -0.78, up) + br * 0.01;
    armR.rotation.x = lerp(0, -0.18, up);
    elbow.rotation.z = lerp(0.04, Math.PI + 0.55, up) + up * Math.sin(t * 4.5) * 0.06;
    elbow.rotation.x = lerp(0, 0.1, up);
    wrist.rotation.z = up * Math.sin(t * 9) * 0.38;
    wrist.rotation.y = up * 0.15;
    // hair sway (more when the head turns)
    locks.forEach((l) => { l.g.rotation.z = Math.sin(t * 1.3 + l.phase) * 0.018 * l.amp - st.headX * 0.04 * l.amp; l.g.rotation.x = Math.sin(t * 1.1 + l.phase) * 0.012 * l.amp; });
    applyExpression();
  };

  const resize = () => {
    const r = host.getBoundingClientRect();
    const w = Math.max(1, Math.round(r.width)), h = Math.max(1, Math.round(r.width * 520 / 400));
    renderer.setSize(w, h, false);
  };
  const renderOnce = () => { resize(); pose(clock.getElapsedTime(), 0.016); renderer.render(scene, camera); };
  const loop = () => {
    if (!running || disposed) return;
    const dt = Math.min(0.05, clock.getDelta());
    pose(clock.elapsedTime, dt);
    renderer.render(scene, camera);
    raf = requestAnimationFrame(loop);
  };
  const start = () => { if (running || !animate || disposed) return; running = true; clock.getDelta(); raf = requestAnimationFrame(loop); };
  const stop = () => { running = false; cancelAnimationFrame(raf); };

  const ro = new ResizeObserver(() => { resize(); if (!running) renderer.render(scene, camera); });
  ro.observe(host);
  const io = new IntersectionObserver((en) => (en[0].isIntersecting ? start() : stop()));
  io.observe(host);
  const onVis = () => (document.hidden ? stop() : io.takeRecords());
  document.addEventListener('visibilitychange', onVis);
  const onMove = (ev: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height * 0.3;
    ptr.x = Math.max(-1, Math.min(1, (ev.clientX - cx) / (innerWidth * 0.4)));
    ptr.y = Math.max(-1, Math.min(1, -(ev.clientY - cy) / (innerHeight * 0.4)));
    ptr.active = true;
  };
  if (animate) addEventListener('pointermove', onMove, { passive: true });

  renderOnce();

  return {
    canvas,
    renderOnce,
    setExpression(e) { target = e; if (!running) { st.happy = e === 'happy' ? 1 : 0; st.surprise = e === 'baby' ? 1 : 0; renderOnce(); } },
    dispose() {
      disposed = true; stop(); ro.disconnect(); io.disconnect();
      removeEventListener('pointermove', onMove); document.removeEventListener('visibilitychange', onVis);
      scene.traverse((x) => { const m = x as THREE.Mesh; if (m.geometry) m.geometry.dispose(); });
      Object.values(M).forEach((m) => m.dispose()); env.dispose(); pmrem.dispose(); renderer.dispose(); canvas.remove();
    },
  };
}
