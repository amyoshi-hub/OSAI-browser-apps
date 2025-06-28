import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.0/build/three.module.js';

export function setupRaycaster(camera, scene) {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  // マウスクリックイベント
  function onMouseClick(event) {
    // マウス座標を正規化(-1 ~ 1)に変換
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // カメラからの光線を更新
    raycaster.setFromCamera(mouse, camera);

    // シーン内のオブジェクトと交差を判定
    const intersects = raycaster.intersectObjects(scene.children);

    // 交差があった場合の処理
    if (intersects.length > 0) {
      const intersectedObject = intersects[0].object;
      //intersectedObject.material.color.set(0xff0000); // 色を赤に変更
      console.log("Hit:", intersectedObject);
    }
  }

  // クリックイベントリスナーを設定
  window.addEventListener("click", onMouseClick);
}

