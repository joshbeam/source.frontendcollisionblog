---
layout: post
title:  "How do I check if a parameter was passed in to a function in JavaScript?"
date:   2015-03-20 22:39:00
categories: javascript
author: Josh Beam
comments: true
---

<div class="note"><!--excerpt.start-->
This post is going to talk about checking for the "existence" of a parameter, if we expected one to be there and how to handle this "flow of control", and how we define "checking for existence" in the first place. The fundamental concept behind all of this, as we'll learn, is the fuzzy idea of truthiness (which is different depending on which programming language you're referring too.) We'll see that JavaScript has a very broad idea of truthiness.<!--excerpt.end-->
</div>

# What's a parameter?

A parameter can also be called an argument. It's the thing passed into a function that you do something with:

{% highlight javascript %}
	
function test(x) {
	return x + 1;
}

test(1); // ==> returns 2

var two = test(1); // this variable is now set to 2

{% endhighlight %}

But what if a function can do something *without* a parameter, or what if the functionality changes based on whether or not a parameter was passed in?

{% highlight javascript %}
	
function test(x) {
	if(x) {
		// do something
	} else {
		// do something else
	}
}

{% endhighlight %}

In the above example, we expect that if `x` "exists", then we'll do something; if not, we'll do something else. But checking for existence is a little more difficult than that. It has to do with truthiness.

# The truth about truthiness

In `if` statements, JavaScript evaluates the statement to a boolean `true` or `false`, and acts accordingly. But when certain values are encountered, JavaScript "coerces" them to a boolean value. For example, these statements are all correct:

## These are all true:
{% highlight javascript %}
	
/*
	1 == true
	0 == false
	' ' == true
	'' == false
	null == false
	undefined == false
*/

{% endhighlight %}

There are plenty of other examples. However, you'll notice above that we're using the `==` operator. This is called the equality operator. It checks if two values are "equal", but to do this, JavaScript coerces the types.

## These are all incorrect (they will evaluate to false):
{% highlight javascript %}
	
/*
	1 === true
	0 === false
	' ' === true
	'' === false
	null === false
	undefined === false
*/

{% endhighlight %}

You'll notice a very subtle, but important, difference here: we're using the `===` operator: also called the identity operator. `1` does not have the identity of `true`, *however*, it is equal to true. This is confusing at first, but this is the principle of truthiness.

This brings us to a very important logical operator, the exlamation point `!` (also called the "not" operator). It gives you the opposite of whatever boolean value you give.

## The "not" operator in action (the following statements are all true)
{% highlight javascript %}
	
/*
	!1 === false
	!0 === true
	!' ' === false
	!'' === true
	!null === true
	!undefined === true
*/

{% endhighlight %}

You'll notice above that we are using the strict identity operator `===`. This is okay, because the `!` operator coerces the values on the left side of the equation to a boolean value. So really when we say `!1 === false`, we're actually saying `false === false`. In other words, `false` *does* have the identity of `false`.

## The "double not" (or just two "not" operators &mdash; these are also all true)
{% highlight javascript %}
	
/*
	!!1 === true
	!!0 === false
	!!' ' === true
	!!'' === false
	!!null === false
	!!undefined === false
*/

{% endhighlight %}

The double not basically coerces each value into its equal boolean form. That's a weird way to say it. Think of it like this: `0 == false` is the same as `!!0 === false`.

# So how do we check for existence?

Well, it depends on how we want to define existence. Do we want to say that the parameter doesn't exist, if it is `null`,`undefined`,`0`,`false`, or some other non-truthy value? What if we want to pass in an empty string (`''`) as a value?

## Bad example:
{% highlight javascript %}
function test(x) {
	if(!!x) {
		console.log('we passed the "if" test');
		console.log('empty strings are okay too');
	}
}

test(null); // logs nothing
test(1); // ==> 'we passed the "if" test'; 'empty strings are okay too'
test(''); // logs nothing... uh oh

// By the way, if(!!x) is basically shorthand for if(x == true)

{% endhighlight %}

So we can combine instead combine logical statements to check for our idea of existence:

## Better example:
{% highlight javascript %}
function test(x) {
	if(!!x || x === '') {
		console.log('we passed the "if" test');
		console.log('empty strings are okay too');
	}
}

test(null); // logs nothing
test(1); // ==> 'we passed the "if" test'; 'empty strings are okay too'
test(''); // ==> 'we passed the "if" test'; 'empty strings are okay too'

// We could even use 'typeof'
function test(x) {
	if(!!x || typeof x === 'string') {
		console.log('we passed the "if" test');
		console.log('empty strings are okay too');
	}
}

// the above function will output the same thing

{% endhighlight %}

## Checking strictly for undefined values:
{% highlight javascript %}
function test() {
	if(a) {
		console.log('a exists!');
	}
}

// The above function will throw a ReferenceError: a is not defined

function test() {
	if(typeof a !== 'undefined')  {
		console.log('a exists!');
	}
}

// This second function won't log anything, but it also won't throw an error!
{% endhighlight %}

In the above example, `a` **was never declared**. If a variable is never declared and you try to check for its existence, you'll get an error. But the `typeof` operator is the only operator (to my knowledge) that gets around this. If you check the type of a variable that was never declared, **you won't get an error, and your program can continue**.

## Declared vs. defined
{% highlight javascript %}
var a; // this is a declared variable that exists; its value is undefined

var a = true; // this is now a defined variable; its value is NO LONGER undefined

var b;

console.log(typeof b); // ==> undefined
console.log(!!b); // ==> false

var c;
console.log(typeof c); // ==> undefined
console.log(!!c); // ==> ReferenceError! Your program is dead.
{% endhighlight %}


# Best Practice

I think in this circumstance, **the best practice depends on however you define "existence" in the context of your specific function**. This means that you have to take into consideration the concepts of truthiness, the use of the `typeof` operator, the principle of declared vs. defined, etc.

Keep in mind, too, that there are many ways to check the types of of variables you encounter. For example:
{% highlight javascript %}
var x = [];

// x.constructor === Array
// typeof x === 'object'
// x.toString() === ''

var y = 'hello';

// y.constructor === String
// typeof y === 'string'
// y.toString() === 'hello'
{% endhighlight %}

This is a topic for another post, but it demonstrates how you can check the types of a variable based on your definition of existence in the context of your specific function.
