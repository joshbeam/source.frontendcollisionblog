---
layout: page
comments: false
title: Archive
permalink: /archive/
---

{% include total-posts.html %}

<ul class="unstyled archive-list">
{% for post in site.posts %}
	<li>
	  <span class="archive-list-meta">{{ post.date | date_to_string }}</span>
	  <a href="{{ post.url }}">{{post.title}}</a>
	</li>
{% endfor %}
</ul>