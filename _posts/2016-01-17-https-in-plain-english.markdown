---
layout: post
title:  "Breaking down HTTPS"
date:   2016-01-17 13:49:00
categories: encryption
author: Josh Beam
comments: true
---

<!--excerpt.start-->

<!--excerpt.end-->

I recently read a great <a href="http://robertheaton.com/2014/03/27/how-does-https-actually-work/">article by Robert Heaton (an engineer at Stripe), "How does HTTPS actually work?"</a>. I would definitely recommend giving it a read.

I wanted to extend off of some of the concepts a bit, and give some examples of how authenticity and encryption work on a very basic level within the context of communicating over the internet. **I'll do this by giving a simplified example of the HTTPS flow using actual asymmetric and symmetric encryption algorithms**.

For starters, I want to breakdown some terminology. Stay with me, we'll clarify the whole HTTPS process again later:

# TLS

*Related: <a href="http://security.stackexchange.com/a/5127/45897">What's the difference between SSL, TLS, and HTTPS? on StackExchange</a>*

TLS (used to be called SSL) is the entire process used for secure communications over the internet. As you know, HTTP is the protocol used for clients and servers to exchange information (any type of information: sending HTML to the client, sending requests for, say, JSON to the server).

**When HTTP implements TLS, we call it HTTPS**.

TLS uses RSA for **asymmetric cryptography** (one part of what makes TLS secure). RSA in this case is *only* used for the initial connection to verify *authenticity* (the "handshake", we call it). This is important! TLS also uses **symmetric cryptography**. This second form of cryptography is how messages are actually encrypted and sent back and forth after the initial authenticity verification happens.

Wait, wait, wait. **Why don't we just keep using RSA (our asymmetric cryptography) to send all of our messages back and forth? I'll answer that soon. Keep reading.**

# RSA

*Related: <a href="https://en.wikipedia.org/wiki/RSA_(cryptosystem)">RSA (cryptosystem) on Wikipedia</a>*

## What it is

It's an algorithm. Specifically, it is the algorithm we choose to use for private and public keys. These two keys are different, and anything you encrypt with a public key can only be decrypted with the corresponding private key and vice-versa. We call this **asymmetric cryptography**. There are <a href="http://security.stackexchange.com/a/54188/45897">other algorithms</a> besides RSA, but RSA is the most popular.

It is important to note that calling a key "public" or "private" really only has to do with its availability to one person or multiple people.

Another important thing to note is that when we "encrypt" with a private key, we always call this **signing**, because thousands of people may have the corresponding public key (which is the whole point). When this is the case, we can't expect to actually "encrypt" a message with the private key, since anyone with the public key could "decrypt" that message: all we're doing by signing is proving that it came from the person who has the private key (only one person has the private key). This is only **verifying authenticity**.

However, when we encrypt something with the *public key*, we in fact do call this "encryption". This is because only one person can decrypt the message: the person who has the private key.

**When we encrypt something with a private key, we always call it "signing". When we encrypt something with a public key, we always call it "encrypting".**

There is a comment I read to an answer on <a href="http://stackoverflow.com/a/28084950/2714730">SHA1 VS RSA: what's the difference between them?</a>:

> You shouldn't talk about encryption with a private key when you mean signatures.

Again, to really <a href="http://stackoverflow.com/a/408466/2714730">drive this point home</a>:

