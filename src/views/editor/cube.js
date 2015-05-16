var BackBone = require('backbone');
var THREE = require('three');

var Cube = Backbone.Model.extend({
  initialize: function(intersectPoint, intersectFace) {
    this.set('name', 'anonymous');
    // this.set('geometry', new THREE.BoxGeometry( 50, 50, 50 ));
    // this.set('material', new THREE.MeshBasicMaterial( { color: 0x00ff00 } ));
    var geometry = new THREE.BoxGeometry( 50, 50, 50 );
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    var object = new THREE.Mesh(geometry, material);
    object.position.copy(intersectPoint).add(intersectFace);
    object.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
    
    this.set('object', object);
    // this.set('transformation', new THREE.Matrix4());
  },
  setName: function(name) {
    this.set('name', name);
  },
  getName: function() {
    return this.get('name');
  },
  // setColor: function(color) {
  //   this.get('material').color = color;
  // },
  // getColor: function() {
  //   return this.get('material').color;
  // },
  // setGeometry: function(x, y, z) {
  //   var geometry = this.get('geometry');
  //   geometry.set(x, y, z);
  // },
  getObject: function() {
    return this.get('object');
  }
});

var CubeCollection = Backbone.Collection.extend({
  model: Cube
});

module.exports = {
  Cube: Cube,
  CubeCollection: CubeCollection
};