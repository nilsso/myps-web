<template>
    <div class="flex flex-col min-h-screen">
        <div class="nav sticky top-0 z-10 p-2 bg-white border-b border-gray-400">
            <router-link :to="{ name: 'Editor' }">
                <button class="btn-blue text-xl mx-1">
                    Editor
                </button>
            </router-link>
            <router-link :to="{ name: 'About' }">
                <button class="btn-blue-inv text-xl mx-1">
                    About
                </button>
            </router-link>
            <button class="btn-inv text-xl mx-1">
                Github
            </button>
        </div>
        <router-view v-slot="{ Component, route }">
            <transition
                mode="out-in"
                :name="route.meta.transitionName"
                @before-enter="setupWaiter"
                @before-leave="flushWaiter"
            >
                <keep-alive>
                    <component :is="Component" class="flex-1" />
                </keep-alive>
            </transition>
        </router-view>
    </div>
</template>

<script>
import '@css/base.css'

export default {
    name: 'App',
    components: [ 'BaseButton' ],
    props: {
        scrollWaiter: {
            type: Object,
            required: true
        },
    },
    mounted() {
        this.scrollWaiter.flush()
    },
    methods: {
        setupWaiter() {
            this.scrollWaiter.add()
        },
        flushWaiter() {
            this.scrollWaiter.flush()
        }
    }
}
</script>
