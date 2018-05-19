---
layout: post
toc: true
permalink: javascript/understanding-functions-in-javascript.html
title: 'Understanding Functions in JavaScript'
excerpt: 'Understanding and working with functions in JavaScript, anonymous functions IIFEs (Immedately Invokded Function Expressions, functions as first-class objects, scope, hoisting and other interesting and intricate details'
date: 2015-07-05 16:08:00
categories: javascript
---

> **Note**
>
> This article is not completely done and may contain errors.

# Intro

In JavaScript, functions are first-class objects, they can be:

  - passed as arguments to other functions

  - returned from other functions

  - assigned to variables, properties of objects, and stuffed into arrays

  - created dynamically

Let’s create a helper log function so we don’t need to type the lengthy `console.log` thing all the time:

``` javascript
// Assumes ES5 or higher.
console.log.bind(console);
```

> **Warning**
>
> The examples shown here do not implement error-checking. For instance, in a function that sums numbers, we assume that actual numbers are passed, and we do not verify that before attempting to add the values together. The objective here is to talk about functions and their intricacies. Therefore, we ignore other things and focus on the main topic to keep code examples shorter and easier to understand.

# Functions

The basic syntax to create functions is:

  - the `function` keyword

  - an *optional* name for the function

  - a pair of parenthesis enclosing zero or more comma-separated list of arguments (zero or more means that arguments are optional)

  - a pair of curly braces enclosing zero or more statements (again, optional)

<!-- end list -->

``` javascript
function optionalFunctionName(zero, or, more, arguments) {
    // Code goes here...
}
```

## Defining vs Invoking a Function

Beware that defining a function doesn’t automatically makes it run. It just sits there waiting…​ To make the function fulfill its purpose, it must be run (invoked, executed, called)

## Simple Examples

**Shows a message.**

``` javascript
function msg() {
    l('Hello World.');
}

// Invokes/calls/runs the function.
msg();
// → Hello World.
```

**Shows how to use arguments to the function.**

``` javascript
/**
 * Defines a function that sums its x and y argumentss
 * and returns the result.
 */
function sum(num1, num2) {
    return num1 + num2;
}

// Invokes the function passing it two arguments, assigns the result the
// function returns to the variable `total`, and outputs that with `l`
// (which we defined earlier).
var total = sum(2, 5);
l(total);
// → 7

// Or, instead of assigning the result to a variable, simply do this:
l(sum(2, 5));
// → 7
```

No surprises so far, right? The examples shown above are very similar in syntax and behavior to functions in other languages. But wait and you’ll see\!

## arguments (the pseudo-array)

`arguments` is a parameter (a *pseudo-array*) available automatically in all functions. It is not a real array for it doesn’t possess methods and properties that real arrays do. Still, its elements *can* be accessed with *subscript notation*, and it does have a `length` property. Thus it is called a *pseudo array*.

Every time parameters are passed to functions, those parameters can always be accessed from `arguments`, even if you didn’t declare the function to take parameters.

**A function that sums numbers and uses `arguments`.**

``` javascript
function add(x, y) {
    // return x + y;
    return arguments[0] + arguments[1];
}
l(soma(3, 1, 5));
// → 9
```

Even though the function takes arguments `x` and `y`, and we could have used them, in this example we used `arguments` and ignored the named parameters.

Also, if a function is defined to take, say, two arguments, and upon invokation only one is passed, the second one just gets the value `undefined`, but no error is reported.

``` javascript
function testArgs(foo, bar) {
    l(foo);
    l(bar);
}

testArgs('the force');
// → the force
// → undefined
```

On the other hand, if the function is defined without any arguments, it is possible to invoke the function passing any number of arguments nonetheless. In this case, it will not be possible to access the arguments inside the function by their names, for they have not been declared during the function definition.

``` javascript
function testArgs() {
    // If we call the function as testArg(5, 3, 1), how to access them (the parameters)
    // since their names are not declared inside ()?
}

// Invokes the function passing three parameters.
testArgs(5, 3, 1);
```

In this case, the `arguments` *pseudo-array* is very useful indeed. See the next example.

**a function that sums zero or more numbers.**

``` javascript
function sum() {
    var total = 0,
        i;

    for (i = 0; i < arguments.length; ++i)
        total += arguments[i];

    return total;
}

l(sum(3, 1, 5));
// → 9
```

And nothing prevents us from mixing named parameters with optional parameters accessed through `arguments`.

``` javascript
/**
 * A very simple example for the sole purpose of exemplifying things.
 */
function doMath(operator /* 1 or more args */) {
    var total,
        i;

    //
    // i starts as 1 so we skip the operator.
    //


    if (operator === '+') {
        total = 0;
        for (i = 1; i < arguments.length; ++i) {
            total += arguments[i];
        }
    }

    else if (operador === '*') {
        // Multiply the first vaue by 1, which results in the value itself.
        // If start multiplying by 0, it will always return 0 in the end.
        total = 1;
        for (var i = 1; i < arguments.length; ++i) {
            total *= arguments[i];
        }
    }

    return total;
}
l(doMath('*', 3, 2, 4));
// → 24
l(doMath('+', 3, 2, 4));
// → 9
```

