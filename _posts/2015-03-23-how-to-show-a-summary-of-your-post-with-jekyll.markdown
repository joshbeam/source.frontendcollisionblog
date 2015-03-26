---
layout: post
title:  "How to show a summary of your post with Jekyll"
date:   2015-03-23 09:50:00
categories: jekyll snippet
author: Josh Beam
comments: true
---

I am using the static-site generator <a href="http://jekyllrb.com/">Jekyll</a> to compile my website into a bunch of static files (the main benefit being a generally more secure and potentially quicker website due to a lack of server round-trips to a database).

I ran across <a href="http://stackoverflow.com/questions/15497207/how-to-display-post-summary-on-index-page-using-jekyll">several solutions</a> for displaying a summary or excerpt of the post in the main blog page (if you're using the basic Jekyll theme that comes standard, it'll probably be your `index.html`).

Anyway, the solution I came up with is meant to allow me to control what part of the post I want to display as an excerpt. If I don't choose a part of the post, that's okay, it just displays a default excerpt.

If you didn't know, Jekyll uses <a href="http://liquidmarkup.org/">Liquid</a> for its templating.

# Example:

{% highlight html %}
<!-- index.html -->
<p class="post-excerpt">
{% raw %}
{% if post.content contains '<!--excerpt.start-->' and post.content contains '<!--excerpt.end-->' %}
	{{ ((post.content | split:'<!--excerpt.start-->' | last) | split: '<!--excerpt.end-->' | first) | strip_html | truncatewords: 20 }}
{% else %}
	{{ post.content | strip_html | truncatewords: 20 }}
{% endif %}
{% endraw %}
</p>

<!-- _posts/some-random-post.html -->
<p>
Here's all my content, and <!--excerpt.start-->here's where I want my summary to begin, and this is where I want it to end<!--excerpt.end-->.
</p>
{% endhighlight %}

If I don't add the comments in the post, the template with simply extract the content of the post, strip the HTML tags, and truncate it 20 words, followed by an ellipsis `...`.