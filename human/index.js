const head = new RigidBody({
    type: 'dynamic',
    position: { x: 0, y: 1.8, z: 0 }, // 頭の位置
});

const headShape = new Shape({
    geometry: { type: 'sphere', radius: 0.3 }, // 球体形状
    density: 1,
});
head.addShape(headShape);
world.addRigidBody(head);

const body = new RigidBody({
    type: 'dynamic',
    position: { x: 0, y: 1.2, z: 0 }, // 胴体の位置
});

const bodyShape = new Shape({
    geometry: { type: 'box', width: 0.5, height: 1.0, depth: 0.3 }, // ボックス形状
    density: 1,
});
body.addShape(bodyShape);
world.addRigidBody(body);

const joint = new Joint({
    body1: head,
    body2: body,
    anchor: { x: 0, y: 1.5, z: 0 }, // ジョイントの接続位置
    type: 'ball', // ボールジョイント
});
world.addJoint(joint);

// 腕の作成
const leftArm = new RigidBody({
    type: 'dynamic',
    position: { x: -0.5, y: 1.2, z: 0 },
});

const leftArmShape = new Shape({
    geometry: { type: 'box', width: 0.3, height: 0.8, depth: 0.3 },
    density: 1,
});
leftArm.addShape(leftArmShape);
world.addRigidBody(leftArm);

const armJoint = new Joint({
    body1: body,
    body2: leftArm,
    anchor: { x: -0.25, y: 1.2, z: 0 },
    type: 'hinge', // ヒンジジョイント
});
world.addJoint(armJoint);

head.applyForce({ x: 0, y: 10, z: 0 }); // 上方向に力を加える

function update() {
    const headPosition = head.getPosition();
    headMesh.position.set(headPosition.x, headPosition.y, headPosition.z);

    renderer.render(scene, camera);
    requestAnimationFrame(update);
}

