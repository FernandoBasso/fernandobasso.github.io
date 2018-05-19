---
layout: post
toc: true
title: Shell Script Input and Default Values
permalink: shell/shell-script-input-default-values.html
date: 2017-01-09 19:08:00
excerpt: Let’s see some examples about on how to provide input to shell scripts with default values and making use of parameter expansion as well\!
categories: shell
---

# Introduction

One way to provide input to shell scripts (as well for programs written in other programming languges than the shell) is by providing arguments upon starting the program. That is useful and intersting. In this post, however, we will see means to provide input to a shell script that is already running. That is, the script runs, and then at some point it needs to ask the user for input so it can perform whatever actions are needed to fulfill its purpose in life\!

Let’s have fun, shall we‽

# Reading Two Values

Read two numbers and print the result of dividing the first by the second:

``` bash
read x y
printf "$x / $y = %.2f\n" $( bc <<< "scale=2; $x / $y" )
```

``` term
$ ./script <<< '10 3'
10 / 3 = 3.33
```

Don’t get confused here\! It may look like we are passing arguments to the script, but we are *not*. Instead, we are justing using Shell *herestrings* (`<<< '10 3'`) to provide input to the program *after* it is already running. It is the same as if we did something like this:

``` term
$ ./script <RET>
10 RET
13 RET
10 / 3 = 3.33
```

Read two numbers into the variables `x` and `y`, then sum them and store the result in the varaible `result`, and finally print the result to the output.

``` bash
read -p 'Two numbers to add: ' x y
result=$( bc <<< "$x + $y" )

printf "The sum of %d and %d is: %d\n" $x $y $result
```

> **Note**
>
> We used the `bc` program (just for fun) to do the math so it also works with floating pointer numbers. Bash itself can only work with integers.

# Read Input With a Default Value

The user may edit, or completely remove the default value at the prompt and type something entirely different. Still, if they just hit \<RET\>, that default value is used.

``` bash
read -p 'User to greet: ' -e -i 'Yoda' username
printf "Greetings, ${username}."
```

``` term
$ ./script
User to greet: Yoda <RET>
Greetings, honorable Yoda.
```

# Read Input With a Default Value and a Timeout

`read` has a `-t` command line option that we can use to cause the script to continue after N seconds even if the user doesn’t hit \<RET\>.

``` bash
read -t 3 -p "User to greet: " -e -i 'Yoda' username
printf "\nGreetings, honorable ${username}."
```

``` term
$ ./script
User to greet: Yoda <RET>
Greetings, honorable Yoda.
```

But what if we do not hit \<RET\> and wait for the time to pass and the script to just continue execution?

``` bash
read -t 3 -p "User to greet: " -e -i 'Yoda' username
printf "\nGreetings, honorable ${username}."
```

``` term
$ ./script
User to greet: Yoda
Greetings, honorable .
```

When we run the script, we intentionally let the 3 seconds pass without hitting \<RET\>. The result is that `username` is not assigned any value and the `printf` line gives the output you see above, that is, it prints nothing for `username` because it is empty.

Still, there are ways to circumvent that “limitation”. We can make use of the `||` operator to assign a value to the variable `username` in case the `read` expressions return a *false* value.

# Timeout With a Default Value Using The OR (||) Operator

Let’s study this example:

``` bash
read -t 3 -p "User to greet: " -e -i 'Yoda' username || username=Yoda
printf "\nGreetings, honorable ${username}."
```

``` term
$ ./script
User to greet: Yoda
Greetings, honorable Yoda.
```

To understand how the `read` line works, recall that when you run a command, it returns an status value. That status value can be read through the `$?` special variable in bash. Zero means the command succeeded, and any other value means there was some sort of error, and it depends each program. An example:

``` term
$ ls .gitignore
.gitignore
$ echo $?
0
$ ls I-do-not-exist.txt
ls: cannot access 'I-do-not-exist.txt': No such file or directory
$ echo $?
2
```

As it can be seen, if `ls` succeeds in listing the file `.gititnore`, its status value is 0 (true). If the file does not exist, it returns 2 (one of the many possible falsy value codes for `ls`; check its man page).

