var minivents = require('minivents');
var eventBox = new minivents();

eventBox.sendEvent = function (name, value) {
  setTimeout(eventBox.emit.bind(eventBox, name, value), 0);
};

eventBox.sendEventFunc = function (name, value) {
  return eventBox.sendEvent.bind(null, name, value);
}

module.exports = eventBox;