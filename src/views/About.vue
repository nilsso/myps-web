<template>
    <div class="w-1/2 mx-auto pt-4 pb-1/3h text-justify">
        <h1>What is MYPS?</h1>

        <p> MYPS is a custom DSL (domain specific language) I've created that feels like Python but
        compiles into optimized Stationeers MIPS assembly code. </p>
        <p> I decided to create MYPS from a desire to write more complicated programs for
        Stationeers without the necessary tedium of manually optimizing the MIPS assembly code. That
        being said I really like MIPS, and I wouldn't have the in game language be anything else,
        but the challenge of manually optimizing register allocations and cramming down into 128
        lines started to become too much for me. I looked for other compiler/transpiler projects and
        found a few, but wasn't particularly satisfied. In particular, it seemed that no one had
        taken a swing at automatically optimizing register allocation; the one thing that I desired
        the most. So I decided to get down and learn some parser/lexer/compiler theory, and this
        project is the result. </p>
        <p> Specifically, there are three parts to this project: </p>
        <ol>
            <li>a MIPS parser, lexer and optimizer</li>
            <li>a parser and lexer for my custom language MYPS, and</li>
            <li>a translator which maps the MYPS abstract syntax tree into a MIPS one, such that the MIPS
                optimizer can then do its work.</li>
        </ol>
        <p> All are written as libraries in the Rust language, which I can then compile into a Wasm
        binary for use in this Javascript Vue web application. All in all, it's been a lot to learn,
        I'm very satisfied with the results, and yet there's plenty more to be improved. </p>

        <hr />

        <h1>What this app does</h1>

        <p> Within the editor tab, provide a source MYPS program and click compile (or hit
        shift-enter) to get back the translated MIPS source code for the MYPS input. Various
        translation optimizations are included at below the editor. These selctions as well as the
        input and output source code are saved in the URL hash for sharing or reopenning later. </p>

        <p> <strong>As of writing there is not proper error management within the library itself, so
        the editor is entirely lacking in reporting what is going wrong. At the very least you can
        <em>see</em> that something went wrong, but I'll eventually include propper error messages
        on top of proper text editing areas (both are no-frills text-areas for now).</strong> </p>

        <hr />

        <h1>Grammar Guide</h1>

        <p> MYPS preserves much of the grammar of Python, but not everything can be the same when
        the purpose is to be translated into assembly as accurately as possible. </p>

        <h2>Variables, lifetimes, and register allocation</h2>

        <p> Variables are just like in Python; defined with any assignment statement: </p>

        <Example>
            <template>
<pre>
a = 1
</pre>
            </template>
        </Example>

        <p> However register names like <code>r0</code> are forbidden. Why? Because
        registers are *automatically allocated* when the MYPS is compiled. </p>

        <Example>
            <template>
<pre>
move r0 = 1 # a = 1
</pre>
            </template>
        </Example>

        <p> And not only is allocation automated but *optimized*. </p>

        <Example>
            <template>
<pre>
a = 1
b = 2
c = a + b
</pre>
            </template>
            <template v-slot:rhs>
<pre>
move r0 = 1  # a = 1
move r1 = 2  # b = 2
add r0 r0 r1 # c = a + b
</pre>
            </template>
        </Example>

        <p> What's happening here? On line 1 the allocator assigns the register
        <code>r0</code> for <code>a</code>, and on line 2
        <code>r1</code> for <code>b</code>. Each variable has a
        <em>lifetime</em> which is as long as the last expression to use the variable. In this
        example, <code>a</code> and <code>b</code> need to live as long as
        line 3 where we have the expression <code>a + b</code>. The allocator is allowed
        to reuse the registers of any <em>dead</em> variables, and in this example it chooses
        <code>r0</code> for <code>c</code> since the lifetime of
        <code>a</code> ends on the same line as the new lifetime of
        <code>c</code>. What the allocator sees looks something like this graph: </p>

        <Example>
            <template>
<pre>
0  r0 : 0 - 2
1  r1 : | 1 2
2  r2 : | | 2
</pre>
            </template>
        </Example>

        <p> One caveat is that a lifetime ends as soon as the variable is re-assigned. This also has
        the effect of reusing the same register, as we'll see below. </p>

        <p> Also note that the order in which variables are defined/initialized matters. For
        example, the following code fails to compile because <code>a</code> doesn't exist
        until after its use. </p>

        <Example>
            <template>
