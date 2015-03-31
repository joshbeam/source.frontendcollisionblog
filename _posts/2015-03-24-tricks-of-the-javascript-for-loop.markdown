---
layout: post
title:  "Tricks of the JavaScript for loop"
date:   2015-03-24 22:18:00
categories: javascript
author: Josh Beam
comments: true
---

<div class="note"><!--excerpt.start-->
I'm sure you've seen the common for loop written a thousand different ways. Well, in this post, you'll learn one readable way that is good for pretty much most instances where you'll use a for loop (some exceptions are noted, too). Oh, and scroll all the way down for a bonus snippet (we'll create something pretty cool, I think).<!--excerpt.end-->
</div>

We use the `for` loop generally to cycle through, say, an array of items. We can do something with each item. For example:

{% highlight javascript %}
var arr = [1,2,3,4,5];

for(var i = 0; i < arr.length; i++) {
	console.log(arr[i]);
}
{% endhighlight %}

The code above obviously just increases `i`, starting at 0 and ending at the length of `arr`, which gives us the ability to access each of the items of `arr` by its index.

# How do you declare the loop?

There's frequently discussion on how to best write a `for` loop. There are some performance issues depending on how you write it (see this <a href="http://stackoverflow.com/a/6974417/2714730">StackOverflow question</a>), and I think a lot of it comes down to two things at the end: readability and personal style.

## Several ways:

{% highlight javascript %}
/*
	These will all ouput:
		1
		2
		3
		4
		5
*/

var arr = [1,2,3,4,5];

// #1

for(var i = 0; i < arr.length; i++) {
	console.log(arr[i]);
}

// #2
var i, len = arr.length;

for(i = 0; i < len; i++) {
	console.log(arr[i]);
}

// #3
var i = 0, len = arr.length;

for(; i < len; i++) {
	console.log(arr[i]);
}
{% endhighlight %}

There are many other ways to write the loops, but those are some of the more common ones.

## Let's go over all of them, briefly

\#1 &mdash; The problem with this one is that it <a href="http://stackoverflow.com/a/6974417/2714730">might take some browsers longer</a> because we're **"resetting" some variables each time (i.e., each iteration, the loop checks the section where we define the limit, which is oftentimes the length of an array)**. In fact, **we can prove this**:

{% highlight javascript %}
// #1
var arr = [1,2,3,4,5];

for(var i = 0; i < arr.length - i; i++) {
	console.log(arr[i]);
}

/*
	==> 1
	==> 2
	==> 3
*/

{% endhighlight %}

The engine appears to check each statement for every iteration of the loop. We can cache the variables, so in comes:

\#2 &mdash; This one caches the length, which could give you **a little micro-optimized performance boost in some browsers**. The first `i` definition doesn't get "re-evaluated" at the end of each iteration. We can prove this too:

{% highlight javascript %}
// #2
var i = 0, len = arr.length;

for(i+=i; i < len; i++) {
	console.log(arr[i]);
}

/*
	==> 1
	==> 2
	==> 3
	==> 4
	==> 5
*/
{% endhighlight %}

As you can see above, `i` is only defined once. If it wasn't, it would increase by itself each iteration, and we wouldn't see every number of `arr` in the output. So it seems we've got to a nice, optimized way of writing the loop. But in comes the "personal style" element:

\#3 &mdash; I like the last one, because it **defines everything at the top of the function**, much like how I described as a best practice in <a href="{{ "/javascript/2015/03/20/what-is-hoisting-in-javascript.html" | prepend:site.url }}">my post about hoisting</a>. You can see everything easier, and predict what is going to be used, and where. However, **this is not the best style to use, if you need to re-define the length, or limit, every iteration (for instance, if you're removing or adding items to an array)**. I think it also is very minimalistic and clean.

{% highlight javascript %}
// #3

var i = 0, len = arr.length;

for(; i < len; i++) {
	console.log(arr[i]);
}
{% endhighlight %}

## Why does #3 not throw an error?

The third one is strange, because we start it off with a `;` all by its lonesome. Well, I think this can be explained if we accept that the second part of the loop, the `i < // whatever` part, looks to define itself by `i`, wherever `i` might be. The first part, the part where we normally declare and define `i`, it just that: a part where we can initialize variables. In fact, we could initialize any variables we wanted. We could even initialize the limit, or length variable, and the array itself! Check it out:

{% highlight javascript %}
for(var arr = [1,2,3,4,5], i = 0, len = arr.length; i < len; i++) {
	console.log(arr[i]);
}
{% endhighlight %}

Pretty cool, right? The initialization section of the loop provides us a space to intialize whatever we want; the syntactical benefit is that when a user looks at it, they know that `i` and `len` are **directly tied to that loop**. The downside I think, though, is that a beginner might be fooled into thinking that `i` only exists in the scope of the `for` loop, when in fact, **even though `i` was initialized as part of the `for` loop, it still exists to whatever function scope that it's inside**. We can prove this:

{% highlight javascript %}
for(var arr = [1,2,3,4,5], i = 0, len = arr.length; i < len; i++) {
	console.log(arr[i]);
}

console.log(arr); // [1,2,3,4,5]
console.log(i); // ==> 5
console.log(len); // ==> 5
{% endhighlight %}

Each of these sections (the first part where we initialize `i`, the second part, and the third part) all have names, by the way. They are called:

{% highlight javascript %}
for(/*initialization*/;/*condition*/;/*final-expression*/) {
	console.log(arr[i]);
}
{% endhighlight %}

# So what have we learned?


Well, we learned its easier when you call things by their names: `initialization`, `condition`, and `final-expression`.

## Initialization lessons

We can use this to declare anything we want, but we don't have to use it to declare anything

{% highlight javascript %}

var arr = [1,2,3,4,5], len = arr.length, i = 0;

for(;i<len;i++) {
	console.log(arr[i]);
}

{% endhighlight %}

Additionally, although it may be a personal style issue, I think it's best to declare everything at the top of the function where the `for` loop resides, unless you need to redefine something in the `condition` section, such as the length of an array.

## Condition lessons
When it comes to arrays, we're probably better off **caching the length of the array either in the `initialization` expression or at the top of the function in which the `for` loop resides**. This can give some performance benefits. However, we want to keep in mind that in a function where we add or remove things from an array, we might need to redefine the `condition` expression of the `for` loop every iteration.

# Bonus!

**Let's create a function that does a `for` loop for us.** It eliminates the scoping issues of variables like `i` and `len`, and it feels a whole lot cleaner. In fact, this function is a simplified version of something that the [Underscore.js][underscore] and [jQuery][jquery] libraries do (jQuery has [$.each][jqeach]). You can even see a very complicated polyfill for [Array.prototype.forEach on MDN's page][mdn-each-polyfill]. Here's out simplified function:

