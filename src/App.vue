<template>
    <div class="flex flex-col min-h-screen">
        <div class="nav sticky top-0 z-10 p-2 bg-white border-b border-gray-400">
            <AppLink :to="{ name: 'Editor' }" class="mr-1">
                Editor
            </AppLink>
            <AppLink :to="{ name: 'About' }" class="mx-1">
                About
            </AppLink>
            <AppLink to="https://github.com/nilsso" class="mx-1 disabled">
                Github
            </AppLink>
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
import AppLink from '@components/AppLink.vue';
import '@css/base.css';

/* const jsscompress = import('js-string-compression'); */
/* import jsscompress from 'js-string-compression'; */
/* import * as jsscompress from 'js-string-compression'; */

export default {
    name: 'MypsWeb',
    components: { AppLink },
    props: {
        scrollWaiter: {
            type: Object,
            required: true,
        },
    },
    mounted() {
        this.scrollWaiter.flush();
    },
    methods: {
        setupWaiter() {
            this.scrollWaiter.add();
        },
        flushWaiter() {
            this.scrollWaiter.flush();
        },
        /* compress(s) { */
        /*     return window.btoa(this.compressor.compress(s + ' ')); */
        /* }, */
        /* decompress(s) { */
        /*     return this.compressor.decompress(window.atob(s)); */
        /* }, */
        compress: s => window.btoa(s),
        decompress: s => window.atob(s),
    },
    /* async setup() { */
    /*     let data = { */
    /*         compressor: null, */
    /*     }; */
    /*     onMounted(async () => { */
    /*     /1* const jsscompress = await import('js-string-compression'); *1/ */
    /*     /1* const compressor = new jsscompress.Hauffman(); *1/ */
    /*     /1* data.compressor = compressor; *1/ */
    /*     }); */
    /*     return data; */
    /* }, */
}
</script>
