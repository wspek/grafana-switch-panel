// import './external/firebase-app';
// import './external/angularfire.min';
// import './external/ocLazyLoad';

// Create an application module for our demo.
var myApp = angular.module('Demo', []);

// angular.element(document).ready(function() {
//     console.log("Document ready");
//     angular.bootstrap(mydiv, ['Demo']);
//   });

// angular.module('grafana.core').requires.push('Demo');
// -------------------------------------------------- //
// -------------------------------------------------- //
// After the AngularJS has been bootstrapped, you can no longer
// use the normal module methods (ex, app.controller) to add
// components to the dependency-injection container. Instead,
// you have to use the relevant providers. Since those are only
// available during the config() method at initialization time,
// we have to keep a reference to them.
// --
// NOTE: This general idea is based on excellent article by
// Ifeanyi Isitor: http://ify.io/lazy-loading-in-angularjs/
myApp.config(
    function( $controllerProvider, $provide, $compileProvider ) {
        // Since the "shorthand" methods for component
        // definitions are no longer valid, we can just
        // override them to use the providers for post-
        // bootstrap loading.
        console.log( "Config method executed." );
        // Let's keep the older references.
        myApp._controller = myApp.controller;
        myApp._service = myApp.service;
        myApp._factory = myApp.factory;
        myApp._value = myApp.value;
        myApp._directive = myApp.directive;
        // Provider-based controller.
        myApp.controller = function( name, constructor ) {
            console.log( "Creating controller." + name );

            $controllerProvider.register( name, constructor );

            return( this );
        };
        // Provider-based service.
        myApp.service = function( name, constructor ) {
            $provide.service( name, constructor );
            return( this );
        };
        // Provider-based factory.
        myApp.factory = function( name, factory ) {
            $provide.factory( name, factory );
            return( this );
        };
        // Provider-based value.
        myApp.value = function( name, value ) {
            $provide.value( name, value );
            return( this );
        };
        // Provider-based directive.
        myApp.directive = function( name, factory ) {
            $compileProvider.directive( name, factory );
            return( this );
        };
        // NOTE: You can do the same thing with the "filter"
        // and the "$filterProvider"; but, I don't really use
        // custom filters.
        console.log( "Config method completely." );
    }
);
// -------------------------------------------------- //
// -------------------------------------------------- //
// I control the root of the application.
myApp.controller(
    "AppController",
    function( $scope ) {
        // Since this Controller will be instantiated once
        // the application is bootstrapped, let's log it to
        // the console so we can see the timing.
        console.log( "Controller instantiated (after bootstrap)." );
        // I determine which view is rendered.
        $scope.subview = "before";
        // ---
        // PUBLIC METHODS.
        // ---
        // I toggle between the two different subviews.
        $scope.toggleSubview = function() {
            if ( $scope.subview === "before" ) {
                $scope.subview = "after";
            } else {
                $scope.subview = "before";
            }
        };
    }
);

// -------------------------------------------------- //
// -------------------------------------------------- //
// Once the DOM-Ready event has fired, we know that AngularJS
// will have bootstrapped the application. As such, we want to
// try adding our "lazy bindings" after the DOM-ready event.
// $( lazyBindings );
// I define the modules after bootstrapping. Remember, inside
// of this function, the shorthand methods (ex, app.controller)
// NO LONGER POINTER to the core shorthands; instead, they
// point to the method definitions we defined in the config()
// method executed at myApplication bootstrap.
function lazyBindings() {
    console.log( "Lazy bindings added to application." );
    // Lazy-loaded controller.
    myApp.controller(
        "LazyController",
        function( $scope) {
            console.log("Inside LazyController");

            $scope.message = "After app bootstrap.";
        }
    );
    // Lazy-loaded service.
    myApp.service(
        "util",
        function( emphasize ) {
            this.emphasize = emphasize;
        }
    );
    // Lazy-loaded factory.
    myApp.factory(
        "emphasize",
        function() {
            return(
                function( value ) {
                    return( value.replace( /\.$/, "!!!!" ) );
                }
            );
        }
    );
    // Lazy-loaded value.
    myApp.value(
        "uppercase",
        function( value ) {
            return( value.toString().toUpperCase() );
        }
    );
    // Lazy-loaded directive.
    myApp.directive(
        "bnItalics",
        function() {
            return(
                function( $scope, element ) {
                    element.css( "font-style", "italic" );
                }
            );
        }
    );
}

// $(document).ready(function() {
//     console.log("Bootstrapping in document ready");
//     angular.bootstrap($('grafana-panel'), ['Demo']);
// });