---
layout: post
toc: false
permalink: javascript/nodejs-v12-ES6-module-support.html
title: 'Node.js 12 ES6 Module Support'
excerpt: 'Just a quick example of how to setup Node.js 12 to make use of the experimental ES6 modules feature'
date: 2019-04-27 11:13:41
categories: javascript
---

- [Intro](#intro)
- [The Example Modules](#the-example-modules)
- [package.json](#packagejson)
- [The Command Line Options](#the-command-line-options)
- [Conclusion](#conclusion)

<div class="image-center-wrapper">
    <figure style="max-width: 100%;">
        <img
            style="display: inline-block; max-height: 600px;"
            src="/imgs/javascript/Victory-nephew-drawing-girl.png?v=1"
            alt="Girl, by Vitória (my 6-year-old nephew)">
        <figcaption>Girl, by Vitória (my 6-year-old nephew)</figcaption>
    </figure>
</div>

## Intro

Node has had experimental ES6 modules support for a few versions. It was possible to use such feature if files had the extension `.mjs`. With the release of Node.js 12 (2019-04-23), it is now also possible to import and export modules with either the `.js` extension, or no extension at all.

Let's see a quick setup example to get ES6 `import/export` working with Node.js 12 in a way that it does not require the file extension.


## The Example modules

Suppose our module has something like this:

```js
// log.js
const log = console.log.bind(console);
const info = console.info.bind(console);

export { info };
export default log;
```

Note the ES6 `export` instead of Node.js' CommonJS `module.exports` syntax.

Then, some other file imports the log helper.

```
// main.js
import log from './log';
import { info } from './log';

log('log, default export/import works!');
info('info, named export/import works too!');
```

Note we used ES6 `import` instead of Node.js' CommonJS `require` syntax and we _did not_ specify any file extension!


## package.json

Now, in order for us to be able to run it successfully (with Node.js 12), we need fiddle with `package.json`. It needs to contain a field called `type` with the value `module`:

package.json file:
```json
{
  "name": "es6-example-node12",
  "type": "module",
}
```

## The Command Line options

And finally we can invoke node with some specific options:

```bash
node \
  --experimental-modules \
  --es-module-specifier-resolution=node \
  main.js
```

The `--experimental-modules` option makes Node accept `import/export` statements. But it requires that we use either the `.mjs` or the `.js` extension when importing modules. Thankfully, we can make use of the `--es-module-specifier-resolution` set to `node` and Node.js will accept imports without extension.

With all setup and the command line properly crafted, you'll get an output like this:

```
(node:13058) ExperimentalWarning: The ESM module loader is experimental.
log, default export/import works!
info, named export/import works too!
```

We get the warning about the experimental feature, but other than that, everything is fine.

Would you rather not see that warning all the time? Just add `--no-warnings` to the command line:

```bash
node \
  --no-warnings \
  --experimental-modules \
  --es-module-specifier-resolution=node \
  main.js
```

Of course, we could create a shell alias:

```
alias es6mod='\
  node \
  --no-warnings \
  --experimental-modules \
  --es-module-specifier-resolution=node'
```

And then simply run the project or file with the alias:

```
es6mod main.js
```

Perhaps better yet, we could add the command line to the `script` section of `package.json`, like the `start` script in the example:

```json
{
  "name": "node12-es6-module-support",
  "version": "0.0.1",
  "main": "main.js",
  "type": "module",
  "scripts": {
    "start": "node --no-warnings --experimental-modules --es-module-specifier-resolution=node main.js",
    "test": "jest ."
  },
}
```

## Conclusion

There are several other things to consider, pros and cons, etc. In this post, I just wanted to create a minimal example of setting Node.js 12 to make use of its experimental ES6 modules support in a quick and simple way. This is the way I myself mostly use ES6 modules: basic and simple default and named `export/import`, and most importantly, _without_ having to specify the file extension. So, here we have a simple example of how to achieve that with Node.js 12.

So long.
