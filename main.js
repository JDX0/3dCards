import "./style.css";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
//import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';
import { FontLoader } from "three/src/loaders/FontLoader.js";
//import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  100,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.rotation.x = 0.1;
camera.position.z = 6;
function moveCamera() {
  const t = document.body.getBoundingClientRect().top;

  camera.position.y = t * 0.01;
}
document.body.onscroll = moveCamera;
moveCamera();

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas: document.querySelector("#bg"),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.render(scene, camera);

/*document.body.appendChild(renderer.domElement);
let controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 100;
controls.maxDistance = 500;
controls.maxPolarAngle = Math.PI / 2;*/

/*const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);
const ambientLight = new THREE.AmbientLight(0x223344);
scene.add(pointLight, ambientLight);*/

new RGBELoader()
  .setPath("static/images/backgrounds/")
  .load("1k.hdr", function (texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;

    scene.background = texture;
    scene.environment = texture;
  });
/*function addStar() {
  const geometry = new THREE.SphereGeometry(0.05, 8, 8);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}
Array(2000).fill().forEach(addStar);
*/
const pointer = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
const onMouseMove = (event) => {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);
  if (intersects.length > 0) {
    intersects[0].object.material.color.set(0xff0000);
    intersects[0].object.rotation.y += 0.025;
  }
};
const onClick = (event) => {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(scene.children);
  if (intersects.length > 0) {
    intersects[0].object.material.color.set(0x333333);
    console.log(intersects[0].object.name);
  }
  document.getElementById("cards").style.visibility = "hidden";
};
window.addEventListener("mousemove", onMouseMove);
window.addEventListener("click", onClick);

//const bgTexture = new THREE.TextureLoader().load("bg.png");
//scene.background = bgTexture;
scene.background = new THREE.Color(0x000000);

const gltfloader = new GLTFLoader().setPath("static/models/");
/*gltfloader.load("monster.gltf", function (gltf) {
  gltf.scene.traverse(function (child) {
    gltf.scene.getObjectByName("Sphere").name = "123";
    scene.add(gltf.scene.getObjectByName("123"));
  });
});*/
gltfloader.load("javaSphere.glb", function (gltf) {
  gltf.scene.traverse(function (child) {
    scene.add(gltf.scene.getObjectByName("Sphere"));
  });
});

const fnLoader = new FontLoader();

/*loader.load("fonts/Inter Medium_Regular.json", function (font) {
  const color = 0x00ddff;

  const matDark = new THREE.LineBasicMaterial({
    color: color,
    side: THREE.DoubleSide,
  });

  const matLite = new THREE.MeshBasicMaterial({
    color: color,
    transparent: true,
    opacity: 1,
    side: THREE.DoubleSide,
  });
  var schools = document.getElementsByClassName("text-gradient");
  var s123a = "";
  for (var index = 0; index < schools.length; index++) {
    s123a = s123a.concat("\n", schools[index].innerText);
  }
  console.log(s123a);
  const message = s123a;

  const shapes = font.generateShapes(message, 0.33);

  const geometry = new THREE.ShapeGeometry(shapes);

  geometry.computeBoundingBox();

  const xMid = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);

  geometry.translate(xMid, 0, 0);

  // make shape ( N.B. edge view not visible )

  const text = new THREE.Mesh(geometry, matLite);
  text.position.z = -0;
  scene.add(text);

  // make line shape ( N.B. edge view remains visible )

  const holeShapes = [];

  for (let i = 0; i < shapes.length; i++) {
    const shape = shapes[i];

    if (shape.holes && shape.holes.length > 0) {
      for (let j = 0; j < shape.holes.length; j++) {
        const hole = shape.holes[j];
        holeShapes.push(hole);
      }
    }
  }

  shapes.push.apply(shapes, holeShapes);

  const lineText = new THREE.Object3D();

  for (let i = 0; i < shapes.length; i++) {
    const shape = shapes[i];

    const points = shape.getPoints();
    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    geometry.translate(xMid, 0, -0.025);

    const lineMesh = new THREE.Line(geometry, matDark);
    lineText.add(lineMesh);
  }

  scene.add(lineText);
});*/

