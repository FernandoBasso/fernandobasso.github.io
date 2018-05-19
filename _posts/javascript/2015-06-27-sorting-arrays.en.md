---
layout: post
toc: true
permalink: javascript/sorting-arrays-in-javascript.html
title: Sorting Arrays In JavaScript
date: 2015-06-27 21:01:29
excerpt: 'Let us learn how to sort arrays in JavaScript. How ascendent and descendent sorting works and how to use custom sorting functions to sort arrays however we please.'
categories: javascript array sort
---

# Introduction

JavaScript provides us with a function called `sort` that can be used to sort arrays. Let’s work through some examples to see how it works. This function sorts an array *in place*, that is, it modifies the original array (although it also returns the sorted array).

> Master thy craft and thou shalt be respected among men.
>
> —  Fernando Basso

# Sorting characters

We shall start with something that works as expected. An array of characters in no special order.

``` js
var chars = ['d', 'a', 'e', 'c', 'b'];
l(chars.sort());
// [ 'a', 'b', 'c', 'd', 'e' ]
```

As it can be seen, just doing `chars.sort()` sorts our array ascendantly in the order thy appear in the alphabet.

> **Tip**
>
> If you don’t know what `l` is, see link:{{ site.baseurl }}{% post_url /javascript/2015-06-21-console-log-helper.en %}\[my post on console log helpers\].

# Sorting numbers - why doesn’t it work?

Now let’s see a situation where the default sorting algorithm does not work as expected.

    var nums = [15, 10, 35, 301, 45, 20, 25, 101];
    l(nums.sort());
    // [ 10, 101, 15, 20, 25, 301, 35, 45 ]

Oops\! The output is not numerically sorted in ascending order. That is because JavaScript `sort` function treats elements as Unicode code points, and in this case `101` comes *before* `15`. Although this is not ASCII, `man ascii` on a \*nix system may help you understand this. You’ll see, for instance, how numbers come before uppercase letters, and these come before lowercase letters.

# Sorting numbers - correct way

Luckily, JavaScript’s `sort` method can take a function as argument which dictates how an array is to be sorted. This function takes two parameters `a` and `b` and must return a value less than, equal to, or greater than zero. Its return value tells the following to `sort`:

  - less than zero → `a` should be before `b`, or `a` is less than `b`;

  - greather than zero → `a` should be placed after `b`, or `a` is greater than `b`;

  - zero → both `a` and `b` are equal and should remain in the position they currently are.

Let’s try again using a function to properly sort numbers in ascendant order.

**Sorting numbers in ascending order.**

``` javascript
var nums = [15, 10, 35, 301, 45, 20, 25, 101];
nums.sort(function(a, b) {
    return a - b;
});
l(nums);
// [ 10, 15, 20, 25, 35, 45, 101, 301 ]
```

Ha\! Now it works\! To make it sort in descending order, we need to invert the result. To accomplish that we just need that in math we multiply any value for `-1` (negative one) to invert the sign.

**Sorting numbers in descending order.**

``` javascript
var nums = [15, 10, 35, 301, 45, 20, 25, 101];
nums.sort(function(a, b) {
    return (a - b) * -1;
});
// [ 301, 101, 45, 35, 25, 20, 15, 10 ]
```

Note that we pass the arguments `a` and `b`, and inside the function we *subtract* `a` from `b` and *then* multiply the result of the subtraction by `-1`. Well, it so happens that mathematically, `(a - b) * -1` is the same as `b - a`. Pay attention to the order or `a` and `b`. Therefore, we could also using this to sort numbers in descending order:

**Sorting numbers in descending order - another math approach.**

``` javascript
var nums = [15, 10, 35, 301, 45, 20, 25, 101];
nums.sort(function(a, b) {
    return b - a; // Note that a - b becomes b - a.
});
// [ 301, 101, 45, 35, 25, 20, 15, 10 ]
```

# Preventing multiple pointless function definitions

If you are just sorting an array once or twice, there is no problem in writing the function we use as parameter to `sort` right then and there. But if you use the same sorting callback function many times (perhaps inside a loop, or recursively), you are making the JavaScript engine recreate the same function over and over again for no good reason, which means the engine has to create the function, store memory to it, and later garbage-collect it, just to soon create another one, exactly the same as the previous one and repeat the process. In such cases it is probably better to define the callback function separately as to save CPU cycles and resources in general.

So, instead of doing:

    nums.sort(function(a, b) {
        // ...
    });

We could do:

**Defining sorting callback functions to use multiple times.**

``` js
var sortNumsAsc = function sortNumsAsc(a, b) {
    return a - b;
};

var sortNumsDesc = function sortNumsDesc(a, b) {
    return b - a;
};

var evens = [8, 0, 2, 6, 4];
var odds = [7, 9, 1, 5, 3];

evens.sort(sortNumsAsc);
odds.sort(sortNumsDesc);

// And then we could use the same sorting functions over
// and over again should we have more sorting to do.
```

> **Important**
>
> When passing the callback function using this approach, *do not* use parenthesis. If you don’t understand why I am saying this, read link:{{ site.baseurl }}{% post_url /javascript/2016-04-09-javascript-functions.en %}\[my post on JavaScript functions\].
