---
layout: post
title:  "From JavaScript to Ruby: Using Blocks Like Callbacks"
date:   2015-04-20 11:40:00
categories: javascript ruby
author: Josh Beam
comments: true
---

<!--excerpt.start-->
This post is the first in the series of ***"From JavaScript to Ruby"***, which is aimed at helping JavaScript developers transition their thinking from JavaScript to Ruby. This post will answer this fundamental question: how do I do "callbacks" in Ruby? The answer is: the "idiomatic" way (we'll talk about what "idiomatic" means) to use so-called callbacks in Ruby is to use **blocks**. We'll discuss blocks, and their similarities to JavaScript callbacks.
<!--excerpt.end-->

# Defining "callback" through practical examples

A callback is a function that happens after we call another function, but the catch is, they're coupled. However, being coupled in this way doesn't mean we can't reuse the callback function.

We often use anonymous functions in JavaScript as callbacks. Here's an example using `Array.prototype.forEach`:

{% highlight javascript %}
var names = ['Bob', 'Sue', 'Aron', 'Joseph'];

names.forEach(function(name) {
  console.log('Hello ' + name);
});

// => "Hello Bob"
// => "Hello Sue"
// => "Hello Aron"
// => "Hello Joseph"
{% endhighlight %}

We can actually sort of "scoop out" the function that we passed into `Array.prototype.forEach` in order to make it **reusable**:

{% highlight javascript %}
var names = ['Bob', 'Sue', 'Aron', 'Joseph'];

names.forEach(sayHello);

function sayHello(name) {
  console.log('Hello ' + name);
}

// => "Hello Bob"
// => "Hello Sue"
// => "Hello Aron"
// => "Hello Joseph"
{% endhighlight %}

# How do we do this in Ruby? And what does "idiomatic" mean?

You'll hear a lot of Rubyists use the word "idiomatic". Read:

> The idiomatic way to pass arguments to a method in Ruby is such and such...

> The idiomatic way to use a "callback" in Ruby is to such and such...

In normal-people speak, you'd say:

> The common way to go about doing this is such and such...

Make sense? In other words, **there are certain patterns and best practices (solutions) for common problems in Ruby: we call these solutions "idioms".** So, the idiomatic way to use callbacks in Ruby is **not to use callbacks at all. Instead, we use blocks.**

Here's how we can do the **same exact thing in Ruby, instead of JavaScript**:

<script src="//repl.it/embed/jkQ.js"></script>

If you run the above, you'll see `Hello <name>` printed for each name, and at the end it'll actually return the entire array for you to use.

**Let's compare the two. Essentially, this JavaScript...:**
{% highlight javascript %}
names.forEach(function(name) {
  console.log('Hello ' + name);
});
{% endhighlight %}

**...is the same as this Ruby:**
{% highlight ruby %}
names.each do |name|
    puts "Hello #{name}" 
end
{% endhighlight %}

**We can also write the above Ruby in another, shorter way:**
{% highlight ruby %}
names.each { |name| puts "Hello #{name}" }
{% endhighlight %}

So here's a few things we've learned from the above.

## 1st thing we learned (string interpolation)

{% highlight ruby %}
# Notice the necessary double-quotes. Interpolation doesn't work without them.
puts "Hello #{name}" 
# That's "string interpolation". It's the same as this:
puts 'Hello ' + name
{% endhighlight %}

Both ways are correct, but the string interpolation notation is more idiomatic.

In JavaScript, we call it "string concatenation":
{% highlight javascript %}
console.log('Hello ' + name);
{% endhighlight %}

## 2nd thing we learned (block syntax)

We also learned two styles, or syntaxes, for writing blocks:
{% highlight ruby %}
names.each do |name|
  # stuff here
end

# do ... end is one type of block notation. The other type is:

names.each { |name| }

# The curly braces replace the "do" and "end".
{% endhighlight %}

<div class="protip">
  <h1>Pro Tip</h1>

  <p>
    Before we continue, I want to point out a couple style points. Rubyists often use "soft tabs", or 2 spaces instead of just a 4-character tab, only because it different environments it remains readable (see <a href="http://stackoverflow.com/questions/9446109/soft-tabs-or-hard-tabs">this StackOVerflow question</a>). Also, look at the spacing between the curly braces and pipes. I recommend something to you: <a href="https://github.com/bbatsov/rubocop">Rubocop</a>, which is sort of the de-facto command line tool that tells you if your code looks bad according to the <a href="https://github.com/bbatsov/ruby-style-guide">community style guide on GitHub</a>. It's good stuff.
  </p>
</div>

## 3rd thing we learned (`Enumerable#each == Array.prototype.forEach`)

**Continuing, we learned that Ruby's `Enumerable#each` is equivalent to JavaScript's `Array.prototype.forEach` (more or less).** I have found only one online blog post so far that has made Ruby's `#each` make sense to me. It is by <a href="http://www.eriktrautman.com/posts/ruby-explained-map-select-and-other-enumerable-methods">Erik Trautman</a>.

# "Scooping out" the block like a reusable callback

There are two common ways to make a reusable "callback" in Ruby. They are the **`lambda` and the `Proc`**. There are **very subtle differences between the two ways**.

## Lambda

<script src="//repl.it/embed/jkQ/1.js"></script>

By the way, that's the **new syntax for the single-line lambda as of Ruby 1.9 (I have Ruby 2.1 right now, if you're curious)**. If you want to do a **multi-line lambda**, you do:
{% highlight ruby %}
sayHello = lambda do |name|
            puts "Hello #{name}"
           end
{% endhighlight %}

