---
layout: post
toc: true
title: Understanding Order of Evaluation in Ruby Control Expressions
excerpt: Let’s study some examples, analyse and understand the order of evaluation of expressions in Ruby control expressions and modifiers like while, until, if, and unless.
permalink: ruby/understanding-order-evaluation-ruby-control-expressions
categories: ruby, control-expressions
---

# Introduction - Can You Answer This?

Do you know what is printed in each of the following pieces of code?

``` ruby
# We'll use the same array for all examples.
arr = [10, 20, 30]

# We'll also use a variable `i` and set to zero
# for each different example.

# Case 1
i = 0
while arr[i] do
  p arr[i]
  i += 1
end

# Case 2
i = 0
while arr[i += 1] do
  p arr[i]
end

# Case 3
i = 0
while arr[i] do
  p arr[i += 1]
end

# Case 4
i = 0
p arr[i] while arr[i += 1]

# Case 5
i = 0
p arr[i += 1] while arr[i]
```

For starters, cases 1, 2 and 3 use a normal `while` loop. Cases 4 and 5 use `while` as a *modifier*.

A normal `while` loop reads like “while \<some condition\>, do this”. The modifier, on the other hand, reads as “do this while \<some condition\>”.

For all examples (unless otherwise specified), we start with:

``` ruby
arr = [10, 20, 30]
i = 0
```

So, we will omit that from the examples unless otherwise noted.

# True and False in Ruby

In ruby, only `nil` and `false` is a fasly values. Empty arrays, empty hashes, empty strings, the values 0, 0.0 or -1 all evaluate truthy in a boolean context.

# While Loop and Modifier

We’ll dissect some examples in a step-by-step fashion using `while` as a normal loop and as a modifier, which should give us a sound ground to understand similar ideas with other forms of loops and conditional expressions.

## Case \#1 - while loop

So, case 1 is the most obvious one, and no surprises should arise.

``` ruby
# Case 1
while arr[i] do # <1>
  p arr[i]      # <2>
  i += 1        # <3>
end
```

Iteration 1:

1.  First ruby evaluates if `arr[i]`, that is, `arr[0]` is true. Since `i` is zero, and `arr` has a truthy element on index zero, the result is truthy, so, enter inside the block.

2.  Print `arr[0]`, which is the value 10.

3.  Increment `i` so now its value is 1.

Iteration 2:

1.  `i` is 1 and `arr[i]`, that is, `arr[1]`, is truty because we have the value 20 in that index. Dive into the block.

2.  Print `arr[i]`, which produces the value 20.

3.  Increment `i` and its value becomes 2.

Iteration 3:

1.  `i` is 2, and `arr[i]`, that is, `arr[2]`, is truthy because we have the value 30 in that array index. Again, enter the block.

2.  Print `arr[2]`, which produces the value 30.

3.  Increment `i` to the value 3.

Iteration 4:

1.  Now that `i` is 3, `arr[i]`, that is, `arr[3]`, is falsy because our array goes only up to index 2, we *do not* enter the block. The loop stops and we have by now printed the values 10, 20 and 30. The result is:

<!-- end list -->

``` ruby
# Case 1
while arr[i] do # <1>
  p arr[i]      # <2>
  i += 1
end
# → 10
# → 20
# → 30
```

Note that in each iteration `i` has the same value both in 1 and in 2.

## Case \#2 - while loop - change i when testing

``` ruby
while arr[i += 1] do # <1>
  p arr[i]           # <2>
end
```

Here, we increment `i` inside the square brackets in the `while` expression. That makes a difference, because ruby will first evaluate `i += 1`, then access the array index with the new value of `i`. Let’s analyse it step by step.

Iteration 1:

1.  `i` is zero, but ruby first evaluate `i += 1`, which causes `i` have the value 1. Only then ruby proceeds and accesses the array index, which is 1. `arr[1]` has a truthy value, which causes the expression to return truthy. Yay\! Enter the block.

2.  Print `arr[i]`, that is, `arr[1]`, which is 20.

Iteration 2:

1.  `i` is 1. Evaluate `i += 1`, which results in the value 2. `arr[2]` is truthy because it has the value 30 in that index. We again go inside the block.

2.  Print `arr[2]`, which is 30.

Iteration 3:

