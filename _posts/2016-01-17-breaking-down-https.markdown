---
layout: post
title:  "Breaking down HTTPS"
date:   2016-01-17 13:49:00
categories: encryption
author: Josh Beam
comments: true
---

<!--excerpt.start-->
What is HTTPS, and why is it any more secure than HTTP? What is TLS, RSA, symmetric and asymmetric encryption, and what happens when I send my credit card over a secure connection so that I can buy Game of Thrones with the sole intention of binge watching the entire season in one evening? This article will attempt to answer those questions (but not the one about your obsession with Game of Thrones).
<!--excerpt.end-->

# Who is this for?

**Intended audience**: Anyone who knows what basic HTTP (not secure) is, and...

- You want to know what makes HTTPS any more secure
- You also want to know what terms like RSA, TLS, asymmetric, and symmetric actually mean

You'll have a head start if you've ever purchased a domain certificate in the past from someone like Comodo or GoDaddy, or if you already know that HTTPS protects your communications over the internet and want to know how that actually works.

**Time to read**: 20 minutes of uninterrupted reading.

# How did you get this information?

Lots of reading and some software engineering. I obtained all this information from various sources on the internet (some of which may or may not be canonical), like various <a href="http://stackexchange.com/">StackExchange</a> websites, <a href="http://robertheaton.com/2014/03/27/how-does-https-actually-work/">Robert Heaton's blog</a>, <a href="https://www.schneier.com/">Schneier on Security</a>, and <a href="https://wikipedia.com">Wikipedia</a>. If you are generally skeptical of the veractiy of online sources which may or may not be opinionated, you'll find some various specs and canonical references scattered throughout this article.

If you want to see a step by step breakdown of an actual HTTPS request, I recommend <a href="http://www.moserware.com/2009/06/first-few-milliseconds-of-https.html">The First Few Milliseconds of HTTPS by Moserware</a>.

# Intro

I recently read a great <a href="http://robertheaton.com/2014/03/27/how-does-https-actually-work/">article by Robert Heaton (an engineer at Stripe), "How does HTTPS actually work?"</a>. I would definitely recommend giving it a read.

I wanted to extend off of some of the concepts a bit, and give some examples of how authenticity and encryption work on a very basic level within the context of communicating over the internet. **I'll do this by giving a simplified example of the HTTPS flow using asymmetric and symmetric encryption algorithms**.

For starters, I want to breakdown some terminology. Stay with me, we'll clarify the whole HTTPS process again later:

# TLS

*Related: <a href="http://security.stackexchange.com/a/5127/45897">What's the difference between SSL, TLS, and HTTPS? on StackExchange</a>*

TLS (previously SSL) is the entire process used for secure communications over the internet. As you know, HTTP is the protocol used for clients and servers to exchange information (any type of information: sending HTML to the client, sending requests for, say, JSON to the server).

**When HTTP implements TLS, we call it HTTPS**.

TLS uses RSA for **asymmetric cryptography** (one part of what makes TLS secure). RSA in this case is *only* used for the initial connection to verify *authenticity* (the "handshake", we call it). This is important! TLS also uses **symmetric cryptography**. This second form of cryptography is how messages (like sensitive login details or your credit card number) are actually encrypted and sent back and forth after the initial authenticity verification happens.

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

The same applies for SHA2 (SHA-256), etc. For some reason, RSA and hashing algorithms get mixed up easily.

RSA is the algorithm for creating public and private key-pairs. SHA2 (which is another name for SHA-256, by the way), for example, might be used to hash a password to store it in a database.

## Example

Here's a fake example of asymmetric cryptography:

<pre>
Private key:                            abc
Public key:                             xyz
Message we will "encrypt":              hello world

Output when signed by private key:      asdfghj
Output when verified by public key:     hello world
(OK cool, since we could verify it, it came from the owner of the private key)

Output when encrypted by public key:    zxcvbnm
Output when decrypted by private key:   hello world
</pre>

> OK cool, since we could verify it, it came from the owner of the private key

Wait, what? If you didn't know what the message was in the first place, how do you know it was really supposed to say `hello world`?

As you might notice above, we have to have some sort of expectation of what the message *should* look like. We have to know that the message is supposed to be "hello world" in the first place. So what we do is send the original message along with a "digital signature", which is simply the signed (remember, we don't say encrypted when we encrypt something with a private key) version of the message. Then you just use the public key to verify (again remember, we don't "decrypt" with a public key) the attached signature to make sure it matches the plain-text message.

