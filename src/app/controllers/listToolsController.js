(function (angular) {
	"use strict";
	var app = angular.module('app');

	app.controller('ListToolsController', function ($state) {
        var vm = this;
        vm.test = "test";

        vm.compareLists = function(listA, listB){
            debugger;

            if (vm.listA) {
                var stringOutput = [];
                listA = [];
                _.each(vm.listA.split("\n"), function (line) {
                    listA.push(line.trim());
                });                
            }
            else{
                vm.itemsUniqueToA = [];
            }

            if (vm.listB) {
                var stringOutput = [];
                listB = [];
                _.each(vm.listB.split("\n"), function (line) {
                    listB.push(line.trim());
                });                
            }
            else{
                vm.itemsUniqueToB = [];
            }

            if(listA && !listB){
                vm.itemsUniqueToA = listA;
            }

            if(listB && !listA){
                vm.itemsUniqueToB = listB;
            }

            if(listA && listB){
                vm.commonEntries = intersect(listA, listB);
                vm.itemsUniqueToA = _.difference(listA, listB);
                vm.itemsUniqueToB = _.difference(listB, listA);
            }

            //vm.commonEntries
            //vm.itemsUniqueToA
            //vm.itemsUniqueToB
        }
    });
})(window.angular);

function intersect(a, b) {
    var t;
    if (b.length > a.length) t = b, b = a, a = t; // indexOf to loop over shorter
    return a.filter(function (e) {
        return b.indexOf(e) > -1;
    });
}