> Quick point of terminology: the public key isn't used to decrypt a message encrypted with the private key: it's used to verify (the signature of) a message that has been signed with the private key. Decrypting is done with the private key, following encryption with the private key. (It doesn't make sense to encrypt something with the private key, so that anyone can decrypt it with the public key.)

## What it isn't

It is not a hashing algorithm. Again, refer to the above <a href="http://stackoverflow.com/questions/733692/sha1-vs-rsa-whats-the-difference-between-them">SHA1 VS RSA: what's the difference between them? on StackOverflow</a>.

The same applies for SHA2 (sha256), etc. For some reason, RSA and hashing algorithms get mixed up easily.

RSA is the algorithm for creating public and private key-pairs. SHA2, for example, might be used to hash a password to store it in a database. If you are unfamiliar with this, please read <a href="/encryption/2016/01/17/intro-to-password-hashing.html">this article of mine</a> (it should take about 10 minutes), and then come back here. It's important to understand what RSA isn't.

Here's a fake example of asymmetric cryptography:

<pre>
Private key:                abc
Public key:                 xyz
Message:                    hello world

Signed by private key:      asdfghj
Verified by public key:     hello world
(OK cool, since we could verify it, it came from the owner of the private key)

Encrypted by public key:    zxcvbnm
Decrypted by private key:   hello world
</pre>

However, as you might notice above, we have to have some sort of expectation of what the message *should* look like. 

<a href="https://coolaj86.com/articles/asymmetric-public--private-key-encryption-in-node-js/">Asymmetric Public / Private Key Encryption (RSA) in Node.js</a> puts it very well:

> Public keys Encrypt & Verify
>
> Private keys Sign & Decrypt

# Symmetric cryptography

*Related: <a href="https://en.wikipedia.org/wiki/Caesar_cipher">Caesar cipher (Wikipedia)</a>*

## Example

On a high level, symmetric cryptography is something like this:

<pre>
Plain:    ABCDEFGHIJKLMNOPQRSTUVWXYZ
Cipher:   XYZABCDEFGHIJKLMNOPQRSTUVW
</pre>

<pre>
HELLO WORLD => EBIIL TLOIA
</pre>

If we both know the cypher, we can encrypt and decrypt messages.

The client and server will decide which symmetric algorithm they want to use (thankfully, the Caesar Cipher is not one of the available options). A popular one is <a href="https://en.wikipedia.org/wiki/Advanced_Encryption_Standard">AES</a>, and the one used before that was <a href="https://en.wikipedia.org/wiki/Data_Encryption_Standard">DES</a>.

To give an AES example in code (adapted from <a href="http://lollyrock.com/articles/nodejs-encryption/">Encrypt and decrypt content with Nodejs</a>):

{% highlight javascript %}
var crypto = require('crypto');
var algorithm = 'aes-256-ctr';
var password = crypto.randomBytes(16);

function encrypt(text){
  var cipher = crypto.createCipher(algorithm, password)
  var encrypted = cipher.update(text,'utf8','hex')
  encrypted += cipher.final('hex');
  return encrypted;
}
 
function decrypt(text){
  var decipher = crypto.createDecipher(algorithm,password)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}
{% endhighlight %}

In other words, we're created a key: a bunch of <a href="http://stackoverflow.com/a/2450098/2714730">cryptographically random bytes</a> --

> A cryptographically secure number random generator, as you might use for generating encryption keys, works by gathering entropy - that is, unpredictable input - from a source which other people can't observe.

Then we used AES-256 to use that key to encrypt our message. If we share that key, we can also decrypt that message.

<pre>
Message:           hello world
Password:          2d00cd9bd332cef43a41d80ef31b9ebb
Encrypted message: 940f1f7e63f7bc229169fa 
</pre>


# Revisiting the HTTPS flow

Keeping it basic, here is essentially what happens when you visit a site that `https://` in the URL (I'm shortening this into 2 broad steps, but know that there is more going on at a lower level):

## Step 1 of 2: Server proves its authenticity by sending a signed certificate

Remember, your browser comes pre-installed with "root certificates" that you automatically trust. So, if the server bought its certificate from GoDaddy, the certificate can be signed with, say, GoDaddy's private key as well as the server's private key, and you use those two corresponding public keys to check the certificate (in other words, you're checking that the certificate came from the server since only the server should have its private key, and you also check that the server bought their certificate from someone you trust already, like GoDaddy -- we call them the "Certificate Authority"). In other word, we can have any number of people sign the certificate. This is the <a href="https://en.wikipedia.org/wiki/Chain_of_trust">Chain of trust (Wikipedia)</a>.

> TODO: actual example

From <a href="http://robertheaton.com/2014/03/27/how-does-https-actually-work/">Heaton's article</a>:

> Note that the server is also allowed to require a certificate to prove the client’s identity, but this typically only happens in very sensitive applications.

## Step 2 of 2: The server and client start using symmetric encryption

The client encrypts a "password" (the session key that will be used from now on to decrypt each others' messages) and sends it to the server. Remember, the server can only decrypt this message containing the session key if the server actually has the corresponding private key, which is another cool security measure.

So to answer a question from earlier, **why don't we just keep using RSA (our asymmetric cryptography) to send all of our messages back and forth?** Essentially, asymmetric encryption is less efficient than symmetric encryption. Some of these reasons include:

<a href="http://crypto.stackexchange.com/a/5790">Why is asymmetric cryptography bad for huge data? on Crypto StackExchange</a>:

>  Size of cryptogram: symmetric encryption does not increase the size of the cryptogram (asymptotically), but asymmetric encryption does [...] it is safe to say that a symmetric scheme is orders of magnitude faster and less power hungry than an asymmetric one, at least for decryption (some asymmetric schemes, including RSA with low public exponent, are considerably faster on the encryption side than they are on the decryption side, and can approach the throughput of some symmetric cryptography).

Someone mentioned succinctly from <a href="http://stackoverflow.com/a/4469258/2714730">How does SSL use symmetric and asymmetric encryption? on StackOverflow</a>:

> Asymmetric encryption is necessary to verify the others identity and then symmetric encryption gets used because it's faster.

Remember too initially that a server can't encrypt messages with the private key since anyone with the public key could read them. This would mean that the server would need to have the client's public key as well so that the server could actually encrypt messages.

From now on, since the client and server both have a shared password (the "session key"), they can both encrypt and decrypt messages with it.

In our example from the "symmetric encryption":

<pre>
Message:                      hello world
Session secret (password):    2d00cd9bd332cef43a41d80ef31b9ebb
Encrypted message:            940f1f7e63f7bc229169fa 
</pre>

Remember, since the client sent the server the session secret (by encrypting it asymmetrically first by using the server's public key), **the server and client both now used this shared session secret from now on**.

# A note on trust

Part of the Chain of Trust depends on us having pre-installed root certificates that we implicitly trust. That means I could make a certificate and install it on someone's computer, and then pretend to be the server they are requesting something from. This is a classic "man in the middle" attack. 

You can use <a href="https://www.charlesproxy.com/">Charles Proxy</a> to test your native app API. Essentially, your're performing a MITM attack against your own app. To understand this, check out <a href="http://nickfishman.com/post/50557873036/reverse-engineering-native-apps-by-intercepting-network">Reverse Engineering Native Apps by Intercepting Network Traffic</a> (this was also linked at the end of Heaton's article above, but I'd like to link to it as well since it is very relevant). You can also use Charles Proxy to perform a MITM attack on one of your co-workers. Remember there are <a href="https://en.wikipedia.org/wiki/Electronic_Communications_Privacy_Act">laws against this</a> (also see <a href="http://www.hackerlaw.org/?page_id=55">Hacker Law</a>). Or your boss could monitor all of your internet traffic (there is probably a clause in your employment agreement allowing your IT department to perform MITM attacks on you). There's even an article called <a href="http://www.entrepreneur.com/article/223686">3 Tips for Legally and Ethically Monitoring Employees Online</a>.

Actual openssl examples
Why use symmetric encryption alongside assymetric encryption
Authenticity versus identity
Buying a certificate