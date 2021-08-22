<template>
    <div id="modal-mask">
        <div id="modal-wrapper">
            <div id="modal-container" :class="[colors.bgColor, colors.ringColor]">
                <h1 :class="['m-0', colors.headerColor]">
                    <slot name="header">
                        {{ kind.charAt(0).toUpperCase() + kind.slice(1) }}
                    </slot>
                </h1>
                <hr />
                <div>
                    <slot name="default" />
                </div>
                <hr />
                <div class="text-right">
                    <button ref="ok" :class="['btn w-1/4', colors.buttonColor]" @click="close">
                        OK
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

const Kind = {
    message: 'message',
    warning: 'warning',
    error: 'error'
}

const ColorTable = (bgColor, headerColor, ringColor, buttonColor) => {
    return { bgColor, headerColor, ringColor, buttonColor }
}

const Colors = {
    message: ColorTable('bg-gray-50',   'text-gray-500',   'ring-gray-500',   'btn'       ),
    warning: ColorTable('bg-yellow-50', 'text-yellow-500', 'ring-yellow-500', 'btn-yellow'),
    error:   ColorTable('bg-red-50',    'text-red-500',    'ring-red-500',    'btn-red'   )
}

//  interface ModalData {
//      show: Boolean
//  }

export default {
    emits: [ 'close' ],
    props: {
        kind: {
            type: String,
            default: Kind.message
        }
    },
    setup(props) {
        return { colors: Colors[props.kind] }
    },
    mounted() {
        this.$refs.ok.focus()
    },
    watch: {
        kind() {
            this.colors = Colors[this.kind]
        }
    },
    methods: {
        close() {
            this.$emit('close')
        }
    }
}
</script>

<style lang="postcss" scoped>
    #modal-mask {
        @apply absolute table inset-0 w-full h-full z-50 bg-black bg-opacity-50;
    }
    #modal-wrapper {
        @apply table-cell align-middle;
    }
    #modal-container {
        @apply w-1/2 mx-auto p-2e text-gray-500 rounded-lg ring-2;
    }
</style>
