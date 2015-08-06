## Multilingual Support for Angularjs

You are building a Single Page Application with Angularjs that requires a multilingual support with more than one language so the user can switch instantly between languages without refreshing the page, in that case we need to do more things to our App, this will include translating App text, switching instantly between different languages, change layout direction (RTL & LTR).

In this tutorial we will go through theses steps and see how to add a multilingual support to any Angularjs App.

## Environment Setup

In order to make our development environment more automated and flexible we will use [Bower] and [Gulp] to manage the project dependencies, if they are not installed on your system or you still didn't use them in your development workflow, I highly recommend to install and learn more about them.

Let's setup Bower by running `bower init` in the command line inside a project directory, let's call it `multilingualwithangular`. [bower init] will interactively create a manifest file called [bower.json] which will include some information about the project as well as a list of installed front-end dependencies.

The next step is to install the initial required packages.

```
bower install angular --save
bower install angular-translate --save
```

Let's setup Gulp and install the basic packages, first we need to run  `npm init` command line and follow a simple steps to create [package.json] file which will include some information about the project and managing Node.js modules.

Next, install Gulp within the project:

```
npm install gulp --save-dev
```

We will need some gulp dependencies for JavaScript and Sass and other automation tools.

```
npm install gulp-sass --save-dev
npm install gulp-uglify --save-dev
npm install gulp-concat --save-dev
npm install run-sequence --save-dev
npm install browser-sync --save-dev
```

