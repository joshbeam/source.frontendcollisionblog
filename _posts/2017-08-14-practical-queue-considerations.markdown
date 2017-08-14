---
layout: post
title:  "Practical Queue Considerations"
date:   2017-08-14 13:45:00
categories: rabbitmq
author: Josh Beam
comments: true
---

<!--excerpt.start-->
Intuitively, we jump to HTTP to use as our communication protocol between services in a system. However, using a queue has many benefits. In this post, instead of diving only into theory of queues, I'll give practical advice on implementing a queue, illustrate some use cases I've encountered in a production system where using a queue had obvious benefits versus HTTP, as well as give some practical implementation ideas.
<!--excerpt.end-->

# Who is this post for?

- Those who have used or are familiar with the idea behind queues (like <a href="https://www.rabbitmq.com/">RabbitMQ</a>), and have a general idea about the purpose and benefits/tradeoffs of a system that uses <a href="https://martinfowler.com/articles/microservices.html">microservices</a>.

# Recommended Reading

- <a href="https://www.amazon.com/Enterprise-Integration-Patterns-Designing-Deploying/dp/0321200683">Enterprise Integration Patterns</a>

# TL;DR

- Tip: Use message types properly. **Read <a href="https://www.amazon.com/Enterprise-Integration-Patterns-Designing-Deploying/dp/0321200683">Enterprise Integration Patterns</a> to learn about message types (document, command, and event messages)**... I cannot stress this point enough
- Benefit: messages still get delivered even if a server goes down (in theory). But, make sure your consumers are idempotent.
- Implementation idea: try using a queue for each service
- Tip: set up a dead letter queue
- Tip: encrypt everything yourself

# Message Types

<a href="https://www.amazon.com/Enterprise-Integration-Patterns-Designing-Deploying/dp/0321200683">Enterprise Integration Patterns</a> was published back in 2004, but has invaluable information for patterns in developing a system that uses queues for communication. Best of all, the information is clear and practical (by the way, I don't get anything for recommending this book, I just think it's really good). The biggest question I had going into implementing a queue system was:

How do I format my messages? (Book gives you the patterns: <a href="http://www.enterpriseintegrationpatterns.com/patterns/messaging/DocumentMessage.html">document</a>, <a href="http://www.enterpriseintegrationpatterns.com/patterns/messaging/EventMessage.html">event</a>, <a href="http://www.enterpriseintegrationpatterns.com/patterns/messaging/CommandMessage.html">command</a>)

Very briefly:

1. Document message - data is a single unit of data. It is a piece of information (for example, a MongoDB or SQL document)
2. Event message - it's simply a notification that something happened (&#42;)
3. Command message - it is a verb that says "do this"

I'll give you an example of how these message types interact with one another:

