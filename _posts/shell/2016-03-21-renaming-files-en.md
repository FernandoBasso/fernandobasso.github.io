---
layout: post
toc: true
title: Renaming Files on the Command Line and Bulk (Batch) Renaming
permalink: shell/bulk-renaming-files-on-the-command-line.html
date: 2016-03-21 07:08:00
excerpt: 'How to rename files from the command line, bulk/batch renaming using handy shell features as well as external tools like Sed combined with the shell default functionalities'
categories: shell
---

# Renaming single files

On the command line, we generally use the command `mv` to rename a file. There are other options, like the command `rename` or `perl-rename`. But let’s focus on `mv` for now.

But wait\! `mv` *moves* files, right? Yes, it moves a file from one place to another, but it also moves a file from one name to another. It sounds strange but it works perfectly nonetheless.

Let’s rename a file called `program.c` to `main.c`:

    mv program.c main.c

> **Warning**
>
> If there is already a file named `main.c`, **it will be overwritten**\! Use `-i` so `mv` asks you what to do in such cases, or `-n`. Check `man mv` for complete info on those switches.

# Brace expansion to rename part of file names

Suppose you want to rename `/etc/X11/xorg.conf.d/10-keyboard.cfg` to `/etc/X11/xorg.conf.d/10-keyboard.conf`. That is, you want to change the trailing `cfg` to `conf`. You could `cd` to `/etc/X11/xorg.conf.d/` and `mv` the files from there, and go back to the old directory. Or you could run this lengthy command:

    mv /etc/X11/xorg.conf.d/10-keyboard.cfg \
        /etc/X11/xorg.conf.d/10-keyboard.conf

There is a more elegant and solution, though. You can use Bash’s `{search,replace}` expansion. The command would simply be:

    mv /etc/X11/xorg.conf.d/10-keyboard.{cfg,conf}

Use the `-v` option if you want to see some verbose output of what is going on with that command.

Note that the curly braces could appear anywhere. Suppose you want to replace `10` with `00` in the previous renaming command:

    mv -v /etc/X11/xorg.conf.d/{10,00}-keyboard.cfg

Or even replace multiple things at once:

    mv -v /etc/X11/xorg.conf.d/{10,00}-keyboard.{cfg,conf}

# Renaming multiple files at once - batch renaming

Since we are now renaming multiple files at once (potentially hundreds, thousands or even more), the output of most examples have been truncated to take less space. We have left just enough output to make them understandable.

## Renaming extension to lowercase

Let’s rename `.JPG` to `.jpg`.

    for img in *.JPG ; do mv -v "$img" "${img%.*}.jpg" ; done
    # →  ‘01.JPG’ -> ‘01.jpg’
    # →  ‘02.JPG’ -> ‘02.jpg’
    #     .......
    # →  ‘107.JPG’ -> ‘107.jpg’
    #     .......
    # →  ‘409.JPG’ -> ‘409.jpg’
    #     ....... etc....

We have used a Bash’s `for` loop:

    for img in *.JPG ; do algum-commando ; done

This way, each single image with the extension `.JPG` is assigned, one on each iteration of the loop, to the variable `img`.

> **Tip**
>
> To test, substitute `mv -v "$img "${img%.*}.jpg"` with `echo "${$img%.*}"` and you’ll be able to see what that parameter expansion really does.

The expansion `${img%.*}"` removes the file extension from the variable (not from the real file on the hard drive). So, if `$img` is holding the string `409.JPG`, it will become `409`. We then add the lowercase `.jpg` manually. Since that expansion is happening as the DESTINATION argument for the `mv` command, original image gets renamed to the string resulted from that expansion.

## Renaming filename to lowercase

Suppose you have billions of files like this:

    FoO.JPG
    baR.JPg
    ....
    Profile.jpG

The following command will lowercase the entire filename (not only the extension, like our previous example):

    for file in *.[jJ][pP][gG] ; do mv "${file} "${file,,}" ; done
    # →  foo.jpg
    # →  bar.jpg
    # →  ....
    # →  profile.jpg

The `*.[jJ][pP][gG]` part tells the shell the match files that start with anything, followed by a dot, and then “jpg” in any combination of uppercase or lowercase letters.

Then, the expansion `${file,,}` is used. This is what returns any characters from the filename in lowercase.

Read more about this type of expansion by taking a look `man bash`, then search for the section `EXPANSION` with `/^EXPANSION` and scroll down until you see something like `${parameter,,pattern}`. I was able to just search for `,,` and I could easily find this specific part of the manual.

# Pad with zeroes

Now, we have a situation in which we must rename files padding certain number with zeores (on the left). For instance 1 becomes 01, 2 becomes 02, and so on, until 9 which becomes 09. So, imagine we have these files:

    ls -1
    pag-2016-10.jpg
    pag-2016-11.jpg
    ....
    pag-2016-16.jpg
    pag-2016-1.jpg
    pag-2016-2.jpg
    ....
    pag-2016-9.jpg

