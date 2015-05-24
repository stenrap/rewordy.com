var React = require('react');

module.exports = React.createClass({

  displayName: 'About',

  handleClick: function() {
    console.log('Going home...');
    React.unmountComponentAtNode(document.getElementById('content'));
    var Index = require('./index');
    React.render(
      <Index />,
      document.getElementById('content')
    );
  },

  render: function() {
    return (
      <div>
        About<br></br>
        <button onClick={this.handleClick}>Home</button>
      </div>
    );
  }

});