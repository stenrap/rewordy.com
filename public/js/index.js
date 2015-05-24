require('../css/style.less');
var React = require('react');

var IntroText = React.createClass({
  render: function() {
    return (
      <p>Hello, World!</p>
    );
  }
});

React.render(
  <IntroText />,
  document.getElementById('content')
);