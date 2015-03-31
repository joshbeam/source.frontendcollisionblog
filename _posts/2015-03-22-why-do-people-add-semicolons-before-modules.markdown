---
layout: post
title:  "Why do people add semicolons before modules?"
date:   2015-03-22 23:34:00
categories: javascript snippet
author: Josh Beam
comments: true
---

<div class="note"><!--excerpt.start-->
This post is going to discuss the reasoning behind a strange-looking syntax style that some people use when declaring JavaScript modules (in the context of immediately invoked function expressions). Simply put, the point of this trick is to get around minification issues when using other people's code (or your own).<!--excerpt.end-->
</div>

Simple answer: because of **minification issues**.

Minification can cause modules to use each other as their arguments (unintentionally), if the developer isn't careful.

{% highlight javascript %}

(function() {
	// code
})()

(function() {
	// code	
})();

{% endhighlight %}

If you look closely enough at the above, you'll see the first <a href="http://benalman.com/news/2010/11/immediately-invoked-function-expression/">IIFE</a> is **missing a semicolon at the end**.

That means that when minified, it'll look like this:

# The broken code:

{% highlight javascript %}

(function() {})()(function() {})();

// (a)()(b)()

{% endhighlight %}

The problem is that now function `a` is being called with function `b` passed in as an argument. Interesting.

So, we just add a `;` to the *beginning* of the module, and to the *end*. This acts as a safeguard to ensure we don't run into that problem when we minify.

So, when we try doing the above example with semicolons **at the beginning *and* at the end**, and you minify the code, you get this instead:

# The working code:

{% highlight javascript %}

;(function() {})();;(function() {})();

{% endhighlight %}

The cool thing is, **the above doesn't throw any errors. In fact, <a href="http://jshint.com/">JSHint</a> won't yell at you either.**

Why is this? Check out the <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/Empty">MDN article on `empty`</a>:

> An **empty** statement is used to provide no statement, although the JavaScript syntax would expect one.

So those extra semicolons are *not* a syntax error, because a random semicolon anywhere in the code can be interpreted as an `empty` statement. Cool, huh?


