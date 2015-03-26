---
layout: post
title:  "Getting started with a search engine for your site (no server required!)"
date:   2015-03-26 14:41:00
categories: javascript jekyll json lunr.js tutorial
author: Josh Beam
comments: true
---

<div class="note">This tutorial is in the context of Jekyll and GitHub pages</div>

# What do you mean "no server"?

Lots of search features on websites rely on communicating with the server to deliver search results. For example, a user might click a `search` button that sends, say, a `POST` request to the server, where a `.php` file handles the request, and sends the results back.

With the way we're gonna do it here, **we're going to handle the request entirely on the client. No server-side code processing required.** We'll go over the architecture in a minute.

# Why *not* process on the server?

Nothing wrong with the traditional way of doing it. For my website, though, **I'm using [Jekyll][jekyllrb], and I'm hosting it on [GitHub pages][gh-pages]. GitHub pages doesn't support processing with PHP, Node.js, etc.** Therefore, the only way to do it is on the client (with a little bit of pre-processing, which we'll go over in a second).

# Tutorial

## Technologies used
1. [Jekyll][jekyllrb] (a static site generator)
2. [lunr.js][lunrjs] (a JavaScript search indexer)
3. [jQuery][jquery] (to make the AJAX stuff and displaying the results easier)

## Architecture
1. Take advantage of Liquid (the template system that Jekyll uses) to **create a JSON file of *all* our searchable content** (in this example, blog posts)
2. Write some JavaScript that **sends an AJAX request to retrieve the JSON file** whenever the user searches for something
3. Use lunr.js to **match the search query against all the blog posts** in the JSON file
4. **Display the search results** in order by the strength of the match

<div class="ellipsis">&hellip;</div>

## Step 1 &mdash; Make the JSON file

We're going to kind of "hack" our way through Liquid to create a JSON file.

Create a new file in your *root* called `posts.json`. Open it up:
{% highlight javascript %}
{% raw %}
---
---
[
  {% for post in site.posts %}
    {
      "title"    : "{{ post.title | escape }}",
      "category" : "{{ post.categories | join: ' ' }}",
      "content"	 : "{{post.content | strip_html | strip_newlines | remove:  "	" | remove: """}}",
      "url"      : "{{ site.baseurl }}{{ post.url }}",
      "date"     : "{{ post.date }}"
    }{% unless forloop.last %},{% endunless %}
  {% endfor %}
]
{% endraw %}
{% endhighlight %}

You'll notice some strange things. First, if you're using syntax highlighting, **you'll get all kinds of weird "errors". Ignore them.** JSON or JavaScript syntax highlighting doesn't understand that we're using Liquid.

Second, **how the hell is this going to work**, if it's a JSON file? Well, you see the two sets of `---` at the top of the file? When you run `jekyll build`, it will see this file as a "special file" that needs to be processed with Liquid. If we remove the `---`, it won't process the template. This is called "YAML front matter". **Any pages with YAML front matter get processed with Liquid.**

Most of the templating above is self-explanatory if you understand the basics of [Liquid filters][liquid-filters]. However there is **one line I'd like to explain**.

{% highlight javascript %}
{% raw %}
"content"   : "{{post.content | strip_html | strip_newlines | remove:  "	" | remove: """}}",
{% endraw %}
{% endhighlight %}

The content of our post might contain raw `tab` characters, as well as double quotes (`"`). Well, as it turns out, **having `tab` characters inside a JSON string is *invalid* JSON**, so when we call our AJAX request later, **nothing would be returned! Not good.**

Solution? Run two `remove` filters: one for the `tab` character, and one for the double quotes.

Also, **I want to explain this part:**
{% highlight javascript %}
{% raw %}
}{% unless forloop.last %},{% endunless %}
{% endraw %}
{% endhighlight %}

**If you don't have that line of code**, your output would look something like this:
{% highlight javascript %}
[
	{ /* content */ },
	{ /* content */ },
	{ /* content */ },
]
{% endhighlight %}

See the trailing comma on the last object? **This is also invalid JSON. Not good.** So, we run a some Liquid that says *don't put a comma at the end if it's the last object*.

**Now, run `jekyll build`, and you'll end up with a compiled `posts.json` underneath `_site`, which contains the entire built site. Here's the compiled JSON:**
{% highlight javascript %}
[
    {
      "title"    : "Why do people add semicolons before modules?",
      "category" : "javascript snippet",
      "content"	 : "Simple answer: because of minification issues.Minification can cause modules to use each other as their arguments (unintentionally), if the developer isn’t careful.(function() {// code})()(function() {// code})();If you look closely enough at the above, you’ll see the first IIFE is missing a semicolon at the end.That means that when minified, it’ll look like this:The broken code:(function() {})()(function() {})();// (a)()(b)()The problem is that now function a is being called with function b passed in as an argument. Interesting.So, we just add a ; to the beginning of the module, and to the end. This acts as a safeguard to ensure we don’t run into that problem when we minify.So, when we try doing the above example with semicolons at the beginning and at the end, and you minify the code, you get this instead:The working code:;(function() {})();;(function() {})();The cool thing is, the above doesn’t throw any errors. In fact, JSHint won’t yell at you either.Why is this? Check out the MDN article on empty:  An empty statement is used to provide no statement, although the JavaScript syntax would expect one.So those extra semicolons are not a syntax error, because a random semicolon anywhere in the code can be interpreted as an empty statement. Cool, huh?",
      "url"      : "/javascript/snippet/2015/03/22/why-do-people-add-semicolons-before-modules.html",
      "date"     : "2015-03-22 18:34:00 -0500"
    },
    /* and several other posts*/
]
{% endhighlight %}

<div class="note">I strongly recommend running your output through <a href="http://jsonlint.com/">JSONLint</a> if your code isn't working right. It'll help you find whatever errors you might have in your JSON syntax.</div>

<h1>To be continued...</h1>

[jekyllrb]:			http://jekyllrb.com/
[lunrjs]:			http://lunrjs.com/
[jquery]:			http://jquery.com/
[liquid]:			http://liquidmarkup.org/
[gh-pages]:			https://pages.github.com/
[liquid-filters]:	https://github.com/Shopify/liquid/wiki/Liquid-for-Designers
[jsonlint]:			http://jsonlint.com/