---
title: About MYPS
description: Introduction to MYPS DSL and its grammar
---

What is MYPS?
=============

MYPS is a custom DSL (domain specific language) I've created that feels like Python but compiles
into optimized Stationeers MIPS assembly code.

I decided to create MYPS from a desire to write more complicated programs for Stationeers without
the necessary tedium of manually optimizing the MIPS assembly code. That being said I really like
MIPS, and I wouldn't have the in game language be anything else, but the challenge of manually
optimizing register allocations and cramming down into 128 lines started to become too much for me.
I looked for other compiler/transpiler projects and found a few, but wasn't particularly satisfied.
In particular, it seemed that no one had taken a swing at automatically optimizing register
allocation; the one thing that I desired the most. So I decided to get down and learn some
parser/lexer/compiler theory, and this project is the result.

Specifically, there are three parts to this project:
1. a MIPS parser, lexer and optimizer
2. a parser and lexer for my custom language MYPS, and
3. a translator which maps the MYPS abstract syntax tree into a MIPS one, such that the MIPS
optimizer can then do its work.

All are written as libraries in the Rust language, which I can then compile into a Wasm binary
for use in this Javascript Vue web application. All in all, it's been a lot to learn, I'm
very satisfied with the results, and yet there's plenty more to be improved.

---

What this app does
==================

Within the editor tab, provide a source MYPS program and click compile (or hit shift-enter) to get
back the translated MIPS source code for the MYPS input.
Various translation optimizations are included at below the editor. These selctions as well as the
input and output source code are saved in the URL hash for sharing or reopenning later.

**As of writing there is not proper error management within the library itself, so the editor is
entirely lacking in reporting what is going wrong. At the very least you can *see* that something
went wrong, but I'll eventually include propper error messages on top of proper text editing areas
(both are no-frills text-areas for now).**

---

Grammar Guide
=============

MYPS preserves much of the grammar of Python, but not everything can be the same when the purpose
is to be translated into assembly as accurately as possible.

## Variables, lifetimes, and register allocation

Variables are just like in Python; defined with any assignment statement:

<Example>
<template><pre>
a = 1
</pre></template>
</Example>

However register names like `r0` are forbidden. Why? Because registers are *automatically allocated*
when the MYPS is compiled.

<Example>
<template><pre>
move r0 = 1 # a = 1
</pre></template>
</Example>

And not only is allocation automated but *optimized*.

<Example>
<template><pre>
a = 1
b = 2
c = a + b
</pre></template>
<template v-slot:rhs><pre>
move r0 = 1  # a = 1
move r1 = 2  # b = 2
add r0 r0 r1 # c = a + b
</pre></template>
</Example>

What's happening here?
On line 1 the allocator assigns the register `r0` for `a`, and on line 2 `r1` for `b`.
Each variable has a *lifetime* which is as long as the last expression to use the variable.
In this example, `a` and `b` need to live as long as line 3 where we have the expression `a + b`.
The allocator is allowed to reuse the registers of any *dead* variables, and in this example it
chooses `r0` for `c` since the lifetime of `a` ends on the same line as the new lifetime of `c`.
What the allocator sees looks something like this graph:

<Example>
<template><pre>
0  r0 : 0 - 2
1  r1 : | 1 2
2  r2 : | | 2
</pre></template>
</Example>

One caveat is that a lifetime ends as soon as the variable is re-assigned.
This also has the effect of reusing the same register, as we'll see below.

Also note that the order in which variables are defined/initialized matters.
For example, the following code fails to compile because `a` doesn't exist until after its use.

<Example>
<template><pre>
b = a / 2
a = 5
</pre></template>
</Example>

