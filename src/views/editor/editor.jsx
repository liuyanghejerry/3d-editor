var React = require('react');
var MUI = require('material-ui');
var {Paper} = MUI;
var Stage = require('../../models/stage.js');
var PropertyPanel = require('./property_panel/property_panel.jsx');
var ObjectPanel = require('./object_panel/object_panel.jsx');

var Editor = React.createClass({
  getInitialState: function() {
    return {
      stage: null
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

    var stage = new Stage(
      React.findDOMNode(this.refs.renderElement),
      self.props.width, 
      self.props.height
    );
    self.setState({
      stage: stage
    }, function() {
      stage.startRender();
    });
  },
  handleMouseDbClicked: function(evt) {
    this.state.stage.handleMouseDbCliked(evt);
  },
  handleMouseClicked: function(evt) {
    this.state.stage.handleMouseCliked(evt);
  },
  componentDidMount: function() {
    this.initCanvas();
  },
  componentWillUnmount: function() {
    this.state.stage.stopRender();
  },
  render: function() {
    var stage = this.state.stage;
    var cubes = stage ? stage.getCubes() : [];

    return (
      <div className="editor-view">
        <Paper zDepth={1} className="editor-zone">
          <canvas
            ref="renderElement"
            onDoubleClick={this.handleMouseDbClicked}
            onClick={this.handleMouseClicked}
            width={this.props.width}
            height={this.props.height} />
          <p className="note">Note: Click to select cube; double click to add new cube; All changes are persistent and WYSIWYG.</p>
        </Paper>
        <Paper zDepth={1} className="panel-zone">
          <PropertyPanel />
        </Paper>
        <Paper zDepth={1} className="panel-zone">
          <ObjectPanel cubes={cubes}/>
        </Paper>
      </div>
    );
  }
});

module.exports = Editor;