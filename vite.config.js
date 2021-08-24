import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import { ViteAliases } from 'vite-aliases'
import ViteRsw from 'vite-plugin-rsw'

export default defineConfig({
    plugins: [
        Vue(),
        // Vue({ include: [/(?<!\.md)\.vue$/] }),
        ViteAliases(),
        ViteRsw({
            root: 'wasm',
            crates: [ 'myps-mips' ]
        })
    ]
})
