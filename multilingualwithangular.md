## Multilingual Support for AngularJS

In this tutorial I'll show you how to add a multilingual support to any AngularJS application.

We'll build a single page application with AngularJS that requires a multilingual support with more than one language so the user can switch instantly between languages without refreshing the page. In that case we need to do more things to our App, including translating App text, switching instantly between different languages, or changing layout direction (RTL & LTR).

## Environment Setup

In order to make our development environment as more automated and flexible as possible, we'll use [Bower](http://bower.io/) and [Gulp](http://gulpjs.com/) to manage the project dependencies. If they are not installed on your system yet or you have not even used them in your development workflow, I highly recommend to install and start learning more about them.

As first task, let's setup Bower by running `bower init` in the command line inside a project directory that we'll call `multilingualwithangular`. `bower init` will interactively create a manifest file called `bower.json` which will include some information about the project as well as a list of the previously installed front-end dependencies.

The next step is to install the initial required packages.

```
bower install angular --save
bower install angular-translate --save
```

Let's setup Gulp and install the basic packages.
First we need to run  `npm init` command line and follow few simple steps to create a `package.json` file which will include some information about the project and how to manage Node.js modules.

As next step, we'll install Gulp within the project:

```
npm install gulp --save-dev
```

We'll also need some Gulp dependencies for JavaScript and Sass and other automation tools.

```
npm install gulp-sass --save-dev
npm install gulp-uglify --save-dev
npm install gulp-concat --save-dev
npm install run-sequence --save-dev
npm install browser-sync --save-dev
```

