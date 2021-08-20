
module.exports = {
    plugins: [
        // require('postcss-import'),
        require('postcss-mixins'),
        // require('postcss-mixins')(() => {
        //     const postcss = import('postcss');
        //     return {
        //         mixins: {
        //             'btn-sized': function(mixin, size) {
        //                 let rule = postcss.rule({ selector: '.btn-' + size })
        //                 rule.append('@extend .btn')
        //                 rule.append(`@apply text-${size}`)
        //                 mixin.replaceWith(rule)
        //             }
        //         }
        //     }
        // }),
        // require('postcss-nested'),
        // require('postcss-at-rules-variables'),
        require('postcss-extend'),
        require('postcss-simple-vars'),
        // require('postcss-variables'),
        require('tailwindcss/nesting'),
        require('tailwindcss'),
        require('autoprefixer')
    ]
}
