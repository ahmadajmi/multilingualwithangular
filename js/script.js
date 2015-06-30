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