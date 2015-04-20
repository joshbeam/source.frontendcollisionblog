---
layout: post
title:  "From JavaScript to Ruby: Style Guide"
date:   2015-04-20 14:57:00
categories: javascript ruby
author: Josh Beam
comments: true
---

<!--excerpt.start-->
This post is the second in the series of ***"From JavaScript to Ruby"***, which is aimed at helping JavaScript developers transition their thinking from JavaScript to Ruby. Here you'll find a table of the ways we do things in JavaScript, and the way you're supposed to do them in Ruby.
<!--excerpt.end-->

# Style Guide

This post is a living document. Expect changes as necessary. Suggestions? Leave a comment below or email <a href="mailto:frontendcollisionblog@gmail.com">Josh</a>.

Last updated: {{ "2015-04-20" | date: "%b %-d, %Y" }}

<table>
  <thead>
    <tr>
      <th>
        If you do this in JavaScript...
        <br>
        <small><a href="https://github.com/airbnb/javascript">Airbnb</a></small>
      </th>
      <th>
        ...do it like this in Ruby
        <br>
        <small><a href="https://github.com/bbatsov/ruby-style-guide">bbatsov</a></small>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th colspan="2">String quotes</th>
    </tr>
    <tr>
      <td><code>'Some string'</code></td>
      <td><code>'Some string'</code></td>
    </tr>
    <tr>
      <th colspan="2">String concatenation</th>
    </tr>
    <tr>
      <td>
{% highlight javascript %}
var world = 'world!',
    helloWorld = 'hello' + world;
{% endhighlight %}
      </td>
      <td>
{% highlight ruby %}
world = 'world'
hello_world = "hello #{world}"
{% endhighlight %}
      </td>
    </tr>
    <tr>
      <th colspan="2">Variable names</th>
    </tr>
    <tr>
      <td>
        <code>camelCaseVariable = true</code>
      </td>
      <td>
        <code>camel_case_variable = false</code>
      </td>
    </tr>
    <tr>
      <th colspan="2">Tabs</th>
    </tr>
    <tr>
      <td>
{% highlight javascript %}
function foo() {
    // 'hard tab', 4 spaces
}
{% endhighlight %}
      </td>
      <td>
{% highlight ruby %}
def foo
  # 'soft tab', 2 spaces
end
{% endhighlight %}
      </td>
    </tr>
    <tr>
      <th colspan="2">Callbacks</th>
    </tr>
    <tr>
      <td>
{% highlight javascript %}
function someFunction(cb) {
  var hello = 'hello';

  if(typeof cb !== 'undefined') {
    return cb.call(this, hello);
  }
}

someFunction(function (h) {
  return h;
});
{% endhighlight %}
      </td>
      <td>
{% highlight ruby %}
def someMethod
  hello = 'hello'
  yield(hello) if block_given?
end

someMethod do |h|
  h
end

# or

someMethod { |h| h }
{% endhighlight %}
      </td>
    </tr>
    <tr>
      <th colspan="2">Talking about methods</th>
    </tr>
    <tr>
      <td><code>someClass.someMethod</code></td>
      <td><code>SomeClass#some_method</code></td>
    </tr>
    <tr>
      <th colspan="2">Comments</th>
    </tr>
    <tr>
      <td>
        <code>// single-line comment</code>
{% highlight javascript %}
/*
  multi-line
  comment
*/
{% endhighlight %}
      </td>
      <td>
        <code># single-line comment</code>
{% highlight ruby %}
# multi-line
# comment
{% endhighlight %}
      </td>
    </tr>    
  </tbody>
</table>

