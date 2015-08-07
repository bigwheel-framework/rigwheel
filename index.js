var React = require('react');
var bigwheel = require('bigwheel');

module.exports = React.createClass( {

  getInitialState: function() {
    return {
      currentChildren: [],
      sections: []
    };
  },

  componentWillMount: function() {

    var me = this;
    var routes = {};
    var newChildren = [];
    var framework = bigwheel(function() {

      return {

        routes: routes
      };
    });

    React.Children.forEach(this.props.children, function(child, i) {

      var route = child.props.route;
      var section;
      var childMethods;
      
      if(route) {

        child = React.cloneElement(child, {
          key: i,

          bigwheel: framework,

          setup: function(methods) {

            childMethods = methods;

            if(childMethods.init) {

              methods.init.apply(undefined, section.initArgs);
              section.initArgs = null; 
            } else {

              // call done since there was no init method
              section.initArgs[ 1 ]();
              section.initArgs = null;
            }
          }
        });

        section = {
          route: route,

          initArgs: null,
          destroyArgs: null,

          init: function(req, done) {

            var section = this;
            var currentChildren = me.state.currentChildren;

            currentChildren.push(child);

            this.initArgs = arguments;

            me.setState({ currentChildren: currentChildren });
          },

          resize: function() {

            if(childMethods.resize) {

              childMethods.resize.apply(undefined, arguments);
            }
          },

          animateIn: function(req, done) {

            if(childMethods.animateIn) {

              childMethods.animateIn.apply(undefined, arguments);
            } else {

              done();
            }
          },

          animateOut: function(req, done) {

            if(childMethods.animateIn) {

              childMethods.animateIn.apply(undefined, arguments);
            } else {

              done();
            }
          },

          destroy: function(req, done) {

            var section = this;
            var currentChildren = me.state.currentChildren;

            currentChildren = currentChildren.filter( function(cChild) {
              return cChild !== child;
            });

            this.destroyArgs = arguments;

            me.setState({ currentChildren: currentChildren });

            if(childMethods.destroy) {
              
              childMethods.destroy.apply(undefined, arguments);
            }
          }
        };

        newChildren.push(child);
        routes[ route ] = section;
      }
    });

    framework.init();
  },

  render: function() {

    return (
      <div>
        {this.state.currentChildren}
      </div>
    );
  }
});