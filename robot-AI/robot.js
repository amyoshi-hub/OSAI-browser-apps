import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.0/build/three.module.js';

export class Robot {
    constructor(scene, position = { x: 0, y: 0, z: 0 }) {
        this.size = 1;
        this.scene = scene;

        const geometry = new THREE.BoxGeometry(this.size, this.size * 2, this.size);
        const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(position.x, position.y + this.size, position.z);
        scene.add(this.mesh);

        this.speed = { x: 0.1, z: 0.1 };
        this.raycaster = new THREE.Raycaster();
        this.direction = new THREE.Vector3(0, 0, -1);
    }

    walk(direction = this.direction) {
    const targets = this.scene.children.filter(
        obj => obj !== this.mesh && obj.name !== "ground" && obj.isMesh
    );

    const startPosition = this.mesh.position.clone().add(new THREE.Vector3(0, this.size * 0.5, 0));

    this.raycaster.set(startPosition, direction);
    const intersects = this.raycaster.intersectObjects(targets, true);

    if (intersects.length > 0 && intersects[0].distance < this.size + 1.5) {
        console.log(`障害物検知: ${direction.toArray()}, 距離: ${intersects[0].distance}`);
        this.changeDirection(); // 適切な回避動作
        return; // 障害物を検知したら終了
    }

    // 障害物がなければ前進
    this.mesh.position.addScaledVector(direction, this.speed.z);
    console.log("前進中:", this.mesh.position.toArray());
}

    changeDirection() {
        const possibleDirections = [
            new THREE.Vector3(0, 0, -1),
            new THREE.Vector3(1, 0, 0),
            new THREE.Vector3(-1, 0, 0),
        ];

        let maxDistance = 0;
        let bestDirection = this.direction;

        for (let dir of possibleDirections) {
            this.raycaster.set(this.mesh.position, dir);
            const intersects = this.raycaster.intersectObjects(this.scene.children, true);

            if (intersects.length === 0 || intersects[0].distance > maxDistance) {
                maxDistance = intersects.length > 0 ? intersects[0].distance : Infinity;
                bestDirection = dir;
            }
        }
        this.direction.copy(bestDirection);
    }
}

