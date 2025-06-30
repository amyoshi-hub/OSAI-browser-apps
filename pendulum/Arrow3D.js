export class Arrow3D {
  constructor(THREE, headWidth, headLength, bodyWidth, color) {
    this.THREE = THREE;
    this.headLength = headLength;

    this.arrowHead = new THREE.Mesh(
      new THREE.CylinderGeometry(0, headWidth, headLength, 50, 50),
      new THREE.MeshPhongMaterial({ color: color, specular: 0xffffff, shininess: 250 })
    );
    this.arrowHead.position.set(0, headLength / 2, 0);

    this.arrowBody = new THREE.Mesh(
      new THREE.CylinderGeometry(bodyWidth, bodyWidth, 1, 50, 50),
      new THREE.MeshPhongMaterial({ color: color, specular: 0xffffff, shininess: 250 })
    );
    this.arrowBody.scale.set(1, headLength, 1);

    this.CG = new THREE.Object3D();
    this.CG.add(this.arrowBody);
    this.CG.add(this.arrowHead);
  }

  setArrowBottomToTop(bottom, top) {
    const L = new this.THREE.Vector3().subVectors(top, bottom);
    const R = new this.THREE.Vector3().addVectors(top, bottom).multiplyScalar(0.5);

    this.arrowBody.scale.set(1, L.length() - this.headLength, 1);
    this.arrowBody.position.set(0, (L.length() - this.headLength) / 2, 0);
    this.arrowHead.position.set(0, L.length() - this.headLength / 2, 0);
    this.CG.position.copy(R);

    const V1 = new this.THREE.Vector3(0, 1, 0);
    const V2 = L.clone().normalize();
    const V3 = new this.THREE.Vector3().crossVectors(V1, V2);
    const cosTheta = V1.dot(V2);

    if (Math.abs(V3.length()) > 0.001) {
      const theta = Math.acos(cosTheta);
      const q = new this.THREE.Quaternion().setFromAxisAngle(V3.normalize(), theta);
      this.CG.quaternion.copy(q);
    }
  }

  setVisible(visible) {
    this.arrowHead.visible = visible;
    this.arrowBody.visible = visible;
  }
}

