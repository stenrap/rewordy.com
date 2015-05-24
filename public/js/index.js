require('../css/style');
var React = require('react');

var IntroText = React.createClass({

  handleClick: function() {
    require.ensure(['./about'], function(require) {
      console.log('Did a file load happen?!');
    });
  },

  render: function() {
    return (
      <div>
        Hello, World!<br></br>
        <button onClick={this.handleClick}>About</button>
      </div>
    );
  }

});

React.render(
  <IntroText />,
  document.getElementById('content')
);