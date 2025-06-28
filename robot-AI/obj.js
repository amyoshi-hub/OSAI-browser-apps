import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.0/build/three.module.js';

export function create_obj() {
    // カスタムジオメトリの作成
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array([
        0, 1, 0,   // 頂点1 (頂点)
       -1, -1, 1,  // 頂点2 (左下手前)
        1, -1, 1,  // 頂点3 (右下手前)

        0, 1, 0,   // 頂点1 (頂点)
        1, -1, 1,  // 頂点3 (右下手前)
        1, -1, -1, // 頂点4 (右下奥)

        0, 1, 0,   // 頂点1 (頂点)
        1, -1, -1, // 頂点4 (右下奥)
       -1, -1, -1, // 頂点5 (左下奥)

        0, 1, 0,   // 頂点1 (頂点)
       -1, -1, -1, // 頂点5 (左下奥)
       -1, -1, 1   // 頂点2 (左下手前)
    ]);
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

    // マテリアルを作成（色付け）
    const material = new THREE.MeshBasicMaterial({ color: 0xff6347, wireframe: false });

    // メッシュを作成
    const mesh = new THREE.Mesh(geometry, material);

    // 作成したオブジェクトを返す
    return mesh;
}

