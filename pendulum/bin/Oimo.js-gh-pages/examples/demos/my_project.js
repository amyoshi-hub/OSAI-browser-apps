// THREE.js の初期化
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 20, 50);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(10, 20, 10);
scene.add(light);

// ボーンの定義
var bones = [
    { name: 'head', parent: null, position: [0, 10, 0], rotation: [0, 0, 0] },
    { name: 'left_arm', parent: 'head', position: [1, 8, 0], rotation: [0, 0, 0] },
    { name: 'right_arm', parent: 'head', position: [-1, 8, 0], rotation: [0, 0, 0] },
    { name: 'body', parent: 'head', position: [0, 6, 0], rotation: [0, 0, 0] },
    { name: 'right_leg', parent: 'body', position: [1, 4, 0], rotation: [0, 0, 0] },
    { name: 'left_leg', parent: 'body', position: [-1, 4, 0], rotation: [0, 0, 0] },
];

// OIMO.js の初期化
var world = new OIMO.World({
    timestep: 1 / 60,
    iterations: 8,
    broadphase: 2,
    worldscale: 1,
    random: true,
    info: true
});

var bodys = [];
bones.forEach((bone) => {
    var body = world.add({
        type: 'box',
        size: [1, 2, 1],
        pos: bone.position,
        move: true,
        density: 0.5,
        restitution: 0.3,
        kinematic: false,
    });
    bodys.push(body);
});

// メッシュを追加
bones.forEach((bone) => {
    var geometry = new THREE.BoxGeometry(1, 2, 1);
    var material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    var mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(...bone.position);
    mesh.name = bone.name;
    scene.add(mesh);
});

// demo 関数の定義
function demo() {
    console.log("Demo function executed.");

    // THREE.js と OIMO.js の統合
    world.postLoop = () => {
        bodys.forEach((body, index) => {
            var position = body.getPosition();
            var quaternion = body.getQuaternion();

            var mesh = scene.getObjectByName(bones[index].name);
            if (mesh) {
                mesh.position.set(position.x, position.y, position.z);
                mesh.quaternion.set(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
            }
        });
        renderer.render(scene, camera);
    };

    // OIMO.js ワールドの開始
    world.play();
}

// demo をグローバルスコープに登録
window.demo = demo;

// アニメーションループの開始
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

// demo 関数の呼び出し
if (typeof window.demo === "function") {
    window.demo();
} else {
    console.error("window.demo is not defined");
}

