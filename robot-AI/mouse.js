import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.0/build/three.module.js';
import { create_obj } from './obj.js';
import { generateCubes } from "./map.js";
import { setupRaycaster } from "./raycast.js";
import { Robot } from "./robot.js";

// 基本的なThree.jsのセットアップ
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//raycaster
setupRaycaster(camera, scene);

const texture = new THREE.TextureLoader().load('texture/texture2.jpg');
texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set(1, 1); // テクスチャの繰り返し数

// 地面の作成
const planeGeometry = new THREE.PlaneGeometry(200, 200, 10, 10);
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x808080, side: THREE.DoubleSide });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.name = "ground";
//planeMaterial.map = texture;
scene.add(plane);

for (let i = 0; i < 20; i++) {
    const obstacleGeometry = new THREE.BoxGeometry(2, 2, 2);
    const obstacleMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff });
    const obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
    obstacle.position.set(
        Math.random() * 50 - 25,
        1,
        Math.random() * 50 - 25
    );
    scene.add(obstacle);
}

//Map
const map = [
  [0, 0, 0, 0, 1],
  [0, 0, 0, 0, 1],
  [0, 0, 0, 0, 1],
];

generateCubes(map, scene, texture);

//cube
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
cube.position.set(10, 0.5, 0); // キューブを地面の上に配置
material.map = texture;
scene.add(cube);

const customObject = create_obj();
scene.add(customObject);

// 環境光の追加
const light = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(light);

// カメラ初期位置
camera.position.set(0, 10, 5);
camera.rotation.order = "YXZ";

//Robot
const robot = new Robot(scene, {x: 0, y: 0, z: 0});
//r_go(robot);
//degub
function updateCamera() {
    camera.position.lerp(
        new THREE.Vector3(robot.mesh.position.x, robot.mesh.position.y + 5, robot.mesh.position.z + 10),
        0.1
    );
    camera.lookAt(robot.mesh.position);
}

/*
function animateRobot() {
    robot.walk(robotDirection);

    // 条件に応じて方向を変更（例: 境界に達した場合）
    if (robot.mesh.position.z < -10) {
        robotDirection = 'back';
    } else if (robot.mesh.position.z > 10) {
        robotDirection = 'forward';
    }

    if (robot.mesh.position.x < -10) {
        robotDirection = 'right';
    } else if (robot.mesh.position.x > 10) {
        robotDirection = 'left';
    }
}
*/

// FPS用マウス操作の変数
let cameraRotationX = 0;
let cameraRotationY = 0;
let isPointerLocked = false;

// Pointer Lock APIの設定
document.body.addEventListener("click", () => {
  renderer.domElement.requestPointerLock();
});

document.addEventListener("pointerlockchange", () => {
  isPointerLocked = document.pointerLockElement === renderer.domElement;
  if (!isPointerLocked) {
    //console.log("マウスロックが解除されました");
  }
});

// マウスイベントリスナー
document.addEventListener("mousemove", (e) => {
  if (!isPointerLocked) return;

  const deltaX = e.movementX || 0;
  const deltaY = e.movementY || 0;

  cameraRotationY -= deltaX * 0.002;
  cameraRotationX -= deltaY * 0.002;

  cameraRotationX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, cameraRotationX));

  camera.rotation.y = cameraRotationY;
  camera.rotation.x = cameraRotationX;
});

// WASD移動関連
const movementSpeed = 0.1;
const keysPressed = {};

document.addEventListener("keydown", (e) => {
  keysPressed[e.key.toLowerCase()] = true;
});
document.addEventListener("keyup", (e) => {
  keysPressed[e.key.toLowerCase()] = false;
});

const groundLevel = 1.2; // カメラが立つ基準のY座標
const gravity = 1;   // 重力の加速度
let verticalSpeed = 0;  // カメラの上下速度

function applyGravityAndLimit(deltaTime) {
  if (camera.position.y > groundLevel) {
    // 地面より上なら重力を適用
    verticalSpeed -= gravity * deltaTime;
  } else {
    // 地面より下に行かないように制限
    camera.position.y = groundLevel;
    verticalSpeed = 0; // 地面に触れたら速度をリセット
  }

  // カメラのY座標を更新
  camera.position.y += verticalSpeed * deltaTime;
}

function move() {
  //console.log("move");
  const forwardSpeed = keysPressed["w"] ? movementSpeed : keysPressed["s"] ? -movementSpeed : 0;
  const strafeSpeed = keysPressed["a"] ? movementSpeed : keysPressed["d"] ? -movementSpeed : 0;

  const forward = new THREE.Vector3();
  camera.getWorldDirection(forward);

  const right = new THREE.Vector3();
  right.crossVectors(camera.up, forward).normalize();

  const move_vec = new THREE.Vector3();
  move_vec.addScaledVector(forward, forwardSpeed);
  move_vec.addScaledVector(right, strafeSpeed);

  // カメラの水平方向の移動を適用
  camera.position.add(move_vec);
}

function render() {
  //console.log("start");
  robot.walk(new THREE.Vector3(0, 0, -1)); // 引数に適切な方向を渡す
  const deltaTime = 0.03;
  if (isPointerLocked) {
    //console.log(`Camera Y Position: ${camera.position.y}`); // カメラの高さを出力
    move();
    applyGravityAndLimit(deltaTime);
    updateCamera();
  }
  //console.log(camera.position.y);

  // レンダリング
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

requestAnimationFrame(render);
