---
layout: post
toc: true
title: Shell Script to Create Passwords as Required by Locaweb Hosting Services
permalink: shell/shell-script-generate-passwords-locaweb.html
date: 2018-05-06 09:37:00
excerpt: Locaweb hosting services advise that passwords have special chars, but it only allows a specific set of them, and this script generates passwords that conform to their requirements.
categories: shell, linux-gamming
---

# Introduction

I host some websites and applications on Locaweb. When creating databases or email accounts, they only allow certain special characters to be included. The problem is that you first have to submit the password before they show you which special characters are allowed (a very annoying behaviour; they should show that before letting the user attempt to submit the form).

I tried using some tools to generate the password, like `openssl rand …​` and `pwgen`, but I could not bend those to my will of creating passwords following the constraints required, so I decided to make something myself.

> **Note**
>
> I do not claim my script/approach is secure, or smart, or whatever. It just worked for my needs.

# The Script

**pwlw.sh.**

``` bash
link:https://gitlab.com/fernandobasso/dotfiles/raw/master/FILES/bin/pwlw.sh[]
```

<https://gitlab.com/fernandobasso/dotfiles/blob/master/FILES/bin/pwlw.sh>

# Using pwlw.sh

Nothing much to say, but you can show the help:

    pwlw.sh --help

Generate a password with 11 chars (default):

    pwlw.sh

Generate a password with 14 chars:

    pwlw.sh 14

# Screenshots

![displaying help]({{ site.base_url }}/imgs/shell/pwlw-script-help.jpg)

![generating passwords]({{ site.base_url }}/imgs/shell/pwlw-script-generating-passwords.jpg)
