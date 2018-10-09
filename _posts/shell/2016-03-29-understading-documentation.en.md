---
layout: post
toc: true
title: 'Reading and Understanding Command Line Tools Documentation on Linux'
excerpt: 'How to read documentation about commands and tools and understand the syntax used on the man pages, info pages, help, etc.'
permalink: shell/reading-and-understanding-command-line-documentation.html
date: 2016-03-29 21:39:00
---

<script src="https://asciinema.org/a/jcVzHsZfOlfjiSsXt4ij61XTu.js" id="asciicast-jcVzHsZfOlfjiSsXt4ij61XTu" async></script>

Note: You can watch the asciinema above [here](https://asciinema.org/a/jcVzHsZfOlfjiSsXt4ij61XTu)!

<!--
<a href="https://asciinema.org/a/jcVzHsZfOlfjiSsXt4ij61XTu" target="_blank"><img src="https://asciinema.org/a/jcVzHsZfOlfjiSsXt4ij61XTu.png" /></a>
-->

# Introduction

> **Note**
>
> We are going to work with Bash shell. Many commands may work on other shells (sh, zsh, fish, etc.), but I cannot guarantee anything as Bash is the only shell I am familiar with.

> **Tip**
>
> If you are a newborn in Linux and \\\*nix topics in general, don’t expect to understand much when reading documentation on the first few attempts. It may be difficult indeed and it depends a lot on your *background*, that is, how much you already knows (or doesn’t) about these things. Just hang in there.

We know that when dealing with command line, we have the shell (the “command interpreter”, Bash for the sake of this post), the *builtin* commands (those that are provided by the shell itself, and are not external executables/scripts on your system), and external programs, which are installed and are not part of the shell, but are used from the command line/shell.

> **Note**
>
> In this post I will sometimes use “command” in the same sense as “program”. For instance, “the ping command”, although `ping` is a program, and used on the command line. This my cause controversy, people many times say “command” when they mean “program”. Context should make it clear if a command actually a program.

# Builtin vs external commands

Bash features many commands that are native or *builtin*, that is, the bash developers, besides providing us with the command interpreter, also gave us some commands that come with Bash — are internal to Bash. These are the so called *builtin* commands.

To know whether a command is a builtin, we make use of the `type` command (which is itself a builtin):

    type cd
    # →  cd is a shell builtin
    type type
    # →  type is a shell builtin

On my system/setup, `ls` is an alias:

    type ls
    # →  ls is aliased to `ls --color=auto --classify'

Still, is `ls` a builtin or not? To find out, you must first “remove the alias”:

    unalias ls
    type ls
    # →  ls is /bin/ls

So, no. `ls` is *not* a builtin, but rather a program of its own, installed separately from the shell. Let’s see another such case of external (non-builtin) command:

    type ping
    # →  ping is /bin/ping

But there is more. Let’s see. Programs are installed somewhere on your system, and there is an enviroment variable called PATH that keeps a record of all the places where the shell should look for programs to execute. Builtin commands are, well, builtin, and are not installed “somewhere”. They come with bash. The situation is different with external commands. Suppose you invoke the command `ping`. She shell doesn’t know the exact location where it is. It just knows it is somewhere in my PATH. Well, the shell start scanning the list of directories stored in PATH looking for the program `ping`. If it is found, Bash then add the path for this specific program in a *hash table*, so, the next time you need to run this command, Bash doesn’t need to perform this *lookup* again.

As an example, here’s what PATH looks like on my Arch Linux box:

    $ sed 's/:/\n/g' <<< $PATH
    /home/fernando/.rvm/gems/ruby-2.3.1/bin
    /home/fernando/.rvm/gems/ruby-2.3.1@global/bin
    /home/fernando/.rvm/rubies/ruby-2.3.1/bin
    /home/fernando/.rvm/gems/ruby-2.3.1/bin
    /home/fernando/.rvm/bin
    /home/fernando/.nvm/versions/node/v6.9.1/bin
    /usr/local/sbin
    /usr/local/bin
    /usr/bin
    /usr/bin/site_perl
    /usr/bin/vendor_perl
    /usr/bin/core_perl
    /home/fernando/bin/node_modules/bin/
    /home/fernando/bin
    /home/fernando/.dotfiles/bin
    /home/fernando/bin/android-sdk//tools
    /home/fernando/bin/android-sdk//platform-tools
    /home/fernando/bin
    /usr/local/heroku/bin

As you see, a lot of places to look for a program. It makes sense to *cache* the location of a program so subsequent invocation of the same program take less time.

All that was said so I can explain the output `type`.

Suppose you started your amazing Linux distro today, and you didn’t use `ping` a single time so far. Then you do:

    $ type ping
    ping is /usr/bin/ping

    $ ping -c 1 '::1'

    $ type ping
    ping is hashed (/usr/bin/ping)

See how the first time it tells us the path, whereas in the second time we do `type ping` the shell says it is hashed?

Another example:

    # It wasn't at the hash table yet.
    type epiphany
    # →  epiphany is /usr/bin/epiphany

    # The shell has to perform the _lookup_ (where is this epiphany thing?)
    epiphany

    # OK, found it and added its path to the hash table.

    # Now there is no need to do the lookup again.
    type epiphany
    # →  epiphany is hashed (/usr/bin/epiphany)

Read more about this in the section `COMMAND EXECUTION` in the Bash man page.

> **Note**
>
> Thanks to ‘greycat’ and ‘twkm’ in \#bash. They taught me about this “hash table” vs “lookup” thing.

# Three types of documentation

When talking about command line, or commands, or tools and programs that are command line oriented, we basically have three sources where to read from

  - info

  - man

  - help

Not all three options are always available for any given command, though.

## Man pages

Almost all installed programs have a man page.

We are going to learn how read man pages. It so happens that we first need to understand how `man` itself works\!

    man man     # Yes, man man!
    man --help

And to read documentation from programs, we do:

    man ls
    man ping
    man firefox # Nope...

Yep\! Firefox, for instance, doesn’t come with a man page.

### Apropos

`apropos` is used to find out what program could be used for a certain task. Suppose you want to find out programs that have something to do with “address”:

    apropos address

Or about “print” (chars to the screen, printer, etc):

    apropos print

You can do the same with `man -k`:

    man -k address
    man -k printf

To read a man page in a browser, do something like:

    BROWSER=firefox man -H bash
    BROWSER=midori man -H ping

## Man page sections

If you run:

    man -k printf

The output might be lengthy. Still, part of that output is:

    printf (1)           - format and print data
    printf (3)           - formatted output conversion

Those numbers represent “man page sections”. If you read `man man`, you know that commands are categorized by type. Excerpt from `man man`:

    The table below shows the section numbers of the manual followed by the types of pages they contain.

    1   Executable programs or shell commands
    2   System calls (functions provided by the kernel)
    3   Library calls (functions within program libraries)
    4   Special files (usually found in /dev)
    5   File formats and conventions eg /etc/passwd
    6   Games
    7   Miscellaneous (including macro packages and conventions),
        e.g. man(7), groff(7)
    8   System administration commands (usually only for root)
    9   Kernel routines [Non standard]

Combining that with the output we saw earlier, in which we saw there is `printf` both in section 1 and in section three of the manual, we can pick which one to read about:

    man 1 printf

or

    man 3 printf

No primeiro caso vamos obter a *man page* do **comando** `printf`, ao passo que no segundo caso obteremos documentação sobre o `printf` da linguagem C quando incluímos a biblioteca padrão de entrada e saída (Standard Input/Output) com `#include <stdio.h>`.

In the first case, we are shown the man page of the *command* `printf` (a shell builtin). In the second case, we are presented with the man page for C’s standard library `printf` (that one we use when we do `#include <stdio.h>` in a C source file.

## Help pages and more about shell builtins

`help` is used to obtain help for builtin commands. You can invoke `man bash` and spend sometime just looking for the right place to read about the builtin you are interested in, or just use help.

First of all, `help` alone returns a list of all builtins:

    help

And to read help on a specific builtin:

    help <some builtin command>

Examples:

    help help # Yes, help help! ☺
    help cd
    help alias
    help exit

If you pass `help` a non-builtin, you get an error message.

## Info

Generally, `info` pages are more detailed and sometimes even contain examples (although man pages, albeit rarely, may contain examples too). Info pages are, more often than not, beginner-friendly than man pages. For instance, I challenge you to learn `ed` from the man page. But its info page is more tutorial-like and therefore more likely that one can learn how to use the tool by reading it. It is true that man pages are intended as a reference that helps when you *already know how to use a certain tool*. Info pages can be, often, used to get you started with a tool or command line program.

Start with this:

    info info
    info --help

If you read info’s info page, you’ll see it is a somewhat complex system for documenting stuff because it has lots (I mean lots) of features to help you navigate around.

The, go ahead and look for info pages for other programs.

    info <program or command>

For example:

    info ls
    info grep
    info find
    info ed
    info sed

Unfortunately, not all programs provide an info page. In such cases, the `info` command tries to display at least the command’s man page.

    info bash
    info vim

Both bash an vim (at least on my system) display a man page because there is no info pages for bash and vim.

Please read `info info`. It will teach you, for instance, that you can open an info page directly in a specific section. Look:

    info sed 'execution cycle'

It is possible to read info pages from Emacs:

    C-h i m <command>

Exemplos:

    C-h i m sed

Info has lots of terms, concepts and keyboard shortcuts. `info info` explains it all in a tutorial-like fashion that explains how to find what you need to read about, how to navigate through the pages, etc. It is a complext system, but very powerful.

# Help for GUI Programs

We mentioned earlier, some GUI applications don’t come with man pages. Still, to find out if any GUI application has some sort of command line facilities, try:

    program --help
    program -help
    program -h
    program help

For example, Firefox, Chromium (the open source browser upon which Google rebrand as google chrome), Opera, Midori and some others responds to `--help`. Some may open a man page when you invoke its help.

# Understanding man pages

Here we shall discuss how to understand the significance of the syntax displayed when you read a piece of documentation.

We’ll start with this one:

    man cp

And you’ll se the following output (similar, if not exactly the same):

    NAME
    cp - copy files and directories

    SYNOPSIS
    cp [OPTION]... [-T] SOURCE DEST
    cp [OPTION]... SOURCE... DIRECTORY
    cp [OPTION]... -t DIRECTORY SOURCE...

Behold\! All those things have meanings that require us to understand them if we are to properly understand man pages, info pages and other types of documentation.

`cp` is the name of the command or program. No mystery so far.

Anything inside `[` and `]` means that it is optional. In this case, `[OPTION]` means that the options for the `cp` command are not required. You can either do

    cp -v foo.txt bar.txt

or

    cp foo.txt bar.txt

In which case `-v` is an option (also called a *modifier* or *command line switch*). The man page says that command line options are optional (not required). You can use them if you want/need, but you can also invoke `cp` without passing any option whatsoever.

The three dots (or ellipsis) that come after `[OPTION]` or `SOURCE` mean that the preceding item may appear more than once. If that item is optional, `...` means *zero or more times*, and if the item is mandatory, then the three dots mean *one of more times*.

Therefore, in:

    cp [OPTION]... SOURCE... DIRECTORY

`cp` is required and must appear exactly once, followed by zero or more options, `SOURCE...` is required (there is no pair or `[]` around it) and may appear more than once. Finally, `DIRECTORY` is mandatory and must appear precisely once. Using that information, we are able to compose the command below.

Copy three files to the directory `bkp`:

    cp -vi main.c net.h net.c bkp/

`cp` is the command/program being executed. `-vi` are the optional switches/options. Then `main.c`, `net.h` and `net.c` are all part of the `SOURCE...` argument (mandatory, one or more), and finally `bkp` satisfies `DIRECTORY` (required, one).

# Another example

One of the most popular Scheme interpreters and REPL is [Chicken](https://www.call-cc.org/). From the command line it is invoked with the command `csi` (Chicken Scheme Interpreter). Very well:

    csi -help

Gladly tells us that:

    usage: csi [FILENAME | OPTION...]

Note that we have `[ …​ ]` around *two* items, and there is a `|` *between* those items. That `|` is an `OR`, that is either tells us that we use either one or the other; either `FILENAME` **or** `OPTION...`. It **doesn’t** mean “invoke `csi` followed by filename then one or more options.” This interpretation is incorrect.

It means this:

    csi program.scm

or this:

    sci <some option>

But **not** this:

    sci program.scm <some option>

Again, `cmd [ foo | bar ]` means, `cmd`, either followed by nothing (because both `foo` and `bar` are inside `[ …​ ]`), or followed by `foo`, or followed by `bar`, but never followed by `foo` **and** `bar`.

On the other hand, if you look at the `csi` man page (or `sci -help`), you’ll see that some options require a file name, like the `-s` (or `-script`) option. So, `sci` may be passed a filename *or* an option. Just that there is one option that requires a filename.

The moral of the story is that the man/help of a command may show something that can be easily misunderstood (it happened to a friend of mine :D).

This may lead one to think that this

    csi [FILENAME | OPTION ...]

means that you can run this command

    csi program.scm -s

Which is wrong. It actually means this:

    sci program.scm

or (since the `-script` option demands a filename)

    sci -script program.scm

That is, `csi file` or `csi <option>`, and then, there is an option that takes a file.

I know I repeated myself a lot in this last part, but I wanted to make sure to drive the point home. Sometimes the same thing explained in two or more different ways helps one to really grasp the concept or idea.

And may the force and the source be always with you! <3

<style>
code { font-weight: bold; !important }
</style>

<pre style="border: none;">
<code style="font-weight: bold"
>::::          ::::::      ::::      ::::    :::::::::
::::        ::::  ::::    ::::      ::::    :::::::::
::::       ::::    ::::   ::::      ::::    ::::
::::       ::::    ::::    ::::    ::::     ::::::::
::::       ::::    ::::     ::::  ::::      ::::
::::       ::::    ::::      ::::::::       ::::
::::::::::  ::::  ::::        ::::::        :::::::::
::::::::::    ::::::           ::::         :::::::::
  </code>
</pre>
