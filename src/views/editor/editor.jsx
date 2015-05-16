var React = require('react/addons');
var THREE = require('three');
var OrbitControls = require('three-orbit-controls')(THREE);

var cubeGeometry = new THREE.BoxGeometry( 50, 50, 50 );
var cubeMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );

var Editor = React.createClass({
  getInitialState: function() {
    return {
      scene: null,
      renderer: null,
      camera: null,
      raycaster: null,
      mouseVector: null,
      objects: [],
      stoped: false
    }
  },
  getDefaultProps: function() {
    return {
      width: 800,
      height: 600
    };
  },
  initCanvas: function() {
    var self = this;

    // fetch the element to render
    var renderElement = React.findDOMNode(this.refs.renderElement);
    // create renderer
    var renderer = new THREE.WebGLRenderer({
      canvas: renderElement,
      antialias: true
    });
    renderer.setSize(+this.props.width, +this.props.height);
    renderer.setClearColor( 0xffffff, 1);

    // create a scene
    var scene = new THREE.Scene();

    // set a camera
    var camera = new THREE.PerspectiveCamera(40, this.props.width / this.props.height, 1, 10000);
    camera.position.set(500, 800, 1300);
    camera.lookAt( new THREE.Vector3() );
    scene.add(camera);

    // mouse controller
    var controls = new OrbitControls(camera);

    // sample object
    var cube = new THREE.Mesh( cubeGeometry, cubeMaterial );
    scene.add(cube);

    self.setState({
      renderer: renderer,
      scene: scene,
      camera: camera,
    }, function() {
      self.initLights();
      self.initGrids();
      self.initRayAndMouse();
      self.renderCanvas();
    });
  },
  initGrids: function() {
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
    this.state.scene.add( line );
  },
  initLights: function() {
    var ambientLight = new THREE.AmbientLight( 0x606060 );
    this.state.scene.add( ambientLight );

    var directionalLight = new THREE.DirectionalLight( 0xffffff );
    directionalLight.position.x = Math.random() - 0.5;
    directionalLight.position.y = Math.random() - 0.5;
    directionalLight.position.z = Math.random() - 0.5;
    directionalLight.position.normalize();
    this.state.scene.add( directionalLight );

    var directionalLight = new THREE.DirectionalLight( 0x808080 );
    directionalLight.position.x = Math.random() - 0.5;
    directionalLight.position.y = Math.random() - 0.5;
    directionalLight.position.z = Math.random() - 0.5;
    directionalLight.position.normalize();
    this.state.scene.add( directionalLight );
  },
  initRayAndMouse: function() {
    var raycaster = new THREE.Raycaster();
    var mouseVector = new THREE.Vector2();

    var geometry = new THREE.PlaneBufferGeometry( 1000, 1000 );
    geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );

    var plane = new THREE.Mesh( geometry );
    plane.visible = false;
    this.state.scene.add( plane );

    // var objects = React.addons.update(this.state.objects, {
    //   $push: plane
    // });
    this.state.objects.push(plane);

    var material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );

    this.setState({
      raycaster: raycaster,
      mouseVector: mouseVector,
      // objects: objects
    });
  },
  handleMouseClicked: function(evt) {
    this.state.mouseVector.set(
      ( evt.clientX / this.state.renderer.domElement.width ) * 2 - 1,
      - ( evt.clientY / this.state.renderer.domElement.height ) * 2 + 1
    );

    this.state.raycaster.setFromCamera( this.state.mouseVector, this.state.camera );

    var intersects = this.state.raycaster.intersectObjects( this.state.objects );

    // if ( intersects.length > 0 ) {
    //   var intersect = intersects[ 0 ];
    //   if ( isShiftDown ) {
    //     if ( intersect.object != plane ) {
    //       scene.remove( intersect.object );
    //       objects.splice( objects.indexOf( intersect.object ), 1 );
    //     }
    //   } else {
    //     var voxel = new THREE.Mesh( cubeGeometry, cubeMaterial );
    //     voxel.position.copy( intersect.point ).add( intersect.face.normal );
    //     voxel.position.divideScalar( 50 ).floor().multiplyScalar( 50 ).addScalar( 25 );
    //     scene.add( voxel );
    //     objects.push( voxel );

    //   }
    // }

    if ( intersects.length > 0 ) {
      var intersect = intersects[ 0 ];
      var voxel = new THREE.Mesh( cubeGeometry, cubeMaterial );
      voxel.position.copy( intersect.point ).add( intersect.face.normal );
      voxel.position.divideScalar( 50 ).floor().multiplyScalar( 50 ).addScalar( 25 );
      this.state.scene.add( voxel );
      // var objects = React.addons.update(this.state.objects, {
      //   $push: voxel
      // });
      this.state.objects.push(voxel);
      // this.setState({
      //   objects: objects
      // });
    }
  },
  componentDidMount: function() {
    this.initCanvas();
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
          onDoubleClick={this.handleMouseClicked}
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