import { createApp } from 'vue'
import App from '@/App.vue'
import createAppRouter from '@/router'

import VueHighlightJS from 'vue3-highlightjs'

import css from 'highlight.js/lib/languages/css'
import javascript from 'highlight.js/lib/languages/javascript'

// import 'highlight.js/styles/default.css'
// import 'highlight.js/styles/atom-one-dark.css'
// import 'highlight.js/styles/atom-one-light.css'
import 'highlight.js/styles/nord.css'

    // .map(([path, def]) => {
    // const key = path.match(/\w+\.vue/).pop()
    // const value = def.default
    // return [key, value]
// })

// console.debug(components)

const glob = import.meta.globEager('./components/Base*.vue')
// const components = Object.fromEntries(
//     Object.entries(glob).map(([k, v]) => [k.match(/(\w+)\.vue/).pop(), v])
// )
// console.log(components)

// glob.forEach(([k, v]) => {
    // console.log(k, v)
// })

import { scrollWaiter } from '@/scrollWaiter.js'

scrollWaiter.add()

const router = createAppRouter(scrollWaiter)

const app = createApp(App, { scrollWaiter })
    .use(VueHighlightJS)
    .use(router)

Object.entries(glob).forEach(([path, definition]) => {
    const name = path.match(/(\w+)\.vue/).pop()
    app.component(name, definition.default)
})

router.isReady().then(() => (window.vm = app.mount('#app')))