Create an empty `gulpfile.js` configuration file within the project directory which is used to define our gulp tasks such as JavaScript and Sass. You can view the complete file on [Github](https://github.com/ahmadajmi/multilingualwithangular/blob/master/gulpfile.js).

In JavaScript task we will add `angular` and `angular-translate` files plus the main JavaScript file inside a `/js` directory then concatenate them together and uglify to minify and produce a smaller file size.

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

At this point we can run the `gulp build` task we created above, it will run the `js` task and then generate `/js/app.min.js` file so we can include it in a simple `HTML` file.

``` html
<!DOCTYPE HTML>
<html>
<head>
  <title>Multilingual Support for Angularjs</title>
  <meta charset="utf-8">
</head>

<body>
  <script src="js/app.min.js"></script>
</body>
</html>
```

To open the project in a localhost environment run `gulp serve` and then this will automatically open a browser tab directed to [localhost:3000].

## Adding Translation Using Angular-translate

The first step is to add translation support for Application text, we will work with Arabic and English as our main languages, the two languages are different in the way of writing and the writing direction, Arabic (RTL) English (LTR).

[angular-translate] is an [AngularJS] module that we can use to translate the text, it provides many features like filters, directives and asynchronous loading of i18n data.

Let's setup Angular and configure it with `angular-translate`

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

What we did:

* Create an Angular module called `Multilingual`
* Inject `angular-translate` module as a dependency into your App as `pascalprecht.translate`
* Inject `$translateProvider` in the `.config()` method
* Register the translation tables in different languages using the `.translations()` method and setting the language key such as `en` or `ar` as the first parameter.
* Set the preferred language using `.preferredLanguage()` method, this is important as we use more than one language so we can teach `angular-translate` which one to use on first load.

Let's see an example of `angular-translate` using the `translate` filter

``` html
<h2>{{ 'HELLO' | translate }}</h2>
```

Having too many filters in a view sets up too many watch expressions as described in [translate-directive] documentation. So a better and faster way is to use the `translate` directive. Also the visibility of `{{}}` brackets, they might appear to the user in the first load.

``` html
<h2 translate>HELLO</h2>
```

Another way of using the directive is to pass the translation ID as attribute value of the `translate` directive.

``` html
<h2 translate="HELLO"></h2>
```

Sometimes we need to know if we have missed some translation ID, `angular-translate` provides a very good method `useMissingTranslationHandlerLog()` which logs warnings into console for any missing translation ID.

Install the package with Bower

```
bower install angular-translate-handler-log --save
```

Update the JavaScript Gulp task

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

Using this method directly on `$translateProvider` as:

``` javascript
  $translateProvider
  .translations('en', {
    'HELLO': 'Hello'
  })
  .translations('ar', {
    'HELLO': 'مرحبا'
  })
  .preferredLanguage('ar')
  .useMissingTranslationHandlerLog();
```

So for example if we missed up the translation for `HELLO` we will get a warning message that says:

`Translation for HELLO doesn't exist`

### Load Translation Files Asynchronously

Instead of adding translation data for different languages directly in the `.config()` method, there is another way to load them in an asynchronous and lazy loading.

There are [multiple ways](https://angular-translate.github.io/docs/#/guide/12_asynchronous-loading) to do this. In this tutorial we will use the `angular-translate-loader-static-files` extension.

First we need to install the extension with bower:

```
bower install angular-translate-loader-static-files --save
```

Once installed we need to update the Gulp task with the extension file path then run `gulp build`.

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
  "button_lang_ar": "العربية",
  "button_lang_en": "الإنجليزية",
  "welcome_message": "مرحباً في موقع Angularjs المتعدد اللغات"
}
```

`en.json`

``` json
{
  "HELLO": "Hello",
  "button_lang_ar": "Arabic",
  "button_lang_en": "English",
  "welcome_message": "Welcome to the Angularjs multilingual site"
}
```

Now we can use `useStaticFilesLoader` method to tell `angular-translate` which language files to load using a specific pattern:

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

If we want to add a prefix to the files we can rename the each one using a prefix in this case `locale-`.

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

In this case `angular-translate` will concatenate our code as `{{prefix}}{{langKey}}{{suffix}}` then load `/translations/locale-en.json` file for example.


### Switching Between Different Languages

Till now we have worked only with text translations for two languages, but still we can't switch to the other language from the browser at runtime. To do this we need to add a button for every language to switch from it.

``` html
<div ng-controller="LanguageSwitchController">
  <button ng-show="lang == 'en'" ng-click="changeLanguage('ar')" translate="button_lang_ar" class="button button-small"></button>
  <button ng-show="lang == 'ar'" ng-click="changeLanguage('en')" translate="button_lang_en" class="button button-small"></button>
</div>
```

At this point we can also create some `$rootScope` properties so we can use them on HTMl to setup initial layout direction and `lang` attribute in the first load and bind them later whenever the language change.

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

`anular-translate` provides a handy method `use` that takes a parameter and sets the language for us based on the passed parameter. Also we will listen to the `$translateChangeSuccess` event that gets fired once the a translation change was successful to make sure the language has changed and then we can modify the `$rootScope` properties based on the selected language.

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

Another example of using theses directional properties in HTML as [helper classes](http://www.sitepoint.com/using-helper-classes-dry-scale-css/)

``` html
<div class="text-{{ default_float }}"></div>
```

### Remember the Language after Page Refresh

After we have built the switching language feature and users loved it so much and so yes they can't believe they are able to change the language to use their preferred one, after that they closed the App and come back or they did a page refresh, what will happen in this case is they will see the App in the initial language we set using `preferredLanguage` and this is not good for the user experience and user time, so what we need to do is to let the user continue use the App with his selected language where he left off. We can fix this by using the browser localStorage to store the user selected language and then use it later so our App can remember which language the user have chosen the last time.

We will use [angular-translate-storage-local] extension for that, first install the package with bower:

```
bower install angular-translate-storage-local --save
```

This will also install `angular-cookies` and `angular-translate-storage-cookie`as dependencies, once installed we need to update the Gulp task with the new files then run `gulp build`.

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

The next steps is to:

* Add `ngCookies` as a dependency
* Tell `$translateProvider` to use localStorage via `useLocalStorage()`

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

`angular-translate` will store the initial language as we set by `preferredLanguage()` with the key `NG_TRANSLATE_LANG_KEY` and assign the language as it's value in the browser localStorage and then update it any time the user switch the language, so every time the user open the App it will retrieve it from localStorage.

![localstorage](https://cloud.githubusercontent.com/assets/626005/9083058/6a8488ee-3b68-11e5-988c-8a4713c5f6fe.png)


## Working with CSS and App Layout Direction (RTL & LTR)

Now we reached the presentation part, if you are working with two languages with the same writing directions (English & French), that would be great, but if one of the language direction is RTL and the other is LTR, we need do some extra work to adjust some layout scenarios.

Let's say this is the code for the LTR language (English)

``` css
.media-image { padding-right: 1rem; }
```

When it comes to the RTL language, the above code should be mirrored to be `padding-left` instead of `padding-right`

``` css
.media-image { padding-left: 1rem; }
```

We may do something like this, but this is not a good practice and is time consuming in addition for more code repetition writhing code to override the original code.

```css
[lang='ar'] .media-image {
  padding-right: 0;
  padding-left: 1rem;
}
```

To solve this issue we need to write CSS that supports both RTL and LTR in an effective, automated and dynamic way so that we don’t have to repeat or override CSS. I wrote about this technique before in [manage-rtl-css-sass-grunt] and I encourage you to read it for more information about the issue and how to solve it.

We will implement this technique for this tutorial using Gulp. Adding a Sass task that takes `ltr-app.scss` and `rtl-app.scss` and inside them we will import the main Sass file in addition to direction specific variables.

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

Now you can run `gulp build` and the Sass task we generate two files

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

The next step is to uses these generated files dynamically based on the current language. We will use the `$rootScope` `default_direction` property to set the direction in the first load and then bind it when we change the language.

``` html
<link href="css/{{ default_direction }}-app.css" rel="stylesheet">
```

## Conclusion

As we saw using [angular-translate] is the way to go when it comes to Angularjs translation, it offers a lot of handy filters, directives and other tools to use and we have covered the translation process in many different ways like switching between languages, store selected language in user browser storage and then working with CSS to make the presentation layer more responsive with language directions.

I’ve created a Github repo for this article. You can check out the code at [multilingualwithangular].


[Gulp]:http://gulpjs.com/
[Bower]:http://bower.io/
[bower init]:http://bower.io/docs/creating-packages/
[bower.json]:https://github.com/ahmadajmi/multilingualwithangular/blob/master/bower.json
[package.json]:https://github.com/ahmadajmi/multilingualwithangular/blob/master/package.json
[install-gulp]:https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md
[npm]:https://www.npmjs.com/
[angular-translate]:https://angular-translate.github.io/
[HAML]:http://haml.info/
[SASS]:http://sass-lang.com/
[angular-translate-storage-local]:https://github.com/angular-translate/bower-angular-translate-storage-local
[AngularJS]:https://angularjs.org/
[asynchronous-loading]:http://angular-translate.github.io/docs/#/guide/12_asynchronous-loading
[translate-directive]:https://angular-translate.github.io/docs/#/guide/05_using-translate-directive
[manage-rtl-css-sass-grunt]:http://www.sitepoint.com/manage-rtl-css-sass-grunt/
[multilingualwithangular]:https://github.com/ahmadajmi/multilingualwithangular
[localhost:3000]:http://localhost:3000