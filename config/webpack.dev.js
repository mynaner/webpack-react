const merge = require("webpack-merge");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const common = require("./webpack.common");
const path = require("path")
// const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer")
module.exports = merge(common,{
    mode:"development",
    output:{
        filename:"js/[name].[hash:16].js"
    },
    devtool:"inline-source-map",
    plugins:[
        new HtmlWebpackPlugin({
            template:"public/index.html",
            inject:"body",
            minify:{
                html5:true
            },
            hash:false
        }),
        new webpack.HotModuleReplacementPlugin(),
        // new BundleAnalyzerPlugin() // 打包分析
    ],
    devServer:{
        // port:8080,
        contentBase:path.resolve(__dirname,"public"),
        compress:true,
        historyApiFallback:true,
        hot:true,
        https:false,
        noInfo:true,
        open:true,
        proxy:{}
    }
})