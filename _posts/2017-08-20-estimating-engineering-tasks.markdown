---
layout: post
title:  "Estimating Engineering Tasks: The Soft Side"
date:   2017-08-20 18:00:00
categories: product
author: Josh Beam
comments: true
---

<!--excerpt.start-->
Estimating work is the bane of every engineer's existence. If you overestimate and deliver too quickly, the perception is that you're sandbagging, whereas if you underestimate and deliver too late, the perception is that you're not competent. Most resources about task estimation are purely technical. The "soft side" of estimation is equally important, yet rarely discussed (and in practice, it usually causes the most friction). In this post I'll discuss the psychology of estimation, ways to communicate with stakeholders about engineering tasks, and tactics to get closer to hitting your mark (and learning how to be flexible when unexpected challenges come up).
<!--excerpt.end-->

# Who is this post for?

- Small startups and tech organizations

# TL;DR

- Many ways to estimate engineering effort, but stakeholders care about deadlines
- Many psychological and logical barriers to accurately estimating (if you're aware of them, you can limit their influence on you)
- You and stakeholders are on the same team; you just communicate in different terms

# A quick primer: how do you estimate tasks?

Two typical ways are:

- effort-based
- time-based

## Effort-based

*Recommended reading: <a href="https://en.wikipedia.org/wiki/Fibonacci_scale_(agile)">Fibonacci scale (agile)</a>*

"Effort-based" tends to make more sense to engineering teams, because it represents the relative complexity of a task. For example, the Agile software development approach considers using the fibonacci scale (or even t-shirt sizes).

The **fibonacci** scale ([1, 2, 3, 5, 8...]) is used because as a task increases in complexity, it's harder to accurately determine effort needed to complete it. Using the fibonacci scale, a task with an estimate of 1 might be "relatively simple", and a task with an estimate of 8 might be "significantly more complex".

When numbers increase, it's harder to tell the difference between two numbers that are both very large (when I was a child, anybody who was older than 13 was an adult, and anybody who was older that 20 was *old*).

For example, what is the difference between a task that's estimated at 50, versus a task that's estimated at 51? It's hard to say.

So, we don't use 50 and 51. We would instead step to either 34 and 55, or 55 and 89 (2 pairs of numbers within the fibonacci sequence):

0, 1, 1, 2, 3, 5, 8, 13, 21, **34**, **55**, **89**...

Again, these are all relative terms; but, stakeholders don't want to hear about "relative effort". You need to meet a deadline.

## Time-based (and the importance of intuition)

*Recommended reading: <a href="https://en.wikipedia.org/wiki/Software_development_effort_estimation">Software development effort estimation</a>*

> Hofstadter's Law: It always takes longer than you expect, even when you take into account Hofstadter's Law.

&mdash; *<a href="https://en.wikipedia.org/wiki/Hofstadter%27s_law">Hofstadter's Law</a>*

In practice, time-based estimation requires **experience**. In a perfect world, you should have the engineer who will be working on the task give input on the estimate (and, optimally, this engineer has had experience dealing with other similar tasks). This, however, depends heavily on your organizational structure, and is much more effective in smaller teams.

In other words, the optimal person to be estimating the task is **unconsciously competent** (or, a person whose **intuition** can be reasonably trusted).

When we look at the <a href="https://en.wikipedia.org/wiki/Four_stages_of_competence">stages of competence</a>, we see that people generally fall into 1 of 4 categories:

> **1 - Unconscious incompetence**
>
> The individual does not understand or know how to do something and does not necessarily recognize the deficit. They may deny the usefulness of the skill. The individual must recognize their own incompetence, and the value of the new skill, before moving on to the next stage. The length of time an individual spends in this stage depends on the strength of the stimulus to learn.
>
>
> **2 - Conscious incompetence**
>
> Though the individual does not understand or know how to do something, they recognize the deficit, as well as the value of a new skill in addressing the deficit. The making of mistakes can be integral to the learning process at this stage.
>
>
> **3 - Conscious competence**
>
> The individual understands or knows how to do something. However, demonstrating the skill or knowledge requires concentration. It may be broken down into steps, and there is heavy conscious involvement in executing the new skill.
>
>
> **4 - Unconscious competence**
>
> The individual has had so much practice with a skill that it has become "second nature" and can be performed easily. As a result, the skill can be performed while executing another task. The individual may be able to teach it to others, depending upon how and when it was learned.

An engineer who is in stages 1 or 2 will generally provide an unreliable estimate (but will gradually begin to provide more accurate estimates as they gain more experience, given that they also learn to overcome certain psychological barriers that I'll discuss later).

It may concern some readers that I used the word "intuition" when describing estimating an engineering task. In other words, "intuition" isn't quantifiable, so the two concepts seem juxtaposed.

However, the intuition comes after already diving in-depth into each individual component of the task (which I will also discuss more in detail later).

To give more light on these seemingly contradictory ideas, we can look at <a href="https://www.quora.com/Whats-more-real-to-you-your-feelings-or-facts/answer/Richard-Muller-3?srid=2dRl">Richard Mueller's framework for decision-making</a> (he is a professor of physics at UC Berkeley):

> Rosemary once told me that she approaches all important questions in the same way:
>
> 1. Analyze the issue to death. Gather all the numbers, all the facts, put them (if possible) on a spreadsheet. Create an evaluation function to weigh the importance of all the numbers and facts (she was a math major), and see what the computer says. (Actually, you can do most of this in your head.) Then analyze it a different way. Compare conclusions.
> 2. Then, having completed Step 1, ignore the results, and base your conclusion on your feelings.
>
> That sounds contradictory, but I don’t think it is. Facts and numbers are important, but they can be misleading. Moreover, your own evaluation function, based on what you think is important to you, may be completely wrong. We often can’t articulate what is really important to us. Maybe we don’t even know.

Now, this is in the context of personal decision-making, but we can learn some important lessons that translate over to our current context.

Firstly, it is important to **analyze the facts to death** (i.e., each individual piece of the task), and then it's equally as important **to listen to your gut**.

We can also look at Gavin DeBecker's book <a href="https://www.amazon.com/Other-Survival-Signals-Protect-Violence/dp/0440508835/ref=sr_1_1?s=books&ie=UTF8&qid=1503267711&sr=1-1&keywords=gavin+debecker">"The Gift of Fear"</a> for another lesson that can be useful in our context. He says:

> Intuition is always right in at least two important ways;
> it is always in response to something.
> It always has your best interest at heart

Again, this is out of context, but the lesson we can learn from this is that **after analyzing the facts to death, you should also listen to what your intuition is saying, because it's trying to help you**.

In our context, this tells us a very simple (but important) thing: estimate the shit out of a task, and then do a final gut check. Add a buffer if your gut tells you something doesn't sound right (<a href="https://en.wikipedia.org/wiki/Cognitive_dissonance">cognitive dissonance</a>), and feel free to subtract from the estimate if your gut tells you that it won't actually take "that long" (for whatever reason).

The important considerations here are the "unknowns", which generally influence your intuition:

- known unknowns
- unknown unknowns

"Known unknowns" are things that you know you don't know, and don't have information for yet. If these are present, then you know you should add a little extra buffer, just in case.

"Unknown unknowns" are even worse. What if you implement this new caching system, and something comes up that you never even thought to think of?

These two categories of "unknowns" are generally present in more complex tasks (and can be present in simple tasks), but the simpler the task is in complexity, the easier it is to reliably estimate (and even cut off time during your final gut check) because there simply may not be any "unknowns" (aside from irrelevant situations that may affect your task completion, like unrelated server issues, etc.)

In the conclusion of this post, I'll give an example of merging the "effort-based" and "time-based" frameworks for estimating a task.

# The psychology of estimating

Here we'll discuss barriers to accurately estimating (and how these also affect even experienced engineers' intuition):

1. <a href="https://en.wikipedia.org/wiki/Planning_fallacy">Planning Fallacy</a>
2. <a href="https://en.wikipedia.org/wiki/Dunning%E2%80%93Kruger_effect">Dunning-Kruger Effect</a>
3. <a href="https://en.wikipedia.org/wiki/Anchoring">Anchoring (false premises)</a>
4. <a href="https://www.simplypsychology.org/obedience.html">Obedience to Authority</a>
5. Rebellion (silent or active)

Before we dive in, it is worth it to explain why I included this section.

You should look at psychological factors as external forces that -- unbeknownst to you -- are attempting to influence your decision-making: once you are aware of these phsycological influences and can define them (and see the role they're playing in your own thought processes), the easier it is to work past them.

In other words, you can discover your own natural biases and prevent them from limiting you. **But, the first step is to be aware of them**.

## Planning fallacy

This is a simple one:

> a phenomenon in which predictions about how much time will be needed to complete a future task display an optimism bias and underestimate the time needed.

The takeaway here is: **be skeptical of your optimism about a task**. On the other hand, **also be careful of your own skepticism**. The key is to find a balance.

## Dunning-Kruger Effect

Another simple one:

> a cognitive bias wherein persons of low ability suffer from illusory superiority, mistakenly assessing their cognitive ability as greater than it is

This is especially relevant to engineers who fall into categories 1 or 2 of the stages of competence.

In other words, this is a good lesson in humility, especially for new engineering who might be feeling a bit of <a href="https://en.wikipedia.org/wiki/Impostor_syndrome">impostor syndrome</a>.

The takeaway here is: **be humble about yourself and your capabilities, and seek as much information as is reasonably appropriate before making an important decision**.

*"Can I really do this in a day? Can I implement that algorithm from scratch? Whose help will I need? What resources should I use?"*

## Anchoring

> a cognitive bias that describes the common human tendency to rely too heavily on the first piece of information offered (the "anchor") when making decisions. During decision making, anchoring occurs when individuals use an initial piece of information to make subsequent judgments. Once an anchor is set, other judgments are made by adjusting away from that anchor, and there is a bias toward interpreting other information around the anchor. For example, the initial price offered for a used car sets the standard for the rest of the negotiations, so that prices lower than the initial price seem more reasonable even if they are still higher than what the car is really worth.

In our case, this is also means that we need not to be scared of readjusting estimates when we have more information. For example, if in a meeting with managers, we say "this sounds like something that could take about a week", and then come back a couple days later after thinking about it more and saying "this will take 2 weeks", we had already based all of our other discussions over those couple of days on the idea that the task would take a week, and we are more resistant to being open to discussing a new estimate, even when we have new information (more on this in the section about communicating with stakeholders).

*"You said it was gonna take a week... now you're saying it's gonna take longer? Why'd you tell me a week, then, in the first place?"*

The takeaway here is: **as a company, don't be afraid of flexibility. Don't anchor yourself to initial premises that can be proved wrong once you get new information**.

Also, **try not to go fishing for estimates at inappropriate times**.

This is related to the logical fallacy of drawing conclusions based on <a href="https://en.wikipedia.org/wiki/False_premise">false premises</a>.

## Obedience to Authority

> Obedience is a form of social influence where an individual acts in response to a direct order from another individual, who is usually an authority figure. It is assumed that without such an order the person would not have acted in this way.

This isn't meant to say that you shouldn't listen to your boss: instead, it is important to keep in mind that you might easily feel pressured into giving an inaccurate estimate because you don't want to disappoint your boss with an estimate he or she didn't expect (more on this in the section about communicating with stakeholders).

The takeaway here is: **be honest in your estimates, even if it isn't pleasant**.

This is *extremely* important, too, for the person who is going to be doing the work. If you tell your boss that it'll take a day, knowing that it will take a week, you're doing disservice to yourself, and everyone else:

- there's no way you're gonna get it done in a day, unless you sacrifice your own well-being
- you will be perceived more and more as incompetent in your estimations
- end result: you didn't deliver on time, and possibly negatively impacted the business

## Rebellion (silent or active)

In contract to "Obedience to Authority", you might feel oppressed by your boss and feel the need to give inappropriate estimates in order to spite him or her, because after all, you are in control of the work output. Without you, your boss would need to find another engineer to do the work. This gives you *leverage*. However, it's important to keep this in mind as well: the important thing is the success of the business (because, after all, it benefits you, especially if you have equity). The key principle you should keep in mind is that you are in search of a *correct estimate*, but not necessarily an estimate that is *pleasing* to you. The two should not be conflated.

This is very similar to the concept of finding a correct solution, and not just being biased towards your own solution ("leaving your ego at the door").

The takeaway here is: **you're on the same team**. You all succeed together.

Now that we're aware of psychological and logical barriers to providing estimates, let's discuss how to communicate to the bosses.

# Communicating with stakeholders

In this context, we'll think of "stakeholders" as anybody else who is not an engineer, and who has a degree (limited or otherwise) of influence in your decision-making and the trajectory of the business.

We'll discuss some common situations, and how to deal with them:

- Us vs. them
- *Ineedanestimatenow-itus*
- Trust issues (sandbagging, honesty, incompetence, black swan)
- Communication friction

## Us vs. them

I want to talk about this one first, because it's very important. Generally, engineers view businesspeople as just that... "the businesspeople". You know, the oppressive authority figures lurking in the shadows.

However, we want to limit this dynamic as much as possible. Just like <a href="http://blog.close.io/get-past-gatekeeper">salespeople shouldn't refer to operations professionals as gatekeepers</a>, engineers shouldn't think of businesspeople as "the other guys".

Although there can be frequent friction and conflict, the important thing is to understand that you are both attempting to achieve a mutual goal. When the boss says, "why isn't this done yet?", it's probably not because he or she wants to make your life miserable; instead, it's because your boss (especially if your boss is someone in the C-Suite) has **vested emotional interest in the outcome of the company** (or, maybe you're working for a middle-manager who's just an asshole, but usually you only start encountering these issues at larger firms, since hiring in small organizations and startups can be very selective, and cultural fit is a key aspect that's looked at... usually).

Assuming that it's not the latter case (and your boss isn't just a salty middle-manager), we can then conclude that there are 1 or 2 issues here:

1. the boss's perception is that you're purposely resisting them, and/or
2. you're not doing a good job of communicating your decision-making

Usually, the 2 issues are related (a vicious cycle).

Maybe the boss has had prior experiences with lazy engineers or free-loaders, and their default view (the premise from which they base their conclusions -- their operating principle) is that other engineers will probably be the same. They are inherently skeptical. This is not your problem, it is theirs. However, you still need to be on the same team. You can still take steps to alter this dynamic.

Or, maybe the boss's trust issues stemmed from your bad job at communicating your decision-making in the first place. You make silent decisions that affect scope of work, and the boss is left in the dust, confused about the progress of work, and thinking that there was no plan. Maybe the boss *is* flexible, **but you're not communicating your flexible decisions appropriately**.

Remember, **if this person has vested emotional interest in the outcome of the company, anything that may stand in the way of that is unconsciously (or worse, consciously) branded as an enemy.**

We can see, then, that the fault isn't always necessarily just one person's. We can alter this dynamic through effective communication (I'll discuss this after the next few sections).

## *Ineedanestimatenow-itus*

Your boss asks, "I know it's hard to give an estimate right now, but if you had to guess, how long do you think this could take?"

What do you respond with?

Optimially, he or she gives you space to be able to say, "I'd love to throw something out there, but I think my best bet might be to let this all churn in my head a little first, and then I can come back to you with something that makes sense."

But, what if they insist? Well, this may be a good opportunity to explain something we've already talked about before: *anchoring*. The tactic would be to preface your gut estimate with a warning about the anchoring fallacy.

"For the sake of discussion, we can frame our thinking right now based on the idea that this *could* take about a week, but let's be flexible; I need to look into more, and then I can give you a more reliable initial estimate."

Optimally, everyone should be on the same page on how we, as a team, handle "initial gut estimates". There can be many tactics for this:

- Give a quick organized presentation to the team on the psychological barriers we talked about above
- Or, have a one-on-one with the person who has *Ineedanestimatenow-itus*, and explain the issues that this can cause. Remember to frame it in the correct context: you are both on the same team, and you want to be able to give a reliable estimate and not be anchored to an unreliable one. This is for the benefit of the business.

As a side note, <a href="https://softwareengineering.stackexchange.com/a/716/171283">this StackExchange post</a> echoes my point by quoting <a href="http://rads.stackoverflow.com/amzn/click/020161622X">The Pragmatic Programmer</a>:

> **What to Say When Asked for an Estimate**
>
> You say "I'll get back to you."
>
> You almost always get better results if you slow the process down and spend some time going through the steps we describe in this section. Estimates given at the coffee machine will (like the coffee) come back to haunt you.

## Trust issues

### <a href="https://en.wikipedia.org/wiki/Sandbagging">Sandbagging</a>

> hiding the strength, skill or difficulty of something or someone early in an engagement

This can occur when you accidentally overestimate a task, and complete it earlier than intended. If this happens often, it looks like a tactic, and can cause trust issues.

This brings up 2 important points:

- be thorough in your estimates
- communicate, communicate, communicate

I hate to place all the blame on the engineer for not communicating properly. However, you should have some tactics in mind for when someone asks you the question, "why were you able to complete this so quickly?"

A good response might be:

"Well, I did my best to estimate accurately, but it turns out, I was actually able to build on top of some good previous architectural decisions [resuable components, etc.]"

This also gives emphasizes a good point to the questioner: it is important to invest time in good architecture.

### Perceived incompetence

This is opposite to sandbagging. This happens when you tend to underestimate tasks, and exceed deadlines. If it happens once, ok. If it happens twice, you need to re-evaluate your system. If you it happens three times, there's a major issue.

**You might not be incompetent in your work, but you are incompetent in your estimates.**

Unfortunately, those two ideas can get easily conflated.

### Honesty

Always, always, always, be honest with your estimates. If you succumb to the "Obedience to Authority" fallacy (or on the opposite end of the spectrum, "Rebellion"), then this is the quickest way to put yourself in a situation where you can't be trusted -- and the worst part is, you could've avoided it in the first place. You know when you're being honest, and you know when you're being dishonest. **Choose to be honest**.

### <a href="https://en.wikipedia.org/wiki/Black_swan_theory">Black swan theory</a>

> 1 - The event is a surprise (to the observer).
>
> 2 - The event has a major effect.
>
> 3 - After the first recorded instance of the event, it is rationalized by hindsight, as if it could have been expected; that is, the relevant data were available but unaccounted for in risk mitigation programs. The same is true for the personal perception by individuals.

This is when you're blamed for an "unknown unknown", with the assumption that it could've been predicted based on the information at the time. It's easy to armchair quarterback engineers.

It is important to communicate up-front about your estimates, and everybody should be on the same page that "shit happens".

## Communication friction

**You and stakeholders are on the same team; you just communicate in different terms**.

There is a difference between "dealing with" businesspeople, and being on the same team as them. You should re-frame your thinking in your interactions if you, by default, view them as people to be "dealt with". If you don't, you will set yourself up for failure.

Once you operate from this principle, you can then delve into methods for reducing friction in communication:

- metaphors
- business terms

### Metaphors

This one kind of makes me laugh out loud, but it's very useful.

You are an engineer, so you know the words you use. When someone says "server", you might know to ask: "you mean, the app server or the db server?". **You are an engineer; you know the words you use**.

Other people probably don't.

So, explain it in non-technical terms. The easiest way to do this sometimes is with metaphors.

- What's the difference between changing styles and adding functionality? That's like re-painting a house versus installing new electrical wiring. Re-painting is easier; re-wiring takes a lot of different kind of effort.
- What does it mean that the process is running out of memory? It's like when the drain gets clogged and the sink starts to overflow.

Yes, I know, some of you are probably rolling your eyes. I have to control this impulse as well. But remember, not everybody is a damn engineer! And you are not superior to them because you are; you just have different sets of skills and knowledge.

<!-- Here's a useful video on the topic (*Napoleon Dynamite talks about skills*):

<iframe width="560" height="315" src="https://www.youtube.com/embed/XsiiIa6bs9I?ecver=1" frameborder="0" allowfullscreen></iframe> -->

### Business terms

When discussing trade-offs and implementation, talk about them in business terms.

- "If we don't spend time on configuring our database to support encryption-at-rest, this could open us up to leaking customer data, which could bring down the business."
- "If we don't spend the time to implement this caching mechanism correctly, then critical customer information can be operated on when it's potentially out-of-date, and cause rippling effects throughout the system; this would take days to fix, and then we can implement feature X, Y, and Z."

**The boss only cares about good engineering practices to the extent that it makes the product better and mitigates risk to the business**. And so should you.

In other words, the boss is a good check/balance on your ability to be pragmatic. He is completely uninfluenced by any tech implementation details; he just wants something that works, and works well.

Keep this idea in mind. It is useful to you. Use this ignorance to your benefit.

# Conclusion

Let's do a real-world example to help put this into our context:
1. You are designing an admin page that displays a list of users
2. You are using a RESTful API on a Node.js back-end, and Angular on the front-end
3. We already have a "grid component" (say, using <a href="https://www.telerik.com/kendo-ui">Kendo Web UI Components</a>), which we've determined is suitable for most of our internal admin display pages

The components involved in a time-based estimate for this task are:
1. A server endpoint to retrieve a list of users (only authorized people can query this endpoint)
2. A UI component to draw the users on an internal admin webpage

The effort here is minimally complex. We already have most of our basic components to work with. We'll call this a "3" in complexity.

How does this translate to time though? What's involved in setting up the REST endpoint? What about the grid to draw the list of users?

Ok, the server endpoint will take an hour:
- attach the endpoint to Express router
- ensure only authorized users can access it
- *write a damn unit test*
- ask someone for a code review and merge the PR

Side note: **Always account for testing, code review, and deployment.**

The UI is super simple; just need to wire up an existing component. That's a half hour.

And then, let's give another hour on top of that, because shit happens.

It was a minimally complex task (a "3"), but the time necessary is about 2 and a half hours. What's the gut check on that? You will know, if you know your system. To me, something like this "feels" right. 2 and a half hours is probably more than enough to get through this, and it feels safe.

Remember, throughout all of this, we need to be communicating. If something changes, tell the boss about the business implications. Why is it more important to spend time on a different part of it? What is the important of having a unit test for it?

If takes less time than you originally thought, you're not sandbagging. You built on top of previous good architecture. But, it's important to keep this in mind when analyzing your estimate in the first place. You need to hit your mark.

There is a soft counterpart to the technical implementation of a system. Use it to your advantage.
