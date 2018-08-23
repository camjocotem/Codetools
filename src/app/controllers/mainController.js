(function (angular) {
	"use strict";
	var app = angular.module('app');

	app.controller('MainController', function ($scope, $state) {
        $state.go('sql');
    });
})(window.angular);
