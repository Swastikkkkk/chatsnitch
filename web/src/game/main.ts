// Deterministic endless runner for split-screen reels. window.renderAt(t) draws the frame at time t.
import * as THREE from "three";

const W = 1080, H = 960;
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(1); renderer.setSize(W, H);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color("#07070c");
scene.fog = new THREE.Fog("#07070c", 40, 140);
const cam = new THREE.PerspectiveCamera(62, W / H, 0.1, 400);

// seeded RNG so every render is identical
let seed = 1337; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

const LANES = [-3.2, 0, 3.2];
const speedAt = (t: number) => 26 + t * 1.1;                 // units/s, slowly accelerating
const distAt = (t: number) => 26 * t + 0.55 * t * t;          // integral of speed

// track: glowing lane lines + floor
const floor = new THREE.Mesh(new THREE.PlaneGeometry(12, 2000), new THREE.MeshStandardMaterial({ color: "#0d0d18", roughness: 0.9 }));
floor.rotation.x = -Math.PI / 2; floor.position.z = -900; scene.add(floor);
const lineMat = new THREE.MeshBasicMaterial({ color: "#5ee7ff" });
for (const x of [-4.8, -1.6, 1.6, 4.8]) {
  const l = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.02, 2000), lineMat); l.position.set(x, 0.01, -900); scene.add(l);
}
// side pillars for speed feel
const pillarGeo = new THREE.BoxGeometry(0.5, 6, 0.5);
const pillarMats = [new THREE.MeshBasicMaterial({ color: "#7c5cff" }), new THREE.MeshBasicMaterial({ color: "#2ee6a6" })];
const pillars: THREE.Mesh[] = [];
for (let i = 0; i < 90; i++) { for (const s of [-1, 1]) { const p = new THREE.Mesh(pillarGeo, pillarMats[i % 2]); p.position.set(s * 8, 3, -i * 12); scene.add(p); pillars.push(p); } }

// cross stripes on the floor: they rush past and sell the speed
const stripeMat = new THREE.MeshBasicMaterial({ color: "#1d2a44" });
for (let i = 0; i < 400; i++) { const st = new THREE.Mesh(new THREE.BoxGeometry(9.6, 0.015, 0.35), stripeMat); st.position.set(0, 0.012, -i * 5); scene.add(st); }
scene.add(new THREE.HemisphereLight("#9fb4ff", "#0b0b14", 0.9));
const dl = new THREE.DirectionalLight("#ffffff", 1.4); dl.position.set(4, 10, 6); scene.add(dl);

// obstacles in rows; each row leaves one free lane. Orbs sit in free lanes.
type Row = { z: number; blocked: number[]; free: number };
const rows: Row[] = [];
let z = 60;
for (let i = 0; i < 120; i++) {
  z += 18 + rnd() * 10;
  const free = Math.floor(rnd() * 3);
  const blocked = [0, 1, 2].filter((l) => l !== free && rnd() < 0.85);
  rows.push({ z, blocked, free });
}
const obsGeo = new THREE.BoxGeometry(2.4, 2.4, 2.4);
const obsMat = new THREE.MeshStandardMaterial({ color: "#ff4fd8", emissive: "#6a1a5c", roughness: 0.35, metalness: 0.2 });
const orbGeo = new THREE.IcosahedronGeometry(0.55, 1);
const orbMat = new THREE.MeshBasicMaterial({ color: "#ffe066" });
const obs: { m: THREE.Mesh; z: number }[] = [];
const orbs: { m: THREE.Mesh; z: number; lane: number }[] = [];
for (const r of rows) {
  for (const l of r.blocked) { const m = new THREE.Mesh(obsGeo, obsMat); m.position.set(LANES[l], 1.2, -r.z); scene.add(m); obs.push({ m, z: r.z }); }
  const o = new THREE.Mesh(orbGeo, orbMat); o.position.set(LANES[r.free], 1.2, -(r.z - 0)); scene.add(o); orbs.push({ m: o, z: r.z, lane: r.free });
}

// player: glowing cube with trail
const player = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.4, 1.4), new THREE.MeshStandardMaterial({ color: "#5ee7ff", emissive: "#1a6d80", roughness: 0.2, metalness: 0.3 }));
scene.add(player);
const trail: THREE.Mesh[] = [];
for (let i = 0; i < 14; i++) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.1, 1.1), new THREE.MeshBasicMaterial({ color: "#5ee7ff", transparent: true, opacity: 0.35 * (1 - i / 14) }));
  scene.add(m); trail.push(m);
}
// burst particles when an orb is collected
const burstGeo = new THREE.SphereGeometry(0.12, 6, 6);
const bursts: THREE.Mesh[][] = orbs.map(() => { const arr: THREE.Mesh[] = []; for (let i = 0; i < 12; i++) { const b = new THREE.Mesh(burstGeo, orbMat); b.visible = false; scene.add(b); arr.push(b); } return arr; });

// lane the player is in at distance d: switch smoothly before each row to its free lane
function laneX(d: number) {
  let prev = 1;
  for (const r of rows) {
    const start = r.z - 14, end = r.z - 5;          // lane change window before the row
    if (d < start) return LANES[prev];
    if (d < end) { const k = (d - start) / (end - start); const e = k * k * (3 - 2 * k); return LANES[prev] + (LANES[r.free] - LANES[prev]) * e; }
    prev = r.free;
  }
  return LANES[prev];
}
function hopY(d: number) {  // small hop on each lane change
  for (const r of rows) { const s = r.z - 14, e = r.z - 5; if (d >= s && d < e) { const k = (d - s) / (e - s); return Math.sin(k * Math.PI) * 1.4; } if (d < s) break; }
  return 0;
}

(window as any).renderAt = (t: number) => {
  const d = distAt(t);
  const x = laneX(d), y = 0.7 + hopY(d);
  player.position.set(x, y, -d);
  player.rotation.x = -d * 0.25; player.rotation.z = (x - laneX(d - 1)) * -0.6;
  trail.forEach((m, i) => { const dd = d - (i + 1) * 0.9; m.position.set(laneX(dd), 0.7 + hopY(dd), -dd); m.rotation.copy(player.rotation); });
  cam.position.set(x * 0.55, 6.8, -d + 9.5);
  cam.lookAt(x * 0.3, 0.4, -d - 7);
  cam.fov = 62 + Math.min(12, (speedAt(t) - 26) * 0.6); cam.updateProjectionMatrix();
  orbs.forEach((o, i) => {
    const collected = d > o.z;
    o.m.visible = !collected;
    o.m.rotation.y = t * 3 + i; o.m.position.y = 1.2 + Math.sin(t * 5 + i) * 0.2;
    const age = (d - o.z) / speedAt(t);
    bursts[i].forEach((b, j) => {
      const on = collected && age < 0.45;
      b.visible = on;
      if (on) { const a = (j / 12) * Math.PI * 2; const r = age * 9; b.position.set(LANES[o.lane] + Math.cos(a) * r, 1.2 + Math.sin(a) * r * 0.7, -o.z); }
    });
  });
  renderer.render(scene, cam);
};
(window as any).gameReady = true;
(window as any).renderAt(0);
