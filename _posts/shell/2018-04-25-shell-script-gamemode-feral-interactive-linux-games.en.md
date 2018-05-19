---
layout: post
toc: true
title: Shell Script to Set CPU to Performance Game Mode as Recommended By Feral Interactive To Play Games on Linux
permalink: shell/shell-script-gamemode-feral-interactive-linux-games.html
date: 2018-04-25 09:11:23
excerpt: When playing games on Linux, Feral Interactive advises users to set CPU governor to \`performance' so games cann perform better. This script does exactly that.
categories: shell, linux-gamming
---

# Introduction

Feral Interactive has been doing an amazing job porting games to Linux. Way to go, Feral\! I have played several of their ported games on Linux (my distro of choice is Arch Linux), like [Alien: Isolation](https://www.feralinteractive.com/en/games/alienisolation/){:target="____blank"}, [Tomb Raider](https://www.feralinteractive.com/en/games/tombraider/story/){:target="____blank"}, and [Hitman](https://www.feralinteractive.com/en/games/hitman/story/){:target="____blank"}. In 2018 Feral released [Rise of Tomb Raider](https://www.feralinteractive.com/en/games/riseofthetombraider/){:target="____blank"} for Linux as well. Since this game is very demanding in terms of hardware capatilities, they recommend Linux users to set CPU governor to `performance` in order to play it (and other games too, actually).

So, let’s see how to do it.

# The Script

Feral actually has a [faq](https://support.feralinteractive.com/docs/en/riseofthetombraider/1.0.3/linux/faqs/#i_cpu_governor){:target="____blank"} explaining the commands to set CPU governor to either `performance` (for playing games) or `powersave` (for when you are using the computer for ordinary tasks that do not require that much power).

Since it is a bit harder to remember the whole path and command line used to set it, I decided to make a shell script to run the actual commands. [Check the script on gitlab](https://gitlab.com/fernandobasso/dotfiles/blob/master/FILES/bin/cpu_governor.sh).

**set CPU to either performance or powersave.**

``` bash
#!/usr/bin/env bash

#
# This script sets all available CPUs to either
# 'performance' (for playing games, for instance)
# or 'powersave'.
#
# I Made this script based on the information from:
#
# https://support.feralinteractive.com/docs/en/riseofthetombraider/1.0.3/linux/faqs/#i_cpu_governor
#
# Instead of this script, you may want to use the 'gamemode' (open source)
# tool by Feral Interactive:
#
# https://github.com/FeralInteractive/gamemode
#
# Way to go, Feral!
#
# USAGE:
# ------
#
# Download this script and save it as `cpu_governor.sh` then
# just run it like this:
#
#     bash cpu_governor.sh --performance
#
# or
#
#     bash cpu_governor.sh --powersave
#
# Of course, if you have more experience with Linux, you can also make it
# executable, add it your some directory in your PATH and just run it like
# any other command.
#
# NOTE: This script assumes you have `tr', `sed', `wc' and `bash' at least
# version 3.2 installed. This should be the no problem for any Linux
# distribution as of 2018.
#
# NOTE: We also assume you have `sudo' installed and you are in a group that
# allows you to used `sudo'. This is the default on Ubuntu and derived distros.
# For Arch Linux (also useful for other distros), check:
#
# https://wiki.archlinux.org/index.php/sudo
#
# Checking the current mode
# -------------------------
#
# To check in which mode your CPUs are currently in, check one
# of your CPUs, example:
#
#     cat /sys/devices/system/cpu/cpu2/cpufreq/scaling_governor
#

usage () {

    script_name=${0##*/}

cat << TOMBRAIDER
Run with: ‘%s’ or ’%s’\n' '--powersave' '--performance'

Examples:

    $script_name --performance
or

    $script_name --powersave

You may also use '--dry-run' as the second argument, in
which case no real configurations will be made, but the
script will just print what it _would_ do:

    $script_name --performance --dry-run
or

    $script_name --powersave --dry-run
TOMBRAIDER

    exit 0
}

if [[ $# < 1 ]] ; then
    usage
fi

mode=''

case "$1" in
    --po*)
        mode=powersave
        ;;
    --pe*)
        mode=performance
        ;;
    *)
        usage
        ;;
esac

try=''
if [[ "$2" == '--dry-run' ]]; then
    try='--dry-run'
fi

# Replace tabs with spaces.
# Squeeze multiple spaces to one space.
# Match lines '^processor : <num>$'. Not all SEDs support `[0-9]\+'.
# Count those lines.
# Delete '\n' produced by previous command.
num_processors=$(cat /proc/cpuinfo \
    | tr '\t' ' ' \
    | tr -s ' ' \
    | sed -n '/^processor : [0-9][0-9]*/p' \
    | wc --lines \
    | tr -d '\n')

# Perform the actual config.
for (( num = 0; num < $num_processors; num++ )) ; do
    if [[ $try =~ --dry-run ]] ; then
        printf "Would set CPU '%d' to '%s'\n" $num $mode
        printf "echo \"$mode\" | sudo tee \"/sys/devices/system/cpu/cpu${num}/cpufreq/scaling_governor\n"
    else
        printf "Setting CPU '%d' to '%s'\n" $num $mode
        echo "$mode" | sudo tee "/sys/devices/system/cpu/cpu${num}/cpufreq/scaling_governor"
    fi
done
```

# Download and run

Download the script:

    wget https://gitlab.com/fernandobasso/dotfiles/raw/master/FILES/bin/cpu_governor.sh

Run it without arguments to see some help text:

    bash cpu_governor.sh

See what it *would* do:

    bash cpu_governor.sh --performance --dry-run

Set CPU to `performance` (for real):

    bash cpu_governor.sh --performance

Set CPU back to default:

    bash cpu_governor.sh --powersave

# Feral Gamemode Open Source Tool

Instead of the above script, you may want to check [Feral Interactive’s Gamemode open source tool](https://github.com/FeralInteractive/gamemode){:target="_blank"}. There is an [AUR](https://aur.archlinux.org/packages/?O=0&SeB=n&K=gamemode&outdated=&SB=n&SO=a&PP=50&do_Search=Go) package for Arch Linux.

# Links and Resources

  - [My cpu\_governor.sh script](https://gitlab.com/fernandobasso/dotfiles/blob/master/FILES/bin/cpu_governor.sh){:target="_blank"}

  - [Feral Interactive FAQ](https://support.feralinteractive.com/docs/en/riseofthetombraider/1.0.3/linux/faqs/#i_cpu_governor){:target="_blank"}

  - [Feral Interactive Gamemode for Linux](https://github.com/FeralInteractive/gamemode){:target="_blank"}

  - [Feral Intractive List of Linux Games](https://www.feralinteractive.com/en/linux-games/){:target="_blank"}

  - [Arch Wiki page on sudo](https://wiki.archlinux.org/index.php/Sudo){:target="_blank"}

  - [Arch Wiki page on CPU frequency scalling](https://wiki.archlinux.org/index.php/CPU_frequency_scaling){:target="_blank"}

  - [Kernel docs on cpu governors](https://www.kernel.org/doc/Documentation/cpu-freq/governors.txt){:target="_blank"}
