---
layout: post
toc: true
permalink: ruby/classes-and-objects.html
title: 'Understanding Classes, Objects, Methods, Instance Variables, Class Variables, Class Instance Variables and Inheritance in Ruby'
excerpt: 'Understand Classes, Objects, Instace Variables, Class Variables, Class Instance Variables and how to create method to manipulate them, and how inheritance influences them\!'
date: 2016-10-30 15:26:00
categories: ruby
---

# Classes and Objects

## Introduction

A lot of what is discussed here is only deep enough to get some practical knowledge on how to use these language features. For even more in-depth understanding, refer to [the docs](http://ruby-doc.org/core-2.3.1/) or read the ruby source code itself. :)

This tutorial assumes you have some knowledge about programming in some other object oriented programming language already.

## Intro to Syntax

In ruby, certain characters in the beginning of a variable denote that variable as being an **instance variable**, **class variable**, **global variable**, etc. Take a look at this list. We’ll discuss them further as we go.

  - a local variable (LVAR) starts without any “special character” other than the underscore. `_foo` is also a local variable.

  - a global variable (GVAR) starts with `$`.

  - an instance variable (IVAR) starts with a single `@` character.

  - a class instance variable (CIVAR) *also* starts with a single `@` character.

  - a class variable (CVAR) starts with `@@` (yes, two).

We’ll learn how do distinguish IVARS from CIVARS later on in the text.

## Classes, Objects, Accessors

Let’s create a class with a constructor, a couple of instance variables and, pair of methods and a constructor method.

``` ruby
class Person

  # The constructor.
  def initialize(name, email)
    # @name and @email instance are variables.
    @name = name
    @email = email
  end

  # Getter (reader) for email.
  def email
    @email
  end

  # Setter (writer) for email.
  def email=(email)
    @email = email
  end
end

# Creates an instance of the Person class.
p1 = Person.new('Linus Torvalds', 'linus@linux.org')

# Prints the email using the `getter`.
p p1.email

# Sets a new email using the `setter`.
p1.email = 'torvalds@kernel.org'

# Prints it again using the `getter`.
p p1.email
```

    "linus@linux.org"
    "torvalds@kernel.org"

`@name` and `@email` are instance variables. They are private and thus require proper accessor methods to get and set them. Here we define getter/setter for the email only for sake of demonstration.

Note that Ruby instance variables (IVARs) are not declared beforehand as we normally do in other object oriented languages.

### Visibility

In Ruby, there is no way to make attributes public. They are always private. All attributes that needed to be manipulated from outside of the class/object need proper accessor methods, like we did for the `email` in the previous example. There are other ways, though. Follow along\!

### A Note About Syntax

Note the syntax to create the getter and setter:

``` ruby
def email
  @email
def

def email=(new_email)
  @email = new_email
end
```

Did you see how we named both methods with the same name as the attribute itself? Just that the setter has an extra `=` (equals sign) character. For someone used to some other language, they may think that doing `p1.email` means that `email` is a public attribute on the `p1` object. But it is not. It just so happens that the getter is named `email`.

Moreover, most of the times Ruby doesn’t require that you use parenthesis (and rubists generally don’t use parens unless strictly necessary) to invoke methods. So, although `p1.email` doesn’t look like a method call, it actually is. It is just the same as `p1.email()`.

The same holds true for the setter. You can either do `p1.email = 'foo@bar.net` or `p1.email=('foo@bar.net')`. It is really the same thing. Still, the first version makes it look like we are assigning a value to a public property, which we are not. We are using a setter method.

## Using attr\_reader and attr\_writer

Here we use `attr_reader` and `attr_writer` methods which in turn, create instance variables for us with proper getters and setters.

``` ruby
class Person

  # Define getters.
  attr_reader :name, :email

  # Define setters.
  attr_writer :name, :email

  def initialize(name, email)
    @name = name
    @email = email
  end
end

# Creates in instance of the Person class.
luke = Person.new('Luke', 'luke@star.net')

# Uses the email setter.
p luke.email

# Uses the email getter.
luke.email = 'padawan@start.net'

# Uses the email getter again
p luke.email

# We could have used the name getter/setter in the same way.
```

When we do something like `attr_reader :foo`, Ruby internally does this for us:

``` ruby
# It creates a getter for @foo.
def foo
  @foo
end
```

And when we write `attr_writer :foo`, Ruby internally does this:

``` ruby
# It creates a setter for @foo.
def foo=(arg)
  @foo = arg
end
```

## Using attr\_acessor

And here we use a single `attr_acessor` to create readers and writers (getters and setters) in a single step.

``` ruby
class Person
  attr_accessor :name, :email
end

belinda = Person.new
belinda.name = 'Belinda'
belinda.email = 'belinda@github.io'
p belinda.name
p belinda.email
```

    "Belinda"
    "belinda@github.io"

## Class Variables

A class that contains a class variable (CVAR) `@@count`.

``` ruby
class Thing
  # This is a CVAR.
  @@count = 0

  # A class method getter/reader for the CVAR.
  def self.count
    @@count
  end

  # A class method setter/writer for the CVAR.
  def self.count=(num)
    @@count = num
  end
end

p Thing.count
Thing.count = 42
p Thing.count
```

    0
    42

A class variable is one that belongs to the class, and not to the instances of the class. That is why we do invoke the getter and setter from the `Thing` class itself. But now things get trickier. We are using `self` to define the methods. Why? Go to the next section and find out.

## Classes are Objects in Ruby

Yes, in Ruby, classes are themselves instances of `Object`.

``` ruby
class Thing
  # I am not very useful...
end

p Thing.superclass
p Thing.object_id
```

    Object
    15051340

`Thing` has an `object id`, so, it is an object\!

## self

`self` is an object that defines the context/scope of methods and variables. `self` points to an object. What is the value of self? In other words, what object does `self` point to? It depends. Let’s see an example:

``` ruby
class Thing
  def who_am_i?
    self
  end
end

thing = Thing.new
p thing == thing.who_am_i?

p thing.object_id
p thing.who_am_i?.object_id
```

    true
    10455120
    10455120

`thing` is an object (an instance of the class `Thing`). The method `who_am_i?` is an *instance method*. Inside this method we simply return `self` (and remember: self points to an object). By using the comparison operator `==` we see that both `thing` and `self` (which was returned from the method) are the same thing. Even testing for their object IDs prove that both are the same\!

Now let’s see this other example, where `self` is in the body of the class (and not inside a method):

``` ruby
class Thing
  p self
  p self.object_id
end

p Thing.object_id
```

    Thing
    20384320
    20384320

`Thing` is printed because of `p self` inside the body of the class. It tells us that `self` is actually `Thing`. Then both `self.object_id` and `Thing.object_id` return exactly the same value. As a side note, if classes are themselves objects, and `self` points to an object, we can do `self.object_id` without problems.

Our testes answer the question “What object does `self` point to?”, and the answer varies depending on the context/place in the code where `self` is used:

  - `self` inside an instance method points to the instance of the class.

  - `self` inside the body of the class points to the class itself (and the class is an object as well).

So, if a class has a `@@count` class variable, we must define *class methods* if we are to access the class variable. To create such methods, we use `self` **in the body of the class** followed by a dot and a method name:

``` ruby
class Thing
  # A class variable
  @@count = 0

  # Class method getter/reader for @@count CVAR.
  def self.count
    @@count
  end

  # Class method setter/writter for @@count CVAR.
  def self.count=(val)
    @@count = val
  end
end
```

If `self` in the body of the class `Thing` points to `Thing` itself (and our methods are defined with `def self.method_name`) it means that both the getter method `count` and the setter method `count=` can now be accessed directly from `Thing`.

We talked about instance variables and class variables. Let’s create a class called “Monster” that keeps the number of instantiated monsters and accessors for changing the *power* of the monster when they get hit or healed.

``` ruby
class Monster
  @@count = 0

  def initialize(name)
    @name = name
    @power = 100 # Power always start at 100%.
  end

  # Class method getter/writer for CVAR @@count.
  def self.count
    @@count
  end

  # Class method setter/writer for CVAR @@count.
  def self.count=(num)
    @@count = num
  end

  # Instance method getter/reader for IVAR @power
  def power
    @power
  end

  # Instance method setter/writer for IVAR @power
  def power=(val)
    @power = val
  end

end

# Create a new monster and increment the monster count.
alien = Monster.new('Alien')
Monster.count = Monster.count + 1

predator = Monster.new('Predator')
Monster.count = Monster.count + 1

# Should be 2, because we created two monsters so far.
p Monster.count

# Predator hits Alien with Plasma.
alien.power = 75
p alien.power

# Alien heals to 90%.
alien.power = 90
p alien.power

if predator.power < alien.power
  p 'Alien wins!'
elsif alien.power < predator.power
  p 'Predator wins!'
else
  p 'Alien and Predator tied...'
end
```

    2
    75
    90
    "Predator wins!"

> **Note**
>
> The code above is not professional and elegant, and there are much better ways to do that (like incrementing `@@count` automatically every time a new monster is created), but it serves as an example to show syntax and *explain concepts*.

Having talked about IVARs and CVARs, we now talk about CIVARs.

## Class Instance Variables

Let’s review:

  - IVARS are declared inside instance methods or inside the special `initialize` (constructor) method.

  - CVARS are declared inside the body of the class (but can also be declared inside methods as long as they are defined with the `@@var_name` syntax) and need class methods to be manipulated.

Ruby also has *class instance variables*, which belong to the *class instance*.

``` ruby
class Thing

  # A Class Instance Variable.
  @num = 10

  # A method getter/reader for the @num CIVAR.
  def self.num
    @num
  end

  # A method setter/writer for the @num CIVAR.
  def self.num=(arg)
    @num = arg
  end
end

# Uses the CIVAR reader.
p Thing.num

# Uses the CIVAR writer.
Thing.num = 23

# Uses the CIVAR reader again.
p Thing.num
```

    10
    23

Note that to create methods that can manipulate CIVARs, the syntax **is the same** as for methods for CVARs. Another quick example:

``` ruby
class Person

  # CVAR.
  @@count = 0

  #CIVAR.
  @people = []

  def initialize(name)
    # IVAR.
    @name = name
  end

  # An instance method getter/reader for @name IVAR.
  def name
    @name
  end

  # An instance method setter/writer for @name IVAR.
  def name=(name)
    @name = name
  end

  # A class method getter/reader for @@count CVAR.
  def self.count
    @@count
  end

  # A class method setter/writer for @@count CVAR.
  def self.count=(num)
    @@count = num
  end

  # A class instance method getter/reader for @people CIVAR array.
  def self.people
    @people
  end

  # A class instance method setter/writer for @people CIVAR array.
  def self.people=(person)
    # Appends a person object to the end of the array.
    @people << person
  end
end

# Creates an instance of Person

# Create person 1.
p1 = Person.new('Linus Torvalds')
# Increment the counter.
Person.count = Person.count + 1
# Store person 1 in the CIVAR on Person.
Person.people = p1

# Create person 2.
p2 = Person.new('John Carmack')
# Increment the counter.
Person.count = Person.count + 1
# Store person 2 in the CIVAR on Person.
Person.people = p2

p p1.name
p p2.name

p Person.count
p Person.people
```

    "Linus Torvalds"
    "John Carmack"
    2
    [#<Person:0x00000001dac838 @name="Linus Torvalds">, #<Person:0x00000001dac748 @name="John Carmack">]

TODO: We’ll see more (and hopefully useful) examples on how, when and why to use each of these types of variables later on.

## Classes are Objects (again)

Recall that a class is itself an object - an instance of the `Class` class. That is, `Thing` is an instance of `Class`. If `Class` is an object, we can do `Class.new`, right? Sure\! The syntax:

    class Thing
      # body...
    end

is the same thing as:

    Thing = Class.new do
      # body...
    end

We just pass a *block* to `Class.new` to define the body of the class.

Just as we can do `Thing.new` to create an instance of `Thing`, we can do `Class.new` to create an instance of `Class` and assign that instance to a variable name like `Thing`, just that Ruby provides the `class Thing` syntax sugar.

## Alternative Syntax for Defining Class Instance Methods

Before we delve into the next topic, let me ask you something, just between you and me :) Remember that we used `attr_reader`, `attr_writer`, and `attr_accessor` earlier? You can use them as well to declare class instance methods (but not class methods).

``` ruby
class Person
  @@count = 3 # CVAR
  @count = 5  # CIVAR

  # Create reader/writer for @count (CIVAR), not @@count (CVAR).
  class << self
    attr_reader :count
    attr_writer :count
    # or simply use attr_accessor :count.
  end

  # Let's create a getter/reader for @@count using a different name,
  # otherwise we would be overriding the class instance reader method for the
  # @count CIVAR.
  def self.c_count
    @@count
  end

  # Let's create a setter/writer for @@count using a different name,
  # otherwise we would be overriding the class instance method writer for the
  # @count CIVAR.
  def self.c_count=(val)
    @@count = val
  end
end

p Person.count    # 3 or 5? 5
Person.count = 6
p Person.count    # 6

p Person.c_count = 3  # 3 because we never touched it after declaring it.
```

    5
    6
    3

Since we use a symbol (`:count`) when defining the accessors, Ruby has to decide whether `:count` refers to the CVAR or the CIVAR, and it goes for the CIVAR. Therefore:

    class << self
      attr_accessor :foo  # Always @foo CIVAR, never @@foo CVAR.
    end

The syntax above CANNOT be used to create accessors to CVARS. For those, you need to use the `def self.cvar_method` syntax.

## Inheritance

IVARs, CVARs and CIVARs behave differently under inheritance. Let’s see concepts and examples.

First of all, the syntax for defining inheritance is this:

    class MySubClass < MySuperClass
    # body...
    end

### Inheritance and Instance Variables

“An example is worth a thousand words.” - Fernando Basso\!

``` ruby
class Enemy
  attr_accessor :name, :power

  def initialize(name)
    @name = name
    @power = 100
  end
end

class Human < Enemy
end

class Robot < Enemy
end

human1 = Human.new('Mr. President')
robot1 = Robot.new('Megatron')

p human1.name
p robot1.name
```

    "Mr. President"
    "Megatron"

`@name` and `@power` are both defined in the `Enemy` superclass. Since our `Human` and `Robot` classes inherit from the `Enemy` class, they inherit those IVARs. Now pay attention: we are talking about IVARs here. It means `@name` in one object is different than `@name` in the other object, that is, if we change `@name` in `human1`, `@name` is `robot1` is unchanged.

``` ruby
human1.name = 'Lex Luthor'
p human1.name
p robot1.name
```

    "Lex Luthor"
    "Megatron"

In short, each object has its own instance variable that is unrelated to instance variables from other objects created from a given class.

### Inheritance and Class Variables

Class variables are inherited/shared between a superclass and its subclasses.

``` ruby
class Enemy

  # A CVAR to keep track of how many instances of Enemy are created.
  # Creating an instance of a sublcass of Enemy also increments this @@count.
  @@count = 0

  def initialize
    # Every time an Enemy (or a subclass of Enemy) is instantiated,
    # we increment the @@count class variable to keep track of how
    # many enemies have been created.
    self.class.increment_count # Invoke the method.
  end

  def self.increment_count
    @@count += 1
  end

  # @@count doesn't need a setter/reader because we'll never update it from
  # outside the class. We increment it automatically each time an enemy
  # is created, and therefore need only a getter/reader.
  def self.instances_count
    @@count
  end
end

class Human < Enemy
  def initialize
    super
  end
end

class Robot < Enemy
  def initialize
    super
    # Just as a test, let's increment by 1000 to prove that CVARs
    # are shared between super and sub classes.
    @@count += 1000
  end
end

human1 = Human.new
human2 = Human.new
robot1 = Robot.new # This one will add 1000 more, remember?!

p Enemy.instances_count
```

    1003

Inside the `initialize` method of `Enemy`, we see this line:

    self.class.increment_count

`increment_count` is a class method that increments the CVAR `@@count`. But why do wee need to use `class` in that line? Because `self` is used inside the `initialize` method, which means `self` in that context points to the instance object, the instance of `Enemy` (or one of its subclasses). The object can’t access a class variable, but the class that gave birth to the object can indeed access the class variable. Then, from the object (`self`), we invoke the method `class`, which returns the class from which the object was constructed, and then, from the class, we invoke the class method `increment_count`.

    def initialize
      self.class.increment_count
    end

`self` points to an object, lets say, `human1`. What is `human1.class`? It is `Human`. Therefore:

    self.class.increment_count

is the same as

    Human.increment_count

which because of inheritance is the same as

    Enemy.increment_count

Inside each subclass, we created an `initialize` method that just invokes `super` causing the `initialize` method in the superclass to run, effectively incrementing `@@count` each time `Human` or `Robot` are instantiated.

This stuff is not easy to grasp due to the fact that there are several things involved at once. Just read it several times, run examples and tests, and even look for other tutorials that explain the same thing in different ways. Don’t be worried if it takes several study sessions to make sense out of this.

With the above examples, we showed how you could keep track of all enemies created. What about if we wanted to keep track of all enemies, but also keep a separate count for each specific type of enemies, like:

  - 5 total enemies, from which:

  - 3 are humans.

  - 2 are robots

Several approaches are possible, but let’s take this opportunity to talk about how class instance variables behave when inheritance comes into play.

### Inheritance and Class Instance Variables

Okay. Too keep track of **all** enemies, we used a `@@count` class variable in the superclass `Enemy`. Let’s use class instance variables to keep track of how many individual humans or robots are created as well.

``` ruby
class Enemy

  # Keeps track of all instances, incuding instances from the subclasses.
  @@count = 0

  # Keeps track only of instances created with Enemy.new.
  @count = 0

  def initialize
     # Increments @@count
     self.class.increment_total_count
     # Increments @count
     self.class.increment_individual_count
  end

  def self.increment_total_count
    @@count += 1
  end

  def self.total_instances_count
    @@count
  end

  def self.increment_individual_count
    @count += 1
  end

  def self.individual_instances_count
    @count
  end
end

class Human < Enemy
  # Keeps track of instances created with Human.new.
  @count = 0
  def initialize
    super
  end
end

class Robot < Enemy
 # Keeps track of instances created with Robot.new.
  @count = 0
  def initialize
    super
  end
end

human1 = Human.new
human2 = Human.new
robot1 = Robot.new # This one will add 1000 more, remember?!

# This time, let's also create an instance of Enemy itself.
enemy = Enemy.new

p Enemy.total_instances_count         # 3
p Human.individual_instances_count    # 2
p Robot.individual_instances_count    # 1
p Enemy.individual_instances_count    # 1
```

Here we see that each class, be it the superclass or a subclass must have their on individual `@count` variable, which is a class instance variable. Think about it. An instance variable belongs to an instance of a class (an object) A class variable belongs to the class (and its subclasses), and a class instance variable belongs to a class object (because classes are objects). That is, a CIVAR belongs to an object, just that in this case the object is a class. I know it is confusing. Read, re-read, practice, run tests, read other tutorials. It will eventually all make sense.

## Quick Review

A normal method:

    def foo
      # operates on @ivar.
    end

A method that can be either a class method to work on a CVAR or a class instance method to operate on a CIVAR (remember that we use `self)`:

    def self.foo
      # operates on a @@cvar, or
      # operates on a @civar
    def

Invoke a class method or a class instance method from inside another method (remember that we use `self.class.method_name`):

    def initialize
      self.class.some_class_method
      # or
      self.class.some_class_instance_method
    end

One could argue that there is no such things are *class methods* and *class instance methods*, but I used those terms mainly to denote the idea that the method will either work on a `@cvar` or on a `@civar`. The syntax for both is the same. More than that, the same method could work on *both* types of variables:

    def self.do_something
      @civar += 1
      @@cvar += 1
    end

## Visibility (again)

All methods used in the previous examples are public because by default methods are public.

This:

``` ruby
class Foo
  def hello
    'Hi there!'
  end
end
```

Is effectively the same as this:

``` ruby
class Foo
  public
  def foo
    'Hi there!'
  end
end
```

To make a method private, just change that `public` with `private`:

``` ruby
class Foo
  # A public method.
  def greet
    hello # invoke the hello private method.
  end

  private # From this point on, all methods are private.

  def hello
    'Hi there!'
  end
end

foo = Foo.new
p foo.greet
```

    "Hi there!"

But now that method can’t be called from outside the class, only from inside (as we did). That is, this won’t work:

    foo = Foo.new
    p foo.hello
    # error about trying to access private method.

It is possible to make class methods and class instance methods private as well (just that they are not as useful, because the main purpose of having these types of methods is exactly so that they can be invoked from the class name itself):

``` ruby
class Thing
  # Let's start these with different values so it is easier
  # to understand the different when we look at the results.
  @@cvar = 10
  @civar = 20

  def initialize
    # Invokes the private incr method.
    self.class.incr
  end

  # A public getter/reader for our @@cvar.
  def self.get_cvar
    @@cvar
  end

  # A public getter/reader for our @civar.
  def self.get_civar
    @civar
  end

  private
    # We can only increment from inside the class.
    def self.incr
      @@cvar += 1
      @civar += 1
    end
end

5.times { Thing.new }
p Thing.get_cvar
p Thing.get_civar
```

    15
    25