function loadCards() {
  var schools = document.getElementsByClassName("text-gradient");
  var logos = document.getElementsByClassName("skola-img");
  const color = 0xffffff;
  const distance = -7;
  var b = 0;
  for (var a = 0; a < schools.length; a++) {
    gltfloader.load("Card.glb", function (gltf) {
      gltf.scene.scale.set(2, 1.5, 1.5);
      gltf.scene.position.set(0, b * distance + 1.5, -0.6);
      console.log(b);
      scene.add(gltf.scene);
      b++;
    });
  }
  fnLoader.load("fonts/Inter Medium_Regular.json", function (font) {
    for (var index = 0; index < schools.length; index++) {
      //const Cgeometry = new THREE.BoxGeometry(20, 2, 1);
      //const Cmaterial = new THREE.MeshLambertMaterial({ color: 0xaaaaaa });
      //const mesh = new THREE.Mesh(Cgeometry, Cmaterial);
      //mesh.position.y = index * distance;
      //mesh.position.z = -0.6;
      //scene.add(mesh);
      //const logoTexture = new THREE.TextureLoader().load("static/images/logos/oazlin.jpg");
      const txLoader = new THREE.TextureLoader();
      var i = 0;
      txLoader.load(logos[index].src, function (tx) {
        const width = (tx.image.width / tx.image.height) * 3;
        const height = 3;
        const logoGeometry = new THREE.PlaneGeometry(width, height);
        logoGeometry.translate(0, 2.5, 0.5);
        const logoMaterial = new THREE.MeshBasicMaterial({
          map: tx,
          transparent: true,
        });
        const logoMesh = new THREE.Mesh(logoGeometry, logoMaterial);
        logoMesh.position.y = i * distance;
        logoMesh.position.z = -0.6;
        scene.add(logoMesh);

        i += 1;
      });
      const lineLength = 32;
      var t = schools[index].innerText
      t = t.split(' ');
      var count = 0;
      var tCard = t[0];
      for(var v = 1; v<t.length; v++) {
        count += t[v].length
        if(count > lineLength) {
          count = t[v].length;
          tCard = tCard + '\n' + t[v];
        } else {
          tCard = tCard + ' ' + t[v];
        }
      }
      const messageCard = tCard;
      tCard = '';
      const matDark = new THREE.LineBasicMaterial({
        color: color,
        side: THREE.DoubleSide,
      });

      const matLite = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 1,
        side: THREE.DoubleSide,
      });
      const shapes = font.generateShapes(messageCard, 0.33);

      const geometry = new THREE.ShapeGeometry(shapes);

      geometry.computeBoundingBox();

      const xMid =
        -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);

      geometry.translate(xMid, index * distance, 0);

      // make shape ( N.B. edge view not visible )

      const text = new THREE.Mesh(geometry, matLite);
      text.position.z = -0;
      scene.add(text);

      // make line shape ( N.B. edge view remains visible )
/*
      const holeShapes = [];

      for (let i = 0; i < shapes.length; i++) {
        const shape = shapes[i];

        if (shape.holes && shape.holes.length > 0) {
          for (let j = 0; j < shape.holes.length; j++) {
            const hole = shape.holes[j];
            holeShapes.push(hole);
          }
        }
      }

      shapes.push.apply(shapes, holeShapes);

      const lineText = new THREE.Object3D();

      for (let i = 0; i < shapes.length; i++) {
        const shape = shapes[i];

        const points = shape.getPoints();
        const geometry = new THREE.BufferGeometry().setFromPoints(points);

        geometry.translate(xMid, index * distance, -0.025);

        const lineMesh = new THREE.Line(geometry, matDark);
        lineText.add(lineMesh);
      }

      scene.add(lineText);*/
    }
  });
}
loadCards();

window.addEventListener("resize", onWindowResize);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  //scene.getObjectByName('123').rotation.x += 0.1;
  try{
    scene.getObjectByName('Sphere').rotateY(0.02);
  } catch(err) {}
  requestAnimationFrame(animate);
  //controls.update();
  renderer.render(scene, camera);
}

animate();