1.  `i` is 2, so, `i += 1` results in 3. Nope, there is nothing in `arr[3]` so the expression results in a falsy value and ruby *does not* enter the block. The result is then:

<!-- end list -->

``` ruby
while arr[i += 1] do
  p arr[i]
end
# → 20
# → 30
```

## Case \#3 - while loop - change i when printing

In this case, we increment `i` inside the brackets in the `p` line (in the previous example we incremented `i` inside the brackets in the `while` line). This makes a big difference, even more than the case \#2. Let’s see what happens.

``` ruby
while arr[i] do  # <1>
  p arr[i += 1]  # <2>
end
```

Iteration 1:

1.  `i` is 0, and `arr[i]`, that is, `arr[0]` is truthy. Enter The Dragon the block.

2.  Now, ruby first evaluates `i += 1` and increments `i`, which now holds the value 1. `p` prints the value 20 from `arr[1]`. Pay attention to this: even though the test to enter the loop was against `arr[0]` because `i` was 0 at that point, ruby increments `i` *before* printing the value from the array index. So, we test against `arr[0]` but print `arr[1]`.

Iteration 2:

1.  `i` is 1. `while arr[1]` is truthy, so, again, go inside the block.

2.  Increment `i` before printing. `i` becomes 2 and we print `arr[2]`, which is 30. See, we test against `arr[1]` in the `while` line, but print `arr[2]` in the `p` line.

Iteration 3:

1.  `i` is 2. `while arr[2]` is truthy because that position holds the value 30. Go once again inside the block. But…​

2.  Increment `i` to 3. `arr[3]` doesn’t even exist. `nil` is printed (read the note at the end of this section). Again, we tested against one array index (`arr[2]`), but printed another array index (`arr[3]`).

Iteration 4:

1.  `i` is 3, which causes the `while` condition expression to be falsy because `arr[3]` is nonexistent in our array.

The result is this:

``` ruby
while arr[i] do
  p arr[i += 1]
end
# → 20
# → 30
# → nil
```

> **Note**
>
> Ruby won’t throw a fit because `arr[3]` doesn’t exist. It simply tells you “nil”. Some other languages would throw an exception or some sort of error and stop executing the program. Each approach has pros and cons and I don’t think one is necessarily better than the other. One could argue that it depends on each specific case.

## Case \#4 - while modifier - change i when testing

Here we use `while` as a *modifier*.

``` ruby
# <2>          <1>
p arr[i] while arr[i += 1]
```

In this example, even though `while arr[i += 1]` appears *after* `p arr[i]`, the `while` condition expression `arr[i += 1]` is evaluated *before* the printing takes place. That being said, let’s proceed with our step-by-step analysis of the code.

Iteration 1:

1.  `i` starts as 0, but since ruby does `i += 1` first, `i` becomes 1. `arr[1]` is truthy because we do have a truthy value of 20 in that position.

2.  Since \<1\> was truthy, print `arr[i]`, that is, `arr[1]`, which is 20. `is` is 1 because of the evaluation that took place in \<1\>.

Iteration 2:

1.  `i` is 1. First evaluate `arr[i += 1]`, which results in 2 and makes `i` have the value 2. Truthy again because `arr[2]` is a valid position in our array and we do have a truthy value there.

2.  Print `arr[2]`, which is 30.

Iteration 3:

1.  By now `i` is 2. Ruby evaluates `arr[i += 1]` which makes `i` have the value 3. `arr[3]` is an index our array doesn’t have, so, the expression is falsy.

2.  Nope, since the \<1\> was falsy, do not print anything in this iteration.

This is the result:

``` ruby
p arr[i] while arr[i += 1]
# → 20
# → 30
```

## Case \#5 - while modifier - change i when printing

Again we use `while` as a *modifier* here.

``` ruby
# <2>          <1>
p arr[i += 1] while arr[i]
```

Iteration 1:

1.  `i` is 0. `arr[0]` is truthy because it is a valid index in our array and we have a truthy value there (remember, only `nil` and `false` are falsy values in Ruby).

2.  Since \<1\> was truthy, print `arr[i += 1]`. But hold on\! First evaluate `i += 1`, which produces the value 1 and makes `i` be 1. Print `arr[1]`, which is 20. Like in case \#3, we test the truthyness of the expression agains one array index, but print another array index.

Iteration 2:

