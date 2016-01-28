---
layout: post
title:  "Understanding Mongoose Deep Population"
date:   2016-01-24 17:45:00
categories: mongodb
author: Josh Beam
comments: true
---

<!--excerpt.start-->
While MongoDB doesn't natively support joins, the Mongoose framework now supports "deep population" (Mongoose has supported single-level populations for a while), which is akin to passing Mongoose a "graph" of what data should be populated in the results of your query. 
<!--excerpt.end-->

# Who is this post for?

- Those who have used or are familiar with <a href="http://mongoosejs.com/">Mongoose for MongoDB</a> in a <a href="https://nodejs.org/en/">Node.js</a> app and are familiar with basics of models, schemas, and queries.
- You may also have noticed that to aggregate data, you have several built-in MongoDB and Mongoose options available, but realized that queries for aggregating data oftentimes result in having to make multiple round-trips between your server and the database

# Intro

It looks like <a href="http://mongoosejs.com/">Mongoose</a> recently added sub-population to its API (see <a href="https://github.com/Automattic/mongoose/blob/4.1.0/lib/utils.js#L464">the exact line in the 4.1.0 (github)</a> release, which is the first mention I can see of `subPopulate`).

This means that if you upgrade from Mongoose 3.8.x to ^4.1.x (the latest release is <a href="https://github.com/Automattic/mongoose/tree/4.3.7">4.3.7 (github)</a> at the time of writing), then you get this built in, as well as some other feature. Keep in mind, however, there are backwards breaking changes, but <a href="http://mongoosejs.com/docs/migration.html">this guide (mongoose docs)</a> covers how to migrate successfully.

If you don't know what sub-population is, or have never even heard of **population**, keep reading...

# Quick primer on population

Skip this section if you're already familiar with <a href="http://mongoosejs.com/docs/populate.html">`Model.populate` (mongoose docs)</a>.

Let's pretend we're building a social app, and we have two models: a `User` and a `Post`:

{% highlight javascript %}
var UserSchema = {
  _id: String,
  username: String
};

var PostSchema = {
  _id: String,
  user: {
    ref: 'User',
    type: String
  }
};
{% endhighlight %}

If you run this query: `Post.find({}).populate('user').exec(callback)`, Mongoose will look at the field `user` in the post, see that it has a `ref` to the `User` model, and find that user by its `_id` (yes, right now, <a href="https://github.com/Automattic/mongoose/issues/2562">only `_id` (github issues)</a>, but this covers most general use-cases).

In other words, this query might return you this:

{% highlight javascript %}
var results = [
  {
    __t: 'Post',
    _id: '1234',
    user: {
      __t: 'User',
      _id: '5678',
      username: 'josh'
    }
  }
];
{% endhighlight %}

It's almost like a "join" in a SQL language, but not quite (remember, MongoDB doesn't support joins, but there are some features like the <a href="https://www.mongodb.com/blog/post/joins-and-other-aggregation-enhancements-coming-in-mongodb-3-2-part-1-of-3-introduction">Aggregation framework (MongoDB blog post)</a>, but I won't cover that in this article). `populate` still requires some round-trips, but it optimizes this under the hood so that to you, the developer, it appears that you got all the aggregated data you requested in one fell swoop.

Mongoose says this quite frankly:

> There are no joins in MongoDB

> Population is the process of automatically replacing the specified paths in the document with document(s) from other collection(s). We may populate a single document, multiple documents, plain object, multiple plain objects, or all objects returned from a query.

If, for whatever reason, you didn't find out about `populate` until you already have an app running in production and might not feel like changing schemas around or doing any migrations, you can also specify a model for your query (this means that your schema ***does not*** need a `ref` field):

{% highlight javascript %}
Post.find({}).popuplate({
  path: 'user',
  model: 'User'
}).exec(callback);
{% endhighlight %}

If the query were to fail, your `user` field would just be `null`.

So this is cool, but what if your `User` ***also*** has some field you want to populate? Let's go deeper...

# Deep population

This is the new thing I was talking about.

Maybe our user has friends. Let's update our `User` schema (we'll drop the `ref` fields too):

{% highlight javascript %}
var UserSchema = {
  _id: String,
  username: String,
  friends: [{ type: String }]
};
{% endhighlight %}

Now we can populate down an extra level:

{% highlight javascript %}
Post.find({}).populate({
  path: 'user',
  model: 'User',
  populate: {
    path: 'friends',
    model: 'User'
  }
}).exec(callback);
{% endhighlight %}

Even better. Now we'll get this as our result:


{% highlight javascript %}
var results = [
  {
    __t: 'Post',
    _id: '1234',
    user: {
      __t: 'User',
      _id: '5678',
      username: 'josh',
      friends: [
        {
          __t: 'User',
          _id: '9012',
          username: 'barry',
          friends: ['3456', '7890']
        },
        {
          __t: 'User',
          _id: '3456',
          username: 'rooney',
          friends: ['9012', '5678']        
        }
      ]
    }
  }
];
{% endhighlight %}

You might have noticed that `josh`'s friends also have friends. So you'll have to define your graph even down further if you want to keep populating.

So how does Mongoose fetch all the correct data?

# Under the hood

So I talked about how Mongoose does some smart stuff behind the scenes. If you look at the actual query being made as a result of this `populate` query, it'll look something like this under the hood:

{% highlight javascript %}
posts.find({});
users.find({ _id: { $in: ['5678', '9012', '3456'] } });
{% endhighlight %}

