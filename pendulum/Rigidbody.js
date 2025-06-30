import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.0/build/three.module.js';

export class Rigidbody {
  constructor(mass = 1, length = 1) {
    this.mass = mass;
    this.g = 9.8;
    this.position = new THREE.Vector3(); // 物体の位置
    this.velocity = new THREE.Vector3(); // 線速度
    this.acceleration = new THREE.Vector3(); // 線加速度
    this.externalForce = new THREE.Vector3(); // 外力

    // 回転運動関連
    this.angle = 0; // 角度（ラジアン）
    this.angularVelocity = 0; // 角速度
    this.angularAcceleration = 0; // 角加速度
    this.length = length; // 棒の長さ
  }

  applyGravity(dt) {
    const gravityForce = new THREE.Vector3(0, -this.g * this.mass, 0); // 重力
    const totalForce = gravityForce.add(this.externalForce.clone());
    this.acceleration.copy(totalForce.divideScalar(this.mass)); // 線加速度
    this.velocity.addScaledVector(this.acceleration, dt); // 速度更新
    this.position.addScaledVector(this.velocity, dt); // 位置更新
    this.externalForce.set(0, 0, 0); // 外力リセット
    if (this.position.y < 0) {
      this.position.y = 0;
      this.velocity.set(0, 0, 0); // 地面で静止
    }
  }

  applyRotation(dt) {
    // トルクを計算（重力が棒の中心で生むモーメント）
    const torque = -this.mass * this.g * (this.length / 2) * Math.sin(this.angle);

    // 慣性モーメント (1/3) * m * L^2
    const I = (1 / 3) * this.mass * Math.pow(this.length, 2);

    // 角加速度 = トルク / 慣性モーメント
    this.angularAcceleration = torque / I;

    // 角速度と角度を更新
    this.angularVelocity += this.angularAcceleration * dt;
    this.angle += this.angularVelocity * dt;

    // 減衰（摩擦のような効果）
    this.angularVelocity *= 0.99;
  }

  applyForce(force) {
    this.externalForce.add(force); // 外力を加算
  }
}
