---
layout: post
title:  "Get rid of $scope, and extend into the view model"
date:   2015-08-23 18:30:00
categories: angularjs
author: Josh Beam
comments: true
---

<div class="note">
<!--excerpt.start-->
AngularJS's <code>controllerAs</code> syntax is a good first step into being able to have some sort of sense of hierarchy in applications. However, large controllers can still get unwieldy. We can move towards controlling our controllers with <code>angular.extend</code>.
<!--excerpt.end-->
</div>

# TL;DR

Put all your controller properties into an object literal, and extend that object into `this`:

{% highlight javascript %}
angular.extend(this, vm);
{% endhighlight %}

After that, always use `this` to refer to controller properties (don't use `vm.whatever`).

# A brief overview of `controllerAs`

<a href="#skip">Skip to the next section</a> if you already know how to use this.

Basically, if you have a parent controller and a child controller nested within, you have to explicitly refer to `$scope.$parent` to access the parent controller *from* the child controller.

However, with `controllerAs` syntax, we get a **namespace**.

{% highlight html %}
<div ng-controller="ParentCtrl as parent">
  {% raw %}
  {{parent.something}}
  {% endraw %}
  <div ng-controller="ChildCtrl as child">
    {% raw %}
    {{child.something}}
    {{parent.something}}
    {% endraw %}
  </div>
</div>
{% endhighlight %}

But then in your controller, you might have to deal with this:

{% highlight javascript %}
// parent.controller.js
var vm = this;

vm.name = 'Bob';
vm.job = 'Builder';
vm.motto = 'Yes we can!';
vm.speak = speak;

function speak() {
  return vm.motto;
}
{% endhighlight %}

Also, wondering why we're using `vm`? Check out <a href="https://github.com/johnpapa/angular-styleguide#controlleras-with-vm">John Papa's AngularJS Style Guide</a>.

Now imagine that, 1000x, when you have a controller full of lots and lots of stuff. Really, you could argue that you should consider leveraging directives and services for most of your business logic, but sometimes it's difficult to do.

By the way, `controllerAs` still knows about `$scope`. This fake "namespace" simply happens internally by attaching an object to `$scope`. So in the above example, our parent controller `$scope` would look like this:

{% highlight javascript %}
{
  // a bunch of $$ angular properties, and then...
  parent: {
    name: 'Bob',
    job: 'Builder',
    motto: 'Yes we can!',
    speak: function speak(){...}
  }
}
{% endhighlight %}

In fact, if you were to inject `$scope` into that controller and ask for `$scope.parent`, you'd see all those properties. There's nothing fancy about it.

<span id="skip"></span>

# Extending the view model

Ever heard of <a href="https://docs.angularjs.org/api/ng/function/angular.extend"><code>angular.extend</code></a>? It's pretty nifty. It basically just puts properties from one object into another object, without overwriting any properties. AngularJS already attempts to protect us from this by delimiting internal properties with `$` or `$$`, so it's not really a concern anyway, but it's a nice added touch.

So, we can just make our controller look like this:

{% highlight javascript %}
// parent.controller.js
var vm = {
  name: 'Bob',
  job: 'Builder',
  motto: 'Yes we can!',
  speak: speak 
};

angular.extend(this, vm);

function speak() {
  return this.motto;
}
{% endhighlight %}

However, you'll notice that it'll usually be better from then on to continue to refer to controller properties with `this` rather than `vm`, because any changes through data-binding will propogate only to `this` (our namespaced controller), and not to our `vm` object reference. You can leverage things like <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind"><code>Function.prototype.bind</code></a> if you get into hairy contexts (like `forEach` loops, etc.).
