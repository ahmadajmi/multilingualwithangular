'use strict';

angular.module('Multilingual', ['pascalprecht.translate'])

.config(['$translateProvider', function($translateProvider){

  $translateProvider
  .translations('en', {
    'HELLO': 'Hello'
  })
  .translations('ar', {
    'HELLO': 'مرحبا'
  })
  .preferredLanguage('en')

}]);