---
layout: post
toc: false
permalink: javascript/useless-use-of-functions-in-javascript.html
title: 'Useless Use of Functions in JavaScript'
excerpt: 'Let us take a look at some very simple but yet useful cases where people create useless functions that are totally unnecessary when writing JavaScript code.'
date: 2018-12-01 10:16:15
categories: javascript
---


- [Intro](#intro)
- [A Warm-Up Example](#a-warm-up-example)
- [Doubling a List of Numbers](#doubling-a-list-of-numbers)
- [Applying Discounts To Products](#applying-discounts-to-products)
- [Camelfy Dash-Separated Words](#camelfy-dash-separated-words)
- [An Asynchronous Fetch Example](#an-asynchronous-fetch-example)
- [Conclusion](#conclusion)

<div class="image-center-wrapper">
    <figure style="max-width: 100%;">
        <img
            src="/imgs/javascript/camelfy-js.jpg?v=1"
            alt="Camelfy JavaScript Function, by Fernando Basso">
        <figcaption>Camelfy JavaScript Function</figcaption>
    </figure>
</div>

## Intro

Let's take a quick look at some examples of code where people seem to misunderstand, ignore or forget basic JavaScript concepts, which cause them to end up creating unnecessary functions to perform certain tasks, sin that I myself have been guilty of in the distant and bygone first lightyears of my JavaScript odyssey.


## A Warm-Up Example

To get our feet wet, let's start with a very simple `forEach` example that logs stuff to the console.

Let's say we have this log function that takes one argument and outputs that argument to the console.

```js
const log = thing => console.log(thing);
```

And our goal is to loop over a list of strings and log each string to the console. People often do this:


```js
['may', 'the', 'force'].forEach(function (item) {
  log(item);
});
// → may
// → the
// → force
```

In the example above, we are _unnecessarily creating a new function on each iteration_. We create an anonymous function that accepts an argument called `item` just to then call the `log` function passing it that `item` argument.

We could simply do this instead:

```js
['may', 'the', 'force'].forEach(log)
```

With this approach, we make the most of the fact that ECMAScript supports Higher Order Functions, and we can simply pass a function that already exists, already takes the proper number and type of arguments, and already does something we need, in this case, printing to the console. `log` is automatically passed the argument.

Explaining it a bit further, if we [take a peek at the docs on forEach](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach), it becomes clear that the first argument to `forEach` is a function that takes one (required) argument (and two other optional arguments). It is `forEach`'s job to pass the argument(s) to the function. Let's examine the code again:

```
forEach(function (item) {
  log(item);
})
```

We created an anonymous function that takes an argument that we named `item`. The body of the anonymous function simply calls `log` passing it the `item` argument. Since our `log` function takes one argument, we can simply pass `log` to `forEach` and be done with it. `forEach` will pass each item in turn to `log`.

<!--
Explaining a little more verbosely, our `log` function takes one argument, and when we call `forEach` and pass it the `log` function, `forEach` itself takes care of passing the argument that `log` expects.
-->

The problem is not only syntactical or a matter of elegance. When we unnecessarily create the anonymous function inside the loop, we are each time causing the engine to allocate memory for the function, instantiate it, etc., then invoke the function, and then let the garbage collector throw it away just so in each iteration of the loop we cause the engine to (unnecessarily) go over all that process... over and over again.

All this stuff reminds me of when people _unnecessarily_ use `cat` and `grep` together on the command line (which merits them an [award](http://porkmail.org/era/unix/award.html) by the way):

```bash
cat ~/.bashrc | grep PS1
```

While they could simply drop `cat` altogether and just use `grep`:

```bash
grep PS1 ~/.bashrc
```
And here too, it is not only a mater of elegance or making code shorter. There is more to it than it meets the eye. But I digress. Let's move on to the next example.


## Doubling a list of numbers

You want to double (multiply by two) the elements of a list of numbers. We start by creating a function that doubles a number.

```js
const double = num => num * 2;
```

Unfortunately (and to drive the point home, _unnecessarily_), people often do something like this:

```js
var doubledNumbers = [1, 2, 3].map(function (item) {
  return double(item);
});

log(doubledNumbers);
// → [2, 4, 6]
```

Again, we _don't need_ create an anonymous function that takes an argument and calls `double` on that argument (as done above). It is _not_ optimal and not very idiomatic and elegant ECMAScript. Simply do this instead:

```js
const doubledNumbers = [1, 2, 3].map(double);
log(doubledNumbers);
// → [2, 4, 6]
```

Again, the last version _does not_ create an unnecessary function for each element. We simply use the existing function directly. `map` takes care of passing the argument to `double`.

Arguably, these first two examples are very simplistic and unrealistic. No one would do something like using `forEach` to log stuff or create a double function just for the sake of it. Still, it is nice to have examples that are simple, easy and quick to run and observe the result when we are getting started with some new idea or concept.

That being said, let's try some other scenarios that are a bit closer to real-life situations.


## Applying Discounts To Products

This is a somewhat more realistic example which applies discounts to a list of products.

First let's have a look at our products and the function that applies the discount to a product.

```js
const products = [
  { title: 'Lightsaber', price: 1000, discountPercentage: 10 },
  { title: 'Darth Vader Helmet', price: 400, discountPercentage: 7 },
  { title: 'Millennium Falcon', price: 750000, discountPercentage: 12 },
];

/**
 * Calculates and dds `discount` and `totalToPay` properties to a product.
 *
 * @param {object} product
 * @return {object}
 */
const calculateDiscount = product => {
  const { price, discountPercentage } = product;
  const discount = price * discountPercentage / 100;
  const totalToPay = price - discount;
  return { ...product, discount, totalToPay };
};
```

The `calculateDiscount` function takes a product, calculates the discount value based on `price` and `discountPercentage`, and calculates the total to pay by making use of the already-calculated discount. It then returns the product with those two new properties added. Therefore, if a product's price is U$ 80.00, and the discount percentage is 5%, the discount amount is U$ 4.00 and the total to pay is U$ 76.00.

Here is the approach with the useless use of an anonymous function:

```js
const updatedProducts = products.map(function (product) {   i
  return calculateDiscount(product);
});
log(updatedProducts);
```

The output is as follows.

```plain
[
  {
    title: 'Lightsaber',
    price: 1000,
    discountPercentage: 10,
    discount: 100,
    totalToPay: 900
  },
  {
    title: 'Darth Vader Helmet',
    price: 400,
    discountPercentage: 7,
    discount: 28,
    totalToPay: 372
  },
  {
    title: 'Millennium Falcon',
    price: 750000,
    discountPercentage: 12,
    discount: 90000,
    totalToPay: 660000
  }
]
```

But the output is not the heart of the matter here. What we are concerned about is that we *do not need* to create a brand new function on each iteration of the loop.

Why creating an anonymous function that takes `product` as argument, and in turn calls `calculateProduct` passing that product as argument. That is a big no-no. We can simply pass `calculateProduct` to `map`, and `map` itself takes care of passing each product to our function.

I swear by the haven, the earth and the abyss that you would live a happier and more fulfilling life if you just did this instead:

```js
const updatedProducts = products.map(calculateDiscount);
```

Besides being shorter and arguably more elegant, we do not waste CPU cycles and memory by going to the process of creating a brand new (and useless) function for each product that is mapped on. All in all, the second approach it is more idiomatic, performant and professional code.

Get ready for yet another example.

## Camelfy Dash-Separated Words

It is a somewhat common task to “camelfy” words like `font-family` or `line-height` that we use in CSS to convert them to their JavaScript counterparts like `fontFamily` and `lineHeight`. One such helper function that could perform such thing is as follows:

```js
/**
 * Turn a dash-separated word into a camelCase one.
 *
 * Do not camelfy first letter of the first "subword". That is, do
 * not turn "foo-bar" into "FooBar". Rather, turn it into "fooBar".
 *
 * @param {string} str
 * @return {string}
 */
const camelfy = str => {
  // Return early if there is nothing to camelfy.
  if (str.indexOf('-') === -1) return str;

  return str.split('-').reduce((acc, item, idx) => {
    return idx === 0
      ? acc + item
      : acc + item.charAt(0).toUpperCase() + item.substring(1);
  }, '');
};
```

We could try it like this:

```js
log(camelfy('the-force-is-strong-with-this-one'));
// → theForceIsStrongWithThisOne
```

And to use it on a list of properties, there are two main ways: the award-winning useless use of anonymous function approach, and the idiomatic, elegant, performant and professional one.

Here's a list of css properties that we want to camelfy:

```js
const cssProperties = ['line-heigh', 'font-family', 'border-box'];
```

Don't do this:

```js
var camelfyiedProperties = cssProperties.map(prop => camelfy(prop));
log(camelfyiedProperties);
// → ["lineHeigh", "fontFamily", "borderBox"]
```

Do this instead:

```js
var camelfyiedProperties = cssProperties.map(camelfy);
log(camelfyiedProperties);
// → ["lineHeigh", "fontFamily", "borderBox"]
```

At this point you already know the drill, but I'll repeat the concepts nonetheless. We don't need to create an anonymous function that takes an argument, and then, inside that anonymous function call `camelfy` and pass it that argument manually. We can completely and intentionally not use an useless anonymous function, and just pass `map` the `camelfy` function directly, and `map` will pass the argument to `camelfy`.

## An Asynchronous Fetch Example

Let's also study an example that uses an asynchronous operation to request data from a server somewhere, since that is something we do all the time.

We have this function that takes some response data, parses it into json and then returns a list of gist descriptions:

```js
/**
 * Returns a list of gist descriptions.
 *
 * Parse response data into json, then filter out gists with
 * an empty description.
 *
 * @param {Response} res
 * @return {array}
 */
var getGistDescriptions = async res => {
  const gists = await res.json();

  return gists.reduce((acc, { description }) => {
    if (description === '') return acc;
    return [...acc, description];
  }, []);
};
```

People often do this:

```js
fetch('https://api.github.com/users/FernandoBasso/gists')
  .then(res => getGistDescriptions(res))
  .then(gists => log(gists));
```

In the snippet above, _two_ (useless) anonymous functions are created. One that gets the response and passes it along to `getGistDescriptions` and another one that that gets those descriptions and passes them along to `log`.

But since `getGistDescriptions` already takes a response object to parse and filter, and `log` already takes an argument to log to the console, we can intelligently drop those meaningless anonymous functions and do this instead:

```js
fetch('https://api.github.com/users/FernandoBasso/gists')
  .then(getDescriptions)
  .then(log);
```

It works because `then` takes a function as argument. And the function that `then` takes must accept one argument. `then` takes care of passing the argument to the function. Both `getGistDescriptions` and `log` happen to have the exact signature that `then` expects. Cool, huh‽

Of course, one would not just log the gist descriptions to the console, but perhaps create a list of `h2` tags and then insert them into a web page. Still, it should be a good way to visualize and understand what is going on.


## Conclusion

I did not mention it, but the more idiomatic versions of the examples shown in this post are more or less a consequence of applying Functional Programming concepts on top of JavaScript's support of this style of programming (because JS has Higher Order Functions and many other related goodies). Mind you I'm not even arguing in favor of Functional Programming. It is just that all those unnecessary anonymous functions only make code lengthier, less idiomatic and less performant.

If you want some more insights into this subject, I recommend that you take a look at [this chapter](https://mostly-adequate.gitbooks.io/mostly-adequate-guide/ch02.html#a-quick-review) of the incredible (and awesomely free) Mostly Adequate Guide To Functional Programming Guide Book.

So long.
