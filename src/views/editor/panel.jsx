var React = require('react/addons');

var Panel = React.createClass({
  mixins: [React.addons.LinkedStateMixin],
  getInitialState: function() {
    return {
      //
    }
  },
  getDefaultProps: function() {
    return {
      width: 800,
      height: 600
    };
  },
  componentDidMount: function() {
  },
  componentWillUnmount: function() {
  },
  render: function() {
    return (
      <div>
        <label><input></label>
      </div>
    );
  }
});

module.exports = Panel;