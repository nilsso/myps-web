module.exports = {
    plugins: [
        require('postcss-mixins'),
        require('postcss-extend'),
        require('postcss-simple-vars'),
        require('tailwindcss/nesting'),
        require('tailwindcss'),
        require('autoprefixer')
    ]
}
