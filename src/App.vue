<template>
    <div id="container">
        <div id="myps">
            <textarea
                id="myps-editor"
                v-model="mypsSource"
                placeholder="MYPS input"
                rows="15"
                @keydown.shift.enter.prevent="compile"
            />
        </div>
        <div id="mips" readonly>
            <textarea
                id="mips-viewer"
                v-model="mipsSource"
                placeholder="MIPS output"
                rows="15"
                readonly
            />
            <div>
                <button @click="compile">
                    Compile
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

const HASH_DELAY = 500;

export default {
    name: 'App',
    components: {},
    data() {
        /* const newOption = ([id, label, defaultValue]) => { */
        /*     return { id: id, label: label, value: defaultValue }; */
        /* }; */

        return {
            wasm: import('../wasm/pkg'),
            /* optimizerOptions: optimizerOptions.map(newOption), */
            optimizerOptions: optimizerOptions.reduce((map, [id, label, value]) => {
                map[id] = { id: id, label: label, value: value };
                return map;
            }, {}),
            mypsSource: '',
            mipsSource: '',
        }
    },
    watch: {
        mypsSource: _.debounce(function() { this.saveHash(); }, HASH_DELAY),
    },
    mounted() {
        this.loadHash();
    },
    methods: {
        async compile() {
            console.debug('compile: "' + this.mypsSource + '"');
            this.mipsSource = (await this.wasm).translate(
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
            this.saveHash(false);
        },
        saveHash(dirty = true) {
            console.debug('saveHash');
            const obj = {
                mypsSource: this.mypsSource,
                mipsSource: dirty ? "" : this.mipsSource,
                optimizeRegisters: this.optimizerOptions.optimizeRegisters.value,
                removeComments: this.optimizerOptions.removeComments.value,
                removeEmpty: this.optimizerOptions.removeEmpty.value,
                removeEmptyComments: this.optimizerOptions.removeEmptyComments.value,
                replaceAliasReg: this.optimizerOptions.replaceAliasReg.value,
                replaceAliasDev: this.optimizerOptions.replaceAliasDev.value,
                replaceDefines: this.optimizerOptions.replaceDefines.value,
                replaceTags: this.optimizerOptions.replaceTags.value,
            };
            const json = JSON.stringify(obj);
            const hash = btoa(json);
            window.location.hash = hash;
        },
        loadHash() {
            const hash = window.location.hash.substring(1);
            if (hash) {
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
            }
        },
    }
}
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    margin-top: 60px;
}
#container {
    margin: 0 10%;
}
#myps, #mips {
    /* width: 100%; */
    padding: 0 1%;
}
#myps {
    /* left: 0%; */
}
#mips {
    /* left: 50%; */
}
#myps-editor, #mips-viewer {
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
</style>