1.  `i` is 1. `arr[i]`, which is the same as `arr[1]` is truthy because we have a non-falsy value in that position.

2.  Since \<1\> was truthy, proceed to `p arr[i += 1]`, but as you now by know, first evaluate `i += 1`, which is 2. So, print `arr[2]`, which is the value 30.

Iteration 3:

1.  `i` is 2. `arr[i]`, that is, `arr[2]` is truthy, you know, because we have a truthy value there.

2.  Again, since \<1\> was truthy, we proceed to `p arr[i += 1]`, but low and behold, the expression inside the bracket is evaluated first, producing the value 3. Ruby then tries to access the `arr[3]`. Since that position is nonexistent in our array, ruby gives us `nil` (but no errors).

Our result is:

``` ruby
p arr[i += 1] while arr[i]
# → 20
# → 30
# → nil
```

## All Examples Together Again, With Output

Perhaps looking at the following listing may give us another way to visualize what happens. I also tried to show the values `i`, the increment expression and the truthiness or falseness of those expressions on each iteration.

``` ruby
arr = [10, 20, 30]

puts "\n----- Case #1 - while loop --------------------------------"
i = 0
while arr[i] do # 0, 1, 2, 3 -> false
  p arr[i]      # 0, 1, 2
  i += 1
end
# → 10
# → 20
# → 30

puts "\n----- Case #2 - while loop - chage i when testing ---------"
i = 0
while arr[i += 1] do # 1, 2, 3 -> false
  p arr[i]           # 1, 2
end
# → 20
# → 30

puts "\n----- Case #3 - while loop - chage i when printing --------"
i = 0
while arr[i] do   # 0, 1, 2, 3 -> false
  p arr[i += 1]   # 1, 2, 3 -> nil
end
# → 10
# → 20
# → nil

puts "\n----- Case #4 - while modifier - chage i when testing -----"
i = 0
#    1            1
#    2            2
#    ...          3
p arr[i] while arr[i += 1]
# → 10
# → 20

puts "\n----- Case #5 - while modifier - chage i when printing ----"
i = 0
#    1            0
#    2            1
#    nil          2
p arr[i += 1] while arr[i]
# → 10
# → 20
# → nil
```

## An Array of Nil and False Values Only

Beware\! If an array position contains `nil` or `false`:

``` ruby
arr = [nil, false, nil]

i = 0
while arr[i] do
  p arr[i]
  i += 1
end
```

The above code simple prints nothing because the first element of the array is a falsy value and we do not even enter the block. With this new array, no matter how we increment `i` or we use the while loop or modifier, nothing will ever be printed.

Also, careful if you have an array like this:

``` ruby
arr = [10, 0, nil, false]
i = 0
while arr[i] do
  p arr[i]
  i += 1
end
# → 10
# → 0
```

See‽ `arr[2]` is `nil`, so the loop stops there. It may be what you want and need, but consider other options, like `for` or the `each` iterator:

``` ruby
arr = [10, 0, nil, false]

for item in arr do
  p item
end
# → 10
# → 0
# → nil
# → false

arr.each do |item|
  p item
end
# → 10
# → 0
# → nil
# → false
```

# Until Loop and Modifier

As you probably know, `until` loops until the test expression results in a truthy value, that is, while it is false. Therefore, `until <expr>` is a good replacement for `while ! <expr>`.

  - `while`: loop as long as the condition is true (stop when it becomes false);

  - `until`: loop as long as the condition is false (stop when it becomes true).

And of course you can invert them using the `!` (not) operator of for some reason it makes sense in a given situation. But I digress…​

## Case \#1 - until loop

I each iteration, first test, then print `i`, then increment `i` by 10. In the fourth iteration, `i` is 40, which makes `i > 30` truthy, ending the loop.

``` ruby
i = 0
until i > 30 do         # f, f,  f,  f,  t
  p i                   # 0, 10, 20, 30
  i += 10               # 0, 10, 20, 30, 40
end
# → 0
# → 10
# → 20
# → 30
```

## Case \#2 - until loop - change i when testing

Here we change `i` in the `until` line, before testing if the value is greater than 30. Parenthesis are necessary because of operator precedence.

``` ruby
i = 0
#                             10, 20, 30, 40
until (i += 10) > 30 do     # f, f, f, t
  p i                       # 10, 20, 30
end
# → 10
# → 20
# → 30
```

