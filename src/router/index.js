import { defineAsyncComponent } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import Editor from '@views/Editor.vue'
import About from '@views/About.vue'
// const Editor = () => import('@views/Editor.vue')
// const About = () => import('@views/About.vue')

const routes = [
    {
        path: '/',
        name: 'Editor',
        component: Editor,
        meta: { transitionName: 'fade' }
    },
    {
        path: '/about',
        name: 'About',
        component: About,
        meta: { transitionName: 'fade' }
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: { name: 'Editor' }
    }
]

const createAppRouter = (scrollWaiter) => {
    return createRouter({
        history: createWebHistory(),
        routes,
        async scrollBehavior(to, from, savedPosition) {
            await scrollWaiter.promise

            // const behavior = smoothScroll.value ? 'smooth' : 'auto'
            const behavior = 'auto'

            if (savedPosition) {
                return { ...savedPosition, behavior }
            } else {
                let position = undefined
                if (to.hash) {
                    position = { el: to.hash, behavior }
                }
                return position
            }
        }
    })
}

export default createAppRouter

