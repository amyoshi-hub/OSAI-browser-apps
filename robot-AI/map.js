import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.0/build/three.module.js';

export function generateCubes(map, scene, texture){


const cubeSize = 1; // 各立方体のサイズ
const material = new THREE.MeshBasicMaterial({ map: texture });

for (let x = 0; x < map.length; x++) {
  for (let z = 0; z < map[x].length; z++) {
    const height = map[x][z]; // マップデータの高さ
    if (height > 0) {
      for (let y = 0; y < height; y++) {
        const geometry = new THREE.BoxGeometry(cubeSize, cubeSize * 2, cubeSize);
        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(
          x * cubeSize,
          y * cubeSize + cubeSize / 2,
          z * cubeSize
        ); // 位置を設定
        scene.add(cube);
      }
    }
  }
}
}
