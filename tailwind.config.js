const colors = require('tailwindcss/colors')

module.exports = {
    purge: [
        './index.html',
        './src/**/*.{vue,js,ts,jsx,tsx}'
    ],
    darkMode: 'media',
    theme: {
        colors: {
            gray: colors.coolGray,
            red: colors.red,
            green: colors.emerald,
            blue: colors.blue,
            yellow: colors.amber,
            white: colors.white,
            transparent: colors.transparent
        },
        extend: {
            spacing: {
                     'w':    '100vw',
                  '1/2w':     '50vw',
                  '1/3w': '33.333vw',
                  '2/3w': '66.667vw',
                  '1/4w':     '25vw',
                  '2/4w':     '50vw',
                  '3/4w':     '75vw',
                  '1/5w':     '20vw',
                  '2/5w':     '40vw',
                  '3/5w':     '60vw',
                  '4/5w':     '80vw',
                  '1/6w': '16.667vw',
                  '2/6w': '33.333vw',
                  '3/6w':     '50vw',
                  '4/6w': '66.667vw',
                  '5/6w': '83.333vw',
                 '1/12w': '8.3333vw',
                 '2/12w': '16.667vw',
                 '2/12w': '16.667vw',
                 '3/12w':     '25vw',
                 '4/12w': '33.333vw',
                 '5/12w': '41.667vw',
                 '6/12w':     '50vw',
                 '7/12w': '58.333vw',
                 '8/12w': '66.667vw',
                 '9/12w':     '75vw',
                '10/12w': '83.333vw',
                '11/12w': '91.667vw',

                     'h':    '100vh',
                  '1/2h':     '50vh',
                  '1/3h': '33.333vh',
                  '2/3h': '66.667vh',
                  '1/4h':     '25vh',
                  '2/4h':     '50vh',
                  '3/4h':     '75vh',
                  '1/5h':     '20vh',
                  '2/5h':     '40vh',
                  '3/5h':     '60vh',
                  '4/5h':     '80vh',
                  '1/6h': '16.667vh',
                  '2/6h': '33.333vh',
                  '3/6h':     '50vh',
                  '4/6h': '66.667vh',
                  '5/6h': '83.333vh',
                 '1/12h': '8.3333vh',
                 '2/12h': '16.667vh',
                 '2/12h': '16.667vh',
                 '3/12h':     '25vh',
                 '4/12h': '33.333vh',
                 '5/12h': '41.667vh',
                 '6/12h':     '50vh',
                 '7/12h': '58.333vh',
                 '8/12h': '66.667vh',
                 '9/12h':     '75vh',
                '10/12h': '83.333vh',
                '11/12h': '91.667vh',
            }
        }
        // fontFamily: {
        //     sans: ['Graphik', 'sans-serif'],
        //     serif: ['Merriweather', 'serif']
        // }
    }
}