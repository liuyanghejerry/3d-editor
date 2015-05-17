var BackBone = require('backbone');
Backbone.LocalStorage = require('backbone.localstorage');
var THREE = require('three');

var Cube = Backbone.Model.extend({
  _object: null,
  defaults: {
    name: 'anonymous',
    color: 0x00ff00
  },
  initialize: function(attrs) {
    console.log('Cube initialize with:', attrs);

    if (attrs.object) {
      var loader = new THREE.ObjectLoader();
      var object = loader.parse(attrs.object);
      object.position.x = attrs.position.x;
      object.position.y = attrs.position.y;
      object.position.z = attrs.position.z;
      object.material.color = new THREE.Color(attrs.color);

      this._object = object;
      this.set('object', object);
    }
  },
  setName: function(name) {
    this.set('name', name);
    this.save();
  },
  getName: function() {
    return this.get('name');
  },
  getObject: function() {
    return this._object;
  },
  setColor: function(color) {
    this.getObject().material.color = new THREE.Color(color);
    this.set('color', color);
    this.save();
  },
  getColor: function() {
    return this.getObject().material.color.getHex();
  },
  getPos: function() {
    return this.getObject().position;
  },
  setPos: function(x, y, z) {
    var pos = this.getObject().position;
    pos.x = x;
    pos.y = y;
    pos.z = z;
    this.set('position', pos);
    this.save();
  }
}, {
  createWithIntersect: function(intersectPoint, intersectFace) {
    var geometry = new THREE.BoxGeometry( 50, 50, 50 );
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    var object = new THREE.Mesh(geometry, material);
    object.matrixAutoUpdate = true;
    object.position.copy(intersectPoint).add(intersectFace);
    object.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);

    var cube = new Cube({
      color: material.color.getHex(),
      position: object.position,
    });

    cube._object = object;
    cube.set('object', object);
    return cube;
  }
});

var CubeCollection = Backbone.Collection.extend({
  model: Cube,
  localStorage: new Backbone.LocalStorage('CubeCollection'),
  findCubeByObject: function(obj) {
    return this.find(function(cube) {
      return cube.getObject().uuid === obj.uuid;
    });
  }
});

module.exports = {
  Cube: Cube,
  CubeCollection: CubeCollection
};
