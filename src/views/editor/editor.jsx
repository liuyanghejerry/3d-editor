var React = require('react');
var THREE = require('three');
var OrbitControls = require('three-orbit-controls')(THREE);

var Editor = React.createClass({
  getInitialState: function() {
    return {
      scene: null,
      renderer: null,
      camera: null,
      stoped: false
    }
  },
  getDefaultProps: function() {
    return {
      width: 800,
      height: 600
    };
  },
  componentDidMount: function() {
    var self = this;

    // fetch the element to render
    var renderElement = React.findDOMNode(this.refs.renderElement);
    // create renderer
    var renderer = new THREE.WebGLRenderer({
      canvas: renderElement,
      antialias: false
    });
    renderer.setSize(+this.props.width, +this.props.height);

    // create a scene
    var scene = new THREE.Scene();

    // set a camera
    var camera = new THREE.PerspectiveCamera(75, this.props.width / this.props.height, 0.1, 1000);
    camera.position.z = 5;
    scene.add(camera);

    // mouse controller
    var controls = new OrbitControls(camera);

    // sample object
    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    var cube = new THREE.Mesh( geometry, material );
    scene.add(cube);

    self.setState({
      renderer: renderer,
      scene: scene,
      camera: camera,
    }, self.renderCanvas);
  },
  componentWillUnmount: function() {
    this.setState({
      stoped: true
    });
  },
  render: function() {
    return (
      <div>
        <canvas
          ref="renderElement"
          width={this.props.width}
          height={this.props.height} />
      </div>
    );
  },
  renderCanvas: function() {
    var self = this;
    if (self.state.stoped) {
      return;
    }
    requestAnimationFrame(self.renderCanvas);
    self.state.renderer.render(self.state.scene, self.state.camera);
  }
});

module.exports = Editor;