In the line:

``` bash
read -t 3 -p "User to greet: " -e -i 'Yoda' username || username=Yoda
```

The `||` operator checks for the return value of the `read` command, and if it returns a non-zero value (indicating some sort of failure, i.e. no input is given), bash then proceeds to the expression `username=Yoda`.

Note, however, that this doesn’t work:

``` bash
username=Yoda
read -t 3 -p "User to greet: " -e -i 'Yoda' username
printf "\nGreetings, honorable ${username}."
```

``` term
$ ./script
User to greet: Yoda
Greetings, honorable .
```

You may think, “Okay, if the user doesn’t hit \<RET\> before the three seconds, the variable `username` will contain the original value.” Incorrect\! `username` will be overridden with nothingness. So, using the `||` approach is the way to go for something like this.

# Timeout With a Default Value Using Parameter Expansion

There is yet another way to provide a default value for input and have a timeout that works no matter whether the user hits \<RET\> or not: using Bash’s parameter expansion.

``` bash
read -t 3 -p "User to greet: " -e -i 'Yoda' username
username="${username:-Yoda}"
printf "\nGreetings, honorable ${username}."
```

``` term
$ ./script
User to greet: Yoda
Greetings, honorable Yoda.
```

The expression `username=${username:-Yoda}` means, “if `username` has a value, just use that value, otherwise, use ‘Yoda’ instead.”

If you want to check on the command line how this type of expansion works, try this:

``` term
$ echo "${jedi:-Obiwan Kenobi}"
Obiwan Kenobi
$ jedi='Luke Skywalker'
$ echo "${jedi:-Obiwan Kenobi}"
Luke Skywalker
```

In the first `echo` line, we used a `jedi` variable that had not been previously set; it was empty. Since it was empty, the shell used the default value of ‘Obiwan Kenobi’ and that was the output of that first echo.

Then, we set the variable `jedi` to the value ‘Luke Skywalker'. When we tried the second `echo` command, the shell saw that `jedi` had a value, and printed that value instead of using the default one.

Basically, it is like this:

    ${var:-use_me_if_var_is_not_set}

# Prompt The User For Yes/No Answers

In this example, we prompt the user for a “Yes/No” type of question to decide if the script should do one thing or another. We also handle the case for when they type unacceptable input.

``` bash
while true; do
    read -p 'Continue? (y/n): ' answer

    case "$answer" in
        [Yy]* )
            printf "%s\n" 'Looping once more.';;
        [Nn]* )
            printf "%s\n" 'Bailing out!'
            exit 0;;
        * )
            printf "%s\n" 'Answer either “y” or “n”.'
    esac
done
```

We read the user input into the `answer` variable and then use it in a Bash’s `case` statement to decide what to do based on that input.

1.  Because our first test is `[Yy]*`, it means the user may type either an uppercase or lowercase “y” followed by any other character, so they may type something like “Yessss\!”, and it would still match.

2.  The reasoning explained above is the same for the pattern `[Nn]*`. All that matters is that the input starts with either an uppercase or a lowercase “n”.

3.  Finally, if neither of the first two patterns match anything, we have a *catch all* pattern `*` that handles uncacceptable input.

> **Note**
>
> This pattern matching stuff is a subject for another (TODO) post.

# Related Man Pages and Resources

Specifically for man pages, you can always open them in a browser. Do something like:

    BROWSER=opera man -H bash

And then look in the index for the specific section you want and click the link.

## read

Read the man page of the `read` builtin:

    help read

Or look for it in the SHELL BUILTIN COMMANDS in the bash manual. This works with the `less` pager:

    man bash
    /^SHELL BUILTIN COMMANDS <Enter>

and scroll until you see the `read` entry. If your pager is set to something other than `less`, just read its help/man pages to figure out how to search in them. To try with `less` even with something else set as your default pager program, you can just do this:

``` term
PAGER=less man bash
```

## bc

The man page:

    man bc

Or the more verbose, informative and with examples, info page:

    info bc

## Bash Parameter Expansion

In the man page:

    man bash
    /^EXPANSION

Or more especifically in

    /Parameter Expansion$
