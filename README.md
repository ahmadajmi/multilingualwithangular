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
```

What we did is adding an Angular module called `Multilingual` and then we inject angular-translate module as a dependency into your App then setup the preferred language as `en`

Let's see an example of using the filter

{{ 'HELLO' | translate }}

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
[AngularJS]: https://angularjs.org/