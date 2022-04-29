<template>
    <div class="relative flex flex-col bg-gray-300">
        <!-- overlay -->
        <div
            :class="[
                'absolute inset-0 pointer-events-none z-10',
                compileError ? 'ring-2 ring-red-500 ring-inset' : '',
            ]"
        />
        <div class="flex-1 relative divide-y sm:divide-y-0 sm:divide-x divide-gray-500">
            <!-- input editor -->
            <VueCodeMirror
                ref="inputEditor"
                class="absolute left-0 right-0 top-0 bottom-1/2 sm:left-0 sm:right-1/2 sm:top-0 sm:bottom-0"
                :modelValue="inputValue"
                :options="inputEditorOptions"
                :placeholder="menuData.toggleMypsMips ? 'MIPS input' : 'MYPS input'"
                :mode="menuData.toggleMypsMips ? 'mips' : 'python'"
                @keydown.shift.enter.prevent="compile"
                @changed="inputChanged"
            />
            <!-- output editor -->
            <VueCodeMirror
                ref="outputEditor"
                class="absolute left-0 right-0 top-1/2 bottom-0 sm:left-1/2 sm:right-0 sm:top-0 sm:bottom-0"
                readonly
                placeholder="Optimized MIPS output"
                :modelValue="outputValue"
                :options="outputEditorOptions"
            />
        </div>
        <Menu
            ref="menu"
            v-model="menuData"
            @compile="compile"
            @share="share"
        />
        <transition name="fade">
            <Modal
                v-if="modalShow"
                v-bind:kind="modalKind"
                @close="modalShow = false"
            >
                <template #header>
                    Share Link
                </template>
                <template #default>
                    <div class="w-full h-12 overflow-scroll">
                        <code class="select-all whitespace-nowrap">
                            {{ shareUrl }}
                        </code>
                    </div>
                </template>
            </Modal>
        </transition>
    </div>
</template>

<script>
import VueCodeMirror from '@components/VueCodeMirror.vue';
import Menu from '@components/EditorMenu.vue';
import Modal from '@components/BaseModal.vue';

import CodeMirror from 'codemirror';
import 'codemirror/addon/mode/simple.js';
import 'codemirror/addon/comment/comment.js';
import 'codemirror/mode/python/python.js';
import '@assets/codemirror/modes/mips.js';
/* import '@assets/codemirror/modes/myps.js'; */
/* CodeMirror.defineMode('mips', mipsMode); */

const betterTab = (cm) => {
    if (cm.somethingSelected()) {
        cm.indentSelection("add");
    } else {
        const spaces = () => Array(cm.getOption("indentUnit") + 1).join(" ");
        const tabs = cm.getOption("indentWithTabs");
        cm.replaceSelection(tabs ? "\t" : spaces(), "end", "+input");
    }
};

const defaultEditorOptions = {
    lineNumberFormatter: (n) => n - 1,
    matchBrackets: true,
    extraKeys: {
        Tab: betterTab,
        'Cmd-/': cm => cm.toggleComment(),
    },
    indentUnit: 4,
};

const defaultMenuData = {
    toggleMypsMips: false,
    optimizeRegisters: true,
    removeComments: false,
    removeEmptyLines: true,
    removeEmptyComments: true,
    replaceDefinitions: true,
    replaceRegisterAliases: true,
    replaceDeviceAliases: true,
    replaceLineTags: true,
};

import init, { optimize_mips, translate_myps } from 'wasm/myps-mips';
init();

export default {
    name: 'Editor',
    components: {
        VueCodeMirror,
        Menu,
        Modal,
    },
    data() {
        return {
            inputEditor: null,
            outputEditor: null,

            inputValue: '',
            outputValue: '',

            /* inputMode: */ 

            inputEditorOptions: { ...defaultEditorOptions },
            outputEditorOptions: { ...defaultEditorOptions, mode: 'mips' },
            compileError: false,

            menuData: { ...defaultMenuData },
            shareClean: false,
            shareUrl: window.location.href,

            modalShow: false,
            modalContent: 'Hello hello',
            modalKind: 'message',
        }
    },
    mounted() {
        this.menu = this.$refs.menu;
        this.inputEditor = this.$refs.inputEditor;
        this.outputEditor = this.$refs.outputEditor;
    },
    beforeRouteEnter(to, _, next) {
        if (to.hash) {
            console.log('before editor route enter (with hash)');
            next({ ...to, hash: '' });
        } else if (to.redirectedFrom) {
            const hash = to.redirectedFrom.hash;
            console.log(`before editor route enter (redirected with hash "${hash}")`);
            next(vm => vm.trySetInputFromHash(hash));
        } else {
            console.log('before editor route enter (other)');
            next();
        }
    },
    beforeRouteUpdate(to, _) {
        console.log('before editor route update');
        this.trySetInputFromHash(to.hash);
        return { hash: '' };
    },
    watch: {
        inputValue() {
            console.debug('input changed');
        },
        /* outputValue() { */
        /* }, */
    },
    methods: {
        inputChanged() {
            this.compileError = false;
        },
        setInput(value) {
            this.inputEditor.setValue(value);
        },
        trySetInputFromHash(hash) {
            if (hash) {
                try {
                    const value = this.$root.decompress(hash.substr(1));
                    this.inputEditor.setValue(value.trimEnd());
                } catch (error) {
                    console.debug(`Invalid hash, error: "${error}"`);
                }
            }
        },
        setOutput(value) {
            this.outputEditor.setValue(value);
        },
        // TODO: This should be async, and block further compile attempts
        compile() {
            // TODO: Figure out how CodeMirror marks itself clean/unclean when copy-pasting
            // and when setting the value from hash. Doesn't seem to marked dirty sometimes.
            /* if (!this.inputEditor.isClean()) { */
                try {
                    const f = this.menuData.toggleMypsMips ? optimize_mips : translate_myps;
                    const value = this.inputEditor.getValue();
                    const output = f(
                        value,
                        this.menuData.optimizeRegisters,
                        this.menuData.removeComments,
                        this.menuData.removeEmptyLines,
                        this.menuData.removeEmptyComments,
                        this.menuData.replaceRegisterAliases,
                        this.menuData.replaceDeviceAliases,
                        this.menuData.replaceDefinitions,
                        this.menuData.replaceLineTags,
                    );
                    this.inputEditor.markClean();
                    this.compileError = false;
                    this.outputEditor.setValue(output);
                } catch (error) {
                    console.debug(`Translator error: "${error}"`);
                    this.compileError = true;
                    this.outputEditor.setValue('');
                }
            /* } */
        },
        async share() {
            const value = this.inputEditor.getValue();
            this.shareUrl = window.location.href;
            if (value) {
                this.shareUrl += '#' + this.$root.compress(value.trimEnd());
            }
            this.shareClean = true;
            this.menu.forceHide();
            this.modalShow = true;

            // TODO: Might want to copy to clipboard? Modal is okay though
            /* if (!navigator.clipboard) { */
            /* } else { */
            /* } */
            /* try { */
            /*     const v = this.inputValue */
            /*     await navigator.clipboard.writeText(v) */
            /*     const compressed = this.compress(v.trim()) */
            /*     window.alert(compressed) */
            /*     /1* console.debug(compressed) *1/ */
            /* } catch(err) { */
            /*     /1* window.alert( *1/ */
            /*     console.debug(err) */
            /* } */
        }
    },
}
</script>
