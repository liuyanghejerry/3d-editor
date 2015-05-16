var BackBone = require('backbone');
Backbone.LocalStorage = require('backbone.localstorage');
var THREE = require('three');

var Cube = Backbone.Model.extend({
  initialize: function(attrs) {
    console.log('Cube initialize with:', attrs);
    this.set('name', attrs.name || 'anonymous');
  },
  setName: function(name) {
    this.set('name', name);
    this.save();
  },
  getName: function() {
    return this.get('name');
  },
  getObject: function() {
    return this.get('object');
  },
  setColor: function(color) {
    this.get('object').material.color = new THREE.Color(color);
    this.save();
  },
  getColor: function() {
    return this.get('object').material.color.getHex();
  },
  getPos: function() {
    return this.get('object').position;
  },
  setPos: function(x, y, z) {
    var pos = this.get('object').position;
    pos.x = x;
    pos.y = y;
    pos.z = z;
    this.set('position', pos);
    this.save();
  },
  parse: function(attrs) {
    var loader = new THREE.ObjectLoader();
    var object = loader.parse(attrs.object);
    object.position.x = attrs.position.x;
    object.position.y = attrs.position.y;
    object.position.z = attrs.position.z;

    attrs.object = object;
    return attrs;
  }
}, {
  createWithIntersect: function(intersectPoint, intersectFace) {
    var geometry = new THREE.BoxGeometry( 50, 50, 50 );
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    var object = new THREE.Mesh(geometry, material);
    object.matrixAutoUpdate = true;
    object.position.copy(intersectPoint).add(intersectFace);
    object.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);

    return new Cube({
      position: object.position,
      object: object,
    });
  }
});

var CubeCollection = Backbone.Collection.extend({
  model: Cube,
  localStorage: new Backbone.LocalStorage('CubeCollection'),
  findCubeByObject: function(obj) {
    return this.find(function(cube) {
      return cube.get('object').uuid === obj.uuid;
    });
  }
});

module.exports = {
  Cube: Cube,
  CubeCollection: CubeCollection
};
