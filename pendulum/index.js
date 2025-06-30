import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.0/build/three.module.js';
import { Arrow3D } from './Arrow3D.js';

let body, scene, camera, renderer, arrow;

function init() {
  // シーン作成
  scene = new THREE.Scene();

  // カメラ設定
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 3, 3);
  camera.lookAt(0, 0, 0);

  // レンダラー設定
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // 環境光
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  // グリッド
  const grid = new THREE.GridHelper(10, 10);
  scene.add(grid);

  // ボディ作成と追加（ここで `scene.add` を実行）
  const bodyGeometry = new THREE.BoxGeometry(1, 2, 1);
  const bodyMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  	body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  scene.add(body);

  // 矢印作成
  arrow = new Arrow3D(THREE, 0.1, 0.2, 0.05, 0x00ff00);
  arrow.setArrowBottomToTop(new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 1, 0));
  body.add(arrow.CG);

  // リサイズイベント
  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });

  animate();
}

function animate() {

  requestAnimationFrame(animate);
  const time = Date.now() * 0.001;
  body.position.y = Math.sin(time) * 2;
  arrow.setArrowBottomToTop(
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(Math.sin(time), 0.5, Math.cos(time))
  );

  renderer.render(scene, camera);
}

// 初期化関数の呼び出し
init();

