<template>
    <div class="relative flex flex-col bg-gray-300">
        <div class="flex-1 relative z-10 divide-y sm:divide-y-0 sm:divide-x divide-gray-500">
            <CodeMirror
                ref="inputEditor"
                class="absolute left-0 right-0 top-0 bottom-1/2 sm:left-0 sm:right-1/2 sm:top-0 sm:bottom-0"
                :modelValue="inputValue"
                :options="inputEditorOptions"
                :placeholder="menuData.toggleMypsMips ? 'MIPS input' : 'MYPS input'"
                :mode="menuData.toggleMypsMips ? 'myps' : 'mips'"
                @keydown.shift.enter.prevent="compile"
            />
            <CodeMirror
                ref="outputEditor"
                class="absolute left-0 right-0 top-1/2 bottom-0 sm:left-1/2 sm:right-0 sm:top-0 sm:bottom-0"
                readonly="nocursor"
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
import CodeMirror from '@components/EditorCodeMirror.vue'
import Menu from '@components/EditorMenu.vue'
import Modal from '@components/BaseModal.vue'

const jsscompress = await import('js-string-compression')
const compressor = new jsscompress.Hauffman()

const betterTab = (cm) => {
    if (cm.somethingSelected()) {
        cm.indentSelection("add")
    } else {
        cm.replaceSelection(
            cm.getOption("indentWithTabs") ?
                "\t": Array(cm.getOption("indentUnit") + 3).join(" "), "end", "+input")
    }
}

const defaultEditorOptions = {
    lineNumberFormatter: (n) => n - 1,
    matchBrackets: true,
    extraKeys: { Tab: betterTab }
}

const defaultMenuData = {
    toggleMypsMips: false,
    optimizeRegisters: true,
    removeComments: false,
    removeEmptyLines: true,
    replaceDefinitions: true,
    replaceRegisterAliases: true,
    replaceDeviceAliases: true,
    replaceLineTags: true
}

export default {
    name: 'Editor',
    components: {
        CodeMirror,
        Menu,
        Modal
    },
    data() {
        return {
            wasm: import('/wasm/pkg'),

            inputEditor: null,
            outputEditor: null,

            inputValue: '',
            outputValue: '',

            /* inputMode: */ 

            inputEditorOptions: { ...defaultEditorOptions },
            outputEditorOptions: { ...defaultEditorOptions, mode: 'mips' },
            menuData: { ...defaultMenuData },
            shareClean: false,
            shareUrl: window.location.href,

            modalShow: false,
            modalContent: 'Hello hello',
            modalKind: 'message'
        }
    },
    mounted() {
        this.menu = this.$refs.menu
        this.inputEditor = this.$refs.inputEditor
        this.outputEditor = this.$refs.outputEditor
    },
    beforeRouteEnter(to, _, next) {
        if (to.hash) {
            console.log('before editor route enter (with hash)')
            next({ ...to, hash: '' })
        } else if (to.redirectedFrom) {
            const hash = to.redirectedFrom.hash
            console.log(`before editor route enter (redirected with hash "${hash}")`)
            next(vm => vm.trySetInputFromHash(hash))
        } else {
            console.log('before editor route enter (other)')
            next()
        }
    },
    beforeRouteUpdate(to, _) {
        console.log('before editor route update')
        this.trySetInputFromHash(to.hash)
        return { hash: '' }
    },
    methods: {
        compress(s) {
            return window.btoa(compressor.compress(s))
        },
        decompress(s) {
            return compressor.decompress(window.atob(s))
        },
        setInput(value) {
            this.inputEditor.setValue(value)
        },
        trySetInputFromHash(hash) {
            if (hash) {
                try {
                    const value = this.decompress(hash.substr(1)).trimEnd()
                    console.log(value)
                    this.inputEditor.setValue(value)
                } catch (error) {
                    console.debug(`Invalid hash, error: "${error}"`)
                }
            }
        },
        setOutput(value) {
            this.outputEditor.setValue(value)
        },
        async compile() {
            if (!this.inputEditor.isClean()) {
                const output = (await this.wasm).translate_myps(
                    this.inputEditor.getValue(),
                    this.menuData.optimizeRegisters,
                    this.menuData.removeComments,
                    this.menuData.removeEmptyLines,
                    false, // removeEmptyComments
                    this.menuData.replaceRegisterAliases,
                    this.menuData.replaceDeviceAliases,
                    this.menuData.replaceDefinitions,
                    this.menuData.replaceLineTags
                )
                console.log(output)
                this.inputEditor.markClean()
            }
        },
        async share() {
            if (!this.inputEditor.isClean()) {
                const value = this.inputEditor.getValue()
                this.shareUrl = window.location.href
                if (value) {
                    this.shareUrl += '#' + this.compress(value.trimEnd())
                }
            }
            this.shareClean = true
            this.menu.forceHide()
            this.modalShow = true

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
    watch: {
        /* inputValue() { */
        /*     this.shareClean = false */
        /* }, */
        /* outputValue() { */
        /*     /1* console.debug(`output value changed to "${this.outputValue}"`) *1/ */
        /* }, */
    }
}
</script>
