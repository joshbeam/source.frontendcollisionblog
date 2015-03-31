---
layout: post
title:  "What is hoisting in JavaScript?"
date:   2015-03-20 17:31:00
categories: javascript
author: Josh Beam
comments: true
---

<div class="note"><!--excerpt.start-->
What is this strange word "hoisting"? As of the current version of JavaScript (ECMAScript5), there's not really such a thing as block scope, which is something common to lots of other programming languages (there is a caveat though, which we'll learn towards the end of this post.) Hoisting and the non-existence of "block scope" can be confusing. Learn how to overcome this issue.<!--excerpt.end-->
</div>

# Hoisting is small concept that's pretty important

Hoisting is a concept that really defines a fundamental principle of JavaScript: **there's no such thing as *block scope***.

What does that mean? Well, we know there's a thing called *function scope*:

# Function scope example
{% highlight javascript %}
// This area out here is our "global scope"

var globalVariable = [0,1,2,3];

function testFunction() {

	//This area in here is our "function scope"

	// We can access variables from the global scope
	console.log(globalVariable) // ==> [0,1,2,3]
	
	// "var" makes this variable only exists inside the function
	var hello = 'hello';

	// since there's no "var" keyword,
	// we might as well have put this variable in the global scope
	anotherVariable = 'anotherVariable'; 

}

console.log(hello) // ==> undefined

console.log(anotherVariable) // ==> 'anotherVariable'

{% endhighlight %}

... Easy. 

But how do we define block scope? In some other languages, it might be whatever is inside an `if` statement or a `for` loop. But that doesn't exist in JavaScript (well, with a caveat, which we'll go over in a later section):

# If-statement example
{% highlight javascript %}

function testFunction(num) {
	if(num < 5) {
		console.log('less than five');
	} else {
		console.log('greater than or equal to five');
	}
}

testFunction(4); // ==> 'less than five'

{% endhighlight %}

The above example is super easy to understand. But let's try and do something else with it.

## Trying to use block scope in JavaScript
{% highlight javascript %}

function test() {
	
	if(/* something */) {
		var foo = 'bar';
		console.log('foo'); // ==> 'bar'
	}

	console.log('foo'); // ==> 'bar'
}

{% endhighlight %}

In the above example, if you didn't know any better and you thought JavaScript had block scope, you might assume that the variable `foo` only exists inside the `if` block. But it doesn't. In fact, even if the condition in the `if` statement evaluated to false, the variable `foo` would still exist to the *entire function*, but it just would not be set to `'bar'` (it would actually just remain `undefined`).

# So what's hoisting then?

Anything defined inside of a block is actually "hoisted" up to the function scope of whatever function you're in.

{% highlight javascript %}

function test() {
	
	if(/* something */) {
		var foo;
	}
}

// it gets evaluated to something like this:

function test() {
	var foo;

	if(/* something */) {
		// do something
	}
}

{% endhighlight %}

Anything you declare inside of a block (whether it's a function, a string, an array, or whatever), it is available to the entire scope. Blocks simply evaluate those variable to whatever you say, when a certain condition is met.

# Best Practice
In my opinion, **declaring all variables that will, or even just *might*, be later defined within your function should happen at the *top* of the function**. Some arguments against this might cite possible performance issues, but that might be going into the arguments of [micro-optimization vs readability][micro-optimization].

> In my opinion, declaring all variables that will, or even just *might*, be later defined within your function should happen at the *top* of the function

I humbly assert this opinion because I think it helps immensely with code readability, especially with large, wordy functions, and understanding ahead of time what is going to happen and what certain variable might get new definitions.

{% highlight javascript %}
function someFunction() {
	var test, test1, test2, test3;

	if(/* something */) {
		test = 0;
	} else if (/* something */) {
		test1 = 0;
	} else if (/* something */) {
		test2 = 0;
	} else if (/* something */) {
		test3 = 0;
	}
}
{% endhighlight %}

In the above example, you know all the variables ahead of time, even though only one of them might actually be set to something else other than `undefined` (in this case, only one of those variables might be set to `0`).

To me, this looks like it could get **confusing**:

{% highlight javascript %}
function someFunction() {
	if(/* something */) {
		var test = 0;
	} else if (/* something */) {
		var test1 = 0;
	} else if (/* something */) {
		var test2 = 0;
	} else if (/* something */) {
		var test3 = 0;
	}
}
{% endhighlight %}

While this is a small, manufactured function that probably doesn't make sense and probably does a whole lot of nothing, in a lengthier function, someone else who reads the code might see a new variable definition, and have trouble understanding the context or the use. Additionally, all those variable declarations **will get hoisted to the top of the function anyway**. You'll still have three variables that are `undefined`, and only one that is set to `0`, but the code just happens to be more confusing.

# Small caveat regarding `let`

If you use the keyword `let` in place of `var`, everything I just wrote in this blog post is null and void. `let` allows you to declare and/or define a block-scoped variable (see the [MDN page][mdn-let], which says *"The let statement declares a block scope local variable, optionally initializing it to a value."*)

Note this warning on the MDN page as well:

> The let block and let expression syntax is non-standard and will be removed in the future. Do not use them!

[micro-optimization]:	http://stackoverflow.com/questions/21740711/can-i-speed-up-calls-to-native-methods-in-javascript
[mdn-let]:				https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let
