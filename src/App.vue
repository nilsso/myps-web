<template>
    <div id="container">
        <tabs v-model="selectedTab">
            <tab
                val="editor"
                label="Editor"
                class="tab"
            />
            <tab
                val="about"
                label="About/Guide"
                class="tab"
            />
        </tabs>
        <tab-panels v-model="selectedTab">
            <tab-panel val="editor">
                <Editor :class="[(selectedTab == 'editor') ? '' : 'hidden']" />
            </tab-panel>
            <tab-panel val="about">
                <AboutGuide :class="[(selectedTab == 'about') ? '' : 'hidden']" />
            </tab-panel>
        </tab-panels>
    </div>
</template>

<script>
import { reactive, toRefs } from 'vue';
import { Tabs, Tab, TabPanels, TabPanel } from 'vue3-tabs';

import Editor from './components/Editor.vue';
import AboutGuide from './components/AboutGuide.vue';

export default {
    name: 'App',
    components: {
        Tabs,
        Tab,
        TabPanels,
        TabPanel,
        Editor,
        AboutGuide,
    },
    setup() {
        const state = reactive({
            selectedTab: 'editor',
        });
        return {
            ...toRefs(state),
        }
    },
    data() {
        return {
        }
    },
}
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
}
/* #container { */
/*     padding: 0 10%; */
/* } */
/* .tab-panel { */
/*     display: none; */
/* } */
.hidden {
    display: none;
}
</style>
