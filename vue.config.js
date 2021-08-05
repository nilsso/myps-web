const path = require("path");
const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin");
const webpack = require("webpack");

module.exports = {
    publicPath: '/apps/myps/',
    configureWebpack: {
        module: {
            rules: [
                {
                    test: /\.txt$/i,
                    use: 'raw-loader',
                },
                {
                    test: /\.md$/i,
                    use: 'raw-loader',
                },
            ],
        },
    },
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
