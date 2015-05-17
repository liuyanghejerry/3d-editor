var reset = require('./reset.css');
var main = require('./main.scss');

var React = require('react');
var Router = require('react-router');
var { Route, DefaultRoute, NotFoundRoute, RouteHandler } = Router;

var Editor = require('./views/editor/editor.jsx');

var App = React.createClass({
  render: function() {
    return (
      <div>
        <header>3D Edtior</header>
        <RouteHandler/>
      </div>
    );
  }
});

var routes = (
  <Route handler={App}>
    <Route name="editor" path="editor" handler={Editor} />
    <DefaultRoute handler={Editor} />
    <NotFoundRoute handler={Editor} />
  </Route>
);

Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.body);
});