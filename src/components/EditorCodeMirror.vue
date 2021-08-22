<template>
    <div ref="editor" :style="{ height: editorHeight }" />
</template>

<script>
import { markRaw } from 'vue'

import CodeMirror from 'codemirror'
import 'codemirror/addon/fold/brace-fold'
import 'codemirror/addon/fold/foldgutter'
import 'codemirror/addon/fold/foldgutter.css'
import 'codemirror/addon/display/placeholder'
/* import 'codemirror/mode/javascript/javascript' */
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/nord.css'

const DEFAULT_OPTIONS = {
    mode: '',
    theme: 'nord',
    readOnly: false,
    lineWrapping: true,
    lineNumbers: true,
    foldGutter: true,
    gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
}

export default {
    name: 'CodeMirror',
    emits: [ 'update:modelValue' ],
    props: {
        modelValue: {
            type: String,
            default: '',
        },
        mode: {
            type: String,
            default: 'javascript',
        },
        theme: {
            type: String,
            default: 'nord',
        },
        placeholder: {
            type: String,
            default: '',
        },
        readonly: {
            type: [Boolean, String],
            default: false,
        },
        height: {
            type: String,
            default: 'auto',
        },
        noautosize: {
            type: Boolean,
            default: false,
        },
        wrap: {
            type: Boolean,
            default: true,
        },
        options: {
            type: Object,
            default: {},
        },
    },
    data() {
        return {
            /* width: null, */
            /* height: null, */
            editorHeight: 'auto',
            sizer: [Object, null],
        }
    },
    methods: {
        getEditorHeight() {
            return this.editorHeight
        },
        setEditorHeight(height) {
            this.editorHeight = height
        },
        updateEditorHeight() {
            switch (this.height) {
                case 'auto':
                    break
                case 'lines':
                    const h = ((this.editor.lineCount() * 19.5) + 8)
                    this.editorHeight = h + 'px'
                    break
                default:
                    this.setEditorHeight(this.editorHeight = this.height)
                    break
            }
        },
        getValue() {
            return this.editor.getValue()
        },
        setValue(value) {
            this.editor.setValue(value)
        },
        setMode(mode) {
            this.mode = mode
        },
        setTheme(theme) {
            this.theme = theme
        },
        setPlaceholder(placeholder = this.placeholder) {
            this.placeholder = placeholder
        },
        setOption(key, value) {
            this.editor.setOption(key, value)
        },
        isClean() {
            return this.editor.isClean()
        },
        markClean() {
            this.editor.markClean()
        },
    },
    watch: {
        modelValue() {
            const value = this.modelValue
            if (value != this.editor.getValue()) {
                console.debug(`model value changed to "${value}"`)
                this.editor.setValue(value)
            }
        },
        mode() {
            console.debug(`mode changed to "${this.mode}"`)
            this.editor.setOption('mode', this.mode)
        },
        theme() {
            console.debug(`theme changed to "${this.theme}"`)
            this.editor.setOption('theme', this.theme)
        },
        placeholder() {
            console.debug(`placeholder changed to "${this.placeholder}"`)
            this.editor.setOption('placeholder', this.placeholder)
        },
    },
    mounted() {
        // Spread options
        const propOptions = {
            value: this.modelValue,
            mode: this.mode,
            theme: this.theme,
            placeholder: this.placeholder,
            readOnly: this.readonly,
            lineWrapping: this.wrap,
        }

        const options = {
            ...DEFAULT_OPTIONS,
            ...Object.fromEntries(Object.entries(propOptions).filter(([_, v]) => !!(v))),
            ...this.options
        }

        const container = this.container = this.$refs.editor
        const editor
            = container.editor
            = this.editor
            = markRaw(CodeMirror(container, options))
        this.sizer = container.getElementsByClassName('CodeMirror-sizer')[0]

        // Emit value change handeler
        editor.on('changes', () => {
            const value = this.editor.getValue()
            this.$emit('update:modelValue', value)
            this.updateEditorHeight()
        })

        // Consider hooking other events (focus, blur)

        // Resize editor to container automatically
        const ro = editor.ro = new ResizeObserver(entries => {
        /* const ro = editor.ro = new ResizeObserver(function (entries) { */
            entries.forEach(entry => {
                const editor = entry.target.editor
                const { width, height } = entry.contentRect
                editor.setSize(width, height)
                editor.refresh()
            })
        })
        ro.observe(container)

        this.updateEditorHeight()
    },
}
</script>

<style lang="postcss">
/* @import 'codemirror/theme/base16-light.css'; */
/* @tailwind components; */
/* @tailwind utilities; */
/* .cm-s-duotone-light span.cm-bracket, .cm-s-duotone-light span.cm-comment { color: #b6ad9a; } */
/* .cm-s-base16-dark span.cm-comment { color: #8f5536; } */
.CodeMirror pre.CodeMirror-placeholder {
    color: #999;
}
</style>
