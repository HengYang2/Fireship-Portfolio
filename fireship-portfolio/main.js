import './style.css'
import * as THREE from 'three'
//Import orbit controls to make the scene more interactive:
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

//Scene - like a containter that holds all objects, cameras and lights
const scene = new THREE.Scene(); 


//Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/ window.innerHeight, 0.1, 1000);


//Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

renderer.render(scene, camera);


//Geometry
const geometry = new THREE.TorusGeometry(10,3,16,100);
//Material for geometry:
 //NOTE: .MeshBasicMaterial doesnt need light and .MeshStandardMaterial does need light.
const material = new THREE.MeshStandardMaterial({color: 0xFF6347, wireframe:false});
//Create a new mesh object using the material and geometry variables above:
const torus = new THREE.Mesh(geometry, material);

//Add Torus to the scene:
scene.add(torus);

//Add a light to the scene:
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(20,20,20)
//Ambient light is like a flood light (it will light up everything in the scene equally):
const ambientLight = new THREE.AmbientLight(0xffffff);
ambientLight.intensity = 1;

//Add the light to the scene
scene.add(pointLight, ambientLight);

//Light helper shows where the light is and its position:
const lightHelper = new THREE.PointLightHelper(pointLight);
scene.add(lightHelper); 
//Grid helper creates a 2D grid:
const gridHelper = new THREE.GridHelper(200,50);
scene.add(gridHelper) 


//OrbitControls: This listens to DOM events on the mouse and positions the camera accordingly:
const controls = new OrbitControls(camera, renderer.domElement)


//Generate random stars:
function addStar() {
  const geometry1 = new THREE.SphereGeometry(0.25, 24, 24);
  const material1 = new THREE.MeshStandardMaterial({color:0xffffff});
  const star = new THREE.Mesh(geometry1, material1);

  //Generate random position for each star:
  const [x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
  star.position.set(x,y,z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);


//Add a background image:
const spaceTexture = new THREE.TextureLoader().load('./space.jpg');
scene.background = spaceTexture;
scene.backgroundIntensity = 0.2;


//Heng Cube
const hengTexture = new THREE.TextureLoader().load('./hengs_profile_picture.jpeg');
const heng = new THREE.Mesh(
  new THREE.BoxGeometry(3,3,3),
  new THREE.MeshBasicMaterial({map: hengTexture})
)
scene.add(heng)

//Moon

const moonTexture = new THREE.TextureLoader().load('./moon.jpg');
//Normal map makes the surfaces looks more 3d and not as uniform:
const normalTexture = new THREE.TextureLoader().load('./normal.jpg');

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3,32,32),
  new THREE.MeshStandardMaterial({
    map: moonTexture, 
    normalMap: normalTexture
  })
)

//Position the moon:
moon.position.z = 30;
moon.position.setX(-10);

scene.add(moon)


//Function for moving the camera on mouse scroll:
function moveCamera() {
  const t = document.body.getBoundingClientRect().top;

  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  heng.rotation.y += 0.01;
  heng.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.position.y = t * -0.0002;
}

document.body.onscroll = moveCamera;

//Create a game loop that wil re-render everytime the page is re-painted
function animate() {
  requestAnimationFrame(animate);
  
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  controls.update();

  renderer.render(scene, camera);
}

animate();