All we said about functions so far apply both to *function declarations* and *function expressions*. Let’s now proceed and see what makes them different.

# Function Declarations vs Function Expressions

**Function declarations** are those whose statment start with the `function` keyword. All of the examples we have seen so far were defined in this manner, which means they are all function declarations.

**Function expressions** are those that *appear as part of a larger expression* (and do not start with the `function`). Some examples:

``` javascript
// 1a. Function as an event handler.
btn.onclick = function(evt) {
    // Do something when click happens.
};

// 1b. Or using an event listener.
btn.addEventListener('click', function(evt) {
    // Do something when click happens.
}, false);

// 2. Function as argument to sort an array (in ascending
// order in this example).
var arr = '10 52 25 13 14'.split(' ').sort(function(a, b) {
    return (a - b) * -1;
});



// 3. Construtor.
// A constructior function, but still a function. The definition is
// a function declaration, but its use is generally in the form
// of a function expression.
function Jedi(name, skill) {
    this.name = name;
    this.skill = skill;

    // 4. Método
    this.power = function() {
        l(this.name + ' uses the force to fight Darth Sith.');
    };
}

// We'll learn more about constructors later.

// Note that the function here is invoked as part of
// a larger expression.
var jedi = new Jedi('Master Yoda', 'The Force');

// 5. Function used to create scope and constrain code inside
// the function so it doesn't pollute the outside scope.
(function(msg) {
    var i, n;
    i = 1, n = 2;
    l(msg);
    l(i - 2);
}("Isn't this cool?!"));

// There could be even more examples of function expressions.
```

  - Technically, we do not create actual methods in JavaScript. What was done in this case is that an attribute was attached to the object, and an anonymous function was assigned to the attribute. Still, the effect is about the same of creating methods in other languages, and there is generally no problem in saying that “we created a method” in JavaScript.

We just saw how function declarations and function expressions differ regarding syntax. Later, when we talk about hoisting, we’ll so another, and arguably more important difference.

## A Note About Automatic Semicolon Insertion

JavaScript has a mechanism called *automatic semicolon insertion* (ASI) which allows one to omit semicolon in most (but not all) expressions. However, there are situations that not using the semicolon to delimit the end of an statement or expression leads to undesirable and hard to track bugs. Therefore, it is safer (and wiser) to always include the statement terminator (semicolon).

Function declarations don’t need a statement terminator because they are not *expressions* (although the name is “statment” terminator). Function expressions should be terminated with a semicolon. If you don’t the JavaScript engine will trigger ASI and thins will work fine most of the times, but as said before there are edge cases that will cause problems and bugs.

# Immediately Invoked Function Expressions

*Immediately Invoked Function Expressions* (or IIFEs for short) may contain a name, or it may be anonymous:

  - IIFE
    Immediately Invoked Function Expression (may or may not have a name)

  - IIAFE
    Immediately Ivoked Named Function Expression

  - IIAFE
    Immediately Invoked Anonymous Function Expression

Most people just use IIFE no mater whether the function has a name or not and don’t care too much about the terminology and that is okay.

IFFEs are those defined and invoked in a single step instead of being first defind, and then later called at some other point.

All IIFEs are *function expressions* becuse it is not possible to declare and immediately invoke a *function declaraion* in a single step. See the examples\!

**IIFE 1, used to create scope.**

``` javascript
(function() {
    // The code inside this IIFE has the scope constrained by the
    // function's containing block and thus avoids polluting the
    // global space.
}());
```

  - For the JavaScript engine, statements that start with the `function` keyword are alll *function declarations*. The `(` at the beginning of the line is what makes it a *function expression* for the engine. There are other ways to trick the engine to treat function as a *function expression*, but this is by far the most common and widely adopted.

  - Note the `()` pair following the closing `}`. This is what causes de function to be invoked right after its definition.

Some other ways to force the engine to treat a function as a function expression.

``` javascript
true && function() {
    // body
}();

!function() {
    // body
}();

-function() {
    // body
}();

// There are others, but... bleh...
```

## Immediately Invoked Anonymous Function Expressions

Beware that not all anonymous functions are immediately invoked.

**anonymous function that is **not** immediately invoked.**

``` javascript
phone.addEventListener('keypress', function(evt) {
    l('they are typing...');
}, false);
```

