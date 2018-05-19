---
layout: post
toc: true
title: Editing Code on Vim Command Line and Nicely Align Text on Columns
permalink: en/vim/editing-code-command-line-align-text-columns.html
date: 2017-05-16 19:08:00
excerpt: Editing code using vim command line, search and replace and external `column` command.
categories: vim programming tips
---

Today I’ll show some ways to edit text using vim’s command line search and replace plus how to use an external command to help us nicely align columns of text.

# Example \#1

So, I was working in some PHP code and I had these variables which I needed to initialize with the values from a POST request.

    $id
    $nome
    $email
    $password
    $status
    $fone1
    $fone2
    $nome_fantasia
    $razao_social
    $cpf
    $cnpj
    $rg
    $ie
    $cidade
    $estado
    $rua
    $cep
    $numero

First we visually selecte those lines, and hit `:` to start the *command line mode*. Since it is a visual selection, Vim marks the beginning of the selection with `'<` and the end with `'>`, therefore the command line starts as `:'<,'>`. The comma just separates the range marks.

Then, type down the regexp replace thing. The entire command line looks like this:

    :'<,'>s/$\(\w\+\)/$\1 = param('\1');/

Hit `<CR>` (the ‘Enter’, or ‘Return’ key) and the result is:

``` php
<?php
$id = param('id');
$nome = param('nome');
$email = param('email');
$password = param('password');
$status = param('status');
$fone1 = param('fone1');
$fone2 = param('fone2');
$nome_fantasia = param('nome_fantasia');
$razao_social = param('razao_social');
$cpf = param('cpf');
$cnpj = param('cnpj');
$rg = param('rg');
$ie = param('ie');
$cidade = param('cidade');
$estado = param('estado');
$rua = param('rua');
$cep = param('cep');
$numero = param('numero');
```

That command did a lot, didn’t it‽ Basically, it matches the “word characters” after the `$` and saves it in a capturing group: `\(\w+\)`. Then it just adds the `$` followed by the previous matched text in the capturing group `\1` followed by ` = param('\1');`, which results in every line with the single variable being turned into `$varname = param('varname');` statements.

If the code style of your code base uses assignments in aligned columns, it is possible to use the `column` command line (available on \*nix systems) to nicely align the columns. Visually select the lines again (you may use `gv`) and then run:

    :'<,'>!column -t

And the result is:

``` php
<?php
$id             =  param('id');
$nome           =  param('nome');
$email          =  param('email');
$password       =  param('password');
$status         =  param('status');
$fone1          =  param('fone1');
$fone2          =  param('fone2');
$nome_fantasia  =  param('nome_fantasia');
$razao_social   =  param('razao_social');
$cpf            =  param('cpf');
$cnpj           =  param('cnpj');
$rg             =  param('rg');
$ie             =  param('ie');
$cidade         =  param('cidade');
$estado         =  param('estado');
$rua            =  param('rua');
$cep            =  param('cep');
$numero         =  param('numero');
```

It is important to note the use of the `!` character so that the text in the selected lines is sent to the external program, operated on and then placed back (after modification), effectively replacing the old, unaligned columns with the new, aligned ones.

# Example \#2

This one is very similar, actually, but I do think it is worth to take a look at it nonetheless. Here is the raw input lines I had, copied from an SQL statement somewhere else:

    nome
    email
    fone1
    fone2
    nome_fantasia
    razao_social
    cpf
    cnpj
    rg
    ie
    cidade
    estado
    rua
    cep
    numero

Then I run:

    :'<,'>s/\w\+/$sth->bindParam(':&', $&, PDO::PARAM_STR);/

And the result is:

