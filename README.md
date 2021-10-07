# Fernando Basso Site

- [Fernando Basso Site](#fernando-basso-site)
  - [Setup and Running](#setup-and-running)
  - [Social Icons Used](#social-icons-used)

## Setup and Running

```text
$ rvm install v2.7.2

$ gem install bundler

$ bundle install

$ bundle exec jekyll serve --port 2002
```

Setup `/etc/hosts` (do this only once):

```text
$ cat <<'EOF' | sudo tee --append /etc/hosts

##
# Access at:
#
#   http://local.fernandobasso.dev:2002
#
127.0.0.1 local.fernandobasso.dev
EOF
```

Finally, point the browser to http://local.fernandobasso.dev:2002.

## Social Icons Used

Credit to:

- https://www.flaticon.com/packs/social-media-icons