You send a **command** message to a particular service (with the routing key **DoSomething**). Some asynchronous stuff happens in the background, and an **event** message **SomethingDone** is broadcasted to *all* queues that are interested when something is done. This message contains the <code>_id</code> of a document that was affected, and then each service that heard the **SomethingDone** event requests via a request-reply queue for the document with the <code>_id</code> that was received in the event message (and whichever service knows about that document type sends a **document** message to the requesting service) (&#42;&#42;).

This is a very lightweight interaction method between services, and is especially useful when the communication can happen asynchronously. It may seem convoluted, but when you have your infrastructure set up, it can all happen pretty automatically.

(&#42;) *There is a nuance between event messages that contain metadata, versus an event message that contains a document, which is described in the book*

(&#42;&#42;) *This is the "pull" method, as opposed to the "push" method. The "push" method would actually send the entire document along with the event message so that there doesn't need to be a separate RPC request for the document after the event is received. For brevity, I'll leave out the details here, and recommend you again to read the Message Types chapters in the book*

# Message Delivery

Queues are especially useful when you have **important messages** that you want to know **will be delivered**. However, your design pattern for your messages and your message consumers should be **idempotent** (meaning, given the same message, the consumer will do the same thing each time). In other words, you don't want a consumer that increments somebody's bank account value by $1 every time it receives a message. Instead, you want the consumer to set the value to a specific value (which was $1 plus whatever the previous known value was). This is safer.

There are caveats to this, and it depends on if, for example, your queues are durable, your messages are persistent, and your queue server is up (you can mitigate this risk too, by using an offline in-memory queue). However, given that your queue system itself is generally reliable, you have now managed to separate message delivery reliability from the application server itself.

Places where this is helpful:

1. If an app server crashes and restarts
2. If you have to manually restart a server
3. If you need to scale a cloud server, which causes a restart

For points 1 and 2, most people will quip back with "well, you should have error handlers". Yes, agreed. However, this assumes that the engineer managed to provide 100% error coverage, which isn't realistic. Servers still crash, servers still need to be restarted, etc.

For point 3, if you've used something like <a href="https://www.heroku.com">Heroku</a>, you'll notice that you have the option to scale horizontally, which means in Heroku's context that you increase the number of dynos, which supports more traffic to the dyno. However, this also causes a server restart.

Now, the benefit: I've seen a server restart, watched the logs, and then see a message get delivered (a message that was sent immediately *before* the server restarted). It didn't really click in my head until I actually saw it happen in production in a critical instance: I restarted the server, and a message was still consumed by the process that I restarted.

This is fantastic. However, **it is also extremely important that your services consume messages in an idempotent manner**. For example:

A service sends a message to invoke a process that will take 15 seconds, and then the message will be acknowledged. However, the process crashed at 10 seconds, but unfortunately 10 database documents were already manipulated in that time. The message wasn't acknowledged yet, so when the server boots up again, the message *will be redelivered*. So, will those updates cause the 10 documents to be updated *again*? Is there some value you're incrementing, for example? That wouldn't necessarily be idempotent.

# Queue Per Service

In HTTP, there exist common patterns for deciding how services will communicate (for example, REST). However, a pain point in building out a queue system from scratch is that you also have to figure out what "queue" means in *your* system. Do I set up a queue for certain message types (possibly)? Do I set up a queue per service and deliver all messages on that queue?

The method I've had luck with in production so far is using a queue per service. This is the simplest way for me to reason about it in my head. You have a routing key for your message, and then it goes to a specific place (this would be for a "direct" queue using command messages).

So, if you have a service that maintains user data, and the service is named "user-service", then you create a queue called "user-service". There are other patterns, but depending on your system, you may find the "queue per service" pattern useful.

If you're using RabbitMQ, you can just send a message with a specific routing key, and the queue server knows automatically which queue to send it to.

# Dead letters

There are nuances between Dead Letter Channels and Invalid Message Channels. For brevity, again, I'll recommend you read those 2 chapters in EIP, but for the sake of practical advice, I'll tell you **set up a dead letter queue**.

What do you do with those messages? Do you store them to a database? Do you redeliver them?

Depending on your system, you could decrypt the message and store it in a database that provides encryption at rest. This will allow you a quick way to scan through the messages that couldn't be delivered and debug (your mileage may vary here; depending on your system, you might have to encrypt certain fields yourself, etc.)

# Encryption

TL;DR

1. Use <code>amqps://</code> protocol
2. Encrypt your message before sending to the queue server

If you're using the secure protocol, you have encryption while in-transit, but depending on your provider, you might not have encryption at rest. 

Encrypting your messages might be a hassle, since now your services all need to use, say, a shared key, but you can bury this under the hood of your API using a message adapater to automatically handle the key negotiation, encryption, and decryption.

# Conclusion

Again, I can't recommend the EIP book enough. It can be hard to find coherent internet resources for implementing a queue, and this book provides well-tested production design patterns. Remember, consider your messages types, encrypt everything, and consider storing your dead letter messages to persistent storage to help you debug your system when (not if) something fails.
