## Multilingual support for Angularjs

#### Intro

Lots of websites now are supporting more than one language to target more audience and exposure their services to more people. You are building a SPA App and the main requirement is to support more than one language so the user can switch instantly between two language without refreshing the page as well as doing any action in SPA.

When we support more languages we will need to do more things to our App, this will include translating App text, change layout direction (RTL & LTR) and in some cased load different content based on the selected language.

#### Environment Setup

First let's setup our development environment and add our dependencies, we will use bower to manage our project dependencies including [Angular.js] and [angular-translate]

For a better management to our packages we will use bower as a package manager.Let's setup bower with `bower init` and then install our packages

Our bower files will look like

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

```
bower install angular --save
bower install angular-translate --save
```

``` html
<!DOCTYPE HTML>
<html lang="en" ng-app="myApp">
<head>
    <title></title>
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

time for adding translation for the selected language, we will work with Arabic and English as our main languages, the two languages are different in the way of writing and the writing direction, Arabic (RTL) English (LTR).

[angular-translate] is an [AngularJS] module that makes it very easy to translate our App text, it provides many features like filters to be used directly in HTML code.

Let's setup Angular and configure it with angular-translate

```
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

What we did is:

* Create an Angular module called `Multilingual`
* Inject `angular-translate` module as a dependency into your App as `pascalprecht.translate`
* Inject `$translateProvider` in the config function
* Register translation tables in different languages as a key value object and don't forget to set the language key such as `en` or `ar` as first parameter.
* Set the preferred language using `preferredLanguage(langKey)`, this is important as we use more than one language so we can teach `angular-translate` which one to use on first load.

Let's see an example of using the filter

{{ 'HELLO' | translate }}

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

```
var app = angular.module('Multilingual', [
  'pascalprecht.translate',
  'ngCookies'
  ]);

app.config(['$translateProvider', function($translateProvider){

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

#### Switching between different languages
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