Here is a fake example of how that would look:

{% highlight javascript %}
var message = 'hello world';
var signature = sign(sha256(message), privateKey); // => a5dc78923jhbc
var certificate = message + signature;

print(certificate); // => hello worlda5dc78923jhbc
{% endhighlight %}

When we send that message to someone, they parse out the digital signature (the `a5dc78923jhbc` part), and then verify and hash the original themselves to check if they are the same thing:

{% highlight javascript %}
verify('a5dc78923jhbc', publicKey) === sha256('hello world');
{% endhighlight %}

In reality, certificates (such as the popular X.509 certificate) contain a different message, and the content of the digital signature is different. Here is <a href="https://www.rfc-editor.org/rfc/rfc2459.txt">the X.509 rfc</a>, which echos the point above about hashing and then signing:

> The data to be signed (e.g., the one-way hash function output value) is formatted for the signature algorithm to be used.  Then, a private key operation (e.g., RSA encryption) is performed to generate the signature value.

There are some unanswered questions here, like, how do we know who this certificate actually came from. Could someone just copy and paste someone else's certificate and send it (I don't mean the private key; I mean the signature, which is public and attached to the certificate, which is also public)? More on this in a sec.

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

Symmetric algorithms are generally more efficient than their asymmetric counterparts, but we can't send a session key (a symmetric shared key) over a non-secure network connection and expect any information encrypted with it to be secure. This is why we start off first with asymmetric encryption, and then end up using symmetric encryption for the rest of the time we're connected. More on this in a sec.


# Revisiting the HTTPS flow

Keeping it basic, here is essentially what happens when you visit a site that has `https://` in the URL (I'm shortening this into 2 broad steps, but just know that there is more going on at a lower level):

## Step 1 of 2: Server proves its authenticity by sending a signed certificate

Remember in the RSA section above where we asked, "how do we know who actually sent the certificate"? Even if there is a signature present, this only proves that the message was somehow signed by the server's private key. But couldn't anyone simply copy and paste a valid certificate and send it, pretending to be say, www.microsoft.com? Yes, but remember, the moment you encrypt something with Microsoft's public key and send it back to the original sender, they will not be able to decrypt it (given that they don't have the correct private key). Also, we rely on outside constraints like DNS servers to make sure the traffic is routed correctly.

Another example of this is in real life: you could write a new employment agreement granting yourself double your current salary, create a stamp of your boss's signature, then stamp the memo and send it to HR. It looks like it came from your boss, but HR needs to check to make sure it actually did.

We can also sign certificates with as many signatures as we want, belonging to whomever we want.

