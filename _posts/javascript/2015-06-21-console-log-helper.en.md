---
layout: post
toc: true
permalink: javascript/javascript-console-log-warn-debug-bind-shortcuts.html
title: Shorter functions for console log, warn, debug, error
date: 2015-06-21 21:01:29
excerpt: In this post we are going to use Function.prototype.bind to create shorter and easier to use variants of console.log, console.warn, console.error, etc.
categories: javascript functions bind console log
---

# Introduction

You know, we can use `console.<thing>` family of functions/methods to help us debug and test code we are working on.

See this screenshot I took from Opera’s console on Arch Linux.

![Opera’s Console on Arch Linux]({{ site.baseurl }}/imgs/javascript/console-log-debug-warn-error.png)

That is very useful indeed. Just that I find it a bit too much having to wring that lengthy `console.<thing>` every time I need to dump something into the console output. `Function.prototype.bind` to the rescue\!

# Shorter functions with the help of Function.prototype.bind

Since ES5, all functions have a `bind` method that allows one to create a new function specifying the context. That is, when the function is invoked, its `this` value is already define and does not depend on the function invocation (well, explaining `bind` is not the goal here). Let’s just see how to put it into use to make shorter versions of the `console.<thing>` friends.

When we do `console.log()`, `log` is a method of the `console` object, which means the `this` value (context execution\` of the `log` method is `console`.

Say we do:

    var log = console.log;

to assign the method `log` to the variable `log`. Then we use it like this:

    log('test');

What is the context execution in this case? Well, it is not `console` because by default, the context execution in JavaScript **depends on how the function is invoked rather than how it was defined**. Since we are invoking `log` as a simple function (a method of the global object), its `this` value will be the global object (`window` on browsers, `process` in nodejs).

But we can use `bind` to pre-define the context execution to always point to `console`. This way, no matter how the function is invoked, we are instructing the JavaScript engine to always set the context execution to `console`.

**Shorter versions.**

``` js
var log = console.log.bind(console);
var debug = console.debug.bind(console);
var warn = console.warn.bind(console);
var error = console.error.bind(console);
```

Now, when we invoke any of our `log`, `debug`, `warn` or `error` functions, it will be just like if we were invoking the original version with `console.<thing>` syntax. But because we used `bind`, every time we use our shorter versions, their context execution will still be the object `console`.

![Opera’s console on Arch Linux with shorter logger functions]({{ site.baseurl }}/imgs/javascript/console-log-debug-warn-error-bind-1.png)

That saves us from having to type `console.` all the time (although I type with ten fingers and I do type reasonably fast, I really find it incredibly boring typing that all the time).

Of course, you could make those ‘shortcuts’ even shorter:

``` js
var l = console.log.bind(console);
var d = console.debug.bind(console);
var w = console.warn.bind(console);
var e = console.error.bind(console);
```

# Predefined parameters

On browsers, all of those different variations of the function produce different output, as you can see from the screenshots. That is not the case with server side JavaScript though. In Node.js, there are neither icons nor different colors by default.

``` js
var l = console.log.bind(console);
// Node.js doesn't have console.debug.
var w = console.warn.bind(console);
var e = console.error.bind(console);
```

Yeah, it works but the output doesn’t help us distinguish what is what…​

![Console on Node.js]({{ site.baseurl }}/imgs/javascript/console-log-warn-error-nodejs.png)

If you wish to make it clear whether something was logged, d, warned, etc, know that `bind` let’s us also pre-define parameters (there are ways to use colors, but it is not the point of the specific post).

Let’s make use of `bind` ability to pre-set parameters. It is easy:

``` js
var l = console.log.bind(console, 'LOG:');
var w = console.warn.bind(console, 'WARN:');
var e = console.error.bind(console, 'ERROR:');
```

Now we can invoke `l`, `w` and `e` and each of them will always print a leading string that helps us identify which of the helper functions was used. You just pass as argument the thing you want to see in the output, and those pre-defined arguments are automatically managed for us.

This is a screenshot of my `dev.js` file while I was creating the examples to show in this post:

![Console on Node.js, code on Vim Editor]({{ site.baseurl }}/imgs/javascript/console-log-warn-error-nodejs-params-vim.png)

And here is how the output looks like on my setup:

![Console on Node.js with predefined arguments set with bind()]({{ site.baseurl }}/imgs/javascript/console-log-warn-error-nodejs-params.png)

# Conclusion

We now have a shorter way to dump messages to the console when we are working with JavaScript. You could set your editor to insert a snippet of code automatically for you so you could easily insert these functions easily on a JavaScript file when you need them. Vim has [Ultisnips](https://github.com/SirVer/ultisnips), Emacs has [Yasnippet](https://github.com/joaotavora/yasnippeti), and some other editors also have means of easily inserting snippets of code inside your source files.
