---
layout: post
toc: true
permalink: typescript/2020-09-19-typescript-union-types-and-type-guards.html
title: TypeScript Union Types and Type Guards
date: 2020-09-19 16:07:35
excerpt: Let's work through a situation where we put TypeScript Union Types and Type Guards through the paces
categories: typescript
---

- [Union Types and Type Guards](#union-types-and-type-guards)
  - [Introduction](#introduction)
  - [Enter TypeScript](#enter-typescript)
  - [A First Working Solution](#a-first-working-solution)
  - [A Better Solution: Type Guards](#a-better-solution-type-guards)
  - [Conclusion](#conclusion)

<div
  class="image-center-wrapper"
  style="background-color: #fff; border-radius: 10px;">
    <figure style="max-width: 100%;">
        <img
            style="display: inline-block; max-height: 600px; border-radius: 10px;"
            src="/imgs/typescript/nvim-ts-buffer.png"
            alt="nvim typescript buffer"
        >
    </figure>
</div>


## Introduction

It is not uncommon that a function takes a value of some type **or** an object which has a property containing the value of that given type. For example, an API might return a message in the form of a string, or an object, which contains a property `text` from which we can read the message:

```javascript
/**
 * Returns the string from the parameter `msg`.
 *
 * ASSUME: `msg` is neither undefined nor null.
 *
 * @param {string|object} msg The input to get the string from.
 * @return {string}
 */
function getMsg(msg) {
  if (msg.text) return msg.text;
  return msg;
}

getMsg('Hello!');
// → 'Hello!'

getMsg({ text: 'Superb!' });
// → 'Superb!';
```

That is, `getMsg()` returns either `msg.text`, in case `msg` is an object like...

```
{ text: 'Deno', ...otherProperties }
```

...or it assumes the input `msg` is already a literal string and just returns that.

## Enter TypeScript

Let's port that implementation to TypeScript, using a **Union Type** for `TMsg`:

```typescript
type TMsgObj = { text: string };
type TMsg = string | TMsgObj;

/**
 * Returns the string from the parameter `msg`.
 *
 * @param input The input to get the string from.
 */
function getMsg(msg: TMsg): string {
  if (msg.text) return msg.text;
  return msg;
}

getMsg('Hello!');
// → 'Hello!'

getMsg({ text: 'Superb!' });
// → 'Superb!';
```

But we get this message:

```
[tsserver 2339] [E] Property 'text' does not exist on type 'TMsg'.
Property 'text' does not exist on type 'string'.This means
```

![error property does not exist typescript](/imgs/typescript/error1.png)

How come‽ We are saying our union type takes either a string, or an object which contains a property `text` which is of type string. What the poop

If we [take a look at TypeScript docs](https://www.typescriptlang.org/docs/handbook/advanced-types.html), we'll read:

> [...] you can only access members that are guaranteed to be in all the constituents of a union type.

All in all, this means that we can't do `msg.text` because although the type `TMsgObj` says we have a property `text`, the type `string` does not have it.

## A First Working Solution

For our case, we can do something like this:

```typescript
/**
 * Returns the string from the parameter `msg`.
 *
 * @param input The input to get the string from.
 */
function getMsg(msg: TMsg): string {
  if ((msg as TMsgObj).text !== undefined) {
    return (msg as TMsgObj).text;
  }

  return msg as string;
}
```

Note that we had to use `msg as <some_time>` a few times to please the type checker. A probably better approach is to create a **predicate function** to do the type checking on `msg` being of the type `TMsgObj` containing the property `text`.

## A Better Solution: Type Guards

To solve this type problem in a more idiomatic and reusable way, we create a [Type Guard](https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards).

> A type guard is some expression that performs a runtime check that guarantees the type in some scope.

First, let's write the actual **Type Guard**:

```typescript
/**
 * Predicate to check wheter param is of type TMsgObj.
 *
 * @param t The value to check the type of.
 */
function isTMsgObj(t: TMsg): t is TMsgObj {
  return (t as TMsgObj).text !== undefined;
}
```

The magic with this is the part `paramName is Type`, in our case, `t is TMsgObj`.

According to the docs, “a predicate takes the form `parameterName is Type`, where `parameterName` must be the name of a parameter from the current function signature.”

Do note that the return of the function is a *type predicate*.

Then, we make use of our type guard:

```typescript
/**
 * Returns the string from the parameter `msg`.
 *
 * @param input The input to get the string from.
 */
function getMsg(msg: TMsg): string {
  if (isTMsgObj(msg)) return msg.text;
  return msg;
}
```

Note that *because* we used a type guard (rather than manually using `as someType`), the compiler now knows that we can just return `msg.text` (without the `as Type` syntax as in the previous solution), and we can also simply `return msg` because according to our union type, that is the only other alternative, so, the compiler smartly enough makes sense of that!

Let's see the two versions again just for comparison:

```typescript
// Using in-place “as Type” syntax.
function getMsg(msg: TMsg): string {
  if ((msg as TMsgObj).text !== undefined) {
    return (msg as TMsgObj).text;
  }

  return msg as string;
}

// Using Type Guard.
function getMsg(msg: TMsg): string {
  if (isTMsgObj(msg)) return msg.text;
  return msg;
}
```

The version with the type guard is cleaner, more self-documenting, more idiomatic, and helps the compiler to make right assumptions about the types.

## Conclusion

Sure, TypeScript is more verbose than vanilla, plain JavaScript, but we gain type safety and can rest assured that our data flow through the application is properly handled because the compiler tells us when something could be sleeping through.

Besides that, the developer experience is greatly improved. The editor gets much smarter with suggestions, warnings, etc. It works amazingly well for me with both Vim and NeoVim, and I see very good results with other editors too! Take a look at my [dotfiles](https://gitlab.com/fernandobasso/dotfiles) for my setup if you are curious.