Remember, your browser comes pre-installed with "root certificates" that you automatically trust. So, if the server bought its certificate from GoDaddy, the certificate can be signed with, say, GoDaddy's private key as well as the server's private key, and you use those two corresponding public keys to check the certificate (in other words, you're checking that the certificate came from the server since only the server should have its private key, and you also check that the server bought their certificate from someone you trust already, like GoDaddy -- we call them the "Certificate Authority"). In other word, we can have any number of people sign the certificate. This is the <a href="https://en.wikipedia.org/wiki/Chain_of_trust">Chain of trust (Wikipedia)</a>.

As Heaton notes (in an example of Symantec hypothetical being the CA for Microsoft):

> Symantec will have taken steps to ensure the organisation they are signing for really does own Microsoft.com, and so given that your client trusts Symantec, it can be sure that it really is talking to Microsoft Inc.

To simplify things, here are some ways we can check that the certificate in fact was sent by the correct server (instead of an attacker just copy and pasting an entire certificate and sending it to you, adapted from a <a href="http://stackoverflow.com/a/188308/2714730">fantastic answer</a> to "How are ssl certificates verified?" on StackOverflow):

1. The certificate is signed by a CA, any intermediate signatures, and the server's private key.
2. Your browser uses the pre-installed certificates to verify any CA signatures in the server's certificate.
3. The certificate contains an IP address or domain name, and the browser checks this is the server with which there is an open connection.
4. The client encrypts the symmetric key (more on this in a second) with the server's public key; only the server can decrypt this.

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

In our example from the "symmetric encryption" section (these are actual AES-encrypted keys and messages):

<pre>
Message:                      hello world
Session secret (password):    2d00cd9bd332cef43a41d80ef31b9ebb
Encrypted message:            940f1f7e63f7bc229169fa 
</pre>

Remember, since the client sent the server the session secret (by encrypting it asymmetrically first by using the server's public key), **the server and client both now used this shared session secret from now on**.

# A note on trust

Part of the Chain of Trust depends on us having pre-installed root certificates that we implicitly trust. That means I could make a certificate and install it on someone's computer, and then pretend to be the server they are requesting something from. This is a classic "man in the middle" attack. 

You can use <a href="https://www.charlesproxy.com/">Charles Proxy</a> to test your native app API. Essentially, your're performing a MITM attack against your own app. To understand this, check out <a href="http://nickfishman.com/post/50557873036/reverse-engineering-native-apps-by-intercepting-network">Reverse Engineering Native Apps by Intercepting Network Traffic</a> (this was also linked at the end of Heaton's article above, but I'd like to link to it as well since it is very relevant). You can also use Charles Proxy to perform a MITM attack on one of your co-workers. Remember there are <a href="https://en.wikipedia.org/wiki/Electronic_Communications_Privacy_Act">laws against this</a> (also see <a href="http://www.hackerlaw.org/?page_id=55">Hacker Law</a>). Or your boss could monitor all of your internet traffic (there is probably a clause in your employment agreement allowing your IT department to perform MITM attacks on you). There's even an article called <a href="http://www.entrepreneur.com/article/223686">3 Tips for Legally and Ethically Monitoring Employees Online</a>.

Also, I mentioned above something about "buying a certificate". If you haven't purchased a certificate before in order to enable HTTPS on your custom domain, here's how it works (I've bought 3 or 4 certificates from different providers in the past). Some providers (like <a href="https://www.comodo.com/">Comodo</a>) offer a free 90-day certificate where they don't really verify much about you. On the other hand, you can buy a certificate from them, or from someone like GoDaddy, called "extended validation", where they email the email address associated with the domain, they verify your business and address, etc. This allows the certificate authority to verify that they are giving a legitimate certificate to a legitimate entity. Does it always work out perfectly? I would say no.

For example, I could still be a bad guy setting up an HTTPS domain to steal information from people, and I could simply get one of Comodo's free 90-day certificates, steal a bunch of information from unsuspected users visiting my site over an HTTPS connection. In other words:

1. Certificate authorities sign a certificate simply saying it belongs to a domain (and that's it)
2. The certificate allows you to use an HTTPS connection so people can't steal data that's going across the wire

But this doesn't prove whether the owner of the server is good or bad. This whole process is just about identity, authentication, and secure communications. Just something to keep in mind.

# Conclusion

If you made it this far, I'd like to say... you have no life, and thank you for reading (just kidding about the "no life" part; you only spent 20 minutes reading this, I spent a whole day writing it... So who's really the one with no life?)

In pseudo-code using pseudo-certificates, here's our summary of what happens over HTTPS:

1. Client connects and asks server for their certificate, which in my pseudo-world looks like this: `ip:216.58.192.461:public_key:123456:signature:qa2ws3ed4rf`
2. Client verifies that `verify('qa2ws3ed4rf', public_key) === sha256('ip:216.58.192.461:public_key:123456')`
3. Client creates a shared symmetric session secret `caesarcipher`, and encrypts this with the server's public key
4. Client sends `encrypt('caesarcipher', public_key)` which turns out to look like `abcdefg` to the server
5. The server attempts to `decrypt('abcdefg', private_key)`, and thankfully, the server gets `caesarcipher` (the correct shared session key)
6. The client buys the new season of Game of Thrones by sending his credit card number (encrypted with `caesarcipher`) to the server and binge watches the entire season in one evening

That's it. This is the real end. Again, this is a very, very basic overview and there is much more going on behind the scenes (for example, things like <a href="http://security.stackexchange.com/questions/63971/how-is-the-premaster-secret-used-in-tls-generated">pre-master and master secrets</a>, <a href="https://en.wikipedia.org/wiki/Cryptographic_nonce">nonces</a>, and all kinds of other stuff. Also, we are still discovering <a href="http://robertheaton.com/2015/04/06/the-ssl-freak-vulnerability/">bugs in SSL</a>).

Further reading:

- <a href="http://vincent.bernat.im/en/blog/2011-ssl-perfect-forward-secrecy.html">SSL/TLS & Perfect Forward Secrecy</a> from Vincent Bernat
- <a href="http://security.stackexchange.com/questions/20105/are-ssl-encrypted-requests-vulnerable-to-replay-attacks">Are SSL encrypted requests vulnerable to Replay Attacks?</a> on Security StackExchange (explains partially why we use randoms "so old signatures and temporary keys cannot be replayed.")
