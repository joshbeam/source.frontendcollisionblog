---
layout: post
title:  "Lightweight dependency modularization"
date:   2015-03-22 21:00:00
categories: javascript
author: Josh Beam
comments: true
---

<div class="note"><!--excerpt.start-->
So what's this post all about? We're going to examine an interesting alternative for passing dependencies between JavaScript modules. The goal is to avoid any overhead (by using libraries like RequireJS), but also to avoid attaching too many things to the global namespace...<!--excerpt.end-->
</div>

# A common approach

A common approach when utilizing the <a href="http://addyosmani.com/resources/essentialjsdesignpatterns/book/#modulepatternjavascript">module pattern</a> or something close to it, is to attach the end object to the `window`, or return the object inside some sort of local variable to create a namespace for your module.

So you might end up having something like this:

{% highlight javascript %}
// first.module.js
;(function(win) {
	var exports = //code

	win.firstModule = exports;
})(window);

// several more modules...

// and eventually a module that depends on firstModule

// fifth.module.js
;(function(win,firstModule) {
	// do something with firstModule

	var exports = //code;

	win.fifthModule = exports;
})(window,firstModule);
{% endhighlight %}

{% highlight html %}
<!-- then in your html... -->

<script src="first.module.js"></script>
<!-- several other modules -->
<scirpt src="fifth.module.js"></script>

{% endhighlight %}

Of course, the obvious problems with this are:

1. You attach a lot of stuff to the global scope (this can be overcome with various techniques, though)
2. You have to get the order of your `<script>` tags pretty exact (we're pretending we're not using a task runner here, like <a href="http://gulpjs.com/">gulp</a>)

... and probably several other I'm forgetting about. There are other ways to do this (a popular library like <a href="http://requirejs.org/">RequireJS</a>, for example), but in my case, I wanted to try to use a basic object that would be attached to the `window`, and have all of my dependencies attach to that global object.

# A global dependencies object

For <a href="http://github.com/joshbeam/angular-state-manager">angular-state-manager</a>, I utilized a global object called `stateManagerDependencies`, or something along that line, to attach all of my modules to that would eventually go into the main `stateManager` module.

The purpose of this was to only have one object (the `stateManagerDependencies` object) be attached to the global scope (i.e. `window` object), and that would hold all of the dependencies, as opposed to attaching each dependency to the global scope at the end of each module.

{% highlight javascript %}
// dependencies.js
;(function(win) {

	win.stateManagerDependencies = {};

})(window);

// first.example.module.js
;(function(dependencies) {
	var dependencies = dependencies;

	// then, use them...
})(stateManagerDependencies);

// etc.

{% endhighlight %}

## Obvious downsides to this approach

1. You're still attaching some strangely named global object to the `window`
2. In each module that depends on the `dependencies` object, there is no error-checking or method to list what modules are available inside the `dependencies` object (a possible fix for this is to simply implement some of those methods, for example: `.list()`, or `.checkFor()`, etc.)