Aha! So it's just an <a href="https://docs.mongodb.org/manual/reference/operator/query/in/">`$in`</a> query! Mongoose collects all of the `_id` fields that it needs to look for per collection, and then after that... I'm not quite sure. Looking at the source code, it looks like it does some smart stuff to reflect on the results of that query and map the correct objects back to each original document, based on its position in the `populate` graph that you passed into the query... or something like that (you can look over the source code starting around <a href="https://github.com/Automattic/mongoose/blob/4.3.7/lib/model.js#L2468">line 2468 of lib/model.js</a> if you're so inclined).

In other words, yes, we're making multiple round-trips as expected, and you as the developer could do this same query yourself, but this nice Mongoose API simply ***let's us define a graph of data that we want*** and takes care of the rest under the hood. Not sure how much of this might be similar to the structure of what <a href="https://facebook.github.io/react/blog/2015/05/01/graphql-introduction.html">GraphQL</a> could be intending to do in the future (I would be interested to know, as I'm not very familiar with that).

Let's back up a second. We saw that we can start at one level and traverse down arbitrarily, but what about siblings?

# Sibling populations

Let's back up and add something to our `Post` schema. We're going to add "related posts", which is just an array of `Post` IDs:

{% highlight javascript %}
var PostSchema = {
  _id: String,
  user: String,
  related_posts: [{ type: String }]
};
{% endhighlight %}

So now we want to start at 2 different root nodes: the `user` field, and the `related_posts` field. Mongoose supports this too, and has for quite some time (but only deeply since recently):

{% highlight javascript %}
Post.find({}).populate([
  {
    path: 'user',
    model: 'User',
    populate: {
      path: 'friends',
      model: 'User'
    }
  },
  {
    path: 'related_posts',
    model: 'Post',
    populate: {
      path: 'user',
      model: 'User',
      populate: {
        path: 'friends',
        model: 'User'
      }
    }
  }
]).exec(callback);
{% endhighlight %}

As you can see above, we simply can define sibling graphs in an array. If you look starting at <a href="https://github.com/Automattic/mongoose/blob/4.3.7/lib/utils.js#L543">line 543 of the lib/utils.js source code</a>, you can see that we check first if the graph is an array, and if so, map over each individual graph, and then looking for sub-populations, and recursing over and over until we collect all the relevant IDs, perform our `$in` query, and then map the resulting docs back to the original docs. Whew. I'm glad Mongoose does that for us.

It seems like defining an arbitrarily deep graph every time we want to populate something might be a pain in the ass. Do we have to define graphs every time, or can we do it automatically?

# Automatic population per document

MongoDB <a href="https://www.mongodb.com/blog/post/introducing-version-40-mongoose-nodejs-odm">published an article referencing Mongoose 4.0</a>, and gave an example using the new `pre` and `post` `find` hooks (<a href="http://mongoosejs.com/docs/middleware.html">middleware</a>):

> But what if you always wanted to load the lead singer every time you loaded a band?

{% highlight javascript %}
// example from the article above

var bandSchema = new mongoose.Schema({
  name: String,
  lead: { type: mongoose.Schema.Types.ObjectId, ref: 'person' }
});

var autoPopulateLead = function(next) {
  this.populate('lead');
  next();
};

bandSchema.
  pre('findOne', autoPopulateLead).
  pre('find', autoPopulateLead);

var Band = mongoose.model('band', bandSchema, 'bands');
{% endhighlight %}

Nice. So if we define populations at the model level, we never have to actually call `populate`. So in our previous examples, we could just add the hooks to each model, and simply call this:

{% highlight javascript %}
Post.find({}, callback);
{% endhighlight %}

Much cleaner. If you don't want to handle this middleware yourself, you can use <a href="https://www.npmjs.com/package/mongoose-autopopulate">mongoose-autopopulate</a> plugin:

{% highlight javascript %}
PostSchema.plugin(autopopulate);
{% endhighlight %}

# Some weaknesses and things that aren't supported

If you weren't aware, you can have multiple models of different schemas all living in the same collection:

{% highlight javascript %}
mongoose.model('PhotoPost', PhotoPostSchema, 'posts');
mongoose.model('TextPost', TextPostSchema, 'posts');
{% endhighlight %}

Or, if you're using <a href="https://github.com/briankircho/mongoose-schema-extend">mongoose-schema-extend</a>:

{% highlight javascript %}
var PhotosPostSchema = PostSchema.extend({
  // your schema
}, { collection: 'posts' });
{% endhighlight %}

It's hard for Mongoose to discriminate under the hood which IDs might be duplicated across documents, so you might end up with `$in` queries that have duplicate IDs if you're querying the entire `posts` collection. Keep in mind, though, that you can also define different graphs by <a href="http://mongoosejs.com/docs/discriminators.html">`discriminatorKey`</a> (by default, `__t`). You do this with the `match` parameter:

{% highlight javascript %}
var populationGraph = {
  match: { __t: 'PhotoPost' },
  path: 'user',
  model: 'User',
  // then continue with deep population
};
{% endhighlight %}

This can ***limit specific graphs to certain models which may have varying schemas that exist in the same collection***.

Some other things that aren't supported by `populate` itself that I may write about in the future:

- Renaming fields (for example, truly, `user` is just an ID... shouldn't it be called `user_id` then in the database, but be returned to the client as `user` when it's populated?)
- Service calls (what if you want to populate a path based on some *outside service*?)

# Conclusion

This seems like a useful tool in being able to define a **declarative model** for what your data should look like as a result of any query. There are some inherent weaknesses to a lack of true "joins", but the Mongoose API does an elegant job of optimizing these types of queries under the hood.

I've only recently begun using this, so if you know something that I don't and would like to contribute to the discussion for anyone reading this article, feel free to comment below with any critiques, suggestions, random quotes, or song lyrics. Thanks.