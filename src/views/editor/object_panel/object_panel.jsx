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

var ObjectPanel = React.createClass({
  getInitialState: function() {
    return {
      cubes: this.props.cubes
    }
  },
  componentDidMount: function() {
    var self = this;
    eventBox.on('cubes:updated', function(cubes) {
      self.setState({
        cubes: cubes
      });
    });
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
        <li key={item.key}>{item.text}</li>
      );
    });
  },
  render: function() {
    var menuItems = this.state.cubes.map(function(cube, index) {
      return {
        payload: index.toString(),
        key: cube.getObject().uuid,
        text: cube.getName()
      };
    });

    return (
      <div className="object-panel">
        <h2>Cubes:</h2>
        <ul className="object-list">{this.renderList(menuItems)}</ul>
      </div>
    );
  }
});

module.exports = ObjectPanel;