<pre>
b = a / 2
a = 5
</pre>
            </template>
        </Example>

        <p> (The main reason that this happens is because <code>a</code> has yet to be
        assigned a register by the allocator. For a method of circumventing this problem see the
        <a href="#">fixed variables</a> section.) </p>

        <h2>Operator expressions</h2>

        <p> Most <a href="#">Python operators</a> are implemented. Specifically the binary operators
        <code>+</code>, <code>-</code>, <code>*</code>,
        <code>/</code>, <code>%</code>, <code>^</code>,
        <code>and</code>, <code>or</code>, <code>xor</code>,
        <code>== </code>, <code>>=</code>, <code>></code>,
        <code>&lt;=</code>,<code>&lt;</code> and <code>!=</code>;
        and the unary operators <code>-</code>, <code>!</code> are all
        preserved. Operator precedence is also the same as what you would expect. </p>
        <p> Note that the binary <code>a^b</code> (raise <code>a</code> to the
        power <code>b</code>) isn't actually available as a single instruction in MIPS,
        and instead the translator inserts change of base instructions to compensate. Similarly,
        unary operators <code>-a</code> and <code>!a</code> become
        <code>0 - a</code> and <code>nor a a a</code> respectively. </p>

        <Example>
            <template>
<pre>
a = 2
b = -(a^4)
</pre>
            </template>
            <template v-slot:rhs>
