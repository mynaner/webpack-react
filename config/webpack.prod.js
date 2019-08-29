const merge = require("webpack-merge");
const common = require("./webpack.common")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")

module.exports = merge(common,{
    mode:"production",
    output:{
        filename: "js/[name].[chunkhash:16].js",
    },
    devtool:"source-map",
    plugins:[
        new HtmlWebpackPlugin({
            template:"public/index.html", // 模板来源文件（html文件）
            inject:"body", // 引入模板的注入位置
            minify:{
                html5:true,
                collapseWhitespace: true, // 是否去除空格
                removeComments: true, // 去掉注释
                removeAttributeQuotes: true, // 移除属性的引号
            },
            hash:true // 是否生成hash添加在引入文件地址的末尾，这个可以避免缓存带来的麻烦。默认为true。
        }),
        new CleanWebpackPlugin()
    ]
})