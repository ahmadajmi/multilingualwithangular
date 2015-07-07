## Multilingual support for Angularjs

#### Intro

You are building a Single Page Application with Angularjs that require a multilingual support for more than one language so the user can switch instantly between languages without refreshing the page.

When we support more languages we need to do more things to our App, this will include translating App text, change layout direction (RTL & LTR) and in some cases load different content based on the selected language.

#### Environment Setup

First let's setup our development environment and add our dependencies, we will use bower to manage the project dependencies including [Angular.js] and [angular-translate]

Let's setup bower with `bower init` in the Terminal and then install our packages. `bower init` will interactively create a `bower.json` file that will look like this

``` javascript
{
  name: 'multilingualwithangular',
  version: '0',
  authors: [
  'Ahmad Ajmi <ahmad@ahmadajmi.com>'
  ],
  description: 'Multilingual support for Angularjs',
  keywords: [
  'AngularJS',
  'multilingual'
  ],
  license: 'MIT',
  private: true,
  ignore: [
  '**/.*',
  'node_modules',
  'bower_components',
  'test',
  'tests'
  ]
}
```

The next step is to install the initial bower packages and add them to `index.html` file

```
bower install angular --save
bower install angular-translate --save
```

``` html
<!DOCTYPE HTML>
<html lang="en">
<head>
  <title>Multilingual</title>
  <meta charset="utf-8">
  <link href="style.css" rel="stylesheet">
</head>

<body>
  <script src="bower_components/angular/angular.min.js"></script>
  <script src="bower_components/angular-translate/angular-translate.min.js"></script>
  <script src="js/script.js"></script>
</body>
</html>
```

#### Adding translation using angular-translate

The first step is to add translation support for App text, we will work with Arabic and English as our main languages, the two languages are different in the way of writing and the writing direction, Arabic (RTL) English (LTR).

[angular-translate] is an [AngularJS] module that makes it very easy to translate our App text, it provides many features like filters and directives, asynchronous loading of i18n data and more.

Let's setup Angular and configure it with angular-translate

``` javascript
'use strict';

var app = angular.module('Multilingual', ['pascalprecht.translate']);

app.config(['$translateProvider', function($translateProvider){

  $translateProvider
  .translations('en', {
    'HELLO': 'Hello'
  })
  .translations('ar', {
    'HELLO': 'مرحبا'
  })
  .preferredLanguage('ar');

}]);
```

```
<html lang="en" ng-app="Multilingual">
```

What we did is:

* Create an Angular module called `Multilingual`
* Inject `angular-translate` module as a dependency into your App as `pascalprecht.translate`
* Inject `$translateProvider` in the config function
* Register translation tables in different languages as a key value and don't forget to set the language key such as `en` or `ar` as first parameter.
* Set the preferred language using `preferredLanguage(langKey)`, this is important as we use more than one language so we can teach `angular-translate` which one to use on first load.

Let's see an example using `angular-translate`, we can use translate filter as

```
<h2>{{ 'HELLO' | translate }}</h2>
```

A better way is to use the `translate` directive, using the directive is better than using the filter as described in [translate-directive] docs.

``` html
<h2 translate>HELLO</h2>
```

Another way using the directive is to pass the translation ID as attribute value of the `translate` directive.

``` html
<h2 translate="HELLO"></h2>
```

##### Let App remember the language after refresh

What if the user refreshed the page, the current scenario is to display the languages we set using `preferredLanguage`, but what if we want to display the languages to be the one the user set before the refresh, so our App can remember the language.

We will use [angular-translate-storage-local] for that, first we can install the package with bower as:

```
bower install angular-translate-storage-local --save
```

This will also install `angular-cookies` and `angular-translate-storage-local` as a dependencies.

our HTML file should be updated with the new files

```
<script src="bower_components/angular-cookies/angular-cookies.min.js"></script>
<script src="bower_components/angular-translate-storage-cookie/angular-translate-storage-cookie.min.js"></script>
<script src="bower_components/angular-translate-storage-local/angular-translate-storage-local.min.js"></script>
```