Now that's some weird-ass looking syntax, huh? Let's make it look even weirder:

## Proc (short for "procedure")

<script src="//repl.it/embed/jkQ/2.js"></script>

Did you notice, by the way, **that you can do multi-line variable assignment?** Pretty cool; you can't do that in JavaScript.

## Differences

- **Lambda**:
  - **You don't have to pass in all the arguments if you don't want to**. If your "callback" needs, say, 3 arguments, and you only pass in 2 when you use it, **there will be no error**. This is just like a JavaScript callback... but in JavaScript, the undefined arguments will be `undefined`, and in Ruby, the undefined arguments will be `nil`.
  - **If you call `return <whatever>`, the lambda stops, but any method that the lambda is in *does not* stop**. You can use the lambda's returned value in the rest of the containing method.
- **Proc**:
  - **You must pass in all the arguments**, or you'll get an error.
  - **If you call `return <whatever>`, the Proc *and* any method that it is in *will stop***. The Proc will return its value to the containing method, and the containing method will also return that same value.

**`lambda` in JavaScript:**
{% highlight javascript %}

// This is a JavaScript lambda
function world() {
  return 'world!';
}

// This is the "containing method" that uses the lambda
function hello() {
  // world() returns, but it just gives up its value, and the function continues
  var who = world();

  return 'Hello ' + who;
}

// => "Hello world"
{% endhighlight %}

**`Proc` in JavaScript:**
{% highlight javascript %}

// This is a JavaScript Proc
function world() {
  return 'world!';
}

// This is the "containing method" that uses the Proc
function hello() {
  // The containing function returns the return value of the Proc
  return 'Hello ' + world();

  // Any code below here obviously won't run:
  console.log('nothing will log here');
}

// => "Hello world"
{% endhighlight %}

In Ruby, though, as a side note, we rarely use an explicit `return` statement. You can just type a value.

**This JavaScript...:**
{% highlight javascript %}
function hello() {
  return 'Hello';
}
{% endhighlight %}

**...is equivalent to this Ruby:**
{% highlight ruby %}
def hello
  'Hello'
end
{% endhighlight %}

## The ampersand (`&`)

This confusing thing basically just makes sure the thing you're passing into the method is a Proc, sort of. You can read about that in detail on <a href="http://ablogaboutcode.com/2012/01/04/the-ampersand-operator-in-ruby/">a.blog.about.code</a>.

{% highlight ruby %}
names.each(sayHello) # => error: wrong number of arguments (1 for 0)
{% endhighlight %}

The above error is basically saying, "why did you pass me an argument? I expected 0 arguments for `#each`". `&sayHello` is **not** an argument! It is a `Proc`, **and Ruby does not count `Proc`s as arguments!**

It's weird, huh? That's because **you can pass in a block at the end of pretty much any method in Ruby, and it won't see it as an argument, in the typical sense**.

Check it out:

<script src="//repl.it/embed/jld/3.js"></script>

{% highlight ruby %}
# => What's up
# => What's up
{% endhighlight %}

We passed in a block at the end, but it didn't run. But we didn't get any error either. If we want the block to actually run, we can just say `yield`:

<script src="//repl.it/embed/jld/2.js"></script>

{% highlight ruby %}
# => What's up
# => What's up
# =>  you
{% endhighlight %}

`#block_given?` is a native method that returns a boolean (`true` or `false`) that checks if a block was passed in to the method. We have to use it in the above example, because if we just say `yield` instead of `yield if block_given?`, then we'll get an error that says `no block given (yield)`.

Also, the question mark `?` is Ruby's way of meaningfully letting the user know that the method is supposed to return a boolean. There's nothing really special about it.

**Now, going back to the original error (`error: wrong number of arguments (1 for 0)`):**

I'll try my best to sort of construe a similar error in JavaScript:
{% highlight javascript %}
names.forEach(names, sayHello); // TypeError: [object Array] is not a function

// It's saying "names" is not a function, which is true...
// forEach expects one argument (a function)

// we expected: names.forEach(sayHello);
{% endhighlight %}

If the above code were Ruby, you'd get an error something like `wrong number of arguments (2 for 1)`. Once again, I want to emphasize this is because Ruby doesn't see the `Proc` as an argument.

# Conclusion

- **Use blocks as if they were callbacks.**
- **Use a `lambda` or a  `Proc`.** Remember the two subtle differences between them (number of arguments, and return values).
- **Put a `&` before the block that you pass into the method,** if you pass it in to a native Ruby method that will run a block, like `Enumberable#each`.

# Further reading

- <a href="http://www.reactive.io/tips/2008/12/21/understanding-ruby-blocks-procs-and-lambdas/">Reactive.IO: Understanding Ruby Blocks, Procs, and Lambdas</a>
- <a href="http://makandracards.com/makandra/17305-short-lambda-syntax-in-ruby-1-9">makandracards: Short Lambda Syntax in Ruby 1.9</a>
