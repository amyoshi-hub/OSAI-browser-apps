import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.0/build/three.module.js';

export class Robot {
    constructor(scene, position = { x: 0, y: 0, z: 0 }) {
        this.size = 1;
        this.scene = scene;

        // ロボットの体
        const geometry = new THREE.BoxGeometry(this.size, this.size * 2, this.size);
        const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(position.x, position.y + this.size, position.z);
        scene.add(this.mesh);

        // 移動速度
        this.speed = { x: 0.1, z: 0.1 };

        // A地点の位置と報酬範囲
        this.targetPoint = new THREE.Vector3(100, 1, 10); // A地点
        this.rewardThreshold = 1.0; // 報酬を与える距離
        this.preventDistance = null; // 前回の距離

        this.raycaster = new THREE.Raycaster();
        this.direction = new THREE.Vector3(0, 0, -1);
    }

    walk() {
	console.log(`現在の方向: ${this.direction.toArray()}`); // 現在の方向を出力
	const direction = this.direction;
        const targets = this.scene.children.filter(
            obj => obj !== this.mesh && obj.name !== "ground" && obj.isMesh
        );

        const startPosition = this.mesh.position.clone().add(new THREE.Vector3(0, this.size * 0.5, 0));
        this.raycaster.set(startPosition, direction);
        const intersects = this.raycaster.intersectObjects(targets, true);

        // 障害物検知
        if (intersects.length > 0 && intersects[0].distance < this.size + 0.01) {
            console.log(`障害物検知: ${direction.toArray()}, 距離: ${intersects[0].distance}`);
            this.changeDirection();
            return;
        }

        // 初回または移動前の距離を記録
        if (this.preventDistance === null) {
            this.preventDistance = this.mesh.position.distanceTo(this.targetPoint);
        }

        // 障害物がなければ移動
        this.mesh.position.addScaledVector(direction, this.speed.z);
        console.log("前進中:", this.mesh.position.toArray());

        // 報酬チェック
        if (this.checkReward()){
		this.changeDirection();	
		console.log("あなたに近づきたい");
	}
    }

   checkReward() {
    const distanceToTarget = this.mesh.position.distanceTo(this.targetPoint);
    console.log(`現在地とA地点の距離: ${distanceToTarget.toFixed(2)}`);
    console.log(distanceToTarget);

    if (distanceToTarget < this.rewardThreshold) {
        console.log("報酬獲得！ A地点に到達しました！");
        this.handleReward();
        this.preventDistance = distanceToTarget; // 更新
	this.speed = {x: 0, z: 0};
	
        return; // もう方向変えなくて良い
    }

    if (this.preventDistance === null) {
        this.preventDistance = distanceToTarget; // 初期値セット
        return false;
    }

    if (distanceToTarget < this.preventDistance) {
        console.log("A地点に近づいています。その調子です！");
        this.preventDistance = distanceToTarget; // 更新
        return false; // 方向変えない
    } else {
        console.log("A地点から離れています。方向を修正してください！");
        this.preventDistance = distanceToTarget; // 更新
        return true; // 方向変えたい
    }
} 

    handleReward() {
        console.log("報酬処理を実行中...");
        // 例: ポイント加算やフラグ更新
    }

    changeDirection() {
    const possibleDirections = [
        new THREE.Vector3(0, 0, -1), // 前
        new THREE.Vector3(1, 0, 0),  // 右
        new THREE.Vector3(-1, 0, 0), // 左
        new THREE.Vector3(0, 0, 1),  // 後ろ
    ];

    // ランダムに方向を選択
    const randomIndex = Math.floor(Math.random() * possibleDirections.length);
    const randomDirection = possibleDirections[randomIndex];

    console.log(`ランダムな方向に変更: ${randomDirection.toArray()}`);
    this.direction.copy(randomDirection);
}

}