At this point, we have to create an empty `gulpfile.js` configuration file within the project directory, which will be used to define our Gulp tasks such as JavaScript and Sass.
[You can view the complete file on my Github repository](https://github.com/ahmadajmi/multilingualwithangular/blob/master/gulpfile.js).

In the JavaScript task we'll add two files, `angular` and `angular-translate`, plus the main JavaScript file inside a `/js` directory. Then, we'll concatenate them together and use a library for NodeJS called [Uglify](https://github.com/mishoo/UglifyJS) to compress and reduce the size of our file.

``` javascript
'use strict';

var gulp         = require('gulp');
var sass         = require('gulp-sass');
var concat       = require('gulp-concat');
var uglify       = require('gulp-uglify');
var runSequence  = require('run-sequence');
var browserSync  = require('browser-sync');

gulp.task('js', function(){
  return gulp.src([
    './bower_components/angular/angular.js',
    './bower_components/angular-translate/angular-translate.js',

    './js/app.js'])
    .pipe(concat('app.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./js'))
});

gulp.task('serve', function() {
  browserSync({
    server: {
      baseDir: "./"
    }
  });
});

gulp.task('build', [], function() {
  runSequence('js');
});

gulp.task('default', ['build'], function() {});
```

Done this, we can run the `gulp build` task we've previously created. It'll run the `js` task and then generate `/js/app.min.js` file that will be included in a simple `HTML` file.

``` html
<!DOCTYPE HTML>
<html>
<head>
  <title>Multilingual AngularJS</title>
  <meta charset="utf-8">
</head>

<body>
  <script src="js/app.min.js"></script>
</body>
</html>
```

To open the project in a localhost environment, run `gulp serve` and then this will automatically open a browser tab directed to [localhost:3000](http://localhost:3000/).

## Adding Translation Using angular-translate

These first configuration tasks completed, it's time to take a step forward and add translation support for the application text. We'll work with Arabic and English as our main languages, two languages which are different in the way of writing and writing directions (Right-to-Left Arabic and Left-to-Right English).

[angular-translate](https://angular-translate.github.io/) is an [AngularJS](https://angularjs.org/) module that we can use to translate the text since it provides many interesting features like filters, directives and asynchronous loading of i18n data.

First, let's setup AngularJS and configure it with `angular-translate`

``` javascript
// js/app.js

var app = angular.module('Multilingual', ['pascalprecht.translate']);

app.config(['$translateProvider', function($translateProvider) {

  $translateProvider
  .translations('ar', {
    'HELLO': 'مرحبا'
  })
  .translations('en', {
    'HELLO': 'Hello'
  })
  .preferredLanguage('ar');

}]);
```

``` html
<html ng-app="Multilingual">
```

Then run `gulp build` task from the command line to build the new changes in the JavaScript file.

Here is the explanation of what we've done in the previous code snippet:

* Created an Angular module called `Multilingual`.
* Injected the `angular-translate` module as a dependency into our App as `pascalprecht.translate`.
* Injected `$translateProvider` in the `.config()` method.
* Registered the translation tables in different languages using the `.translations()` method and setting the language key such as `en` or `ar` as the first parameter.
* Set the preferred language using `.preferredLanguage()` method, (this is important as we use more than one language, so we can teach `angular-translate` which one to use on first load).

Let's see an example of `angular-translate` using the `translate` filter

``` html
<h2>{{ 'HELLO' | translate }}</h2>
```

Having too many filters in a view sets up too many watch expressions as described in the [translate-directive](https://angular-translate.github.io/docs/#/guide/05_using-translate-directive) documentation. So, a better and faster way to implement is using the `translate` directive.

Another reason to go with the directive is that there is a chance that the user will see the raw `{{ 'HELLO' | translate }}` before our template rendered by AngularJS while it's being loading.

The way we can use the directive is to pass the translation ID as an attribute value of the `translate` directive.

``` html
<h2 translate="HELLO"></h2>
```

Sometimes we may need to know if we have missed some translation ID. Well, `angular-translate-handler-log` helps us solving this problem providing a very good method called `useMissingTranslationHandlerLog()` which logs warnings into the console for any missing translation ID.

First of all, you need to install the package with Bower;

```
bower install angular-translate-handler-log --save
```

then, update the JavaScript Gulp task.

``` javascript
gulp.task('js', function(){
  return gulp.src([
    './bower_components/angular/angular.js',
    './bower_components/angular-translate/angular-translate.js',

    // New file
    './bower_components/angular-translate-handler-log/angular-translate-handler-log.js',

    './js/app.js'])
    .pipe(concat('app.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./js'));
});
```

Run `gulp build`

using this method directly on `$translateProvider` as:

``` javascript
  $translateProvider
  .translations('ar', {
    'HELLO': 'مرحبا'
  })
  .translations('en', {
    'HELLO': 'Hello'
  })
  .preferredLanguage('ar')
  .useMissingTranslationHandlerLog();
```

For example, if we missed up the translation for `HELLO`, thanks to this method we'll get a warning message that says:

`Translation for HELLO doesn't exist`

### Load Translation Files Asynchronously

Instead of adding translation data for different languages directly in the `.config()` method, there is another way to load them in an asynchronous and lazy loading. Actually, there are [several ways](https://angular-translate.github.io/docs/#/guide/12_asynchronous-loading) to achieve this task, but in this tutorial we'll use the `angular-translate-loader-static-files` extension.

First we need to install the extension with Bower:

```
bower install angular-translate-loader-static-files --save
```

Once installed, we need to update the Gulp task with the extension file path and then run `gulp build`.

``` javascript
gulp.task('js', function(){
  return gulp.src([
    './bower_components/angular/angular.js',
    './bower_components/angular-translate/angular-translate.js',
    './bower_components/angular-translate-handler-log/angular-translate-handler-log.js',

    // New file
    'bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.js',

    './js/app.js'])
    .pipe(concat('app.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./js'));
});
```

We need to create a `/translations` directory and add the languages translation files.

```
translations
├── ar.json
└── en.json
```

`ar.json`

``` json
{
  "HELLO": "مرحبا",
  "BUTTON_LANG_AR": "العربية",
  "BUTTON_LANG_EN": "الإنجليزية",
  "WELCOME_MESSAGE": "مرحباً في موقع AngularJS المتعدد اللغات"
}
```

`en.json`

``` json
{
  "HELLO": "Hello",
  "BUTTON_LANG_AR": "Arabic",
  "BUTTON_LANG_EN": "English",
  "WELCOME_MESSAGE": "Welcome to the AngularJS multilingual site"
}
```

At this point we can use `useStaticFilesLoader` method to tell `angular-translate` which language files to load using a specific pattern:

```
prefix - specifies file prefix
suffix - specifies file suffix
```

``` javascript
// js/app.js

app.config(['$translateProvider', function($translateProvider) {

  $translateProvider
  .useStaticFilesLoader({
    prefix: '/translations/',
    suffix: '.json'
  })
  .preferredLanguage('ar')
  .useMissingTranslationHandlerLog();
}]);
```

If we want to add a prefix to the files we can rename each of them using a prefix (in this case, `locale-`).

```
translations
├── locale-ar.json
└── locale-en.json
```

``` javascript
// js/app.js

app.config(['$translateProvider', function($translateProvider) {

  $translateProvider
  .useStaticFilesLoader({
    prefix: '/translations/locale-',
    suffix: '.json'
  })
  .preferredLanguage('ar')
  .useMissingTranslationHandlerLog()
}]);
```

Here `angular-translate` will concatenate our code as `{{prefix}}{{langKey}}{{suffix}}`, and then load `/translations/locale-en.json` file for example.

### Switching Between Different Languages

So far we've seen how to work with text translations for two languages. Nevertheless, we can't still switch to the other language from the browser at runtime. To do this, we need to add a button for every language to switch from it.

``` html
<div ng-controller="LanguageSwitchController">
  <button ng-show="lang == 'en'" ng-click="changeLanguage('ar')" translate="BUTTON_LANG_AR"></button>
  <button ng-show="lang == 'ar'" ng-click="changeLanguage('en')" translate="BUTTON_LANG_EN"></button>
</div>
```

Now we can also create some `$rootScope` properties and use them on our HTML code to setup the initial layout direction and the `lang` attribute in the first load, binding them later whenever the language change.

``` javascript
// js/app.js

app.run(['$rootScope', function($rootScope) {
  $rootScope.lang = 'en';

  $rootScope.default_float = 'left';
  $rootScope.opposite_float = 'right';

  $rootScope.default_direction = 'ltr';
  $rootScope.opposite_direction = 'rtl';
}])
```

`anular-translate` provides a handy method called `use` that takes a parameter and sets the language for us based on the passed parameter. Moreover, we'll listen to the `$translateChangeSuccess` event that gets fired once a translation change is successful, in order to make sure the language has changed. Then, we can modify the `$rootScope` properties based on the selected language.

``` javascript
// js/app.js

app.controller('LanguageSwitchController', ['$scope', '$rootScope', '$translate',
  function($scope, $rootScope, $translate) {
    $scope.changeLanguage = function(langKey) {
      $translate.use(langKey);
    };

    $rootScope.$on('$translateChangeSuccess', function(event, data) {
      var language = data.language;

      $rootScope.lang = language;

      $rootScope.default_direction = language === 'ar' ? 'rtl' : 'ltr';
      $rootScope.opposite_direction = language === 'ar' ? 'ltr' : 'rtl';

      $rootScope.default_float = language === 'ar' ? 'right' : 'left';
      $rootScope.opposite_float = language === 'ar' ? 'left' : 'right';
    });
}]);
```

``` html
<html lang="{{ lang }}" ng-app="Multilingual">
```

In my article titled [Using Helper Classes to DRY and Scale CSS](http://www.sitepoint.com/using-helper-classes-dry-scale-css/), you can see another example of using these directional properties in HTML as helper classes.

``` html
<div class="text-{{ default_float }}"></div>
```

### Remember the Language

Well, we've built the switching language feature and we're able to change the language to use our favorite one, the next step is to let the App remember the language we choose, so the next time we launch our App we don't have to switch to that language again.

We will teach our App to remember the language using the browser localStorage to store the selected language and we'll use [angular-translate-storage-local](https://github.com/angular-translate/bower-angular-translate-storage-local) extension for this purpose.

First install the package with Bower:

```
bower install angular-translate-storage-local --save
```

Running this command, we'll also install `angular-cookies` and `angular-translate-storage-cookie` as dependencies.

Once installed, we need to update the Gulp task with the new files running `gulp build`.

``` javascript
gulp.task('js', function(){
  return gulp.src([
    './bower_components/angular/angular.js',
    './bower_components/angular-translate/angular-translate.js',
    './bower_components/angular-translate-handler-log/angular-translate-handler-log.js',
    'bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.js',

    // New files
    './bower_components/angular-cookies/angular-cookies.js',
    './bower_components/angular-translate-storage-cookie/angular-translate-storage-cookie.js',
    './bower_components/angular-translate-storage-local/angular-translate-storage-local.js',

    './js/app.js'])
    .pipe(concat('app.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./js'));
});
```

At this point, the next steps are:

* Adding `ngCookies` as a dependency.
* Telling `$translateProvider` to use localStorage via `useLocalStorage()`

Here is how we need to proceed:

``` javascript
var app = angular.module('Multilingual', [
  'pascalprecht.translate',
  'ngCookies'
  ]);

app.config(['$translateProvider', function($translateProvider) {
  $translateProvider
  .useStaticFilesLoader({
    prefix: '/translations/',
    suffix: '.json'
  })
  .preferredLanguage('ar')
  .useLocalStorage()
  .useMissingTranslationHandlerLog()
}]);
```

`angular-translate` will store the initial language as we set by `preferredLanguage()` with the key `NG_TRANSLATE_LANG_KEY` . It will assign the language as its value in the browser localStorage and then update it any time the user switches the language. Every time the user opens the App, `angular-translate` will retrieve **it** from localStorage.

![localstorage](https://cloud.githubusercontent.com/assets/626005/9083058/6a8488ee-3b68-11e5-988c-8a4713c5f6fe.png)

## Working with CSS and App Layout Direction (RTL & LTR)

We have reached the presentation part. If you're working with two languages with the same writing directions (for instance, English and French), that would be great. Nevertheless, if one of the language direction is RTL and the other is LTR, we need do some extra work to adjust some layout scenarios.

Let's say this is the code for the LTR language (English)

``` css
.media-image { padding-right: 1rem; }
```

When it comes to the RTL language, the above code should be mirrored to be `padding-left` instead of `padding-right`

``` css
.media-image { padding-left: 1rem; }
```

**We may do something like this, but this is not a good practice and is time consuming in addition for more code repetition writhing code to override the original code.**

```css
[lang='ar'] .media-image {
  padding-right: 0;
  padding-left: 1rem;
}
```

To solve this issue we need to write CSS that supports both RTL and LTR in an effective, automated and dynamic way, so that we don’t have to repeat or override CSS. I encourage you to read my article titled [Manage RTL CSS with Sass and Grunt](http://www.sitepoint.com/manage-rtl-css-sass-grunt/) to learn more about this technique and how to use it in your projects.

We'll implement it in this tutorial using Gulp and adding a Sass task that takes `ltr-app.scss` and `rtl-app.scss`. We'll import the main Sass file in addition to direction specific variables inside them.

``` javascript
gulp.task('sass', function () {
  return gulp.src(['./sass/ltr-app.scss', './sass/rtl-app.scss'])
  .pipe(sass())
  .pipe(gulp.dest('./css'));
});

// Update the build task with sass
gulp.task('build', [], function() {
  runSequence('js', 'sass');
});

```

`sass/ltr-app.scss` file should be

``` sass
// LTR language directions

$default-float:          left;
$opposite-float:        right;

$default-direction:       ltr;
$opposite-direction:      rtl;

@import 'style';
```

And `sass/rtl-app.scss`

``` sass
// RTL language directions

$default-float:         right;
$opposite-float:         left;

$default-direction:       rtl;
$opposite-direction:      ltr;

@import 'style';
```

And this is an example of what `sass/style.scss`  looks like.

``` css
body { direction: $default-direction; }

.column { float: $default-float; }

.media-image { padding-#{$opposite-float}: 1rem; }
```

Now you can run `gulp build` and **the Sass task we generate** two files

``` css
/* css/rtl-app.css */

body { direction: rtl; }

.column { float: right; }

.media-image { padding-left: 1rem; }
```

``` css
/* css/ltr-app.css */
body { direction: ltr; }

.column { float: left; }

.media-image { padding-right: 1rem; }
```

The next step is to use these generated files dynamically, based on the current language. We'll use the `$rootScope` `default_direction` property to set the direction in the first load and then bind it when we change the language.

``` html
<link ng-href="css/{{ default_direction }}-app.css" rel="stylesheet">
```

## Conclusion

As we saw using [angular-translate](https://angular-translate.github.io/) is the way to go when it comes to AngularJS translation, it offers a lot of handy filters, directives and other tools to use and we have covered the translation process in many different ways like switching between languages, store selected language in user browser storage and then working with CSS to make the presentation layer more responsive with language directions.

I’ve created a Github repo for this article. [You can check out the code here](https://github.com/ahmadajmi/multilingualwithangular).