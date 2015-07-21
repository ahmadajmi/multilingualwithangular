## Multilingual support for Angularjs

You are building a Single Page Application with Angularjs that require a multilingual support with more than one language so the user can switch instantly between languages without refreshing the page.

When we support more languages we need to do more things to our App, this will include translating App text, change layout direction (RTL & LTR) and in some cases load different content based on the selected language.

## Environment Setup

A quick overview of the development environment and how to set it up, we will use [bower] and [gulp] to manage the project dependencies, so a basic knowledge of them would be great.

Let's setup bower by running [bower init] in the command line and then install our packages, `bower init` will interactively create a manifest file [bower.json]

The next step is to install the initial required packages.

```
bower install angular --save
bower install angular-translate --save
```

Let's setup [Gulp] and install the basic packages, first we need to scaffold a `package.json` file by running `npm init` command and follow a simple steps to customize [package.json] file.

Next, install Gulp within the project:

```
npm install gulp --save-dev
```

We will need some gulp dependencies mainly for for JavaScript and Sass.

```
npm install gulp-sass --save-dev
npm install gulp-uglify --save-dev
npm install gulp-concat --save-dev
```

Create a `Gulpfile.js` file in the project directory, you can view the complete file on [Github](https://github.com/ahmadajmi/multilingualwithangular/blob/master/gulpfile.js).

In JavaScript task we will add `angular` and `angular-translate` files plus the main JavaScript file then concatenate them together and finally uglify to minify and produce a smaller file size.

``` javascript
gulp.task('js', function(){
  return gulp.src([
    './bower_components/angular/angular.js',
    './bower_components/angular-translate/angular-translate.js',

    './js/app.js'])
    .pipe(concat('app.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./js'))
});
```

``` html
<!DOCTYPE HTML>
<html lang="en">
<head>
  <title>Multilingual</title>
  <meta charset="utf-8">
  <link href="style.min.css" rel="stylesheet">
</head>

<body>
  <script src="js/app.min.js"></script>
</body>
</html>
```


## Adding translation using angular-translate

The first step is to add translation support for Application text, we will work with Arabic and English as our main languages, the two languages are different in the way of writing and the writing direction, Arabic (RTL) English (LTR).

[angular-translate] is an [AngularJS] module that makes it very easy to translate the text, it provides many features like filters and directives, asynchronous loading of i18n data and more.

Let's setup Angular and configure it with `angular-translate`

``` javascript

// js/app.js

var app = angular.module('Multilingual', ['pascalprecht.translate']);

app.config(['$translateProvider', function($translateProvider) {

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

``` html
<html ng-app="Multilingual">
```

What we did:

* Create an Angular module called `Multilingual`
* Inject `angular-translate` module as a dependency into your App as `pascalprecht.translate`
* Inject `$translateProvider` in the `.config()` method
* Register the translation tables in different languages using the `.translations()` method setting the language key such as `en` or `ar` as the first parameter.
* Set the preferred language using `.preferredLanguage()` method, this is important as we use more than one language so we can teach `angular-translate` which one to use on first load.

Let's see an example of `angular-translate` using the `translate` filter

``` html
<h2>{{ 'HELLO' | translate }}</h2>
```

A better way is to use the `translate` directive, using the directive is better than using the filter as described in [translate-directive] documentation.

``` html
<h2 translate>HELLO</h2>
```

Another way of using the directive is to pass the translation ID as attribute value of the `translate` directive.

``` html
<h2 translate="HELLO"></h2>
```

Sometimes we need to know if we have missed some translation ID, `angular-translate` provides a very good method which is `useMissingTranslationHandlerLog()` which logs warnings into console for any missing translation ID. Using this method directly on `$translateProvider` as:

``` javascript
$translateProvider.useMissingTranslationHandlerLog();
```


### Load translation files asynchronously

Instead of adding translation data for different languages in the `.config()` method, there is another way to load them in an asynchronous and lazy loading.

There are multiple ways to do this, one of them is to use the `angular-translate-loader-static-files` extension, first we need to install the extension with bower:

```
bower install angular-translate-loader-static-files --save
```

Once installed we need to update the gulp task with the extension file path.

``` javascript
gulp.task('js', function(){
  return gulp.src([
    './bower_components/angular/angular.js',
    './bower_components/angular-translate/angular-translate.js',
    'bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.js',

    './js/app.js'])
    .pipe(concat('app.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./js'))
});
```

Now we can use `useStaticFilesLoader` method to tell `angular-translate` which language files to load using a specific pattern:

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

``` json

//en.json

{
  "HELLO": "Hello",
  "button_lang_ar": "Arabic",
  "button_lang_en": "English"
}
```

``` javascript
app.config(['$translateProvider', function($translateProvider){

  $translateProvider.useStaticFilesLoader({
    prefix: '/translations/',
    suffix: '.json'
  })
  .preferredLanguage('ar')
  .useMissingTranslationHandlerLog();

}]);
```

If we want to add a prefix to files we can do something like this

```
translations
├── locale-ar.json
└── locale-en.json
```

``` javascript
app.config(['$translateProvider', function($translateProvider){

  $translateProvider.useStaticFilesLoader({
    prefix: '/translations/locale-',
    suffix: '.json'
  })
  .preferredLanguage('ar')
  .useMissingTranslationHandlerLog();

}]);
```

And angular translate will concatenate our code to `{{prefix}}{{langKey}}{{suffix}}` then load `/translations/en.json` or `/translations/locale-en.json` file in the second case.


### Switching between different languages

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

### Remember the language after page refresh

What if the user did a page refresh, the current scenario is to show the language we defined using `preferredLanguage`, but if the user selected another language then he closed the App or did a page refresh, we need the user to continue use his selected language where he left off. We can fix this by using the browser localStorage to store the selected language and then use it so our app can remember which language the user have chosen the last time.

We will use [angular-translate-storage-local] extension for that, first install the package with bower:

```
bower install angular-translate-storage-local --save
```

This will also install `angular-cookies` and `angular-translate-storage-cookie`as a dependencies, once installed we need to update the gulp task with the new files.

``` javascript
gulp.task('js', function(){
  return gulp.src([
    './bower_components/angular/angular.js',
    './bower_components/angular-translate/angular-translate.js',
    './bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
    './bower_components/angular-cookies/angular-cookies.min.js',
    './bower_components/bower_components/angular-translate-storage-cookie/angular-translate-storage-cookie.min.js',
    './bower_components/bower_components/angular-translate-storage-local/angular-translate-storage-local.min.js',

    './js/app.js'])
    .pipe(concat('app.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./js'))
});
```

* Add `ngCookies` as a dependency
* Tell `$translateProvider` to use the localStorage via `useLocalStorage()`

``` javascript
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

}]);
```

What `angular-translate` will do is to save a language key with a specific language ID, then it will retrieve it the next time the users opens the app.

`angular-translate` will store the initial language as we st it using `.preferredLanguage('en')` and then update it any time the user switches the language.

## Working with CSS and App layout direction (RTL & LTR)

Comes to the presentation part, if you are working with two languages with the same writing directions (English & French), that would be great, but if one of the language direction is RTL and the other is LTR, we need do some extra work to adjust some layout scenarios.

Let's say this is the code for the LTR language (English)

``` css
.media-image { padding-right: 1rem; }
```

When it comes to the RTL language, the above code should be mirrored to be `padding-left` instead of `padding-right`

``` css
.media-image { padding-left: 1rem; }
```

We may do something like this, but this is not a good practice and is time consuming in addition for code repetition and writhing code to override the original code.

```css
[lang='ar'] .media-image {
  padding-right: 0;
  padding-left: 1rem;
}
```

To solve this issue we need to write CSS that supports both RTL and LTR in an effective, automated and dynamic way so that we don’t have to repeat or override CSS. I wrote about [manage-rtl-css-sass-grunt] before, I encourage you to read it for more information about the issue and how to solve it.

We will do the same thing but this time using Gulp.

## Load different remote content based on the selected language
## Conclusion

* Angular broadcast

[bower]:http://bower.io/
[gulp]:http://gulpjs.com/
[bower init]:http://bower.io/docs/creating-packages/
[bower.json]:https://github.com/ahmadajmi/multilingualwithangular/blob/master/bower.json
[package.json]:https://github.com/ahmadajmi/multilingualwithangular/blob/master/package.json
[install-gulp]:https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md
[angular-translate]:https://angular-translate.github.io/
[HAML]:http://haml.info/
[SASS]:http://sass-lang.com/
[Gulp]:http://gulpjs.com/
[Bower]:http://bower.io/
[angular-translate-storage-local]:https://github.com/angular-translate/bower-angular-translate-storage-local
[AngularJS]:https://angularjs.org/
[asynchronous-loading]:http://angular-translate.github.io/docs/#/guide/12_asynchronous-loading
[translate-directive]:https://angular-translate.github.io/docs/#/guide/05_using-translate-directive
[manage-rtl-css-sass-grunt]:http://www.sitepoint.com/manage-rtl-css-sass-grunt/