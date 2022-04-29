import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import { ViteAliases } from 'vite-aliases'
import ViteRsw from 'vite-plugin-rsw'

export default defineConfig({
    base: '/apps/myps2/',
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
