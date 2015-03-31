---
layout: post
title:  "Something no one tells you about minifying AngularJS controllers (until it's too late)"
date:   2015-03-31 10:48:00
categories: javascript angularjs
author: Josh Beam
comments: true
---

<div class="note"><!--excerpt.start-->
This post is going to talk briefly about the common ways people are shown to write AngularJS controllers, why minifying your code will break your application if you write them in this way, and how to fix this problem.<!--excerpt.end-->
</div>

# The usual approach to writing controllers

In many online AngularJS tutorials, you're taught (for simplicity's sake) to write a controller as such:

{% highlight javascript %}
var app = angular.module('myModule');

app.controller('MyController',function($scope) {
	$scope.doSomething = function() {
		// some code here
	}
});
{% endhighlight %}

The above code has several advantages. First, it's simple to read. Second, it's simple to write. However, it is generally recommended to minify your JavaScript code before deploying it live, since this reduces the size of the file that the server has to send (in other words, this can dramatically increase the user's perception of how fast your application loads).

**Minifying the above controller will break your application. Here's why...**

**Quick little tangent**: if you're curious, I use <a href="http://gulpjs.com/">Gulp</a> to concatenate and minify my project files. If you're just writing some code in <a href="http://jsbin.com">JSBin</a>, for example, you can just head over to an online minifier like <a href="http://jscompress.com/">jscompress</a>, which will do the job just fine in most cases.

**Continuing on...** if you minify our above example and open your app, you'll see that nothing happens. And you'll get this error in your console:

`Error: [$injector:unpr]`

So what is this error? If we click on the error in our console, it will take us to the AngularJS website, which will say something like this:

> This error results from the $injector being unable to resolve a required dependency. To fix this, make sure the dependency is defined and spelled correctly.

In other words, because of the way AngularJS uses dependency injection (it actually parses the arguments of your functions), when the code is minified, `$scope` is no longer `$scope`, `$route` is no longer `$route`, etc. Instead, they're just minified variables, like `e` or `a`, which don't make any sense to AngularJS (if you want to understand a little bit more about dependency injection and how it works in JavaScript, check out these two posts: one by <a href="http://anandmanisankar.com/posts/angularjs-dependency-injection-demystified/">Anand</a> and one by <a href="http://www.alexrothenberg.com/2013/02/11/the-magic-behind-angularjs-dependency-injection.html">Alex</a>. For now, just know that minfiying breaks dependency injection.)

In fact, I've written two JSBin examples for you to see what exactly is going on.

## Working example

<a class="jsbin-embed" href="http://jsbin.com/gijujiqixe/2/embed?js,output">JS Bin</a><script src="http://static.jsbin.com/js/embed.js"></script>

## Non-working (minified) example

<a class="jsbin-embed" href="http://jsbin.com/migine/1/embed?js,output">JS Bin</a><script src="http://static.jsbin.com/js/embed.js"></script>

Open up your console (if you're on Mac with Chrome, hit <kbd>CMD</kbd>+<kbd>opt</kbd>+<kbd>j</kbd>), and you'll actually see the injector error live on this site (since I embedded the JSBin).

# How to fix it

When you click on your error message in the console, which leads to the AngularJS website, they actually provide you with a solution to this error:

{% highlight javascript %}
angular.module('myApp', [])
.controller('MyController', ['myService', function (myService) {
  // Do something with myService
}]);
{% endhighlight %}

This way works completely fine. If you minify, AngularJS instead looks at each item in the array (which is the second argument passed to the controller in the above example), and resolves any minified dependency to match its correct string name.

But as you may or may not know, I am a big fan of John Papa's <a href="https://github.com/johnpapa/angular-styleguide">Style Guide</a>, and he specifically recommends <a href="https://github.com/johnpapa/angular-styleguide#style-y091">against the above example</a>, for several reasons. However, the biggest reason to me, is that with a long list of dependencies, the above code can get **very hard to read, very quickly**.

Just imagine if we have something like this:
{% highlight javascript %}
angular.module('myApp', [])
.controller('MyController', ['$scope', '$route', 'Item', 'items', 'utils', 'shade', function ($scope,$route,Item,items,utils,shade) {
  // Do something
}]);
{% endhighlight %}

Okay, okay, it's not **terrible**. But I think there's a better way to write it. As John Papa says:

> Why?: Avoid creating in-line dependencies as long lists can be difficult to read in the array. Also it can be confusing that the array is a series of strings while the last item is the component's function.

**Use `$inject`:**

{% highlight javascript %}
angular.module('myApp', []);

MyController.$inject = ['$scope', '$route', 'Item', 'items', 'utils', 'shade'];

angular.module('myApp')
	.controller('MyController', MyController);

function MyController($scope,$route,Item,items,utils,shade) {
	// do something
}
{% endhighlight %}

The above makes me breathe a sigh of relief, due to the now ease of readability. And, **we've solved our issue of minification. We are now minification-safe!** Anyone looking at the code can now understand exactly what is happening. *"Oh, okay, so we have **injected** several services into this controller...*"

You'll notice too that I separated the declarations of the module (I didn't chain `.controller` to `angular.module('myApp',[])`). Once again, I recommend reading John Papa's style guide for quick clarification on that.

# Conclusion

This doesn't just go for controllers. It goes for anything where you inject anything. Directives, configs, runs, factories, etc. I am of the opinion that following the above implementation of dependency injection, at least in the current version of AngularJS at the time of writing this (end of March 2015), is probably one of the best solutions to solving the minification and readibility issues caused by other solutions.

So to recap what we learned... Minifying code that uses string-dependent dependency injection can break your application, unless you explicitly define the strings to use for the dependencies, which `$inject` is perfect for.