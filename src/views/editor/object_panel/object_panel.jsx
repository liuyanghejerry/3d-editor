var React = require('react');
//Needed for onTouchTap
var injectTapEventPlugin = require("react-tap-event-plugin");
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

var MUI = require('material-ui');
var {Menu} = MUI;
var eventBox = require('../../../misc/eventbox.js');

function sendEvent(name, value) {
  setTimeout(eventBox.emit.bind(eventBox, name, value), 0);
}

function sendEventFunc(name, value) {
  return sendEvent.bind(null, name, value);
}

var ObjectPanel = React.createClass({
  getInitialState: function() {
    return {
      cubes: this.props.cubes
    }
  },
  componentDidMount: function() {
    // eventBox.on('target:updated', this.handleTargetUpdated);
  },
  componentWillUnmount: function() {
  },
  componentWillReceiveProps: function(props) {
    this.setState({
      cubes: props.cubes
    });
  },
  renderList: function(items) {
    return items.map(function(item) {
      return (
        <li>{item.text}</li>
      );
    });
  },
  render: function() {
    var menuItems = this.state.cubes.map(function(cube, index) {
      return {
        payload: index.toString(),
        text: cube.getName()
      };
    });

    return (
      <div className="panel">
        <ul>{this.renderList(menuItems)}</ul>
      </div>
    );
  }
});

module.exports = ObjectPanel;