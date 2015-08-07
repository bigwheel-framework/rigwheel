var React = require('react');
var ReactBigwheel = require('./..');

var Section = React.createClass({

  getInitialState: function() {
    return {
      alpha: 0
    };
  },

  componentWillMount: function() {

    console.log('will mount', this.props.route);

    this.props.setup(this);
  },

  // init: function(req, done) {

  //   console.log('call init', this.props.route);

  //   this.setState({ alpha: 0 });

  //   done();
  // },

  animateIn: function(req, done) {

    console.log('call animateIn', this.props.route);

    this.setState({ alpha: 1 });

    done();
  },

  animateOut: function(req, done) {

    console.log('call animateOut', this.props.route);

    this.setState({ alpha: 0 });

    done();    
  },

  destroy: function(req, done) {

    console.log('call destroy', this.props.route);

    done(); 
  },

  render: function() {

    var style = {
      opacity: this.state.alpha
    };

    return (
      <div style={style} onClick={this._onChangeSection}>section {this.props.route}</div>
    );
  },

  _onChangeSection: function() {

    if(this.props.route === '/') {
      this.props.bigwheel.go('/about');  
    } else {
      this.props.bigwheel.go('/');
    }
  }
});

React.render(
  <ReactBigwheel>
    <Section route="/" />
    <Section route="/about" />
  </ReactBigwheel>,
  document.body
);