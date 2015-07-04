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
  // .translations('en', {
  //   'HELLO': 'Hello'
  // })
  // .translations('ar', {
  //   'HELLO': 'مرحبا'
  // })
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
      // tmhDynamicLocale.set(data.language.toLowerCase().replace(/_/g, '-'));
    });
  }

]);