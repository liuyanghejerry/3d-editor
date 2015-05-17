var React = require('react');
var THREE = require('three');
var OrbitControls = require('./orbit_controls.js')(THREE);

var BackBone = require('backbone');
Backbone.LocalStorage = require("backbone.localstorage");

var Cube = require('./cube.js').Cube;
var CubeCollection = require('./cube.js').CubeCollection;

var eventBox = require('./eventbox.js');

var Stage = Backbone.Model.extend({
  initialize: function(renderElement, width, height) {
    var self = this;
    this.set('objects', []);
    var cubes = new CubeCollection();
    this.set('cubes', cubes);
    this.set('stoped', true);
    this.set('selectedCube', null);
    this._initCanvas(renderElement, width, height);
    this._hookEvents();

    cubes.fetch({
      success: function(model, response, options) {
        cubes.forEach(function(cube) {
          self._addCube(cube);
        });
      }
    });
  },
  _initCanvas: function(renderElement, width, height) {
    var self = this;
    // create renderer
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
    var controls = new OrbitControls(camera, renderElement);

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
  _hookEvents: function() {
    var self = this;
    eventBox.on('color:updated', self._updateColor.bind(self));
    eventBox.on('pos:x:updated', self._updatePosX.bind(self));
    eventBox.on('pos:y:updated', self._updatePosY.bind(self));
    eventBox.on('pos:z:updated', self._updatePosZ.bind(self));
    eventBox.on('name:updated', self._updateName.bind(self));
  },
  _updateColor: function(color) {
    var selectedCube = this.get('selectedCube');
    console.log('_hookEvents', 'color:updated', selectedCube);
    if (!selectedCube) {
      return;
    }

    selectedCube.setColor(color);
    console.log(selectedCube.getColor());
  },
  _updatePosX: function(x) {
    var selectedCube = this.get('selectedCube');
    console.log('_hookEvents', 'pos:x:updated', selectedCube);
    if (!selectedCube) {
      return;
    }

    var lastPos = selectedCube.getPos();
    var y = lastPos.y;
    var z = lastPos.z;

    selectedCube.setPos(x, y, z);
  },
  _updatePosY: function(y) {
    var selectedCube = this.get('selectedCube');
    console.log('_hookEvents', 'pos:y:updated', selectedCube);
    if (!selectedCube) {
      return;
    }

    var lastPos = selectedCube.getPos();
    var x = lastPos.x;
    var z = lastPos.z;

    selectedCube.setPos(x, y, z);
  },
  _updatePosZ: function(z) {
    var selectedCube = this.get('selectedCube');
    console.log('_hookEvents', 'pos:z:updated', selectedCube);
    if (!selectedCube) {
      return;
    }

    var lastPos = selectedCube.getPos();
    var y = lastPos.y;
    var x = lastPos.x;

    selectedCube.setPos(x, y, z);
  },
  _updateName: function(name) {
    var selectedCube = this.get('selectedCube');
    console.log('_hookEvents', 'name:updated', selectedCube);
    if (!selectedCube) {
      return;
    }

    selectedCube.setName(name);
  },
  _locateMouseTarget: function(evt) {
    var renderer = this.get('renderer');
    var raycaster = this.get('raycaster');
    var scene = this.get('scene');
    var camera = this.get('camera');
    var objects = this.get('objects');
    var plane = this.get('plane');
    var cubes = this.get('cubes');
    var mouseVector = this.get('mouseVector');

    function divPos(evt) {
      var current = evt.currentTarget;
      var x = current.offsetLeft;
      var y = current.offsetTop;

      var element = current.offsetParent;

      while (element !== null) {
        x = parseInt (x) + parseInt (element.offsetLeft);
        y = parseInt (y) + parseInt (element.offsetTop);

        element = element.offsetParent;
      }

      return [evt.clientX - x, evt.clientY - y];
    }

    var pos = divPos(evt);

    mouseVector.set(
      ( pos[0] / renderer.domElement.width ) * 2 - 1,
      - ( pos[1] / renderer.domElement.height ) * 2 + 1
    );

    raycaster.setFromCamera( mouseVector, camera );

    var intersects = raycaster.intersectObjects( objects );

    console.log('mouse intersects', intersects);
    return intersects;
  },
  handleMouseDbCliked: function(evt) {
    var objects = this.get('objects');
    var plane = this.get('plane');
    var cubes = this.get('cubes');
    var intersects = this._locateMouseTarget(evt);

    if (intersects.length <= 0) {
      return;
    }

    var intersect = intersects[0];

    if ( intersect.object === plane ) {
      // its the plane, we place one more normal object
      var cube = Cube.createWithIntersect(intersect.point, intersect.face.normal);
      this.addCube(cube);
      this.selectCube(cube);
    }
  },
  handleMouseCliked: function(evt) {
    var objects = this.get('objects');
    var plane = this.get('plane');
    var cubes = this.get('cubes');
    var intersects = this._locateMouseTarget(evt);

    if (intersects.length <= 0) {
      return;
    }

    for (var i = 0; i < intersects.length; i++) {
      if ( intersects[i].object !== plane ) {
        // we clicked on an normal object
        var cube = cubes.findCubeByObject(intersects[i].object);
        if (!cube) {
          console.error('cannot find cube when selected');
          return;
        }
        this.selectCube(cube);
        break;
      }
    }
  },
  selectCube: function(cube) {
    this.set('selectedCube', cube);
    console.log('cube selected', cube);
    eventBox.emit('target:updated', cube);
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
    this._addCube(cube);
    var cubes = this.get('cubes');
    cubes.push(cube);
    cube.setColor(0xff0000);
  },
  _addCube: function(cube) {
    var scene = this.get('scene');
    var objects = this.get('objects');

    scene.add(cube.getObject());
    objects.push(cube.getObject());

    console.log('cube is added to scene:', cube);
  }
});

module.exports = Stage;