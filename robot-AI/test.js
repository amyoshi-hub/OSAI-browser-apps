// 基本的なThree.jsのセットアップ
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// ジオメトリ、マテリアル、メッシュの作成
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

let then = 0;

// アニメーションループ
function render(now) {
  now *= 0.001; // 秒に変換
  const deltaTime = now - then;
  then = now;

  cube.rotation.x += deltaTime;
  cube.rotation.y += deltaTime;

  renderer.render(scene, camera);

  requestAnimationFrame(render);
}
requestAnimationFrame(render);

