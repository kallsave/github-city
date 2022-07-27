import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import {
  ENVIRONMENT_ANIMATED_ASSET,
  ENVIRONMENT_ASSET,
  ENVIRONMENT_OBJECTS_ASSET,
  FLOOR_HEIGHT,
  GRASS_ASSET,
  ROAD_TYPES,
  TREES_SMALL,
} from "./constants";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

console.log(ENVIRONMENT_OBJECTS_ASSET)

const loader = new GLTFLoader();

export function createScene() {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    400,
  );
  camera.position.set(0, 30, 51);

  const renderer = new THREE.WebGLRenderer({
    powerPreference: "high-performance",
    antialias: true,
    depth: true,
    canvas: document.querySelector("#bg"),
  });

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.render(scene, camera);

  setupLighting(scene);
  setupEnvironment(scene);
  const controls = createControls(camera, renderer);

  const clock = new THREE.Clock();

  function animate() {
    const delta = clock.getDelta();

    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }

  animate();

  return { scene }
}

// Create and configure lighting in the scene
function setupLighting(scene) {
  // Ambient lighting
  const ambientLight = new THREE.AmbientLight(0x9ad0ec, 0.7);
  // const ambientLight = new THREE.AmbientLight(0x9AD0EC, 1);
  scene.add(ambientLight);

  // Directional lighting and shadows
  const directionLight = new THREE.DirectionalLight(0xe9b37c);
  directionLight.position.set(-50, 50, -20);
  directionLight.castShadow = true;
  directionLight.shadow.mapSize.x = 768;
  directionLight.shadow.mapSize.y = 768;
  directionLight.shadow.camera.near = 15;
  directionLight.shadow.camera.far = 150.0;
  directionLight.shadow.camera.right = 75;
  directionLight.shadow.camera.left = -75;
  directionLight.shadow.camera.top = 75;
  directionLight.shadow.camera.bottom = -75;
  scene.add(directionLight);
}

function setupEnvironment(scene) {
  const sceneBackground = new THREE.Color(0x9ad0ec);
  scene.background = sceneBackground;

  const position = new THREE.Vector3(0, -4, 0);

  // Render environment (ground)
  loader.load(`./assets/${ENVIRONMENT_ASSET}`, function (gltf) {
    const env = gltf.scene;
    env.position.set(...position);
    setShadow(gltf.scene, false, true);
    scene.add(env);
  });

  // Render environment (objects and other stuff)
  loader.load(`./assets/${ENVIRONMENT_OBJECTS_ASSET}`, function (gltf) {
    const envObjects = gltf.scene;
    envObjects.position.set(...position);
    console.log(gltf)
    setShadow(gltf.scene, true, false);
    scene.add(envObjects);
  });
}

// Set shadows on given object to given settings
function setShadow(obj, cast = false, receive = false) {
  obj.castShadow = cast;
  obj.receiveShadow = receive;
  if (obj?.children != null) {
    for (const child of obj.children) {
      setShadow(child, cast, receive);
    }
  }
}

function createControls(camera, renderer) {
  const controls = new OrbitControls(camera, renderer.domElement);
  // controls.autoRotate = true;
  controls.autoRotateSpeed = -1;
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;
  controls.enablePan = false;
  controls.minDistance = 30;
  controls.maxDistance = 150;

  return controls;
}

