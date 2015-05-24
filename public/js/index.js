var React = require('react');

module.exports = React.createClass({

  displayName: 'Index',

  handleClick: function() {
    require.ensure(['./about'], function(require) {
      console.log('Going to about...');
      React.unmountComponentAtNode(document.getElementById('content'));
      var About = require('./about');
      React.render(
        <About />,
        document.getElementById('content')
      );
    });
  },

  render: function() {
    return (
      <div>
        Home<br></br>
        <button onClick={this.handleClick}>About</button>
      </div>
    );
  }

});