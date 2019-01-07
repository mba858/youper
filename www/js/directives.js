angular.module('youper.directives', [])


  /**
   * Image Load directive, calls the function once image is loaded
   */
  .directive('imageLoad', ['$parse', function ($parse) {
    return {
      restrict: 'A',
      link: function (scope, elem, attrs) {
        var fn = $parse(attrs.imageLoad);
        elem.on('load', function (event) {
          scope.$apply(function () {
            fn(scope, {
              $event: event
            });
          });
        });
      }
    };
  }]);
