---
layout: post
title:  "3 lessons in solving stupid engineering problems (without resorting to manslaughter)"
date:   2015-08-23 13:39:00
categories: javascript
author: Josh Beam
comments: true
---

<div class="note">
<!--excerpt.start-->
Recently, some colleagues and I dreadfully <strike>spent</strike> wasted valuable man hours attempting to solve a bug in a hybrid mobile app. The cause of the bug? A missing &lt;script&gt; tag. Several important lessons can be learned from the ways in which we decided to go about solving this simple headbanger (no, not like you'd do at a heavy metal concert; rather, where you actually consider banging your head on a solid object) of a problem.
<!--excerpt.end-->
</div>

<center>
  <img src="{% include images/honorable-suicide %}" width="50%">
</center>

# Before we continue, here's the problem and our solution

We were attempting to integrate a certain OAuth library into a hybrid mobile app, which uses <a href="http://ionicframework.com/">ionic</a> (if you haven't heard of it, it's a pretty... interesting hybrid framework for building mobile apps with web technologies, aka, no Objective-C or Java).

Basically, the OAuth library would just let us login to our app. Except we couldn't login... Why? Because we were missing this line of code in our `index.html`:

<pre>
&lt;script src="cordova.js"&gt;&lt;/script&gt;
</pre>

That took quite a while to figure out. Pretty simple solution, though, no?

# Lesson 1: Everyone is responsible for the environment

<center>
  <img src="{% include images/tree-hugger %}" width="50%">
</center>

No, not *that* environment (well, that environment too, but that's not what we're referring to, here). We're referring to the development environment.

When you run `ionic start myApp blank`, it scaffolds a blank app for you. It also happens to set up an `index.html` for you, which already contains this cryptic line:

<pre>
&lt;!-- this will be a 404 when in a development environment --&gt;
&lt;script src="cordova.js"&gt;&lt;/script&gt;
</pre>

However, with plethora build tools available (like <a href="http://webpack.github.io/">webpack</a>), one can usually just `require('ionic')` or whatever. Instead, we got rid of the `index.html` and replaced it with our own, because we thought we were being super developers who could build an app in one step. There are many issues that play into this (for example, the whole point of a build tool such as webpack *is* to be able to be a super developer and build the app in one step... but we'll ignore that for now).

Anyway, **the initial assumption was that the environment was set up correctly from the get-go**. Usually this is a reasonable assumption, and everything *did* appear to be working correctly from the get-go, but there were some clues that we weren't paying attention to.

This isn't anyone's fault, per se, but the **key takeaway is that when you run into a bug like this, you should do your due diligence and consider that the environment could have, in fact, been setup incorrectly.** Had this been the first step, many man-hours would've been saved.

**We had three devs working on this problem, and all of us assumed that everyone else had made sure the environment was pristine. We never questioned it.**

# Lesson 2: Everything is a clue

<center>
  <img src="{% include images/aliens-meme %}" width="50%">
</center>

In our situation, we had two apps: the first app was already working, login and all. The environment, plugins, etc., in our second app appeared to be *equivalent* to those of the first app. But there was a nagging clue that was ignored.

In the context of ionic, in order to make outside requests (i.e., XHR), you have to have the <a href="https://github.com/apache/cordova-plugin-whitelist">cordova-plugin-whitelist</a> installed. However, it'll give you a nice little warning if you specify that the app can access *all* outside origins (with an asterisk: `*`), and don't supply a certain `meta` tag: `No Content-Security-Policy meta tag found. Please add one when using the Cordova-plugin-whitelist plugin.`.

Because our second app environment was theoretically equivalent to the first app, we should've expected to see this warning in our second app. However, even though this clue was extremely subtle, it could've led us to a solution much earlier. In fact, I admit that I noticed the warning wasn't present, but discounted it as a non-clue.

**The key takeaway is that everything, no matter how subtle, can be a clue.**

# Lesson 3: Question your assumptions... and then question them again

<center>
  <img src="{% include images/debugging-timeline %}" width="50%">
</center>

Our initial assumption was that it *had* to be the specific OAuth library we were using that was causing the problem.

We spent several hours combing through the source code of the library, comparing the differences between execution in the first app and the second app. But they appeared identical. And that's because they *were* identical. That's because our problem had virtually *nothing* to do with the OAuth library.

While delving into this source code did lead us to make some valuable discoveries (related and unrelated to the issue at hand), it was not the genesis of the bug. **The key takeaway is that you should question your assumptions of where the root of the problem lies.**

How do you do this practically? Well, perhaps by verbalizing your assumptions, and making a list of them. Here's what our list would've been:

- Assumption 1: our OAuth library is causing the problem
- Assumption 2: our plugins (`whitelist`, `inAppBrowser`, etc.) aren't configured correctly
- Assumption 3: our environment is set up correctly

These assumptions led us to **this potentially devastating logic**:

**Assumption: our OAuth library sucks**

**Conclusion: therefore, we need to reimplement our login system**

<center>
  <img src="{% include images/i-dont-always-make-assumptions-meme %}" width="50%">
</center>

# So how did we stumble upon a solution to this mystical problem?

We drunkenly stumbled into our solution by attempting to implement a workaround to the `inAppBrowser` plugin. **What, wot?**

Well, one of our other underlying assumpetions was that `window.open` wasn't functioning properly (this is something the OAuth library was using interally). So we thought, why not try to use `cordova.inAppBrowser.open` instead, as suggested by some StackOverflow answers?

This led us to this haunting error (I'll probably have nightmares about it for years to come):

`Uncaught ReferenceError: cordova is not defined`

Only at that point did we go back to the ionic docs and see that, in fact, you have to include this script tag in your `index.html` (even though we were attempting to use the magic of webpack):

<pre>
&lt;!-- this will be a 404 when in a development environment --&gt;
&lt;script src="cordova.js"&gt;&lt;/script&gt;
</pre>

<center>
  <img src="{% include images/y-u-no-include-cordova-webpack-meme %}" width="50%">
</center>