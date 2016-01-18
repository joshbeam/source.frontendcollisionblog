---
layout: post
title:  "Brutal Rainbows: intro to password hashing"
date:   2016-01-17 13:49:00
categories: encryption
author: Josh Beam
comments: true
---

<!--excerpt.start-->
We never store plaintext passwords in a database. This is because I could steal a database admin's password, and then login to the database and steal all the users' passwords. So how do we store passwords, if we can't store passwords?
<!--excerpt.end-->

We use "one way hashing". I usually need to use Google for math, so if you would like to hear from a really smart person, I would recommend watching <a href="https://www.youtube.com/watch?v=jzY3m5Kv7Y8">Everything you need to know about cryptography in 1 hour by Colin Percival on YouTube</a> (the video is actually almost 2 hours). If you don't have 2 hours to spare, I will say one of the important points he makes is that right now, you should only use at least SHA-256 for hashing (it's 2016 at the time of writing this, so if you are reading this from the future, I would suggest using whichever algorithm crypto experts recommend in your current decade).

Here's an example of a SHA-256 hash:

<pre>
password => 5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8
</pre>

I happened to just use this sketchy website to generate this hash online: <a href="http://www.lorem-ipsum.co.uk/hasher.php">hash generator with optional salt</a> (I'll go over salts in a little bit). 

So if one of your users' password is `password`, the hash above will be stored in your database. Any time they login, you convert the password they input to your login form (sent over <a href="/encryption/2016/01/17/breaking-down-https.html">HTTPS</a>, of course) to a SHA-256 hash, and your server will just check if the hash they sent matches the hash in the database.

# Why use a hash at all, though?

**We use hashes because it's very unlikely to find two different things that will result in the same hash, and it's really hard to figure out what it was that created the hash (like, really, really, hard).**

**Solving hashes is a factor of computational power, money, and opportunity.**

**However, if we know the constraints of the original input, we may have an easier time reverse engineering the hash.**

At this point, you might be asking, why is a hash any more safe than just storing the password? Most people will give you this answer (from <a href="http://stackoverflow.com/a/4014407/2714730">Is it safe to ignore the possibility of SHA collisions in practice? on StackOverflow</a>:

> The usual answer goes thus: what is the probability that a rogue asteroid crashes on Earth within the next second, obliterating civilization-as-we-know-it, and killing off a few billion people?

In other words, given the current power of computers today, people say that the possibility of finding two different words, sentences, messages, or whatever, that end up as the same SHA-256 hash is less than the probability of a rogue asteroid crashing onto earth in the next second, etc.

While a hash is a fixed size (in the case of SHA-256, it is 256 bits or 64 characters), the number of things that can be hashed is, well, near infinite. So while we can compute all possible hashes that can exist, it is not necessarily feasible to hash every possible "thing" (word, sentence, whatever) that can exist.

This is speculative at best without knowing how the actual algorithm works. However, I can link you to <a href="http://csrc.nist.gov/publications/fips/fips180-2/fips180-2.pdf">the specification from the National Institute of Standards and Technology</a>, and warn you that reading that is about as dry as... whatever something really dry is. This algorithm (Secure Hash Algorithm) was design by the NSA (see the <a href="https://en.wikipedia.org/wiki/SHA-2">page on Wikipedia</a>).

Schneier on Security has an interesting article called <a href="https://www.schneier.com/blog/archives/2012/10/when_will_we_se.html">"When Will We See Collisions for SHA-1?"</a>. This is for SHA-1, remember, but the examples are still relevant.

He quotes something interesting (about SHA-1, mind you), to point out that previous algorithms are becoming less secure, and that solving them is a factor of computational power, money, and opportunity:

> A collision attack is therefore well within the range of what an organized crime syndicate can practically budget by 2018, and a university research project by 2021.

If we have constraints though (for example, if we know the limitations of the input), it necessarily follows that we do not have infinite possibilities for inputs. There's an interesting question on StackOverflow about finding which coordinates were used to generate a SHA-256 hash. We have an advantage here when we know how the coordinate are supposed to look in this example: `00.000000`. <a href="http://stackoverflow.com/a/21216552/2714730">Martijn Pieters gives a great example</a>:

> Producing all possible coordinates between 00.000000 and 99.999999 is easy enough:

{% highlight python %}
from itertools import product
import hashlib

digits = '0123456789'

for combo in product(digits, repeat=16):
    coords = '{}.{} {}.{}'.format(
        ''.join(combo[:2]), ''.join(combo[2:8]),
        ''.join(combo[8:10]), ''.join(combo[10:]))
    hash = hashlib.sha256(coords).hexdigest()
    if hash == '3f1c756daec9ebced7ff403acb10430659c13b328c676c4510773dc315784e4e':
        print coords
        break
{% endhighlight %}

> This'll brute-force all 10**16 (a big number) combinations. Sit back and relax, this'll take a while.

# Guessing passwords

You have to keep in mind, too, how long it takes to "brute force" a password. This means that an attacker can tell his computer to go through every possible password that there could be, and try all of those passwords until he finds the correct one. Just as an interesting mental exercise, there's an online <a href="https://www.grc.com/haystack.htm">brute force calculator</a> that tries to tell you how many "computing years" it would take to brute force a certain password. Now, I link to this in caution, because there are many variables involved, but nonetheless, it's interesting to look at:

<pre>
password => 2.17 seconds (doing 100 billion guesses per second)
</pre>

Now, what happens if we have an even longer password?

<pre>
1234qewradsfZXCV => 1.54 hundred million centuries (doing 100 billion guesses per second)
</pre>

Woah. However, there are other considerations. What if the first guess is correct? Good question, and you're right. The above calculator only gives times for how long to search the entire character space would take. If we get the answer on the first guess, then it's irrelevant.

Also, keep in mind, lots of web services and applications try to secure passwords from being brute forced by locking you out of your account after you get your password wrong several times in a row.

But wait a second, what if someone has a list of thousands and thousands of words, and their corresponding hashes? I'm glad you asked. This is a real thing: it's called a "rainbow table".

# Rainbow tables

From <a href="https://en.wikipedia.org/wiki/Rainbow_table">Rainbow table on Wikipedia</a>:

> A rainbow table is a precomputed table for reversing cryptographic hash functions, usually for cracking password hashes.

There's an interesting website called <a href="https://crackstation.net/">CrackStation</a> that we can use for another practical exercise. It gives you a box where you can input a SHA-256 hash, and it will try and guess the corresponding password. But wait, I thought that it takes 13.12 million trillion trillion trillion trillion trillion trillion centuries to guess? That would be true, if we didn't already have a table of thousands of words and their corresponding hashes, as mentioned above:

<center><img src="/images/hash-cracker.png" width="66%" /></center>

Interesting. So, how do we get around this?

# Getting salty

From <a href="https://en.wikipedia.org/wiki/Salt_(cryptography)">Salt (cryptography) on Wikipedia</a>:

> The primary function of salts is to defend against dictionary attacks versus a list of password hashes and against pre-computed rainbow table attacks.

The first thing you want to keep in mind is that you want your password to be something that is unlikely to exist in a rainbow table. I won't make any specific suggestions on this, as there is a wide range of advice, but I will link you to <a href="https://www.schneier.com/blog/archives/2014/03/choosing_secure_1.html">Choosing Secure Passwords from Schneier on Security</a>.

Aside from that, you might notice that every person who has the password "password" will have the same hash in the database.

This is bad too. If the attacker sees that `user.hash` for 15 people is `5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8`, and he uses a rainbow table to figure out that the corresponding password is `password`, then he didn't even have to lookup those 15 peoples' hashes separately. They all have the same password.

A common thing is to use a "salt", which is just some random information attached to the beginning or end of the password, which is different for each user. This should be "cryptographically random" according to most general knowledge (for example, by using `crypto.randomBytes(16)` in Node.js) (see <a href="https://coolaj86.com/articles/symmetric-cryptography-aes-with-webcrypto-and-node-js/">Symmetric Cryptography (AES) with WebCrypto and Node.js from CoolAJ86</a> for some other examples).

From <a href="https://en.wikipedia.org/wiki/Salt_(cryptography)">Salt (cryptography) on Wikipedia</a>:

> A new salt is randomly generated for each password. In a typical setting, the salt and the password are concatenated and processed with a cryptographic hash function

How do we salt a password?

<center><img src="/images/salty.png" width="66%" /></center>

This means our password will actually be this:

<pre>
passwordsalty => 29d6afd14bbcdf0b43d1f2c4fd8ecbe8bdedd5ee255e5fa530a3fb968cbbfa1a
</pre>

Now if we have 3 users with the same password and we salt them randomly, we would have:

<pre>
passwordsalty => 29d6afd14bbcdf0b43d1f2c4fd8ecbe8bdedd5ee255e5fa530a3fb968cbbfa1a

passwordverysalty => af88afca3aaa435827396518fa2e2429ce42130904b118fee0f714894da0f546

passwordkindofsalty => c18b77bedee11a6f1d55d54fedb7a9c4578faece96165734c0d5a5bc53bacda6
</pre>

In other words, even though 15 users might have the same password, we're forcing each password to be different (however, the user doesn't need to remember the salt, which is cool). We're enforcing password uniqueness without forcing the user to do anything different.

Remember, though, what I just mentioned?

> The first thing you want to keep in mind is that you want your password to be something that is unlikely to exist in a rainbow table.

What if the salted password exists in the rainbow table too? Another great question, and you're right:

<center><img src="/images/password-salty.png" width="66%" /></center>

# To conclude

Again, I'll leave recommendations for specifically how to choose a password and how to salt them to the crypto experts, but it's useful to outline considerations as shown above, which may help readers to understand why we've come up with certain ways to try to store passwords in databases securely.

By the way, if this helps you sleep better at night, I was able to find a salted SHA-256 password hash that doesn't exist in that online rainbow table:

<center><img src="/images/not-in-rainbow-table.png" width="66%" /></center>

Not telling you what it was though, lest it end up in your rainbow table.