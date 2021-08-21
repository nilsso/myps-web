import { createApp } from 'vue'
import App from '@/App.vue'
import createAppRouter from '@/router'

// import VueHighlightJS from 'vue3-highlightjs'
// console.log(VueHighlightJS)

// import hljs from 'highlight.js'
// const VueHighlightJS = app => {
//     app.directive('highlightjs', (el, binding) => {
//         const codeNodes = el.querySelectorAll('code')
//         if (typeof binding.value === 'string') {
//             codeNodes.forEach(codeNode => {
//                 codeNode.textContent = binding.value
//                 hljs.highlightElement(codeNode)
//             })
//         } else {
//             codeNodes.forEach(codeNode => {
//                 hljs.highlightElement(codeNode)
//             })
//         }
//     })
// }

import { default as VueHljs } from '@highlightjs/vue-plugin'

import css from 'highlight.js/lib/languages/css'
import javascript from 'highlight.js/lib/languages/javascript'

// import 'highlight.js/styles/default.css'
// import 'highlight.js/styles/atom-one-dark.css'
// import 'highlight.js/styles/atom-one-light.css'
import 'highlight.js/styles/nord.css'

import { scrollWaiter } from '@/scrollWaiter.js'
const router = createAppRouter(scrollWaiter)

const app = createApp(App, { scrollWaiter })
    .use(VueHljs)
    .use(router)

// const glob = import.meta.globEager('./components/Base*.vue')
// for (const 
// Object.entries(glob).forEach(([path, definition]) => {
//     console.log(path)
//     const name = path.match(/(\w+)\.vue/).pop()
//     app.component(name, definition.default)
// })

scrollWaiter.add()
router.isReady().then(() => (window.vm = app.mount('#app')))
