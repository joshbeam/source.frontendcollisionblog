---
layout: post
title:  "Modern Looking CSS Toggle Switch"
date:   2015-05-26 19:07:00
categories: javascript sass
author: Josh Beam
comments: true
---

<!--excerpt.start-->
Create a nice, modern toggle switch that works by just changing its padding and adding a transition (all it takes is a JavaScript click handler to add or remove a class)!
<!--excerpt.end-->

<a class="jsbin-embed" href="http://jsbin.com/guduco/1/embed?output">JS Bin</a><script src="http://static.jsbin.com/js/embed.js"></script>

*Works in the latest version of IE, Chrome, Firefox, and Safari.*

This toggle switch can be used to turn things into an "on" or "off" state (for example, through HTTP requests via AJAX), and the state is represented by the toggle's CSS.

# Components

The toggle is made up of two components:

The "toggle" (the container for the whole thing):

<center><img src="/images/2015-05-26-modern-looking-css-toggle-switch-toggle.png"></center>

This toggle gets the badass class name of, you guessed it, `.toggle`. It can also receive the `.on` class via JavaScript.

The next component is the "switch" (the little round thing that moves back and forth):

<center><img src="/images/2015-05-26-modern-looking-css-toggle-switch-switch.png"></center>

{% highlight html %}
<div class="toggle">
  <div class="switch"></div>
</div>
{% endhighlight %}

# Principle of function

**The only thing that changes when you click the toggle is its padding!**

When you click on the toggle, it gets an "on" class added or removed, through some nice vanilla JavaScript:

{% highlight javascript %}
[].forEach.call(document.getElementsByClassName('toggle'), function($toggle) {
  $toggle.addEventListener('mouseup', function() {
    this.classList.toggle('on');
  });
});
{% endhighlight %}

What this "on" class does is set the <code>padding-left</code> of the toggle (<img width="30" src="/images/2015-05-26-modern-looking-css-toggle-switch-toggle.png">) so that the switch appears to move to the side.

All we do after that is add some nice CSS3 transitions to the <code>background-color</code> and <code>padding</code> by saying something like <code>transition: 400ms cubic-bezier(0, 0, 0, 1);</code>, and we have a working switch.

# Don't SASS me

{% highlight scss %}
.toggle {
  // this is both the width and height of the little circular switch
  $switch-height: 36px;
  
  // change the spacing between the switch and the entire toggle
  $switch-margin: 2px;
  
  // change the width of the whole toggle
  $toggle-width: 70px;
  
  // don't change these calculations
  $toggle-height: 3 * $switch-margin + $switch-height;
  $toggle-padding: $toggle-width - $toggle-height;
  
  background-color: #eee;
  border: 1px solid #fff;
  border-radius: $toggle-height;
  box-shadow: 0 0 5px #ddd;
  box-sizing: border-box;
  height: $toggle-height;
  transition: 400ms cubic-bezier(0, 0, 0, 1);
  width: $toggle-width;
  
  &.on {
    background: lightblue;
    padding-left: $toggle-padding;
  }
  
  .switch {
    background: #fff;
    border-radius: 100%;
    height: $switch-height;
    margin: 2px;
    position: relative;
    width: $switch-height;
    z-index: 9;
  } 
}
{% endhighlight %}

# In its simplest form

For the slow people like me, here is a bare-bones version using regular ol' <code>onclick</code> and CSS (and some bad practices).

<a class="jsbin-embed" href="http://jsbin.com/yovipa/1/embed?output">JS Bin</a><script src="http://static.jsbin.com/js/embed.js"></script>

## HTML:

{% highlight html %}
<div class="toggle">
  <div class="switch"></div>
</div>
{% endhighlight %}

## CSS:

{% highlight scss %}
.toggle {
  background: #eee;
  box-sizing: border-box;
  transition: 500ms;
  width: 150px;
}

.toggle.on {
  padding-left: 100px;
}

.switch {
  background: white;
  border: 1px solid gray;
  height: 50px;
  width: 50px;
}
{% endhighlight %}

## JavaScript:

{% highlight javascript %}
document.getElementsByClassName('toggle')[0].onclick = function() {
  this.classList.toggle('on');
}
{% endhighlight %}

# Conclusion

Well that's that: a simple CSS selector switch (all it needs is a click handler). You could also make this an AngularJS directive called, say, <code>&lt;toggle&gt;&lt;/toggle&gt;</code>, and add the click handler inside the directive.

**Key points**: The switch moves by just changing the padding, and you can add a transition to make it all smooth-like.