<pre>
move r0 2
log r0 r0
mul r0 4 r0
exp r0 r0
sub r0 0 r0
</pre>
            </template>
        </Example>

        <p> (Also note parentheses must enclose unary operations that are part of other expressions
        like <code>(-a)*b</code>, but like in the above example must enclose binary
        expressions that the unary operator precedes. The former is more a grammar bug, and likely
        something I'll eventually fix.) </p>
        <p> Additionally, MYPS supports the ternary operator by way of
        <code>select</code> in MIPS. </p>

        <Example>
            <template>
<pre>
a = 1
b = (a > 0) ? 2 : 3
</pre>
            </template>
            <template v-slot:rhs>
<pre>
move r0 1
sgt r0 r0 1
select r0 r0 2 3
</pre>
            </template>
        </Example>

        <p> (And as with unary operators, expression arguments need to be enclosed.) </p>

        <h2>Compound expressions</h2>

        <p> Since MIPS can only do a single mathematical instruction per line, writing more
        complicated expressions can be an absolute chore, especially when it comes to not
        overwriting values you need somewhere later. However in MYPS we can write compound
        expressions and let the allocator do the tedious parts for us. </p>

        <Example>
            <template>
<pre>
a = 1
b = 2
c = 3
b = (a + b) / c
</pre>
            </template>
            <template v-slot:rhs>
<pre>
move r0 1    # a = 1
move r1 2    # b = 2
move r2 3    # c = 3
add r0 r0 r1 # (a + b)
div r1 r0 r2 # b = (a + b) / c
</pre>
            </template>
        </Example>

        <p> By analyzing the lifetimes of each variable, the allocator can correctly expand the
        compound expression into single line instructions in a way that doesn't "clobber" any of the
        values that need to be alive further down. (Also note that <code>r1</code> is
        reused for <code>b</code> despite <code>r0</code> being available.)
        </p>

        <h2>Defines</h2>

        <p> Like in MIPS, we can define constant values using the <code>def</code>
        prefix, with the added bonus that defines in MYPS can be constant valued expressions, which
        the compiler will reduce to a value. Additionally, the define line itself will be removed
        and all occurrences of if replaced accordingly, so as to save some lines. </p>

        <Example>
            <template>
<pre>
def V = 1500 / 3
a = 600
if a > V:
    yield()
</pre>
            </template>
            <template v-slot:rhs>
<pre>
move r0 600
brle r0 500 2
yield
</pre>
            </template>
        </Example>

        <p> (Note that definitions currently only support expressions of literal numbers; eventually
        I'll fix this to allow definitions that are expressions of other definitions.) </p>

        <h2>Working with devices</h2>

        <p> Devices in MYPS can be used referenced by <code>d?</code>, just like in MIPS,
        but also aliased in an identical grammar to assigning to a variable. </p>

        <Example>
            <template>
<pre>
sensor = d0" rhs="alias sensor d0
</pre>
            </template>
        </Example>

        <p> Devices can even be referenced indirectly with the grammar <code>d(x)</code>,
        where <code>x</code> can be a literal, a define, a variable, or even an
        expression. </p>

        <Example>
            <template>
<pre>
for i in (0:3):
    d(i).On = d(i+3).Setting
</pre>
            </template>
            <template v-slot:rhs>
<pre>
move r0 0
brge r0 3 6
add r1 r0 3
l r1 dr1 Setting
s dr0 On r1
add r0 r0 1
jr -5
</pre>
            </template>
        </Example>

        <p> (See the <a href="#">blocks and control flow</a> section for the for-loop grammar.) </p>

        <p> Reading logic parameters has the grammar <code>d?.Parameter</code>, slot
        parameters have <code>d?[Slot].Parameter</code> and reagent parameters have
        <code>d?{Parameter}.Reagent</code> (chosen to match the order of parameters of
        <code>l</code>, <code>ls</code> and <code>lr</code>).
        Writing to a logic parameter works just like assigning to a variable. </p>

        <Example>
            <template>
<pre>
a = d0.Setting          # Setting logic parameter
b = d0[0].Quantity      # Quantity slot parameter from slot 0
c = d0{Required}.Copper # Required count of the Copper reagent
d0.On = a + b + c
</pre>
            </template>
            <template v-slot:rhs>
<pre>
l r0 d0 Setting
ls r1 d0 0 Quantity
lr r2 d0 1 Copper
add r0 r0 r1
add r0 r0 r2
s d0 On r0
</pre>
            </template>
        </Example>

        <p> Secondly, batch reading and writing has the grammar
        <code>Hash.all.Parameter</code> for batch writing, and
        <code>Hash.all.Parameter.Mode</code> for reading (where
        <code>Mode</code> is one of
        <code>Average</code>/<code>Avg</code>, <code>Sum</code>,
        <code>Min</code> or <code>Max</code>, or a corresponding number
        values). The hash can be provided as a literal, as a definition, or even as a variable. </p>

        <Example>
            <template>
<pre>
def ObjectA = 123
objectB = 456
ObjectA.all.Setting = objectB.all.Setting.Average + 789.all.Setting.Sum
</pre>
            </template>
            <template v-slot:rhs>
<pre>
move r0 456
lb r0 r0 Setting 0
lb r1 789 Setting 1
add r0 r0 r1
sb 123 Setting r0
</pre>
            </template>
        </Example>

        <p> And as this last example demonstrates, any of the reading grammars can be use directly
        within expressions. For a *full* example, here is a complete two-axis sun tracking solar
        panel program using these grammars: </p>

        <Example>
            <template>
<pre>
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
</pre>
            </template>
            <template v-slot:rhs>
<pre>
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
</pre>
            </template>
        </Example>

        <h2>Compound assignment</h2>

        <p> A grammar feature common to many languages, <a href="">Python included</a>, is compound
        assignment. Specifically the operators <code>+=</code>, <code>-=</code>, <code>*=</code>,
        <code>/=</code> and <code>%=</code> are preserved. </p>

        <Example>
            <template>
<pre>
a = 1
a *= a + 1
</pre>
            </template>
            <template v-slot:rhs>
<pre>
move r0 1    # a = 1
add r0 r0 1  # a + 1
mul r0 r0 r0 # a *= a + 1 &lt;-> a = a * (a + 1)
</pre>
            </template>
        </Example>

        <h2>Functions</h2>

        <p> Functions cannot be defined in MYPS like they can in Python; this is too daunting of a
        task when it comes to considering how any particular function definition should be
        translated into assembly. However the grammar of function calls is preserved for many MIPS
        function-like instructions; any of which can be used in expressions. </p>

        <table>
            <tr> <th>Function</th> <th>Description</th> </tr>
            <tr>
                <td><code>abs(a)</code></td>
                <td>Absolute value of <code>a</code></td></tr>
            <tr>
                <td><code>acos(a)</code></td>
                <td>Inverse cosine of <code>a</code></td>
            </tr>
            <tr>
                <td><code>asin(a)</code></td>
                <td>Inverse sine of <code>a</code> if 0 ≤ <code>a</code> ≤ 1, else 0</td>
            </tr>
            <tr>
                <td><code>atan(a)</code></td>
                <td>Inverse tangent of <code>a</code> if 0 ≤ <code>a</code> ≤ 1, else 0</td>
            </tr>
            <tr>
                <td><code>ceil(a)</code></td>
                <td>Nearest integer ≥ <code>a</code> if 0 ≤ <code>a</code> ≤ 1, else 0</td>
            </tr>
            <tr>
                <td><code>cos(a)</code></td>
                <td>Cosine of <code>a</code></td>
            </tr>
            <tr>
                <td><code>dec(a)</code></td>
                <td>Decimal part of <code>a</code> (implemented as <code>a-trunc(a)</code>)</td>
            </tr>
            <tr>
                <td><code>exp(a)</code></td>
                <td>Exponential function of <code>a</code></td>
            </tr>
            <tr>
                <td><code>floor(a)</code></td>
                <td>Nearest integer ≤ <code>a</code></td>
            </tr>
            <tr>
                <td><code>log(a,b)</code></td>
                <td>Logarithm of <code>a</code> to base <code>b</code> (implemented as <code>ln(a)/ln(b)</code>)</td>
            </tr>
            <tr>
                <td><code>ln(a)</code></td>
                <td>Logarithm of <code>a</code> to base *e*</td>
            </tr>
            <tr>
                <td><code>max(a,b)</code></td>
                <td>Maximum of <code>a</code> and <code>b</code></td>
            </tr>
            <tr>
                <td><code>min(a,b)</code></td>
                <td>Minimum of <code>a</code> and <code>b</code></td>
            </tr>
            <tr>
                <td><code>rand()</code></td>
                <td>Random value in range (0,1)</td>
            </tr>
            <tr>
                <td><code>round(a)</code></td>
                <td>Nearest integer to <code>a</code></td>
            </tr>
            <tr>
                <td><code>sin(a)</code></td>
                <td>Sine of <code>a</code></td>
            </tr>
            <tr>
                <td><code>sqrt(a)</code></td>
                <td>Square-root of <code>a</code></td>
            </tr>
            <tr>
                <td><code>tan(a)</code></td>
                <td>Tangent of <code>a</code></td>
            </tr>
            <tr>
                <td><code>trunc(a)</code></td>
                <td>Integer part of <code>a</code></td>
            </tr>
            <tr>
                <td><code>peek()</code></td>
                <td>Return stack value <code>sp-1</code></td>
            </tr>
            <tr>
                <td><code>pop()</code></td>
                <td>Return stack value <code>sp-1</code>, then decrement <code>sp</code></td>
            </tr>
            <tr>
                <td><code>dns(d)</code></td>
                <td>1 if device <code>d</code> not set, else 0</td>
            </tr>
            <tr>
                <td><code>dse(d)</code></td>
                <td>1 if device <code>d</code> set, else 0</td>
            </tr>
        </table>

        <h2>Raw MIPS</h2>

        <p> There are plenty of things that MIPS can do that aren't possible using only Python
        grammar, such as arbitrary line jumps. To account for this, *any* MIPS instruction can be
        expressed like a Python function, with the caveat that each argument must be valid MIPS; so
        no compound expressions or function calls, but variables are fine. </p>

        <Example>
            <template>
<pre>
a = 0
b = 1
j(10) # jump to line 10
bltal(a, b, 20) # branch to line 20, storing next line in ra, if a &lt; b
</pre>
            </template>
            <template v-slot:rhs>
<pre>
move r0 0
move r1 1
j 10
bltal r0 r1 20
</pre>
            </template>
        </Example>

        <h2>Blocks and control flow</h2>

        <p> Most of Python's blocks and control flow grammar is preserved in MYPS, in particular the
        use of indents to denote a block. For now and by default these indents <em>must</em> be four
        spaces but are lexed exactly as they are in Python (I'll change this eventually to support
        configurable indent sizes). </p>

        We have <em><code>if</code> <code>elif</code>
        <code>else</code> chains</em>

        <Example>
            <template>
<pre>
a = 0
v = d0.Setting
if v == 0:
    a = 1
elif v == 1:
    a = 2
else:
    a = 3
</pre>
            </template>
            <template v-slot:rhs>
<pre>
move r0 0
l r1 d0 Setting
brnez r1 3
move r0 1
j 9
brne r1 1 3
move r0 2
j 9
move r0 3
</pre>
            </template>
        </Example>

        <em><code>while</code> loops</em>

        <Example>
            <template>
<pre>
i = 10
while i > 10:
    i -= 1
</pre>
            </template>
            <template v-slot:rhs>
<pre>
move r0 10
brle r0 10 3
sub r0 r0 1
jr -2
</pre>
            </template>
        </Example>

        <p> And <em>numerical <code>for</code> loops</em> (granted with some slightly
        modified grammar) </p>

        <Example>
            <template>
<pre>
a = 1
for i in (0:10:1): # or simply (0:10)
    a *= 2
</pre>
            </template>
            <template v-slot:rhs>
<pre>
move r0 1    # a = 1
move r1 0    # i = 0
brge r1 10 4 # while i &lt; 10
mul r0 r0 2
add r1 r1 1  # i += 1
jr -3
</pre>
            </template>
        </Example>

        <p> Note that for the range <code>(s:e[:step])</code>, any part can itself be an
        expression. </p>

        <Example>
            <template>
<pre>
a = 1
for i in (a:a*5:a):
    a *= 2
</pre>
            </template>
            <template v-slot:rhs>
<pre>
move r0 1
mul r2 r0 5
brge r1 r2 4
mul r0 r0 2
add r1 r1 r0
jr -3
</pre>
            </template>
        </Example>

        <p> There are also two additional control flow features: the <em>infinite
        <code>loop</code></em> </p>

        <Example>
            <template>
<pre>
loop:
    yield()
</pre>
            </template>
            <template v-slot:rhs>
<pre>
yield
jr -1
</pre>
            </template>
        </Example>

        <p> And <em><code>tag</code></em>, the MYPS equivalent to line tags in MIPS </p>

        <Example>
            <template>
<pre>
a = 0
tag A:
    a *= 2
j(A)
</pre>
            </template>
            <template v-slot:rhs>
<pre>
move r0 0
mul r0 r0 2
j 1
</pre>
            </template>
        </Example>

        <h2>Fixed variables</h2>

        <p> The register allocator is not perfect. Since MYPS can also translate arbitrary line
        jumps like in MIPS, we have no way to linearly analyze the lifetimes of variables that are
        needed on a line prior to their definition (at least not without some much deeper
        algorithms). Consider this extremely contrived example: </p>

        <Example>
            <template>
<pre>
j(AssignACalcB)
tag CalcC:
    c = a * 2
tag AssignACalcB:
    a = 1
    b = 2
j(CalcC)
</pre>
            </template>
        </Example>

        <p> But this doesn't compile, because linear analysis doesn't show that, because of the
        jumps, <code>a</code> will actually be alive by the time of the <code><pre>c = a
        * 2</pre></code> statement. We might first try to fix this by initializing
        <code>a</code>. </p>

        <Example>
            <template>
<pre>
a = 0
j(AssignACalcB)
tag CalcC:
    c = a * 2
tag AssignACalcB:
    a = 1
    b = 2
j(CalcC)
</pre>
            </template>
            <template v-slot:rhs>
<pre>
move r0 0
j 3
mul r0 r0 2
move r0 1
move r0 2
j 2
</pre>
            </template>
        </Example>

        <p> Which compiles, but notice that the register <code>r0</code> which was
        allocated for <code>a</code> has been re-used for the allocation of
        <code>b</code>, clobbering whatever value was in <code>a</code> that
        needed to be used for the <code>c</code> statement. To <em>fix</em> this, we can
        either prefix the <code>a</code> assignment with the word
        <code>fix</code>, or simply replacing the assignment with a <em>fix
        declaration</em>. </p>

        <Example>
            <template>
<pre>
fix a = 0
j(AssignACalcB)
tag CalcC:
    c = a * 2
tag AssignACalcB:
    a = 1
    b = 2
j(CalcC)
</pre>
            </template>
            <template v-slot:rhs>
<pre>
move r0 0
j 3
mul r1 r0 2
move r0 1
move r1 2
j 2
</pre>
            </template>
        </Example>

        <p> This tells the allocator that the lifetime of <code>a</code> should be global
        (or more precisely as long as the block it is in; see the next section for specifics on
        this) and now have that the register <code>r0</code> allocated for
        <code>a</code> is fixed and wont be re-used later. </p>

        <p> The most common use for fixed variables seems to be for variables whose "old" values
        need to persist throughout a loop, such as an error term in a PID controller. </p>

        <h2>Lifetime scoping</h2>

        <p> Finally, blocks are used by MYPS to help the allocator determine better fixed lifetimes
        for the program as a whole. If a variable is fixed within a block, then its lifetime isn't
        global, but as long as the containing block. This way its possible to fix a variable within
        a block, but then have the allocator re-use the variable's allocated register anywhere
        outside of and below the block. </p>

        <hr />
    </div>
</template>

<script>
import Example from '@components/AboutExample.vue'

export default {
    name: 'About',
    components: { Example },
}
</script>
