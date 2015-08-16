---
layout: post
title:  "3 reasons you should not be using Array.prototype.forEach"
date:   2015-08-15 19:04:00
categories: javascript
author: Josh Beam
comments: true
---

<div class="note"><!--excerpt.start-->
One of the main problems with <code>forEach</code> is that it primarily relies on side effects, whereas some native <code>Array.prototype</code> alternatives make use of semantically-correct programming paradigms (such as reduction, mapping, and filtering) and may in turn introduce less <a href="http://shaffner.us/cs/papers/tarpit.pdf">incidental complexity</a> (and enhance readability) when writing code.<!--excerpt.end-->
</div>

<center>
<img src="https://i.imgflip.com/pm0to.jpg" title="made at imgflip.com" width="300">
</center>

# 3) You should be filtering

In this example, we have an array, and we want to eliminate items from an array that don't meet a specific criteria. Here's how you'll see it done with `forEach`:


## Bad

<div class="repl">
  <div>
{% highlight javascript %}
var filteredArray = [];

[1, 2, 3, 4, 5].forEach(function(number) {
  if(number > 3) {
    filteredArray.push(number);
  }
});

console.log(filteredArray);
{% endhighlight %}
  </div>
  <div>
<pre>
[4, 5]
</pre>
  </div>
</div>

Here, we're simply getting rid of items we don't want. Luckily, `Array.prototype.filter` already has you covered there.

## Good

<div class="repl">
  <div>
{% highlight javascript %}
var filtered = [1, 2, 3, 4, 5].filter(isBig);

function isBig(number) {
  return number > 3;
}

console.log(filtered);
{% endhighlight %}
  </div>
  <div>
<pre>
[4, 5]
</pre>
  </div>
</div>


# 2) You should be mapping

In this example, we want to "change" each value in an array to something else. Here's how we'd do it with `forEach`:

## Bad

<div class="repl">
  <div>
{% highlight javascript %}
var stringNames = [];

var names = [{
  first: 'Josh',
  last: 'Beam'
},
{
  first: 'Ozzy',
  last: 'Osbourne'
}]

names.forEach(function(name) {
  stringNames.push(name.first + ' ' + name.last);
});
{% endhighlight %}
  </div>
  <div>
<pre>
["Josh Beam", "Ozzy Osbourne"]
</pre>
  </div>
</div>

Here, we're gonna use `map` instead:

## Good

<div class="repl">
  <div>
{% highlight javascript %}
var names = [{
  first: 'Josh',
  last: 'Beam'
},
{
  first: 'Ozzy',
  last: 'Osbourne'
}]

names = names.map(fullName);

function fullName(name) {
  return name.first + ' ' + name.last;
}

console.log(names);
{% endhighlight %}
  </div>
  <div>
<pre>
["Josh Beam", "Ozzy Osbourne"]
</pre>
  </div>
</div>

# 1) You should be reducing

Here, we want to combine certain values in an array.

## Bad

<div class="repl">
  <div>
{% highlight javascript %}
var total = 0;

[1, 2, 3, 4, 5].forEach(function(number) {
  total += number;
});

console.log(total);
{% endhighlight %}
  </div>
  <div>
<pre>
15
</pre>
  </div>
</div>

## Good

<div class="repl">
  <div>
{% highlight javascript %}
var total = [1, 2, 3, 4, 5].reduce(addAll);

function addAll(total, current) {
  return total + current;
}

console.log(total);
{% endhighlight %}
  </div>
  <div>
<pre>
15
</pre>
  </div>
</div>

# Conclusion

You'll notice one of the overarching concepts of all these three methods is that they all very easily take the "functional route" of returning a value. It is possible to introduce side effects within these methods, however, they don't **primarily rely on side effects to function**. In other words, you'll see that `Array.prototype.forEach` primarly relies on side effects. **It never returns a value other than `undefined` unless you explicity force it to**.

Why am I referring to functional programming in the context of JavaScript, which is clearly *not* a functional programming language? Well, to quote the <a href="https://en.wikipedia.org/wiki/Functional_programming">omniscient Wikipedia article on functional programming</a>:

> Eliminating side effects, i.e. changes in state that do not depend on the function inputs, can make it much easier to understand and predict the behavior of a program

In other words, it can take more "brain power" to understand what is happening in a `forEach` loop whose sole purpose is to mutate outside data based on side effects, whereas `map`, `reduce`, and `filter` all have **immediate** and **clear** semantic meanings to the programmer (that's not to say, though, that you can't use the power of those methods for evil).

<center>
<img src="https://i.imgflip.com/pm0kr.jpg" title="made at imgflip.com">
</center>