(The main reason that this happens is because `a` has yet to be assigned a register by the
allocator. For a method of circumventing this problem see the [fixed variables](#fixed-variables)
section.)

## Operator expressions

Most [Python operators][python-ops] are implemented.
Specifically the binary operators
`+`, `-`, `*`, `/`, `%`, `^`, `and`, `or`, `xor`, `== `, `>= `, `>`, `<= `, `<` and `!= `;
and the unary operators
`-`, `!`
are all preserved. Operator precedence is also the same as what you would expect.

Note that the binary `a^b` (raise `a` to the power `b`) isn't actually available as a single
instruction in MIPS, and instead the translator inserts change of base instructions to compensate.
Similarly, unary operators `-a` and `!a` become `0 - a` and `nor a a a` respectively.

<Example>
<template><pre>
a = 2
b = -(a^4)
</pre></template>
<template v-slot:rhs><pre>
move r0 2
log r0 r0
mul r0 4 r0
exp r0 r0
sub r0 0 r0
</pre></template>
</Example>

(Also note parentheses must enclose unary operations that are part of other expressions like
`(-a)*b`, but like in the above example must enclose binary expressions that the unary operator
precedes. The former is more a grammar bug, and likely something I'll eventually fix.)

Additionally, MYPS supports the ternary operator by way of `select` in MIPS.

<Example>
<template><pre>
a = 1
b = (a > 0) ? 2 : 3
</pre></template>
<template v-slot:rhs><pre>
move r0 1
sgt r0 r0 1
select r0 r0 2 3
</pre></template>
</Example>

(And as with unary operators, expression arguments need to be enclosed.)

[python-ops]: #

## Compound expressions

Since MIPS can only do a single mathematical instruction per line, writing more complicated
expressions can be an absolute chore, especially when it comes to not overwriting values you need
somewhere later. However in MYPS we can write compound expressions and let the allocator do the
tedious parts for us.

<Example>
<template><pre>
a = 1
b = 2
c = 3
b = (a + b) / c
</pre></template>
<template v-slot:rhs><pre>
move r0 1    # a = 1
move r1 2    # b = 2
move r2 3    # c = 3
add r0 r0 r1 # (a + b)
div r1 r0 r2 # b = (a + b) / c
</pre></template>
</Example>

By analyzing the lifetimes of each variable, the allocator can correctly expand the compound
expression into single line instructions in a way that doesn't "clobber" any of the values that need
to be alive further down. (Also note that `r1` is reused for `b` despite `r0` being available.)

## Defines

Like in MIPS, we can define constant values using the `def` prefix, with the added bonus that
defines in MYPS can be constant valued expressions, which the compiler will reduce to a value.
Additionally, the define line itself will be removed and all occurrences of if replaced accordingly,
so as to save some lines.

<Example>
<template><pre>
def V = 1500 / 3
a = 600
if a > V:
    yield()
</pre></template>
<template v-slot:rhs><pre>
move r0 600
brle r0 500 2
yield
</pre></template>
</Example>

(Note that definitions currently only support expressions of literal numbers;
eventually I'll fix this to allow definitions that are expressions of other definitions.)

## Working with devices

Devices in MYPS can be used referenced by `d?`, just like in MIPS, but also aliased in an identical
grammar to assigning to a variable.

<Example>
<template><pre>
sensor = d0" rhs="alias sensor d0
</pre></template>
</Example>

Devices can even be referenced indirectly with the grammar `d(x)`, where `x` can be a literal,
a define, a variable, or even an expression.

<Example>
<template><pre>
for i in (0:3):
    d(i).On = d(i+3).Setting
</pre></template>
<template v-slot:rhs><pre>
move r0 0
brge r0 3 6
add r1 r0 3
l r1 dr1 Setting
s dr0 On r1
add r0 r0 1
jr -5
</pre></template>
</Example>

(See the [blocks and control flow](#blocks-and-control-flow) section for the for-loop grammar.)

Reading logic parameters has the grammar `d?.Parameter`, slot parameters have `d?[Slot].Parameter`
and reagent parameters have `d?{Parameter}.Reagent` (chosen to match the order of parameters of `l`,
`ls` and `lr`). Writing to a logic parameter works just like assigning to a variable.

<Example>
<template><pre>
a = d0.Setting          # Setting logic parameter
b = d0[0].Quantity      # Quantity slot parameter from slot 0
c = d0{Required}.Copper # Required count of the Copper reagent
d0.On = a + b + c
</pre></template>
<template v-slot:rhs><pre>
l r0 d0 Setting
ls r1 d0 0 Quantity
lr r2 d0 1 Copper
add r0 r0 r1
add r0 r0 r2
s d0 On r0
</pre></template>
</Example>

Secondly, batch reading and writing has the grammar `Hash.all.Parameter` for batch writing, and
`Hash.all.Parameter.Mode` for reading (where `Mode` is one of `Average`/`Avg`, `Sum`, `Min` or
`Max`, or a corresponding number values). The hash can be provided as a literal, as a definition, or
even as a variable.

<Example>
<template><pre>
def ObjectA = 123
objectB = 456
ObjectA.all.Setting = objectB.all.Setting.Average + 789.all.Setting.Sum
</pre></template>
<template v-slot:rhs><pre>
move r0 456
lb r0 r0 Setting 0
lb r1 789 Setting 1
add r0 r0 r1
sb 123 Setting r0
</pre></template>
</Example>

And as this last example demonstrates, any of the reading grammars can be use directly within
expressions. For a *full* example, here is a complete two-axis sun tracking solar panel program
using these grammars:

<Example>
<template><pre>
sensor = d0
# provides a multiple of 90 offset to the horizontal
# just to make setting up easier
offsetDial = d1
def Normal     = -2045627372
def NormalDual = -539224550
def Heavy      = -934345724
def HeavyDual  = -1545574413
loop: # loop
    yield()
    h = sensor.Horizontal + (offsetDial.Setting * 90)
    Normal    .all.Horizontal = h
    NormalDual.all.Horizontal = h
    Heavy     .all.Horizontal = h
    HeavyDual .all.Horizontal = h
    v = (75 - sensor.Vertical) / 1.5
    Normal    .all.Vertical   = v
    NormalDual.all.Vertical   = v
    Heavy     .all.Vertical   = v
    HeavyDual .all.Vertical   = v
</pre></template>
<template v-slot:rhs><pre>
alias sensor d0
alias offsetDial d1
yield
l r0 d0 Horizontal
l r1 d1 Setting
mul r1 r1 90
add r0 r0 r1
sb -2045627372 Horizontal r0
sb -539224550 Horizontal r0
sb -934345724 Horizontal r0
sb -1545574413 Horizontal r0
l r0 d0 Vertical
sub r0 75 r0
div r0 r0 1.5
sb -2045627372 Vertical r0
sb -539224550 Vertical r0
sb -934345724 Vertical r0
sb -1545574413 Vertical r0
jr -16
</pre></template>
</Example>

## Compound assignment

A grammar feature common to many languages, [Python included][python-aug-asn], is compound
assignment. Specifically the operators `+= `, `-= `, `*= `, `/= ` and `%= ` are preserved.

<Example>
<template><pre>
a = 1
a *= a + 1
</pre></template>
<template v-slot:rhs><pre>
move r0 1    # a = 1
add r0 r0 1  # a + 1
mul r0 r0 r0 # a *= a + 1 <-> a = a * (a + 1)
</pre></template>
</Example>

[python-aug-asn]: #

## Functions

Functions cannot be defined in MYPS like they can in Python; this is too daunting of a task when
it comes to considering how any particular function definition should be translated into assembly.
However the grammar of function calls is preserved for many MIPS function-like instructions;
any of which can be used in expressions.

Function  | Description
:-------- | :--------------------------
`abs(a)`  | Absolute value of `a`
`acos(a)` | Inverse cosine of `a`
`asin(a)` | Inverse sine of `a` if 0 ≤ `a` ≤ 1, else 0
`atan(a)` | Inverse tangent of `a` if 0 ≤ `a` ≤ 1, else 0
`ceil(a)` | Nearest integer ≥ `a` if 0 ≤ `a` ≤ 1, else 0
`cos(a)`  | Cosine of `a`
`dec(a)`  | Decimal part of `a` (implemented as `a-trunc(a)`)
`exp(a)`  | Exponential function of `a`
`floor(a)` | Nearest integer ≤ `a`
`log(a,b)` | Logarithm of `a` to base `b` (implemented as `ln(a)/ln(b)`)
`ln(a)`   | Logarithm of `a` to base *e*
`max(a,b)` | Maximum of `a` and `b`
`min(a,b)` | Minimum of `a` and `b`
`rand()` | Random value in range (0,1)
`round(a)` | Nearest integer to `a`
`sin(a)`   | Sine of `a`
`sqrt(a)` | Square-root of `a`
`tan(a)` | Tangent of `a`
`trunc(a)` | Integer part of `a`
`peek()` | Return stack value `sp-1`
`pop()` | Return stack value `sp-1`, then decrement `sp`
`dns(d)` | 1 if device `d` not set, else 0
`dse(d)` | 1 if device `d` set, else 0

## Raw MIPS

There are plenty of things that MIPS can do that aren't possible using only Python grammar, such
as arbitrary line jumps. To account for this, *any* MIPS instruction can be expressed like a
Python function, with the caveat that each argument must be valid MIPS; so no compound expressions
or function calls, but variables are fine.

<Example>
<template><pre>
a = 0
b = 1
j(10) # jump to line 10
bltal(a, b, 20) # branch to line 20, storing next line in ra, if a < b
</pre></template>
<template v-slot:rhs><pre>
move r0 0
move r1 1
j 10
bltal r0 r1 20
</pre></template>
</Example>

## Blocks and control flow

Most of Python's blocks and control flow grammar is preserved in MYPS, in particular the use of
indents to denote a block. For now and by default these indents *must* be four spaces but are lexed
exactly as they are in Python (I'll change this eventually to support configurable indent sizes).

We have **`if` `elif` `else` chains**

<Example>
<template><pre>
a = 0
v = d0.Setting
if v == 0:
    a = 1
elif v == 1:
    a = 2
else:
    a = 3
</pre></template>
<template v-slot:rhs><pre>
move r0 0
l r1 d0 Setting
brnez r1 3
move r0 1
j 9
brne r1 1 3
move r0 2
j 9
move r0 3
</pre></template>
</Example>

**`while` loops**

<Example>
<template><pre>
i = 10
while i > 10:
    i -= 1
</pre></template>
<template v-slot:rhs><pre>
move r0 10
brle r0 10 3
sub r0 r0 1
jr -2
</pre></template>
</Example>

And **numerical `for` loops** (granted with some slightly modified grammar)

<Example>
<template><pre>
a = 1
for i in (0:10:1): # or simply (0:10)
    a *= 2
</pre></template>
<template v-slot:rhs><pre>
move r0 1    # a = 1
move r1 0    # i = 0
brge r1 10 4 # while i < 10
mul r0 r0 2
add r1 r1 1  # i += 1
jr -3
</pre></template>
</Example>

Note that for the range `(s:e[:step])`, any part can itself be an expression.

<Example>
<template><pre>
a = 1
for i in (a:a*5:a):
    a *= 2
</pre></template>
<template v-slot:rhs><pre>
move r0 1
mul r2 r0 5
brge r1 r2 4
mul r0 r0 2
add r1 r1 r0
jr -3
</pre></template>
</Example>

There are also two additional control flow features: the **infinite `loop`**

<Example>
<template><pre>
loop:
    yield()
</pre></template>
<template v-slot:rhs><pre>
yield
jr -1
</pre></template>
</Example>

And **`tag`**, the MYPS equivalent to line tags in MIPS

<Example>
<template><pre>
a = 0
tag A:
    a *= 2
j(A)
</pre></template>
<template v-slot:rhs><pre>
move r0 0
mul r0 r0 2
j 1
</pre></template>
</Example>

## Fixed variables

The register allocator is not perfect. Since MYPS can also translate arbitrary line jumps like in
MIPS, we have no way to linearly analyze the lifetimes of variables that are needed on a line prior
to their definition (at least not without some much deeper algorithms).
Consider this extremely contrived example:

<Example>
<template><pre>
j(AssignACalcB)
tag CalcC:
    c = a * 2
tag AssignACalcB:
    a = 1
    b = 2
j(CalcC)
</pre></template>
</Example>

But this doesn't compile, because linear analysis doesn't show that, because of the jumps, `a` will
actually be alive by the time of the `c = a * 2` statement. We might first try to fix this
by initializing `a`.

<Example>
<template><pre>
a = 0
j(AssignACalcB)
tag CalcC:
    c = a * 2
tag AssignACalcB:
    a = 1
    b = 2
j(CalcC)
</pre></template>
<template v-slot:rhs><pre>
move r0 0
j 3
mul r0 r0 2
move r0 1
move r0 2
j 2
</pre></template>
</Example>

Which compiles, but notice that the register `r0` which was allocated for `a` has been re-used for
the allocation of `b`, clobbering whatever value was in `a` that needed to be used for the `c`
statement. To *fix* this, we can either prefix the `a` assignment with the word `fix`, or simply
replacing the assignment with a *fix declaration*.

<Example>
<template><pre>
fix a = 0
j(AssignACalcB)
tag CalcC:
    c = a * 2
tag AssignACalcB:
    a = 1
    b = 2
j(CalcC)
</pre></template>
<template v-slot:rhs><pre>
move r0 0
j 3
mul r1 r0 2
move r0 1
move r1 2
j 2
</pre></template>
</Example>

This tells the allocator that the lifetime of `a` should be global (or more precisely as long as the
block it is in; see the next section for specifics on this) and now have that the register `r0`
allocated for `a` is fixed and wont be re-used later.

The most common use for fixed variables seems to be for variables whose "old" values need to persist
throughout a loop, such as an error term in a PID controller.

## Lifetime scoping

Finally, blocks are used by MYPS to help the allocator determine better fixed lifetimes for the
program as a whole. If a variable is fixed within a block, then its lifetime isn't global, but as
long as the containing block. This way its possible to fix a variable within a block, but then
have the allocator re-use the variable's allocated register anywhere outside of and below the block.

---