``` php
<?php
$sth->bindParam(':nome', $nome, PDO::PARAM_STR);
$sth->bindParam(':email', $email, PDO::PARAM_STR);
$sth->bindParam(':fone1', $fone1, PDO::PARAM_STR);
$sth->bindParam(':fone2', $fone2, PDO::PARAM_STR);
$sth->bindParam(':nome_fantasia', $nome_fantasia, PDO::PARAM_STR);
$sth->bindParam(':razao_social', $razao_social, PDO::PARAM_STR);
$sth->bindParam(':cpf', $cpf, PDO::PARAM_STR);
$sth->bindParam(':cnpj', $cnpj, PDO::PARAM_STR);
$sth->bindParam(':rg', $rg, PDO::PARAM_STR);
$sth->bindParam(':ie', $ie, PDO::PARAM_STR);
$sth->bindParam(':cidade', $cidade, PDO::PARAM_STR);
$sth->bindParam(':estado', $estado, PDO::PARAM_STR);
$sth->bindParam(':rua', $rua, PDO::PARAM_STR);
$sth->bindParam(':cep', $cep, PDO::PARAM_STR);
$sth->bindParam(':numero', $numero, PDO::PARAM_STR);
```

Here, we again match “word characters” with `\w\+`, but this time *without a capturing group*. In vim regexp we can use `&` to refer to the whole match. In this example `&` is used to place all the matched text in two places in the replacement part of the regexp. That is seen in `:&` (which produces things like `:nome` and `:email`) and `$&` (which similarly produces things like `$nome` and `$email`).

Again, the use of `column` from inside vim makes it easy to create columns nicely aligned. Just visually select the target lines again (remember `gv`) and hit `:`. Again, the whole command looks like this:

    :'<,'>!column -t

And the result is:

``` php
<?php
$sth->bindParam(':nome',           $nome,           PDO::PARAM_STR);
$sth->bindParam(':email',          $email,          PDO::PARAM_STR);
$sth->bindParam(':fone1',          $fone1,          PDO::PARAM_STR);
$sth->bindParam(':fone2',          $fone2,          PDO::PARAM_STR);
$sth->bindParam(':nome_fantasia',  $nome_fantasia,  PDO::PARAM_STR);
$sth->bindParam(':razao_social',   $razao_social,   PDO::PARAM_STR);
$sth->bindParam(':cpf',            $cpf,            PDO::PARAM_STR);
$sth->bindParam(':cnpj',           $cnpj,           PDO::PARAM_STR);
$sth->bindParam(':rg',             $rg,             PDO::PARAM_STR);
$sth->bindParam(':ie',             $ie,             PDO::PARAM_STR);
$sth->bindParam(':cidade',         $cidade,         PDO::PARAM_STR);
$sth->bindParam(':estado',         $estado,         PDO::PARAM_STR);
$sth->bindParam(':rua',            $rua,            PDO::PARAM_STR);
$sth->bindParam(':cep',            $cep,            PDO::PARAM_STR);
$sth->bindParam(':numero',         $numero,         PDO::PARAM_STR);
```

Imagine doing all that replacing and aligning manually, character by character, line by line\!

# Example \#3

This time, we have several lines with HTML `option` tags like this:

    <option value='SN'>State Name</option>

And we want to turn it into PHP’s associative `'key' ⇒ 'value'` array entries:

    'sn' => 'State Name',

The array key should be lowercased. The array value remains untouched.