{% highlight javascript %}
function forEach(arr,fn) {
	var i = 0, len = arr.length;

	if(arr.constructor === Array && fn.constructor === Function) {
		for(;i<len;i++) {
			fn.call(arr,arr[i],i,arr);
		}
	}
}

// usage:

var arr = [1,2,3,4,5];

forEach(arr, function(element, index, array) {
	console.log(element);
	console.log(index);
	console.log(array);
});

/*
	==> 1
	==> 0
	==> [1,2,3,4,5]

	==> 2
	==> 1
	==> [1,2,3,4,5]

	==> 3
	==> 2
	==> [1,2,3,4,5]

	==> 4
	==> 3
	==> [1,2,3,4,5]

	==> 5
	==> 4
	==> [1,2,3,4,5]
*/
{% endhighlight %}

If you want to play around with that function, or just see if it works, open up your Developer Tools (cmd+opt+j on Mac in Chrome), copy and paste, hit enter, and voila.

We could even put it in a module:
{% highlight javascript %}
;(function(win) {
	var utils = {
		forEach: forEach
	};

	function forEach(arr,fn) {
		var i = 0, len = arr.length;

		if(arr.constructor === Array && fn.constructor === Function) {
			for(;i<len;i++) {
				fn.call(arr,arr[i],i,arr);
			}
		}
	}

	win.utils = utils;
})(window);

// usage:

var myOtherModule = (function(utils) {
	var forEach = utils.forEach,
		arr = [1,2,3,4,5];
	
	forEach(arr,logEachElement);

    	/////

	function logEachElement(element,index,array) {
		console.log(element);
		console.log(index);
		console.log(array);	
	}
})(utils);

{% endhighlight %}

Boom! **Why all the strange semicolons? Why the weird function notation?** Check out my post on <a href="{{ "/javascript/snippet/2015/03/22/why-do-people-add-semicolons-before-modules.html" | prepend:site.url }}">weird semicolons</a> and on <a href="{{ "/javascript/2015/03/22/lightweight-dependency-modularization.html" | prepend:site.url }}">a simple way to modularize dependencies</a> for some answers to these question. Also, check out <a href="https://github.com/johnpapa/angular-styleguide">John Papa's AngularJS style guide</a>. It applies specifically to <a href="https://angularjs.org/">AngularJS</a>, but a lot of the principles translate well into vanilla JavaScript principles.

[underscore]:			http://underscorejs.org/
[jquery]:				http://jquery.com/
[jqeach]:				https://api.jquery.com/jquery.each/
[mdn-each-polyfill]:	https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach#Polyfill
