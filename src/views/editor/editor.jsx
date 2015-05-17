var React = require('react');
var MUI = require('material-ui');
var {Paper} = MUI;
var Stage = require('./stage.js');
var Panel = require('./panel.jsx');

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
    return (
      <div className="editor-view">
        <Paper zDepth={1} className="editor-zone">
          <canvas
            ref="renderElement"
            onDoubleClick={this.handleMouseDbClicked}
            onClick={this.handleMouseClicked}
            width={this.props.width}
            height={this.props.height} />
        </Paper>
        <Paper zDepth={1} className="panel-zone">
          <Panel />
        </Paper>
      </div>
    );
  }
});

module.exports = Editor;