Our script file now looks like

``` javascript
var app = angular.module('Multilingual', [
'pascalprecht.translate',
'ngCookies'
]);

app.config(['$translateProvider', function($translateProvider) {

  $translateProvider
  .translations('en', {
    'HELLO': 'Hello'
  })
  .translations('ar', {
    'HELLO': 'مرحبا'
  })
  .preferredLanguage('ar')
  .useLocalStorage()
  .useSanitizeValueStrategy(null);

}]);
```

The differences here are:

* Add `ngCookies` as a dependency
* Update `angular-translate` config to use `useLocalStorage()`

##### write about `useMissingTranslationHandlerLog()`

Sometimes we need to know if we have missed some translation ID, angular-translate provides a very good method which is `useMissingTranslationHandlerLog()` which logs warnings into console for any missing translation ID. Using this method directly on `$translateProvider` as

```
$translateProvider.useMissingTranslationHandlerLog();
```

Another feature is that we can load our translation files in an asynchronous way Using staticFilesLoader, first we install the extension with bower:

```
bower install angular-translate-loader-static-files --save
```

Once installed we need to append the files to our HTML as

```
<script src="bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js"></script>
```

Now we can use `useStaticFilesLoader` method to tell angular-translate which language files to use using a specific pattern:

```
prefix - specifies file prefix
suffix - specifies file suffix
```

In our translations directory we added two files in this way

```
translations
├── ar.json
└── en.json
```

``` javascript
$translateProvider.useStaticFilesLoader({
  prefix: '/translations/',
  suffix: '.json'
})
```

If we want to add a prefix to files we can do something like this

```
translations
├── locale-ar.json
└── locale-en.json
```

``` javascript
$translateProvider.useStaticFilesLoader({
  prefix: '/translations/locale-',
  suffix: '.json'
})
```

And angular translate will concatenate the data we given to `{{prefix}}{{langKey}}{{suffix}}` then load `/translations/en.json` or `/translations/locale-en.json` file in any case.

Using the first way, config method should be

``` javascript
app.config(['$translateProvider', function($translateProvider){

  $translateProvider
  .useStaticFilesLoader({
    prefix: '/translations/',
    suffix: '.json'
  })
  .preferredLanguage('en')
  .useLocalStorage()
  .useMissingTranslationHandlerLog();

}]);
```

#### Switching between different languages

Till now we worked only with label translations, how can we switch between two languages at runtime.

``` html
  <div ng-controller="LanguageSwitchController">

    <button ng-click="changeLanguage('ar')" translate="button_lang_ar" class="button"></button>

    <button ng-click="changeLanguage('en')" translate="button_lang_en" class="button"></button>

  </div>
```

By creating a new controller we can switch the language at runtime, `anular-translate` provides a handy method `use` that takes a parameter and sets

``` javascript
app.controller('LanguageSwitchController', ['$scope', '$rootScope', '$translate',
  function($scope, $rootScope, $translate) {

    $scope.changeLanguage = function(langKey) {
      $translate.use(langKey);
    };

  }]);
```

#### CSS and changing App layout direction (RTL & LTR)
#### Conclusion

#### Load different remote content based on the selected language
#### Conclusion

* Angular broadcast

[bower]: http://bower.io/
[angular-translate]: https://angular-translate.github.io/
[HAML]: http://haml.info/
[SASS]: http://sass-lang.com/
[Gulp]: http://gulpjs.com/
[Bower]: http://bower.io/
[angular-translate-storage-local]: https://github.com/angular-translate/bower-angular-translate-storage-local
[AngularJS]: https://angularjs.org/
[asynchronous-loading]: http://angular-translate.github.io/docs/#/guide/12_asynchronous-loading
[translate-directive]:https://angular-translate.github.io/docs/#/guide/05_using-translate-directive