<template>
    <div id="container">
        <tabs v-model="selectedTab">
            <tab
                val="editor"
                label="Editor"
                :class="['tab', selectedTab=='editor' ? 'selected' : '']"
            />
            <tab
                val="about"
                label="About/Guide"
                :class="['tab', selectedTab=='about' ? 'selected' : '']"
            />
        </tabs>
        <div id="content">
            <tab-panels v-model="selectedTab">
                <tab-panel val="editor">
                    <suspense>
                        <template #default>
                            <Editor />
                        </template>
                        <template #fallback>
                            <p class="loading">Loading Wasm...</p>
                        </template>
                    </suspense>
                </tab-panel>
                <tab-panel val="about">
                    <AboutGuide :class="[(selectedTab == 'about') ? '' : 'hidden']" />
                </tab-panel>
            </tab-panels>
        </div>
    </div>
</template>

<script>
import {
    reactive,
    toRefs,
    /* defineAsyncComponent, */
} from 'vue';
import { Tabs, Tab, TabPanels, TabPanel } from 'vue3-tabs';

import AboutGuide from './components/AboutGuide.vue';
import Editor from './components/Editor.vue';
/* import MipsOptimizer from './components/MipsOptimizer.vue'; */

export default {
    name: 'App',
    components: {
        Tabs,
        Tab,
        TabPanels,
        TabPanel,
        AboutGuide,
        Editor,
    },
    setup() {
        const state = reactive({
            selectedTab: 'editor',
        });

        return {
            ...toRefs(state),
        }
    },
}
</script>

<style>
body {
    margin: 0 24px;
}
#content {
    margin: 12px 0;
}
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
}
.tab.selected {
    border-bottom: solid 3px chocolate;
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
.loading {
    animation-name: loading;
    animation-timing-function: ease-in-out;
    animation-duration: 1s;
    animation-direction: alternate;
    animation-iteration-count: infinite;
}
@keyframes loading {
    from {
        margin-left: 0;
    }
    to {
        margin-left: 12px;
    }
}
</style>
