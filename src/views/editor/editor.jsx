var React = require('react/addons');
var Stage = require('./stage.js');

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
  handleMouseClicked: function(evt) {
    this.state.stage.handleMouseDbCliked(evt);
  },
  componentDidMount: function() {
    this.initCanvas();
  },
  componentWillUnmount: function() {
    this.state.stage.stopRender();
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
  }
});

module.exports = Editor;