In the above example, the second parameter to `addEventListener` is an anonymous function. However, it is **not** immediately invoked. Quite the contrary, not even we ourselves ever call it. Rather, it is called by the [event loop](https://developer.mozilla.org/en/docs/Web/JavaScript/EventLoop) when a `keypress` event happens.

**Anonymous function that is indeed immediately invoked (IIAFE).**

``` javascript
var myModule = (function() {
    return {
        y: 10,
        x: 15
    };
}());

l(meuModulo.x);
l(meuModulo.y);
// → 10
// → 15
```

  - Look at the extra pair of parenthesis which is responsible for invoke the anonymous function right then and there (immediately after being defined).

## Immediately Invoked Named Function Expressions

Generally speaking, IINFEs and IIAFEs can be used interchangeably. Still, named functions make it easier with debuging because error and other messages will many times mention the name of the function that was running when the error happened.

You can use a name in any IIFE if ou want:

``` javascript
(function limitScope() {
    // Code goes here.
}());


var myModule = (function createModule() {
    // code...
    return {
        // Coisas para expor para o mundo externo.
    };
}());
```

## Use of Named Functions

Many of us have the habit of using anonymous functions every time a function needs to be passed as parameter.

**Examples with anonymous functions.**

``` javascript
jQuery.ajax({
    type: 'POST',
    url: 'libs/ajax.php',
    data: objeto,
    success: function(res) {
        l(res);
    }
});

elem.addEventListener('click', function() {
    l('elem was clicked');
}, false);

arr.sort(function(a, b) {
    return (a - b) * -1;
});
```

1.  An anonymous function for jQuery’s `success` callback.

2.  An anonymous function to the event listener for the click event.

But the example below produce the same result, with the advantage of helping with debugging since our `success` callback now has a name instead of being anonymous.

**Examples with named functions.**

``` javascript
jQuery.ajax({
    type: 'POST',
    url: 'libs/ajax.php',
    data: {id: 9, email: 'yoda@theforce.star'},
    success: function handleResponse(res) {
        l(res);
        // Now imagine something wrong happens inside this function.
    }
});

elem.addEventListener('click', function handleUserClick() {
    l('elem was clicked');
    // Something bad could happen here.
}, false);

arr.sort(function sortDesc(a, b) {
    return (a - b) * -1;
});
```

1.  Now, should our program have some sort of error happening inside the `success` callback function, the error would mostly likely tell us that it was in the function `handleResponse`.

2.  Idem for the `handleUserClick` which is the name of the function that handles clicks on `elem`.

This doesn’t **not** mean that using anonymous functions is wrong or bad practice and that we should *always* use named functions. I’m just stating that it is up to the programmer to know the available options and use whatever they feel is more appropriate at any given situation.

# Hoisting

Hoisting is a process or reorganization of code during parsing and previous to actual execution. It happens whe the browser loads your JavaScript source and the engine parses your code. All assignments found throught the file are moved to the top of the current execution context (scope) and have values set to undefined. Only when the code is executed do assignments really take place and variables/properties have their values computed. This has several consequences.

The most important things that are hoisted are variables, attributes, and function expressions assigned to variables or properties.

For example:

``` javascript
// lines
// of
// code
...
var foo = 'Yoda';
...
// more code
...
l(foo);
```

The above code is turned into something like this:

``` javascript
var foo = undefined;
...
...
foo = 'Yoda';
l(foo);
```

Note that the definition of the variable `foo` is moved to the top and assigned the value `undefined`. Look at what happens here:

``` javascript
l(num);
var num = 10;
l(num);
// → undefined
// 10
```

It is turned into:

``` javascript
var num = undefined;
l(num);
num = 10;
l(num);
```

Note that it first logs `undefined` and `10`, and not `10` twice. No error, but perhaps not the desired result.

Another case is what happens with functions. This code:

``` javascript
...
...
function foo() {
    // body of the function
}
```

Is turned into:

``` javascript
var foo = function foo() {
    // body of the function
};
...
...
```

That means that function declarations are moved as a whole to the top, and do not become `undefined`. With function declarations, you could define a function on line 5, and use it on line 1, and it would just work. The same does not hold true for function expressions, though.

``` javascript
l(typeof foo);
// → undefined

var foo = function foo() {
    l('hello');
};

l(typeof foo);
// → function
```

The above, when hoisted, becomes this:

``` javascript
var foo = undefined;
l(typeof foo);
// → undefined

foo = function foo() {
    l('hello');
};

l(typeof foo);
// → function
```

With functions expressions, it is the same as with normal variables. The variable that should reference the function is moved to the top and assigned `undefined`. So, if you use the function before the line it is actually defined, you get an error because at that point the variable referencing it is `undefined`.

Using a variable or function before it is defined in the source file is known as *forward referencing* it. In short:

  - forward referencing a variable gives you undefined, but no error.

  - forward referecing function expression assigned to a variable (trying to invoke it before it is defined) gives you an error (TypeError) because you are trying to call a function that doesn’t exist yet.

  - forward referencing a function declaration works fine, because the function declaration is moved “as a whole” to the top.

# Conclusion

JavaScript functions are the best part of the language (in my supreme opinion). They can either help or bite you, depending on your mastery of how they work.

There is much more that could be said, and lots of other examples, but this should at least get you started and entice your curiosity.
