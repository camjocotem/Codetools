describe('ListToolsController',function(){
    beforeEach(angular.mock.module('app'));
    var $controller;
    var scope;
    var vm;
    beforeEach(inject(function(_$controller_, _$rootScope_){
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $controller = _$controller_;
        scope = _$rootScope_.$new(); //If using scope, a new scope needs to be created from the rootScope
        vm = $controller('ListToolsController', {$scope: scope});
    }));
    
    describe('List comparison', function(){
        it('should return commonEntries with no other values when only common entries are given', function(){
            var listA = ["a"];
            var listB = ["a"];
            vm.compareLists(listA, listB)
            expect(vm.commonEntries).toEqual(["a"]);
            expect(vm.itemsUniqueToA).toEqual([]);
            expect(vm.itemsUniqueToB).toEqual([]);
        });

        it('should return commonEntries with values for list A and B when provided', function(){
            var listA = ["a", "b"];
            var listB = ["a", "c"];
            vm.compareLists(listA, listB)
            expect(vm.commonEntries).toEqual(["a"]);
            expect(vm.itemsUniqueToA).toEqual(["b"]);
            expect(vm.itemsUniqueToB).toEqual(["c"]);
        });

        it('should return unique values for A when only A has a value', function(){
            var listA = ["a"];
            vm.compareLists(listA, [])
            expect(vm.commonEntries).toEqual([]);
            expect(vm.itemsUniqueToA).toEqual(["a"]);
            expect(vm.itemsUniqueToB).toEqual([]);
        });
        
        it('should return unique values for B when only B has a value', function(){
            var listB = ["a"];
            vm.compareLists([], listB);
            expect(vm.commonEntries).toEqual([]);
            expect(vm.itemsUniqueToA).toEqual([]);
            expect(vm.itemsUniqueToB).toEqual(["a"]);
        });
        
        it('should return unique values for A and B when they each have unique values', function(){
            var listA = ["a"];
            var listB = ["b"];
            vm.compareLists(listA, listB);
            expect(vm.commonEntries).toEqual([]);
            expect(vm.itemsUniqueToA).toEqual(["a"]);
            expect(vm.itemsUniqueToB).toEqual(["b"]);
        });

        it('should return empty arrays when passed empty arrays', function(){
            vm.compareLists([], []);
            expect(vm.commonEntries).toEqual([]);
            expect(vm.itemsUniqueToA).toEqual([]);
            expect(vm.itemsUniqueToB).toEqual([]);
        });
    });
});