<template>
    <div>
        <label :for="id" class="group select-none toggle">
            <span class="relative">
                <span class="toggle-bg"/>
                <span :class="[
                    'toggle-button',
                    modelValue ? 'on' : 'off',
                    sameColor ? 'same-color' : '',
                ]">
                    <input
                        :id="id"
                        type="checkbox"
                        class="toggle-input"
                        v-model="modelValue"
                        @change="$emit('update:modelValue', modelValue)"
                    />
                </span>
            </span>
            <span v-once class="toggle-label">{{ label }}</span>
        </label>
    </div>
</template>

<script>
/* import { defineComponent, PropType } from 'vue' */

export default {
    name: 'Toggle',
    emits: ['update:modelValue'],
    props: {
        modelValue: {
            type: Boolean,
            required: false,
        },
        id: {
            type: String,
            required: true,
        },
        label: {
            type: String,
            required: true,
        },
        sameColor: {
            type: Boolean,
            default: false,
        },
    },
}
</script>

<style lang="postcss" scoped>
.toggle {
    @apply inline-flex items-center cursor-pointer;
}
.toggle-bg {
    @apply block w-10 h-6 rounded-full bg-gray-400 shadow-inner;
}
.toggle-button {
    @apply absolute bg-white block w-4 h-4 mt-1 ml-1 rounded-full shadow
        inset-y-0 left-0 transition-transform duration-300 ease-in-out bg-white;
}
.toggle:hover .toggle-button {
    @apply ring;
}
.toggle-button.on {
    @apply bg-blue-500 transform translate-x-full;
}
.toggle-button.same-color.off {
    @apply bg-blue-500;
}
.toggle-input {
    @apply absolute opacity-0 w-0 h-0;
}
.toggle-label {
    @apply ml-3 text-sm whitespace-nowrap;
}
</style>
