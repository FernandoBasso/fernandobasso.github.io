---
layout: post
toc: true
permalink: en/web-development/laravel-deploy-login-problem-infinite-redirect-loop.html
title: Login Redirect Loop on Laravel in Production
date: 2017-10-27 07:16:11
excerpt: In this post I will talk about a problem I had when deploying a Laravel application in which authentication worked fine locally but not on the production server causing an infinite redirect loop.
categories: php laravel deployment types
lang: en
pygments-options: startinline:true
---

# Introduction

Some days ago I finished developing some first working features of a web application in Laravel. Working fine locally, authentication, some authorization roles, all fine and dandy.

When I deployed it to the live, production server, the public area could be accessed just fine, but the admin area was impossible to reach: an infinite redirect loop.

Why would login work locally but not on the production server‽ Well, let’s see.

# Debugging

I started a simple debugging process which was painful because I had to change something locally and upload to production to see what would happen, since the local app was OK and did not present the same login infinite redirect loop problem.

I disabled the `auth` middleware for the admin routes. No change same problem. Then I disabled a middleware I had created myself to handle roles. It was called `admin` and it is like this:

``` php
public function handle($request, Closure $next)
{
    if (Auth::check() && (Auth::user()->isEditor() || Auth::user()->isAdmin())) {
        return $next($request);
    }

    return redirect('/login');
}
```

![Laravel Admin Middleware]({{ site.base_url }}/imgs/web-development/01-admin-middleware-laravel.jpg)

My `User` model has those `isAdmin` and `isEditor` methods defined like so:

``` php
public function isAdmin()
{
    return $this->has_role === 1;
}

public function isEditor()
{
    return $this->has_role === 2;
}
```

Simple enough, right‽ But do note the *triple equal sign* comparison operator I am using.

# Let’s Tinker for a Moment…​

I used `tinker` on my local and production environments. Take a look:

![Laravel Tinker - Devel vs Prod]({{ site.base_url }}/imgs/web-development/02-tinker-devel-vs-prod.jpg)

I did immediately spot the difference. The local development returns `has_role` as numbers, integers, while the production side says they are strings\! How come‽ Moreover, recall I am using *triple equal sign* comparison operators in my `Admin` middleware? Yes, those two things combined resulted in the infinite redirect loop problem for the admin area.

I then changed `===` with `==` on the Admin middleware methods, and indeed, the problem on the production side was gone. Everything working fine\!

The question is why `has_role` values were integers locally, and strings on the production environment.

# Why Different Data types?

When I deployed the application, I didn’t have seeds for the admin users, and I thought it would be just fine if I exported the local users from the DB and imported them on the production database, therefore, I did this (I am using MariaDB):

``` shell
mysqldump -h localhost -u devel_user -ps3cr37 my_devel_db users | \
    mysql -h server.db.net -u prod_user -ps3cr37 -D my_prod_db
```

I though, “of course, the data traveled through the network (mysql client/server communication happens through TCP) and became strings\!” Then I tried doing this on the server:

``` php
// Attempt to update has_role to 1, a number.
\App\User::find(1)->update(['has_role' => 1]);
\App\User::all()->pluck('has_role');
// → "1"
// → "2"
```

Nope, the numeric strings were still there…​ Then I tried through the mysql cli itself:

``` sql
UPDATE users SET has_role = 1 WHERE id = 1;
```

But the problem persisted. PHP, Tinker and the Laravel application still thinking that `1` in the database is `"1"`. No, the problem doesn’t seem to be because of the way I populated the `users` table on the server.

# PDO + mysql vs PDO + mysqlnd

Researching a little more, I found some people saying that PHP + PDO with the mysql extension poses that problem, while mysqlnd extension does not.

  - [Laracasts forum question describing the problem](https://laracasts.com/discuss/channels/laravel/laravel-collection-returns-an-int-as-string-locally-and-on-live-enviroment-as-string)

  - [Stackoverflow question with the problem](https://stackoverflow.com/questions/20079320/php-pdo-mysql-how-do-i-return-integer-and-numeric-columns-from-mysql-as-int/20123337#20123337)

Indeed, doing `php --info` showed this on my local, development box (running Arch Linux):

    PDO Driver for MySQL => enabled
    Client API version => mysqlnd 5.0.12-dev - 20150407 - $Id: b396954eeb2d1d9ed7902b8bae237b287f21ad9e

And this on the server:

    PDO Driver for MySQL => enabled
    Client API version => 5.6.36-82.0

# The "Solution"

I decided the solution for now was just to use `==` instead of `===` in my Admin middleware. I have other applications on this server and would probably be unwise to attempt installing the `mysqlnd` extension.

The lingering question is: what would have been the best approach in the first place that could have avoided the problem and saved me some hours of debugging and experimenting?

I am not perfect and still seeking enlightenment…​
