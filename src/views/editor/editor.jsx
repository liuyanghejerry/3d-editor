var React = require('react');
var ReactTHREE = require('react-three');
var {
  Scene, 
  PerspectiveCamera,
  Line
} = ReactTHREE;
var THREE = require('three');

var Editor = React.createClass({
  getDefaultProps: function() {
    return {
      width: 300,
      height: 300
    };
  },
  componentDidMount: function() {
    //
  },
  render: function() {
    var aspectratio = this.props.width / this.props.height;
    var cameraprops = {
      fov: 75, 
      aspect: aspectratio, 
      near: 1, 
      far: 5000,
      position: new THREE.Vector3(0,0,600), 
      lookat: new THREE.Vector3(0,0,0)
    };

    var material = new THREE.LineBasicMaterial({
      color: 0x0000ff
    });

    var geometry = new THREE.Geometry();
    geometry.vertices.push(
      new THREE.Vector3( -10, 0, 0 ),
      new THREE.Vector3( 0, 10, 0 ),
      new THREE.Vector3( 10, 0, 0 )
    );

    return (
      <Scene 
        width={this.props.width}
        height={this.props.height} 
        camera="maincamera">
          <PerspectiveCamera name="maincamera" {...cameraprops} />
              <Line geometry={geometry} material={material}/>
      </Scene>
    );
  }
});

module.exports = Editor;