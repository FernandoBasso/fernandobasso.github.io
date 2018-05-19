#!/bin/env bash

function usage () {
    exit_status=0

    if [ ! -z "$1" ] ; then
        exit_status=$1
    fi

cat << EOF

USAGE: ${0##*/} COMIT_MESSAGE

Example:

    publish.sh 'Update post about how cool shell script is.'

CAREFUL with crappy messages because they _will be committed_
once you hit Enter.
EOF

    exit "$exit_status"
}

if [ -z "$1" ] ; then
    usage 0
fi

commit_msg="$1"

if [ ! -d ../compiled ] ; then
    printf '%s\n' "'../compiled' directory was _not_ found." 1>&2
    exit 1
fi

# If we find a Gemfile and a _config.yml file, then we
# assume we are in the source directory of a jekyll project
# and by our convetion we have a '../compiled/' directory
# as well.
if [ ! -s Gemfile ] || [ ! -s _config.yml ] ; then
    usage 1
fi

git add .
git commit -m "$commit_msg"
git push -u origin master

if [ ! -d ../compiled ] ; then
    printf '%s\n' "It looks like we do not have a '../compiled/' directory" 1>&2
    printf '%s\n' "Bailing out..." 1>&2
fi

# We checked that '../compiled/' exists in the beginning
# of the script, but shellcheck complains that cd main fail.
cd ../compiled || exit 1
git add .
git commit -m "$commit_msg"
git push -u origin master

# On a fresh shell, $OLDPWD is empty. But here, since we
# used `cd' just above, it will be set, for sure.
cd "$OLDPWD" || exit 1

