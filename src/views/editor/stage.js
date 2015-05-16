var React = require('react');
var THREE = require('three');
var OrbitControls = require('three-orbit-controls')(THREE);

var BackBone = require('backbone');
var THREE = require('three');

var Cube = require('./cube.js').Cube;
var CubeCollection = require('./cube.js').CubeCollection;

var Stage = Backbone.Model.extend({
  initialize: function(renderElement, width, height) {
    this.set('objects', []);
    this.set('cubes', new CubeCollection());
    this.set('stoped', true);
    this._initCanvas(renderElement, width, height);
  },
  _initCanvas: function(renderElement, width, height) {
    var self = this;
    // create renderer
    console.log(renderElement)
    var renderer = new THREE.WebGLRenderer({
      canvas: renderElement,
      antialias: true
    });
    renderer.setSize(width, height);
    renderer.setClearColor( 0xffffff, 1);

    // create a scene
    var scene = new THREE.Scene();

    // set a camera
    var camera = new THREE.PerspectiveCamera(40, width / height, 1, 10000);
    camera.position.set(500, 800, 1300);
    camera.lookAt( new THREE.Vector3() );
    scene.add(camera);

    // mouse controller
    var controls = new OrbitControls(camera);

    this.set('renderer', renderer);
    this.set('scene', scene);
    this.set('camera', camera);

    self._initLights();
    self._initGrids();
    self._initRayAndMouse();
    // self.renderCanvas();
  },
  _initLights: function() {
    var ambientLight = new THREE.AmbientLight( 0x606060 );
    this.get('scene').add( ambientLight );

    var directionalLight = new THREE.DirectionalLight( 0xffffff );
    directionalLight.position.x = Math.random() - 0.5;
    directionalLight.position.y = Math.random() - 0.5;
    directionalLight.position.z = Math.random() - 0.5;
    directionalLight.position.normalize();
    this.get('scene').add( directionalLight );

    var directionalLight = new THREE.DirectionalLight( 0x808080 );
    directionalLight.position.x = Math.random() - 0.5;
    directionalLight.position.y = Math.random() - 0.5;
    directionalLight.position.z = Math.random() - 0.5;
    directionalLight.position.normalize();
    this.get('scene').add( directionalLight );
  },
  _initGrids: function() {
    var size = 500, step = 50;

    var geometry = new THREE.Geometry();

    for ( var i = - size; i <= size; i += step ) {

      geometry.vertices.push( new THREE.Vector3( - size, 0, i ) );
      geometry.vertices.push( new THREE.Vector3(   size, 0, i ) );

      geometry.vertices.push( new THREE.Vector3( i, 0, - size ) );
      geometry.vertices.push( new THREE.Vector3( i, 0,   size ) );

    }

    var material = new THREE.LineBasicMaterial( { color: 0x000000, opacity: 0.2 } );

    var line = new THREE.Line( geometry, material, THREE.LinePieces );
    this.get('scene').add( line );
  },
  _initRayAndMouse: function() {
    var raycaster = new THREE.Raycaster();
    var mouseVector = new THREE.Vector2();

    var geometry = new THREE.PlaneBufferGeometry( 1000, 1000 );
    geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );

    var plane = new THREE.Mesh(geometry);
    plane.visible = false;
    this.get('scene').add(plane);

    this.get('objects').push(plane);

    var material = new THREE.MeshBasicMaterial({
      color: 0xff0000, 
      wireframe: true
    });

    this.set('raycaster', raycaster);
    this.set('mouseVector', mouseVector);
    this.set('plane', plane);
  },
  handleMouseDbCliked: function(evt) {
    var renderer = this.get('renderer');
    var raycaster = this.get('raycaster');
    var scene = this.get('scene');
    var camera = this.get('camera');
    var objects = this.get('objects');
    var plane = this.get('plane');
    var cubes = this.get('cubes');
    var mouseVector = this.get('mouseVector');

    mouseVector.set(
      ( evt.clientX / renderer.domElement.width ) * 2 - 1,
      - ( evt.clientY / renderer.domElement.height ) * 2 + 1
    );

    raycaster.setFromCamera( mouseVector, camera );

    var intersects = raycaster.intersectObjects( objects );

    console.log(intersects);

    if (intersects.length <= 0) {
      return;
    }

    var intersect = intersects[0];

    if ( intersect.object !== plane ) {
      // we clicked on an normal object
    } else {
      // its the plane, we place one more normal object
      var cube = new Cube(intersect.point, intersect.face.normal);
      this.addCube(cube);
    }
  },
  startRender: function() {
    this.set('stoped', false);
    this._renderCanvas();
  },
  stopRender: function() {
    this.set('stoped', true);
  },
  _renderCanvas: function() {
    var self = this;
    if (self.get('stoped')) {
      return;
    }
    requestAnimationFrame(self._renderCanvas.bind(self));
    self.get('renderer').render(self.get('scene'), self.get('camera'));
  },
  addCube: function(cube) {
    var scene = this.get('scene');
    var objects = this.get('objects');
    var cubes = this.get('cubes');
    
    scene.add(cube.getObject());
    cubes.push(cube);
    objects.push(cube.getObject());
  }
});

module.exports = Stage;