1.  The value of `(i += 10)`, which is always evaluated first.

2.  The result of the comparison of `i > 30`.

3.  The output.

## Case \#4 - until loop - change i when printing

In this example, we test with the original value of `i` but print with an already incremented value. That is, when we test with `i` as 0, we print `i += 10`, which is 10. When we test with `i` as 10, we then print `i += 10`, which is 20. And so on until `i > 30` is truthy.

``` ruby
i = 0
until i > 30 do     # f,  f,  f,  t
  p i += 10         # 10, 20, 30, 40
end
# → 10
# → 20
# → 30
# → 40
```

## Case \#4 - until modifier - change i when testing

Pay attention to what gets evaluated first and you should have no trouble understanding this. In each iteration, first evaluate `i += 10`, then test if the result of that is greater than 30, and if so, print `i` with the new value.

``` ruby
i = 0
#                             10, 20, 30, 40
p i until (i += 10) > 30    # f,  f,  f,  t
# → 10
# → 20
# → 30
```

1.  The value of `i`, which is always the value if `i += 10` because it is evaluated first.

2.  The value of the comparison.

But note that we don’t print `i` when it is 40 because at that point the value to the left of `>` is already greater than 30, causing the expression to be truthy, stopping the loop.

## Case \#5 - until modifier - change i when printing

First evaluate `i > 30`. Then evaluate `i += 10` and then print.

``` ruby
i = 0
p (i += 10) until i > 30        # 0, 10, 20, 30, 40
#                                 f,  f,  f,  f,  t
#                                 10, 20, 30, 40
# → 10
# → 20
# → 30
# → 40
```

1.  The value of `i`;

2.  The value of the comparison.

3.  The value of `i += 10`, which is the new value of `i` on each iteration and value that is actually printed..

# More Complex Order of Evaluation Examples

The order of evaluations matter as we shall see. Follow these examples.

``` ruby
if (num = 3).odd? then
  p num
end
# → 3
```

No problem there. But now, behold this problem when using `if` as a modifier in this code:

``` ruby
p num if (num = 3).odd?
```

Let’s run it:

    $ ruby -w devel.rb
    devel.rb:5: warning: assigned but unused variable - num
    devel.rb:5:in `<main>': undefined local variable or method `num' for main:Object (NameError)

Fernando: What the poop‽ Two errors\! You are joking right?
ruby interpreter: No, I am not joking.

Well, we all know that ruby doesn’t require parenthesis to invoke methods. But how then does ruby know when a *name* like `foo` is a variable or a method? If ruby has not seen an assignment to a *name*, or at least an attempt of an assignment, it assumes *name* is a method.

In our example, ruby parses the code and sees `p num` first, and thinks, “h’m, I don’t see an assignment here, so, this is a method.” Then, we assign `num = 3`. When you have the expression `num = 3`, besides assigning 3 to `num`, ruby also returns that value 3, which was the receiver for the method `odd?`. Since 3 is an odd number and that is the test expression of the `if`, ruby decides that it should proceed and finally execute `p num`. But by now `num` is a variable. Still, ruby tries to invoke `num` as method because the initial parsing caused the interpreter to see `num` as a method.

The result is that we have both an unused variable `num`. We set it to 3 but never used it for anything. In `(num = 3).odd?`, the `odd?` method acts upon the resulting value 3 which is the result of the assignment, so, it is not *using* the variable. And we do not print it either. What we try to print is the result of invoking a method `num` which was never defined.

So, yeah, this is a very tricky subject indeed. Ruby is an extremely expressive language, but with it comes some complexity. Again, my opinion that it is not necessarily good or bad.

And a very similar error would be inflicted upon us with an `unless` modifier, because the order of the evaluation is the same:

``` ruby
puts num unless (num = 3).even?
# → error again
```

Thankfully, these last two examples are more to demonstrate the ideas and are not something we would need to use everyday in our Ruby programming. Knowing these things, though, is important nonetheless and may come in handy in some situations.

# Conclusion

And there you have it. Some examples and ways to understand the order in which ruby evaluates the expressions and how that affects our algorithms and programs in general. Our job is to understand the subtleness and nuances of the language (not only Ruby) and make the most of every small feature that can help us, at the time avoiding gotchas and things that may come back to bite us.