And we want to turn that into a PHP array like `'sn' ⇒ 'State Name'`. My first attempt was this:

    '<,'>s:[^"]\+"\(\u\u\)">\([^<]\+\).*$:'\l\1' => '\2',

The matching part goes like this:

  - match everything up to the first double quote: `[^"]\+"`;

  - then match and store two uppercase chars in a capturing group : `\(\u\u\)`;

  - match the closing `>` for opening `option` tag;

  - match and store the next characters up to but not including the next `<`: `\([^<]\+\)`;

  - match the rest of the line.

And then the replacment part:

  - lowercase the text of the first capturing group: `\l\1` (problem here) and place it inside single quotes to make the PHP array key.

  - add the chars `⇒` (required by php array syntax);

  - then place the contents of the second capturing groups in single quotes as well;

  - the array trailing comma;

So, something like

    <option value='SN'>State Name</option>

becomes

    'sN' => 'State Name',

My first attempt was this:

    '<,'>s:[^"]\+"\(\u\u\)">\([^<]\+\).*$:'\l\1' => '\2',

Note that from the matching part we intentionally do *not* capture some text. Some characters need only to help us match and delimit stuff we need, but are not used in the replacement part later; only the captured characters are used in the replacement part of the regexp.

The problem is that the `'sn'` array key should be all lowercase, but our first attempt results in something like `'xX'`, that is, the second character is still uppercase.

Using `\L\1` lowercases the entire rest of the regexp replace thing, so, even the array values become all lower case, that is, instead of `'sn' => 'State Name'` we end up with `'sn' => 'state name'`. Not what we want.

Of course, I asked for help in \#vim, and surely enough, @LeoNerd told me about `\E`. Bingo\! Running

    '<,'>s:[^"]\+"\(\u\u\)">\([^<]\+\).*$:'\L\1\E' => '\2',
    #                                          ^^

on the input:

``` html
<option value="AC">Acre</option>
<option value="AL">Alagoas</option>
<option value="AP">Amapá</option>
<option value="AM">Amazonas</option>
<option value="BA">Bahia</option>
<option value="CE">Ceará</option>
<option value="DF">Distrito Federal</option>
<option value="ES">Espírito Santo</option>
<option value="GO">Goiás</option>
<option value="MA">Maranhão</option>
<option value="MT">Mato Grosso</option>
<option value="MS">Mato Grosso do Sul</option>
<option value="MG">Minas Gerais</option>
<option value="PA">Pará</option>
<option value="PB">Paraíba</option>
<option value="PR">Paraná</option>
<option value="PE">Pernambuco</option>
<option value="PI">Piauí</option>
<option value="RJ">Rio de Janeiro</option>
<option value="RN">Rio Grande do Norte</option>
<option value="RS">Rio Grande do Sul</option>
<option value="RO">Rondônia</option>
<option value="RR">Roraima</option>
<option value="SC">Santa Catarina</option>
<option value="SP">São Paulo</option>
<option value="SE">Sergipe</option>
<option value="TO">Tocantins</option>
```

produces exactly the output we want:

``` html
'ac' => 'Acre',
'al' => 'Alagoas',
'ap' => 'Amapá',
'am' => 'Amazonas',
'ba' => 'Bahia',
'ce' => 'Ceará',
'df' => 'Distrito Federal',
'es' => 'Espírito Santo',
'go' => 'Goiás',
'ma' => 'Maranhão',
'mt' => 'Mato Grosso',
'ms' => 'Mato Grosso do Sul',
'mg' => 'Minas Gerais',
'pa' => 'Pará',
'pb' => 'Paraíba',
'pr' => 'Paraná',
'pe' => 'Pernambuco',
'pi' => 'Piauí',
'rj' => 'Rio de Janeiro',
'rn' => 'Rio Grande do Norte',
'rs' => 'Rio Grande do Sul',
'ro' => 'Rondônia',
'rr' => 'Roraima',
'sc' => 'Santa Catarina',
'sp' => 'São Paulo',
'se' => 'Sergipe',
'to' => 'Tocantins',
```

# Final Tip

If you don’t like to use visual selections, you can still operate on a renge of lines using their line numbers. For instance, if the lines you want to handle are in the range 5 to 13, you can just do:

    :5, 13 s/this/that/

or

    :5, 13 !column -t

There is more about this *range* of lines thing. Take a look at the help sections described below.

# More help and man pages

Vim:

    :help gv
    :help visual.txt
    :help :range
    :help !
    :help pattern.txt # prepare to be blown away!
    :help s/\&
    :help s/\l
    :help s/\L
    :help s/\E

> **Note**
>
> Most of these help sections will be very hard to understand. It requires familiarity with lots of concepts. If you like, you can start reading `:help usr_01.txt`.

You can also take a look at:

    :help usr_toc.txt

Column command:

    man 1 column
