import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.0/build/three.module.js';

export class Rigidbody {
  constructor(three, mass = 1, length = 1) {
    this.mass = mass;
    this.g = 9.8;
    this.position = new THREE.Vector3();
    this.velocity = new THREE.Vector3();
    this.acceleration = new THREE.Vector3();
    this.externalForce = new THREE.Vector3();

    this.length = length;
    this.angle = 50;
    this.angularVelocity = 0;
    this.angularAcceleration = 0;
  }

  applyGravity(dt) {
    const gravityForce = new THREE.Vector3(0, -this.g * this.mass, 0);
    const totalForce = gravityForce.add(this.externalForce.clone());
    this.acceleration.copy(totalForce.divideScalar(this.mass));
    this.velocity.addScaledVector(this.acceleration, dt);
    this.position.addScaledVector(this.velocity, dt);
    this.externalForce.set(0, 0, 0);

    if (this.isGrounded && this.velocity.y < 0) {
      this.velocity.set(0, 0, 0);
    }
  }

  applyRotation(dt) {
    const torque = -this.mass * this.g * (this.length / 2) * Math.sin(this.angle);
    const I = (1 / 3) * this.mass * Math.pow(this.length, 2);
    this.angularAcceleration = torque / I;
    this.angularVelocity += this.angularAcceleration * dt;
    this.angle += this.angularVelocity * dt;
    this.angularVelocity *= 0.999;
    //console.log("angle:", this.angle, "ω:", this.angularVelocity, "α:", this.angularAcceleration);

  }
  setGrounded(flag) {
  this.isGrounded = flag;
  }


  applyForce(force) {
    this.externalForce.add(force);
  }
}

