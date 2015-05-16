var React = require('react');
//Needed for onTouchTap
var injectTapEventPlugin = require("react-tap-event-plugin");
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

var MUI = require('material-ui');
var {TextField} = MUI;
var eventBox = require('./eventbox.js');

function sendEvent(name, value) {
  setTimeout(eventBox.emit.bind(eventBox, name, value), 0);
}

function sendEventFunc(name, value) {
  return sendEvent.bind(null, name, value);
}

var Panel = React.createClass({
  getInitialState: function() {
    return {
      disabled: true,
      name: 'unknown',
      color: '',
      x: 0,
      y: 0,
      z: 0
    }
  },
  componentDidMount: function() {
    eventBox.on('target:updated', this.handleTargetUpdated);
  },
  componentWillUnmount: function() {
  },
  handleTargetUpdated: function(target) {
    var pos = target.getPos();
    this.setState({
      disabled: false,
      name: target.getName(),
      color: '0x' + target.getColor().toString(16),
      x: pos.x,
      y: pos.y,
      z: pos.z,
    });
  },
  handleColorChange: function(evt) {
    console.log('color changed', evt.target.value);
    var color = parseInt(evt.target.value, 16);
    this.setState({
      color: evt.target.value
    }, sendEventFunc('color:updated', color));
  },
  handlePosXChange: function(evt) {
    this.setState({
      x: parseInt(evt.target.value, 10)
    }, sendEventFunc('pos:x:updated', parseInt(evt.target.value, 10)));
  },
  handlePosYChange: function(evt) {
    this.setState({
      y: parseInt(evt.target.value, 10)
    }, sendEventFunc('pos:y:updated', parseInt(evt.target.value, 10)));
  },
  handlePosZChange: function(evt) {
    this.setState({
      z: parseInt(evt.target.value, 10)
    }, sendEventFunc('pos:z:updated', parseInt(evt.target.value, 10)));
  },
  handleNameChange: function(evt) {
    this.setState({
      name: parseInt(evt.target.value, 10)
    }, sendEventFunc('name:updated', parseInt(evt.target.value, 10)));
  },
  render: function() {
    return (
      <div className="panel">
        <div>
          <TextField
            floatingLabelText="Name"
            value={this.state.name}
            disabled={this.state.disabled}
            onChange={this.handleNameChange} />
        </div>
        <div>
          <TextField
            floatingLabelText="Color"
            value={this.state.color}
            disabled={this.state.disabled}
            onChange={this.handleColorChange} />
        </div>
        <div>
          <TextField
            floatingLabelText="X"
            value={this.state.x}
            disabled={this.state.disabled}
            onChange={this.handlePosXChange} />
        </div>
        <div>
          <TextField
            floatingLabelText="Y"
            value={this.state.y}
            disabled={this.state.disabled}
            onChange={this.handlePosYChange} />
        </div>
        <div>
          <TextField
            floatingLabelText="Z"
            value={this.state.z}
            disabled={this.state.disabled}
            onChange={this.handlePosZChange} />
        </div>
      </div>
    );
  }
});

module.exports = Panel;