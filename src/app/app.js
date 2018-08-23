    angular.module('app', ['ui.router', 'ngMaterial', 'angular-google-analytics'])
        .config(['$compileProvider', function ($compileProvider) {
            $compileProvider.debugInfoEnabled(false);
        }])
        .config(['AnalyticsProvider', function (AnalyticsProvider) {
            // Add configuration code as desired
            AnalyticsProvider.setAccount('UA-82063848-2')
            .trackPages(true)
            .trackUrlParams(true);  //UU-XXXXXXX-X should be your tracking code
        }])
        .run([
            "Analytics",
            "$transitions",
            "$location",
            function(Analytics, $transitions, $location) {
                $transitions.onSuccess({}, function(transition) {
                    Analytics.trackPage($location.path());
                });
            }
        ]);