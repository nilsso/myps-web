const path = require("path");
const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin");
const webpack = require("webpack");

module.exports = {
    publicPath: '/apps/myps/',
    chainWebpack: (config) => {
        config
            .plugin("wasm-pack")
            .use(WasmPackPlugin)
            .init((Plugin) => new Plugin({
                crateDirectory: path.resolve(__dirname, "./wasm")
            }))
            .end();
    }
}
