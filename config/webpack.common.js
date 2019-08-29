const path = require("path");

const DIST_PATH = path.resolve(__dirname,"../dist")
const APP_PATH = path.resolve(__dirname,"../src")
module.exports = {
    entry:{
        "app":'./src/index.js',
        vendor:["react","react-dom"],
    },
    output:{ 
        path:DIST_PATH,
    },
    module:{
        rules:[
            {
                test:/\.js?$/,
                use:"babel-loader",
                include:APP_PATH
            }
        ]
    },
    optimization:{
        splitChunks:{
            chunks:"all",
            minChunks:1,
            minSize:0,
            cacheGroups:{
                vendor:{
                    test:"vendor",
                    name:"vendor"
                }
            }
        }
    }
}