And we want it to become:

    pag-2016-01.jpg
             ↑
    pag-2016-02.jpg
    ....     ↑
    pag-2016-09.jpg
             ↑
    pag-2016-16.jpg
    ...

## Zero-pad using parameter expansion

    for img in pag-2016-[0-9].jpg ; do
        parts=(${img//-/ }) ;
        mv "$img" $( printf %s-%s-0%s.jpg ${parts[0]} ${parts[1]} ${parts[2]%.*} ) ;
    done

We are iterating on files with a specific name pattern: before the last `.` (dot) there must be *one* single digit ranging from 0 to 9, followed by “.jpg”.

We then *split* the filename based on `-`. At this point we obtain an array (which we called `parts`), which has content following this structure.

    parts[0]=pag
    parts[1]=2016
    parts[2]=1.jpg

From that point, `mv` is passed the first parameter which is simply the original name. The second parameter is a result of a combination of operations inside a subshell. We use the indexes of the array `parts` to come up with the new filename.

On each iteration, `parts[2]` will be `1.jpg`, then `2.jpg`, etc., up to `9.jpg`. To illustrate, suppose it is `1.jpg`.

Using the expansion `${parts[2]%.*}`, the `.jpg` part is removed. Only the single digit remains (the one we want to pad with zero). The padding zero is inserted with the `0%s` in the `printf` call. The result is exactly what we wanted.

## Padding with parameter expansion, printf and sed parameter expansion, printf e sed

Fasten the seatbelt. Use the force to understand this one. Anything less won’t do.

```shell
for img in pag-2016-[0-9].jpg ; do
    mv "$img" $(printf %s-%d%d.jpg "${img%-*}" "0" $(sed 's/.*\([0-9]\)\.jpg/\1/' <<< $img))
done
```

To spindle the new name for the image (the second parameter to `mv`), a lot of stuff is going on. First of all, we use `printf` inside a subshell. We specified `%s-%d-%d.jpg` to printf. The corresponding argument that matches `%s` is `"${img%-*}"`, which starts from the end of the filename, and removes everything up to the first `-`. The result is something like `pag-2016`.

Then, we pass a simple `"0"` to satisfy the corresponding first `%d` that we specified for `printf`. That is the padding zero.

Next, we use another subshell (inside the previous subshell) to run a sed command to carve the single digit before `.jpg` out of the string. So, the string which is `pag-2016-1.jpg` is turned into a single `1` (the `1` before the `.jpg` part). This sed command takes the original filename as input, and we used a HERESTRING for that. Yeah, it is kind of complex. Test with this:

    sed 's/.*\([0-9]\)\.jpg/\1/' <<< 'pag-2016-1.jpg'
    1
    sed 's/.*\([0-9]\)\.jpg/\1/' <<< 'pag-2016-2.jpg'
    2

The best way to understand things like this is really to run small pieces of the full command to see what each one does individually.

## Using only parameter expansion and printf

This one should, in theory, be more performant and elegant because we are not using unnecessary subshells to run an external program (sed). Here we use only bash’s built-in features.

    for img in pag-2016-[0-9].jpg ; do
        parts=(${img//-/ })
        mv "$img" $( printf %s-%s-0%s.jpg ${parts[0]} ${parts[1]} ${parts[2]%.*} )
    done

We again split the original filename by the `-` character like we did in one of the previous examples.

`parts[0]` is the string `pag`. `parts[1]` is `2016`. Both are just passed as the matching arguments for the first two format specifiers (`%s-%s`).

`parts[2]` is a string like `1.jpg`. It is expanded using `${parts[2]%.*`, which removes everything from the end of the string up to and including the dot. We are once more left with the single digit, the one that is to be padded with zero. But see that this time the padding `0` is added manually in the first parameter to `printf`, as are the needed `-` characters.

## Zero-pad using (perl) rename

Some Linux systems have a program called `rename` installed by default. In some distros, this command is actually a Perl script that enables one to wield all the power of Perl regular expressions to perform surgery on filenames. Let’s zero-pad our digit using perl rename.

    rename -n 's/-(\d)\.jpg/-0\1.jpg/' *.jpg

The regex here is `/-(\d)\.jpg/`, which matches a `-` followed by a *single digit*, followed by `.jpg`. At the replacement part, we add the `-`, a `0` (the padding), and the number that was captured by the grouping pair of parenthesis, finally followed by `.jpg`.

It is important to note that any characters on the original filename not matched by the regex are not touched. That means that in our example, only `-`, the digit and `.jpg` need to be added back in the replacement part of the regex. The `pag-2016` part will not be changed by our command.

# Conclusion

These are but a few examples that I use frequently on my life as a developer. If you think about it, we are just manipulating strings. `mv` takes two arguments. The first is the original file name. The second is the new name. What we do is to manipulate the original filename and generate a new string which becomes the new filename and pass the resulting string as the second argument to `mv`.
