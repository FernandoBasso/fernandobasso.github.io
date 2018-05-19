---
layout: post
toc: true
title: Copying and Pasting To and From the System Clipboard On The Command Line
permalink: shell/copy-paste-from-command-line-xclip-xsel-clipboard.html
excerpt: Copy and Paste to and from the system clipboard (and primary selection) using the command line tools xclip and xsel.
date: 2017-05-25 18:00:00
categories: shell
---

Sometimes it is useful to handle the clipboard and the primary selection (on \*nix) systems using the command line. Let’s see some examples on how to do that using two programs, `xclip` and `xsel`.

# Clipboard vs Primary Selection

On \*nix systems running a graphical display through Xorg, we have the *clipboard* area, and the *primary selection*. The *clipboard* is where Xorg stores text (or other content) you copy from programs with `C-c`, for example. The *primary selection* stores text that is currently selected, like when you drag the cursor over some text, which can be pasted by clicking with the mouse wheel.

# About xclip and xsel

On Arch Linux I had to install both programs:

``` bash
# Arch Linux
pacman -S xclip xsel

# Probably something like this on deb and rpm based distros:
apt-get install xclip xsel
dnf install xclip xsel
# or
yum install xclip xsel
```

`xclip` has options like `-selection`, and they can be abbreviated to shorter names (like `-sel` or even `-s`) as long as they do not conflict to other options. For example, `-v` cannot be an abbreviation because it could mean `-verbose` or `-version`. `clipboard` could be abbreviated to `clip` or even `c`. Check the man pages/help to know more.

Note that `xclip` parameters *always* start with a single `-`, like in `-version`. `xsel` has long and short names. Long names use `--` like in `--output` and a single `-` for the short version, like in `-o`.

You’ll likely want to try these commands out instead of just reading about them. For that you can use an external tool, like a text editor to copy/paste and see if your commands for copying and pasting from the command line are working as expected. Just make sure to copy and paste either using the clipboard or the primary selection accordingly. For instance, if you copy from the command line to the primary selection, make sure you attempt a paste by clicking the mouse wheel, otherwise you may mistakenly think the commands are not working.

> **Note**
>
> Although `xclip` sounds like “X clipboard” and `xsel` sounds like “X selection”, both programs can handle both the clipboard and the primary selection.

`xsel` has `-p` as the short version for `--primary` and `-b` for `--clipboard`. Again, check the man pages for syntax details. You might also like to read link:{{ site.baseurl }}{% post_url /shell/2016-03-29-understading-documentation.en %}\[my post about man/info pages\].

help/info pages. xml:id="\_copy\_stdout\_to\_the\_clipboard"\>

Copy stdout of a command/program to the clipboard.

``` bash
# xclip
echo 'test clipboard xclip' | xclip -in -selection clipboard

# xsel
echo 'test clipboard xsel' | xsel --clipboard
```

We copied to the *clipboard*, so, paste somewhere else with `C-v` (or whatever keyboard shortcut it is used to paste in the tool you are using).

\</my\> post about man/help/info pages.\>

# Copy STDOUT to the Primary Selection

``` bash
# xclip
echo 'test primary selection xclip' | xclip -selection primary

# xsel
echo 'test primary selection xsel' | xsel --primary

# xsel defaults to ‘primary’ selection unless told otherwise.
echo 'again!' | xsel
```

Here we copied to the primary selection. Try to paste it somewhere clicking with the mouse wheel.

To exemplify we used simple `echo` commands. Of course, the source text could come from more useful/complex commands or even shell redirections.

``` bash
# filter and process ip command output and copy to primary selection.
ip addr show | grep -E 'inet6? ' | tr -s ' ' | cut -d' ' -f 3 | xclip -sel p

# Get only the usernames from the passwd file.
sed 's/:.*$//' < /etc/passwd | xsel --clipboard
```

Note that we used `xclip -sel p` as abbreviation for `xclip -selection primary`. We’ll use other abbreviations from now on for `xclip`.

# Using Redirects Instead of Pipes

You could also do things like this:

``` bash
# Using a here string.
xclip -in -sel clip <<<'Using a Shell HERESTRING!'

# Or a here document.
xsel --clipboard <<HDOC
> How
> are you
> doing‽
> HDOC
```

Or even a mix of command substitutions with other things, like a here string.

``` bash
xsel <<<$(~/bin/myprogram /path/to/file)
```

# Contents of Files

We can also get the contents of text/source files (well, any file at all) and send to the system’s clipboard or the primary selection.

``` bash
cat ~/.vimrc | xclip -in -sel clip
cat ~/.emacs | xsel --clipboard

xsel --primary < ~/.tmux.conf
xclip -in -selection < ~/.inputrc
```

# Outputing Contents of Clipboard and Primary Selection

Okay. We now know a bunch of ways to copy data either to the clipboard or the primary selection? How do we output that data to a file, STDOUT, or somewhere else?

Let’s see some examples\!

``` bash
xclip -out -sel clip
xsel --clipboard

xslip -out -sel pri
xsel --primary
```

# Sending Contents of The Clipboard and Primary Selection to a File

Sending to a file requires shell redirections because by default the text is sent to STDOUT.

``` bash
xclip -out -sel clip > file.txt
xsel --clipboard > file.txt

xclip -out -sel pri > main.c
xsel --primary > lib.c
```

# Sending Contents of The Clipboard Vim

Vim can read from STDIN if you start it with the with the `-` argument . Therefore, to send data with xclip or xsel to vim, we do:

``` bash
# using pipes
xclip -out -sel clip | vim -
xsel | vim -

# or, with a subshell and herestrings
vim - <<<$(xclip -out -sel pri)
vim - <<<$(xsel --clipboard)
```

# Final Notes

Using these commands to copy and paste to and from the X clipboard and primary selection is interchangeable with copying and pasting from other programs. For instance, you can copy text from your browser and use it with xclip or xsel, or you can copy text with xclip and xsel and then paste it in your browser.

And there you have it\! Some examples (from which you can always expand upon) that I use myself from time to time, especially because the command line is part of my entire workflow. I hope you have enjoyed it.

And the last, lingering thing I wanted to say all along:

    man xclip
    man xsel

    xclip -help
    xsel --help

    vim +help\ starting.txt
