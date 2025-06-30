import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.0/build/three.module.js';
import { Rigidbody } from './Rigidbody.js';

let pivot;
let scene, camera, renderer;
let rod;
const dt = 0.016;

function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 1, 5);
  camera.lookAt(0, 0, 0);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const grid = new THREE.GridHelper(10, 10);
  scene.add(grid);

  pivot = new THREE.Object3D();
  scene.add(pivot);

  // 物体を作成
  rod = new Rigidbody(1); // 質量 1
  rod.mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 0.1, 0.1),
    new THREE.MeshNormalMaterial()
  );
rod.mesh.position.set(rod.length / 2 || 0.5, 0, 0);

pivot.add(rod.mesh);

// pivotを支点の位置にセット
pivot.position.copy(rod.position);
  rod.position.set(0, 1, 0); // 初期位置
  scene.add(rod.mesh);

  rod.mesh.position.set(rod.length / 2, 0, 0);

  // meshはpivotの子に追加（支点回転のため）
  pivot.add(rod.mesh);

  // 支点の初期位置
  rod.position.set(0, 1, 0);
  pivot.position.copy(rod.position);


  // マウスクリックで「つんつん」
  window.addEventListener('click', () => {
    const force = new THREE.Vector3(0, 50, 0); // 上方向に力を加える
    rod.applyForce(force);
  });

  animate();
}

function animate() {
  requestAnimationFrame(animate);

  // 重力と外力を適用
  rod.applyGravity(dt);
  rod.applyRotation(dt);

  pivot.rotation.z = rod.angle;

  // メッシュの更新
  rod.mesh.position.copy(rod.position);
  rod.mesh.rotation.z = rod.angle; // 角度を反映

  renderer.render(scene, camera);
}


init();
