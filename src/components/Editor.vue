<template>
    <div id="editor-container">
        <div id="myps">
            <textarea
                id="myps-editor"
                v-model="mypsSource"
                placeholder="MYPS input"
                rows="15"
                :class="editorClass"
                @keydown.shift.enter.prevent="compile"
            />
        </div>
        <div id="mips" readonly>
            <textarea
                id="mips-output"
                v-model="mipsSource"
                placeholder="MIPS output"
                rows="15"
                :class="editorClass"
                readonly
            />
            <div>
                <button @click="compile">
                    Compile
                </button>
                <button @click="clear">
                    Clear
                </button>
                <ul id="optimizer-options" type="none">
                    <li
                        v-for="(option, i) in optimizerOptions"
                        :key="i"
                        @change="saveHash"
                    >
                        <input
                            :id="option.id"
                            v-model="option.value"
                            type="checkbox"
                        >
                        <label :for="option.id">{{ option.label }}</label>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import _ from 'lodash';

// TODO: Should use a resusable instance of mips::OptimizerConfiguration to encapsulate all this
const optimizerOptions = [
    [ 'optimizeRegisters',   'Optimize Registers',       true  ],
    [ 'removeComments',      'Remove comments',          false ],
    [ 'removeEmpty',         'Remove empty',             false ],
    [ 'removeEmptyComments', 'Remove empty comments',    false ],
    [ 'replaceAliasReg',     'Replace register aliases', false ],
    [ 'replaceAliasDev',     'Replace device aliases',   false ],
    [ 'replaceDefines',      'Replace definitions',      false ],
    [ 'replaceTags',         'Replace line tags',        false ],
];

const EditorState = {
    Okay: 0,
    Warning: 1,
    Error: 2,
};

const HASH_SAVE_DELAY = 500;

export default {
    name: 'Editor',
    data() {
        return {
            wasm: import('../../wasm/pkg'),
            /* optimizerOptions: optimizerOptions.map(newOption), */
            optimizerOptions: optimizerOptions.reduce((map, [id, label, value]) => {
                map[id] = { id: id, label: label, value: value };
                return map;
            }, {}),
            mypsSource: '',
            mipsSource: '',
            editorState: EditorState.Okay,
        }
    },
    computed: {
        editorClass() {
            return {
                'error':   this.editorState == EditorState.Error,
                'okay':    this.editorState == EditorState.Okay,
                'warning': this.editorState == EditorState.Warning,
            }
        }
    },
    watch: {
        mypsSource: _.debounce(function() { this.saveHash(); }, HASH_SAVE_DELAY),
    },
    mounted() {
        this.loadHash();
    },
    methods: {
        async compile() {
            console.debug('compile: "' + this.mypsSource + '"');
            try {
                const output = (await this.wasm).translate(
                    this.mypsSource,
                    this.optimizerOptions.optimizeRegisters.value,
                    this.optimizerOptions.removeComments.value,
                    this.optimizerOptions.removeEmpty.value,
                    this.optimizerOptions.removeEmptyComments.value,
                    this.optimizerOptions.replaceAliasReg.value,
                    this.optimizerOptions.replaceAliasDev.value,
                    this.optimizerOptions.replaceDefines.value,
                    this.optimizerOptions.replaceTags.value,
                );
                this.editorState = EditorState.Okay;
                this.mipsSource = output;
                this.saveHash(false);
            } catch(e) {
                this.editorState = EditorState.Error;
                this.mipsSource = '';
                console.debug('error!');
                /* console.debug(e); */
                //
            }
        },
        clear() {
            this.mypsSource = '';
            this.mipsSource = '';
            this.saveHash(true);
        },
        saveHash(dirty = true) {
            console.debug('saveHash');
            const obj = {
                mypsSource: this.mypsSource,
                mipsSource: dirty ? '' : this.mipsSource,
                optimizeRegisters: this.optimizerOptions.optimizeRegisters.value,
                removeComments: this.optimizerOptions.removeComments.value,
                removeEmpty: this.optimizerOptions.removeEmpty.value,
                removeEmptyComments: this.optimizerOptions.removeEmptyComments.value,
                replaceAliasReg: this.optimizerOptions.replaceAliasReg.value,
                replaceAliasDev: this.optimizerOptions.replaceAliasDev.value,
                replaceDefines: this.optimizerOptions.replaceDefines.value,
                replaceTags: this.optimizerOptions.replaceTags.value,
                editorState: this.editorState,
            };
            const json = JSON.stringify(obj);
            const hash = btoa(json);
            window.location.hash = hash;
        },
        loadHash() {
            const hash = window.location.hash.substring(1);
            if (hash) {
                try {
                    console.debug('loadHash');
                    const json = atob(hash);
                    const obj = JSON.parse(json);
                    this.mypsSource                                 = obj.mypsSource;
                    this.mipsSource                                 = obj.mipsSource;
                    this.optimizerOptions.optimizeRegisters.value   = obj.optimizeRegisters;
                    this.optimizerOptions.removeComments.value      = obj.removeComments;
                    this.optimizerOptions.removeEmpty.value         = obj.removeEmpty;
                    this.optimizerOptions.removeEmptyComments.value = obj.removeEmptyComments;
                    this.optimizerOptions.replaceAliasReg.value     = obj.replaceAliasReg;
                    this.optimizerOptions.replaceAliasDev.value     = obj.replaceAliasDev;
                    this.optimizerOptions.replaceDefines.value      = obj.replaceDefines;
                    this.optimizerOptions.replaceTags.value         = obj.replaceTags;
                    this.editorState                                = obj.editorState;
                } catch(e) {
                    //
                }
            }
        },
    }
}
</script>

<style>
#myps, #mips {
    padding: 0 1%;
}
/* #myps { */
/*     left: 0%; */
/* } */
/* #mips { */
/*     left: 50%; */
/* } */
#myps-editor, #mips-output {
    font-family: 'Courier New', Courier, monospace;
    width: 100%;
    margin-bottom: 1em;
    resize: none;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
}
#optimizer-options {
    padding: 0;
}
textarea {
    padding: 5px;
    border-style: solid;
    border-radius: 5px;
}
textarea:focus {
    outline: none;
}
/* .okay { */
/* } */
.warning {
    border-color: yellow;
}
.error {
    border-color: red;
}
</style>
