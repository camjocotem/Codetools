(function (angular) {
    'use strict';
    var app = angular.module('app');
    
    
    app.component('ctNavItem', {
        templateUrl: 'app/directives/ctNavItem.tpl.html',
        require: '^nav',
        transclude: true,
        bindings: {
            state: '@'
        },
        controller: function($state){
            var ctrl = this;
            ctrl.isActive = function () {
                return ctrl.state === $state.current.name;
            };
        },
        controllerAs: 'ctrl'
    });
    
})(window.angular);