var BackBone = require('backbone');
Backbone.LocalStorage = require('backbone.localstorage');
var THREE = require('three');

var Cube = Backbone.Model.extend({
  _object: null,
  defaults: {
    name: 'anonymous',
  },
  initialize: function(attrs) {
    console.log('Cube initialize with:', attrs);

    if (attrs && attrs.object) {
      var loader = new THREE.ObjectLoader();
      var object = loader.parse(attrs.object);

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
    this.set('object', this.getObject());
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
    this.getObject().updateMatrix();

    this.set('object', this.getObject());
    this.save();
  }
}, {
  createWithIntersect: function(intersectPoint, intersectFace) {
    var geometry = new THREE.BoxGeometry( 50, 50, 50 );
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    var object = new THREE.Mesh(geometry, material);
    object.position.copy(intersectPoint).add(intersectFace);
    object.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
    object.updateMatrix();

    var cube = new Cube();

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
