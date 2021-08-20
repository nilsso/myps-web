<template>
    <div class="relative flex flex-col bg-gray-300">
        <div class="flex-1 relative z-10 divide-y sm:divide-y-0 sm:divide-x divide-gray-500">
            <CodeMirror
                ref="inputEditor"
                class="absolute left-0 right-0 top-0 bottom-1/2 sm:left-0 sm:right-1/2 sm:top-0 sm:bottom-0"
                v-model="inputValue"
                :options="inputOptions"
                :placeholder="toggleMypsMips ? 'MIPS input' : 'MYPS input'"
                :mode="toggleMypsMips ? 'myps' : 'mips'"
                @keydown.shift.enter.prevent="compile"
            />
            <CodeMirror
                ref="outputEditor"
                class="absolute left-0 right-0 top-1/2 bottom-0 sm:left-1/2 sm:right-0 sm:top-0 sm:bottom-0"
                readonly="nocursor"
                placeholder="Optimized MIPS output"
                v-model="outputValue"
                :options="outputOptions"
            />
        </div>
        <div
            class="absolute z-10 top-0 right-0 p-2 select-none cursor-pointer"
            @mouseover="showMenu"
            @mouseleave="hideMenu(0)"
        >
            <button
                type="button"
                :class="[
                    'inline-flex items-center',
                    fixMenu ? 'text-blue-500' : 'text-gray-500'
                ]"
                @click.prevent="fixMenu = !fixMenu"
            >
                <span class="flex-shrink-0">
                    Menu
                </span>
                <svg
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    class="flex-shrink-0 w-5 h-5 ml-1"
                >
                    <path
                        :class="{ 'rotate-180': showingMenu }"
                        class="transition duration-300 ease-in-out origin-center transform"
                        fill-rule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4
                        4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clip-rule="evenodd"
                    />
                </svg>
            </button>
            <transition
                enter-active-class="transition duration-150 ease-in-out transform"
                enter-from-class="-translate-y-3 scale-95 opacity-0"
                enter-to-class="translate-y-0 scale-100 opacity-100"
                leave-active-class="transition duration-150 ease-in transform"
                leave-from-class="translate-y-0 scale-100 opacity-100"
                leave-to-class="-translate-y-3 scale-95 opacity-0"
            >
                <div
                    v-show="showingMenu"
                    class="fixed m-3 mt-0 pt-3 right-0"
                >
                    <!-- Container -->
                    <div
                        class="relative p-2 bg-white border border-gray-200 rounded-md
                        shadow-xl flex
                        "
                    >
                        <!-- Diamond -->
                        <div
                            class="absolute top-0 right-0 w-4 h-4 origin-center transform rotate-45
                            -translate-x-7 -translate-y-2 bg-white border-t border-l border-gray-200
                            rounded-sm pointer-events-none"
                        />
                        <div class="relative px-0 block">
                            <button class="btn btn-lg btn-blue font-normal mb-2 w-full">
                                Compile
                            </button>
                            <div class="btn-group divide-red-700 px-0 py-0">
                                <button class="btn-red text-sm font-normal">
                                    Clear Input
                                </button>
                                <button class="btn-red text-sm font-normal">
                                    Clear Output
                                </button>
                            </div>
                            <hr />
                            <label>Input Mode</label>
                            <Toggle
                                id="toggle-myps-mips"
                                label="MYPS / MIPS"
                                class="option-toggle"
                                sameColor
                                v-model="toggleMypsMips"
                            />
                            <hr />
                            <label>Optimizer Options</label>
                            <Toggle
                                id="toggle-optimize-registers"
                                label="Optimize registers"
                                class="option-toggle"
                                v-model="optimizeRegisters"
                            />
                        </div>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
import CodeMirror from '@components/EditorCodeMirror.vue'
import Toggle from '@components/BaseToggle.vue'

const commonOptions = {
    lineNumberFormatter: (n) => n - 1,
}

const inputOptions = {
    ...commonOptions,
}

const outputOptions = {
    mode: 'mips',
    ...commonOptions,
}

export default {
    name: 'Editor',
    components: {
        CodeMirror,
        Toggle
    },
    data() {
        return {
            inputValue: '',
            outputValue: '',

            /* inputMode: */ 

            toggleMypsMips: false,
            optimizeRegisters: true,

            inputOptions,
            outputOptions,

            showingMenu: true,
            fixMenu: false,
            hideMenuId: null
        }
    },
    mounted() {
        this.hideMenu(1500)
        this.inputEditor = this.$refs.inputEditor
        this.outputEditor = this.$refs.outputEditor
    },
    methods: {
        showMenu() {
            clearTimeout(this.hideMenuId)
            this.showingMenu = true
        },
        hideMenu(timeout) {
            if (!this.fixMenu) {
                this.hideMenuId = setTimeout(() => this.showingMenu = false, timeout)
            }
        },
        setInput(value) {
            this.inputValue = value
        },
        /* setOutput() { */
        /* } */
        compile() {
            console.debug('compile')
            // TODO
            /* this.outputEditor.setValue(this.inputValue); */
            this.outputValue = this.inputValue
        }
    },
    watch: {
        inputValue() {
            console.debug(`input value changed to "${this.inputValue}"`)
        },
        outputValue() {
            console.debug(`output value changed to "${this.outputValue}"`)
        },
        fixMenu() {
            console.debug(this.fixMenu)
        }
    }
}
</script>
