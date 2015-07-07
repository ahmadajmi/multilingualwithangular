'use strict';

var app = angular.module('Multilingual', [
  'pascalprecht.translate',
  'ngCookies'
  ]);

app.config(['$translateProvider', function($translateProvider){

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
      $translate.use(langKey);
    };

    $rootScope.$on('$translateChangeSuccess', function(event, data) {
      document.documentElement.setAttribute('lang', data.language);
    });
  }

  ]);