<template>
    <div
        class="absolute z-10 top-0 right-0 p-2 select-none"
        @mouseover="show"
        @mouseleave="hide(0)"
    >
        <button
            type="button"
            :class="[
                'inline-flex items-center',
                fix ? 'text-blue-500' : 'text-gray-500'
            ]"
            @click.prevent="fix = !fix"
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
                    :class="{ 'rotate-180': showing }"
                    class="transition duration-300 ease-in-out origin-center transform"
                    fill-rule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4
                    4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                />
            </svg>
        </button>
        <transition name="fade-grow-top">
            <div
                v-show="showing"
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
                        <div class="relative">
                            <div class="btn-group divide-blue-700">
                                <button
                                    class="btn-blue py-2e w-full"
                                    @click="$emit('compile')"
                                    @mouseover="showTooltip = true"
                                    @mouseleave="showTooltip = false"
                                >
                                    Compile
                                </button>
                                <button
                                    class="btn-blue py-2e"
                                    @click="$emit('share')"
                                >
                                    Share
                                </button>
                            </div>
                            <transition name="fade-grow-right">
                                <span v-show="showTooltip" class="tooltip">
                                    or <kbd>shift+return</kbd> in the editor
                                </span>
                            </transition>
                        </div>
                        <hr />
                        <label class="block mb-2">Input Mode</label>
                        <Toggle
                            id="toggle-myps-mips"
                            label="MYPS / MIPS"
                            sameColor
                            v-model="modelValue.toggleMypsMips"
                        />
                        <hr />
                        <label class="block mb-2">Optimizer Options</label>
                        <Toggle
                            id="toggle-optimize-registers"
                            label="Optimize registers"
                            v-model="modelValue.optimizeRegisters"
                        />
                        <Toggle
                            id="remove-comments"
                            label="Remove comments"
                            v-model="modelValue.removeComments"
                        />
                        <Toggle
                            id="remove-empty-lines"
                            label="Remove empty lines"
                            v-model="modelValue.removeEmptyLines"
                        />
                        <Toggle
                            id="remove-empty-comments"
                            label="Remove empty comments"
                            v-model="modelValue.removeEmptyComments"
                        />
                        <Toggle
                            id="replace-definitions"
                            label="Replace definitions"
                            v-model="modelValue.replaceDefinitions"
                        />
                        <Toggle
                            id="replace-register-aliases"
                            label="Replace register aliases"
                            v-model="modelValue.replaceRegisterAliases"
                        />
                        <Toggle
                            id="replace-device-aliases"
                            label="Replace device aliases"
                            v-model="modelValue.replaceDeviceAliases"
                        />
                        <Toggle
                            id="replace-line-tags"
                            label="Replace line tags"
                            v-model="modelValue.replaceLineTags"
                        />
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import Toggle from '@components/BaseToggle.vue'

//  interface MenuData {
//  }

export default {
    name: 'EditorOptions',
    emits: [
        'compile',
        'share'
    ],
    components: {
        Toggle
    },
    props: {
        modelValue: {
            type: Object, // MenuData
            required: true
        }
    },
    data() {
        return {
            showing: true,
            fix: false,
            hideTimerId: null,
            showTooltip: false
        }
    },
    mounted() {
        this.hide(1500)
    },
    methods: {
        show() {
            clearTimeout(this.hideTimerId)
            this.showing = true
        },
        hide(timeout) {
            if (!this.fix) {
                this.hideTimerId = setTimeout(() => this.showing = false, timeout)
            }
        },
        forceHide() {
            this.fix = false;
            this.hide(0);
        }
    }
}
</script>

<style lang="postcss">
.tooltip {
    position: absolute;
    padding: .5em 1em;
    border-radius: .5em;
    color: theme(colors.white);
    background-color: theme(colors.gray.500);
    text-align: center;
    line-height: 1;
    top: 0;
    right: calc(100% + 5px);
    width: 2.6in;
}
.tooltip::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 100%;
    margin-top: -5px;
    border-width: 5px;
    border-color: transparent transparent transparent theme(colors.gray.500);
}
</style>
