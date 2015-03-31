---
layout: post
title:  "Getting started with a search engine for your site (no server required!)"
date:   2015-03-26 14:41:00
categories: javascript jekyll tutorial
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
3. Use lunr.js to **match the search query against all the blog posts** in the JSON file and **display the search results** in order by the strength of the match

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
      "content"	 : "{{post.content | strip_html | strip_newlines | remove:  "	" | escape | remove: "\"}}",
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
"content"   : "{{post.content | strip_html | strip_newlines | remove:  "	" | escape | remove: "\"}}",
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

## Step 2 &mdash; Send an AJAX request

### Create a "Query" object

Don't confuse our `Query` object with `jQuery`. Our `Query` object will serve as a container for everything related to our search. I've commented the code so you can see what everything does.

{% highlight javascript %}


//Create a module using an IIFE

;(function(global,$) {
  /*
    Put ourselves into "strict" mode
    This just helps us write cleaner JavaScript
  */
  'use strict';

  Query.prototype = {
    // this.q is our search query (for example, "javascript tutorial")
    set: function(val) {
      this.q = val;
      return this;
    },
    // brings us to our search page with a query string attached
    goToLocation: function(route) {
      if(typeof this.q !== 'undefined' && typeof this.q === 'string') {
        document.location.href=route+'/?query='+this.q;
      } else {
        return;
      }
    },
    // returns our search query (for example, "javascript tutorial")
    get: function() {
      return this.q;
    },
    // "grab" the query from the query string in the URL and set this.q to it
    setFromURL: function(name) {
      name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
      var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
          results = regex.exec(location.search);

      this.q = results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));

      return this;        
    },
    // a wrapper for jQuery's $.get
    getJSON: function(file) {
      return $.get(file);
    }
  };

  // when we initialize a query, we have the option of giving it a query string
  function Query(q) {
    if(typeof q !== 'undefined' && typeof q === 'string') {
      this.q = q;
    }
  }

  // attach the Query object to the window
  global.Query = Query;
})(this,$);
{% endhighlight %}

Whew! That's a lot of stuff. Let's write a little API documentation to show you what everything does:

