(function (angular) {
    "use strict";
    var app = angular.module('app');

    app.directive('fileReader', function () {
        return {
            scope: {
                fileReader: "="
            },
            link: function (scope, element) {
                element[0].onchange = function (changeEvent) {
                    var files = changeEvent.target.files;
                    if (files.length) {
                        var r = new FileReader();
                        r.onload = function (e) {
                            var contents = e.target.result;
                            scope.$apply(function () {
                                scope.fileReader = contents;
                                scope.testing = contents;
                            });
                        };

                        r.readAsText(files[0]);
                    }
                };
            }
        };
    });
})(window.angular);
