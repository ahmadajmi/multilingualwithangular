'use strict';

var app = angular.module('Multilingual', [
  'pascalprecht.translate',
  'ngCookies'
  ]);

app.run(['$rootScope', function($rootScope) {
  $rootScope.lang = 'en';
  $rootScope.loading = false;

  $rootScope.default_float = 'left';
  $rootScope.opposite_float = 'right';

  $rootScope.default_direction = 'ltr';
  $rootScope.opposite_direction = 'rtl';
}])

app.config(['$translateProvider', function($translateProvider) {

  $translateProvider
  .useStaticFilesLoader({
    prefix: '/translations/',
    suffix: '.json'
  })
  .preferredLanguage('en')
  .useLocalStorage()
  .useMissingTranslationHandlerLog()
  .useSanitizeValueStrategy(null);

}]);

app.controller('LanguageSwitchController', ['$scope', '$rootScope', '$translate',
  function($scope, $rootScope, $translate) {

    $scope.changeLanguage = function(langKey) {
      $rootScope.loading = false;
      $translate.use(langKey);
    };

    $rootScope.$on('$translateChangeSuccess', function(event, data) {

      var language = data.language;
      $rootScope.lang = language;

      $rootScope.default_direction = language === 'ar' ? 'rtl' : 'ltr';
      $rootScope.opposite_direction = language === 'ar' ? 'ltr' : 'rtl';

      $rootScope.default_float = language === 'ar' ? 'right' : 'left';
      $rootScope.opposite_float = language === 'ar' ? 'left' : 'right';

      $rootScope.loading = true;
    });
  }

  ]);