1. `var query = new Query()` &mdash; we can create a new "container" to hold our search query
2. `query.set('javascript tutorial')` &mdash; this is what we want to search for, for example
3. `query.goToLocation('my-search-page')` &mdash; will bring us to `/my-search-page?query=javascript%20tutorial`
4. `query.get()` &mdash; returns `"javascript tutorial", in this case
5. `query.setFromURL()` &mdash; when we reached `/my-search-page?query=javascript%20tutorial`, we can grab the "javascript tutorial" string, and set it (internally, it says `this.q = "javascript tutorial"`)
6. `query.getJSON('/posts.json')` &mdash; this just grabs our page, `/posts.json` and returns the return value of `$.get` (this is useful because we can call `query.getJSON('/posts.json').done(function() {})`)

**Still confused?** I recommend reading up first on [Immediately Invoked Function Expressions][iife].

### Let the user search for something

{% highlight html %}
<!-- Your search form -->
<form class="search">
 	<input type="text" class="search-box" id="search" />
 	<input type="submit" class="search-button" value="Search" />
</form>
{% endhighlight %}

I hate forms. But here, we use them for a very specific reason. It's so that we can execute our search function both whenever the user clicks the "Search" button, or whenever the user hits the "enter" key on the keyboard. HTML has this built-in functionality. If we didn't use a `form`, and just used, say, a `div`, we would have to write code that would listen to both the `click` event on the button, and the `keydown` event on the text box.

So on all pages where there is the above search form, we should also have this JavaScript:

{% highlight javascript %}
// search.js
$(function(Query) {
	'use strict';

	var query = new Query();

	$('.search').on('submit',exec);	

	function submit(e) {
		// stop the form from doing its default behavior
		e.preventDefault();

		// set the query, and go to the search page with our query URL
		query
		.set($('.search-box').val().trim())
		.goToLocation('/search');
	}
}(Query));
{% endhighlight %}

We could easily write the above code as such:
{% highlight javascript %}
// search.js
function submit(e) {
	e.preventDefault();

	document.location.href='/search/?query='+$('.search-box').val().trim();
}
{% endhighlight %}

However, the only reason we're using our custom Query object is because **it separates concerns, and we've also created a reusable, easy-to-read and understandable module**.

### Finally, send the request

We'll have the following code **on our `/search` page**:

{% highlight javascript %}
// results.js
$(function(Query,utils) {
	var query = new Query(),
		site = location.protocol + "//" + location.host,
		// some utility functions
		utils = utils;

	query
	.setFromURL('query')
	.getJSON('/posts.json')
	.done(function(data) {
		console.log(data);
		// show our results
	});	
}(Query,utils));
{% endhighlight %}

<div class="note">Remember my tip about <a href="http://jsonlint.com/">JSONLint</a>? Seriously, use it. Open up your console, and you should see your JSON (since we wrote <code>console.log(data)</code> in the above code). If you don't see it, your JSON might be improperly formatted.</div>

### Wait, what's `utils`?

`utils` is a little package of a function that we'll call `shade`. This function will be used to color our results based on the strength of the match against our query.

{% highlight javascript %}
// utils.js
;(function(global) {
	'use strict';

	var utils = {
		shade: shade
	};

	function shade(color,percent) {
		//Comes from: http://stackoverflow.com/a/13542669/2714730
		var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
		return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
	}

	global.utils = utils;
})(this);
{% endhighlight %}

We've simply wrapped it in a module, because later on we could add more methods to module (if we wanted to). For example, a <a href="{{ "/javascript/2015/03/24/tricks-of-the-javascript-for-loop.html#tocAnchor-1-8" | prepend:site.url }}">custom forEach</a> function.

## Step 3 &mdash; Use lunr.js and display the results

Here comes the fun part. First, here's the HTML for our `/search` page:

{% highlight html %}
<!-- /search -->
<div class="search-results-count"></div>
<ul class="search-results"></ul>
{% endhighlight %}

That's literally it. Our JavaScript is a bit more interesting:
{% highlight javascript %}
// results.js
.done(function(data) {
	var searchIndex,
		results,
		$resultsCount = $('.search-results-count'),
		$results = $('.search-results'),
		totalScore = 0,
		percentOfTotal;

	// PIECE 1
	// set up the allowable fields
	searchIndex = lunr(function() {
		this.field('title');
		this.field('category');
		this.field('content');
		this.ref('url');
		this.field('date');
	});
	
	// PIECE 2
	// add each item from posts.json to the index
	$.each(data,function(i,item) {
		searchIndex.add(item);
	});

	// PIECE 3
	// search for the query and store the results as an array
	results = searchIndex.search(query.get());
	
	// PIECE 4
	// add the title of each post into each result, too (this doesn't come standard with lunr.js)
	for(var result in results) {
		results[result].title = data.filter(function(post) {
			return post.url === results[result].ref;
		})[0].title;
	}

	// show how many results there were, in the DOM
	$resultsCount.append(results.length + (results.length === 1 ? ' result' : ' results') + ' for "' + query.get() +'"');

	// PIECE 5
	// get the total score of all items, so that we can divide each result into it, giving us a percentage
	$.each(results, function(i, result) {
		totalScore+=result.score;
	});

	// PIECE 6 & PIECE 7
	// append each result link, with a border that corresponds to a color with a strength equal to its percentage
	// of the total score
	$.each(results, function(i,result) {
		percentOfTotal = result.score/totalScore;

		$results.append('<li><a href="'+ site + result.ref +'">'+result.title+'</a></li>');
		$results.children('li').last().css({
			'border-left': '20px solid '+utils.shade('#ffffff',-percentOfTotal)
		});
	});		
});	
{% endhighlight %}

Let's go over this in pieces:

### Piece 1

We set up a `searchIndex` object, which is just an initialization of `lunr`. If you notice, we call `this.field()`, and every field **actually exactly matches the fields that we have in our `posts.json`**.

### Piece 2
Then, we loop through our JSON objects from `posts.json`, and we add them to `searchIndex`.

### Piece 3
We call `.search(query.get())` on our `lunr` object, `searchIndex`. Remember, we called `query.setFromURL()`, so when we call `query.get()`, it returns the query string from the URL

### Piece 4
It turns out that the `results` object only contains objects with a `ref` field. Open up your console and run your code and you'll see what I mean. The `ref` field we set up to be the URL of the post. So all we're gonna do is add the title of each post to the result object too, so that way later, we can add the `a` tags with the URLs and titles.

### Piece 5
Each object also has a field called `score`, which lunr.js generates. This is a number between 0 and 1, which reflects the strength of the match. So if we have a match with a score of `0.09`, and a match with a score of `0.0062`, the one with `0.09` matched higher, based on lunr's algorithm.

### Piece 6
So, we'll use a little bit of math. If we have two matches, result #1 at `0.09` and result #2 at `0.0062`, the total is `0.0962`, right? So result #1's fraction of the total is `result.score / totalScore`, which is about `0.9355`, and result #2's is about `0.0644`.

### Piece 7
In comes our `shade` method. We're gonna add a thick border to the side of each search result, and we'll darken it by each result's percentage. Thus, the higher strength of the match for a result, the darker the side border is, which shows the user, intuitively, that that specific match is "stronger", since it has a "stronger" color. As a side note, when we loop through the elements and display them in a list with jQuery, the results are in order from highest score to lowest score by default (thanks to lunr.js), so the results are automatically ordered from high to low in your resulting HTML.

# Conclusion

So that's it. We've successfully implemented a client-side only (or, mostly, since we use AJAX) search system.

## Benefits

1. We can use it on GitHub pages, or whatever hosting site you use that doesn't support a backend with PHP, Node.js, etc.
2. Everything is written in JavaScript and HTML, so it's relatively simple
3. We can render all the JSON ourselves (with Liquid and Jekyll), and serve it up statically
3. ... It works.

## Drawbacks

1. Could be slow, depending on how many results you have. If you have a lot of results, you might want to consider using some loading icons or some sort of AJAX progress bar to show the progress of the loading so the user isn't looking at a blank screen thinking nothing is happening. Also, you could display only a certain amount of results at a time, and wait to render to the second or third, etc., set of results until the user clicks a "next" button, or whatever.
2. JSON is finnicky. You have to render your JSON file with Liquid very detailed.
3. It's a little bit hacky (using Liquid to make the JSON file)

# Example

As of the date of this post, I am using this on my website. Scroll down to the footer to utilize the search feature.

# Credits

Thanks to [christian-fei][cfei] for the inspiration for the JSON creation via Liquid.

Also, thanks [Lunr.js][lunrjs]!



[jekyllrb]:		   		http://jekyllrb.com/
[lunrjs]:		     	http://lunrjs.com/
[jquery]:		     	http://jquery.com/
[liquid]:		    	http://liquidmarkup.org/
[gh-pages]:		  		https://pages.github.com/
[liquid-filters]:		https://github.com/Shopify/liquid/wiki/Liquid-for-Designers
[jsonlint]:			 	http://jsonlint.com/
[iife]:           		http://benalman.com/news/2010/11/immediately-invoked-function-expression/
[cfei]:					https://github.com/christian-fei/Simple-Jekyll-Search