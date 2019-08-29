# webpack4 整合react

## 从空文件夹开始安装webpack4以及配置

```sh
$ yarn init -y
$ yarn add webpack --dev
```

```js
// config/webpack.common.js
const path = require("path");
const DIST_PATH = path.resolve(__dirname,"../dist");
module.exports = {
    entry:"./app/index.js",
    output:{
        filename:"js/bundle.js",
        path:DIST_PATH,
    }
}
```

webpack4.0还增加了mode属性，用来表示不同的环境。

使用merge的方式组织webpack基础配置和不同环境的配置。

```sh
$ yarn add webpack-merge --dev
```

```js
// webpack.prod.js
const merge = require("webpack-merge");
const common = require("./webpack.common")
module.exports = merge(common,{
    mode:"development"
})
```

在根目录下创建app目录，然后创建index.js文件。

```js
// app/index.js
var element =document.getElementById('root');
element.innerHTML = 'hello, world!';
```
在根目录创建一个public文件夹，然后新建一个index.html文件。
```html
<!-- public/index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <div id="root"></div>
    <script src="../dist/js/bundle.js"></script>
</body>
</html>
```

项目目录

```diff
|- /app
  |- index.js
|- /node_modules
|- /public
  |- index.html
|- /config
  |- webpack.base.js
  |- webpack.prod.js
|- package.json
|- package-lock.json 
```

执行webpack命令，来编译我们的代码，4.0版本之后的webpack，已经将webpack命令工具迁移到webpack-cli模块了。你需要安装webpack-cli

```sh
$ yarn add webpack-cli --dev
```

安装完成后，执行下面脚本进行编译：

```sh
$ yarn webpack --config config/webpack.prod.js
```



npm scripts管理

```json
// package.json
{
  "name": "webpack-react",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "scripts": {
    "build":"webpack --config config/webpack.prod.js"
  },
  "devDependencies": {
    "webpack": "^4.39.3",
    "webpack-cli": "^3.3.7",
    "webpack-merge": "^4.2.2"
  }
}
```

## 安装react

```sh
$ yarn add react react-dom
```

```jsx
import React from 'react'
import ReactDom from 'react-dom'

ReactDom.render(
<h1>hello, world!</h1>,
    document.getElementById('root')
);
```

因为webpack只识别JavaScript文件，而且只能编译es5版本的JavaScript语法。实际上，我们使用ES2015，以及jsx的语法糖，webpack它根本不认识

webpack 可以使用 [loader](https://link.zhihu.com/?target=https%3A//doc.webpack-china.org/concepts/loaders) 来预处理文件。它不仅仅可以处理JavaScript本身，还允许你打包任何的静态资源。

其中，babel-loader，就是这样一个预处理插件，它加载 ES2015+ 代码，然后使用 [Babel](https://link.zhihu.com/?target=https%3A//babeljs.io/) 转译为 ES5。我们来了解下如何在webpack配置babel-loader。

```sh
$ yarn add babel-loader babel-core babel-preset-env babel-preset-react --dev

## 注意编译还是报错，需要安装 babel-loader@7 
yarn add babel-loader@7 --dev

### 使用babel8.X版本　　
## babel8的变化
##  一，各个包的名字变了，都以@符号开头 带来2个影响 
## 		1，以前每个包在node_modules目录下都是一个独立的文件夹；现在则在node-modules目录下有个叫“@babel”的目录，这里要安装的所有babel包，都在这个@babel目录下保存
##    2，在配置的时候，写法完全变了。
##  二，有一些包被彻底废弃。比如在babel7.X版本中用到的babel-preset-stage-0
##  三，有一些新的包必须引入进来才可以。

## 必须安装的包 babel-loader '@babel/core'
## 各个包的作用如下 　　

## babel-loader：加载器
## @babel/core：babel核心包,babel-loader的核心依赖
## @babel/preset-env：ES语法分析包
## @babel/runtime和@babel/plugin-transform-runtime：babel 编译时只转换语法，几乎可以编译所有时新的 JavaScript 语法，但并不会转化BOM（浏览器）里面不兼容的API。比如 Promise,Set,Symbol,Array.from,async 等等的一些API。这2个包就是来搞定这些api的。
## @babel/plugin-proposal-class-properties：用来解析类的属性的。

## 添加.babelrc配置文件，并在该文件中写下如下配置信息 　　

{
	"presets": ["@babel/preset-env"],
	"plugins": ["@babel/plugin-transform-runtime", "@babel/plugin-proposal-class-properties"]
}
```

除了babel-loader，我们还安装了好多的包，其中babel-core是babel的核心模块，babel-preset-env是转译ES2015+的语法，babel-preset-react是转译react的JSX以及FLOW。了解详情可以移步 [babel官方](https://link.zhihu.com/?target=http%3A//babeljs.io/)。

```json
// 建立 .babelrc 文件
{
    "presets": [
        [
            "env",
            {
                "targets":{
                    "browsers":[
                        "> 1%",
                        "last 5 versions",
                        "ie >=8"
                    ]
                }
            }
        ],
        "react"
    ]
}
```



```js
// webpack.common.js
const path = require("path");
const DIST_PATH = path.resolve(__dirname,"../dist")
const APP_PATH = path.resolve(__dirname,"../app")
module.exports = {
    entry:{
        "app":'./app/index.js',
    },
    output:{
        filename:"js/bundle.js",
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
    }
}
```

## 整合html-webpack-plugin

```sh
$ yarn add html-webpack-plugin --dev
```

```js
// webpack.prod.js
const merge = require("webpack-merge");
const common = require("./webpack.common")
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = merge(common,{
    mode:"production",
    plugins:[
        new HtmlWebpackPlugin({
            template:"public/index.html",
            inject:"body",
            minify:{
                html5:true, // 根据HTML5规范解析输入
                collapseWhitespace: true,
                removeComments: true,
                removeAttributeQuotes: true, // 移除属性的引号
            },
            hash:true
        })
    ]
})
```

## 为导出的js文件添加内容hash

```js
// webpack.prod.js
const merge = require("webpack-merge");
const common = require("./webpack.common")
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = merge(common,{
    mode:"production",
    output:{
+        filename: "js/[name].[chunkhash:16].js",
    },
    // ...
})
```

## 编译前清理dist目录

```sh
$ yarn add clean-webpack-plugin --dev
```

```js
// webpack.prod.js
const merge = require("webpack-merge");
const common = require("./webpack.common")
const HtmlWebpackPlugin = require("html-webpack-plugin")
+ const { CleanWebpackPlugin } = require("clean-webpack-plugin")

module.exports = merge(common,{
    mode:"production",
    output:{
        filename: "js/[name].[chunkhash:16].js",
    },
    plugins:[
       	// ....
+       CleanWebpackPlugin()
    ]
})
```

## 非业务代码单独打包

你每次发布，这个文件都会被重新下载。你的代码有修改，用户需要重新下载无可厚非。可是，你别忘了这个app.js内还包含了很多不变的代码，比如react，react-dom。我们需要把这些不变的代码分开打包。

```js
const path = require("path");
const DIST_PATH = path.resolve(__dirname,"../dist")
const APP_PATH = path.resolve(__dirname,"../app")
module.exports = {
    entry:{
        "app":'./app/index.js',
+        vendor:["react","react-dom"],
    },
    output:{
        filename:"js/bundle.js",
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
    }
}
```

的确，react和react-dom 被编译成vendor.js。可是，你会发现，app.js并没有减少，还是96.9KB。因为我们还缺少一步，就是抽离app.js中公共的代码。

webpack3版本是通过配置CommonsChunkPlugin插件来抽离公共的模块。webpack4版本，官方废弃了CommonsChunkPlugin，而是改用配置optimization.splitChunks的方式，更加方便。

```js
// webpack.prod.js
const merge = require("webpack-merge");
const common = require("./webpack.common")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
module.exports = merge(common,{
 		// ....
    optimization:{
        splitChunks:{
            chunks:"all", // 
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
})
```

> 更改文件后的hash值会发生变化，就不能被浏览器缓存了

## 整合dev环境 (开发环境)

```sh
$ yarn add webpack-dev-server --dev
```

```js
// webpack.dev.js
const merge = require("webpack-merge");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const common = require("./webpack.common");
const path = require("path") 
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
```

```js
devServer: {
  clientLogLevel: 'warning', // 可能的值有 none, error, warning 或者 info（默认值)
  hot: true,  // 启用 webpack 的模块热替换特性, 这个需要配合： webpack.HotModuleReplacementPlugin插件
  contentBase:  path.join(__dirname, "dist"), // 告诉服务器从哪里提供内容， 默认情况下，将使用当前工作目录作为提供内容的目录
  compress: true, // 一切服务都启用gzip 压缩
  host: '0.0.0.0', // 指定使用一个 host。默认是 localhost。如果你希望服务器外部可访问 0.0.0.0
  port: 8080, // 端口
  open: true, // 是否打开浏览器
  overlay: {  // 出现错误或者警告的时候，是否覆盖页面线上错误消息。
    warnings: true,
    errors: true
  },
  publicPath: '/', // 此路径下的打包文件可在浏览器中访问。
  proxy: {  // 设置代理
    "/api": {  // 访问api开头的请求，会跳转到  下面的target配置
      target: "http://192.168.0.102:8080",
      pathRewrite: {"^/api" : "/mockjsdata/5/api"}
    }
  },
  quiet: true, // necessary for FriendlyErrorsPlugin. 启用 quiet 后，除了初始启动信息之外的任何内容都不会被打印到控制台。这也意味着来自 webpack 的错误或警告在控制台不可见。
  watchOptions: { // 监视文件相关的控制选项
    poll: true,   // webpack 使用文件系统(file system)获取文件改动的通知。在某些情况下，不会正常工作。例如，当使用 Network File System (NFS) 时。Vagrant 也有很多问题。在这些情况下，请使用轮询. poll: true。当然 poll也可以设置成毫秒数，比如：  poll: 1000
    ignored: /node_modules/, // 忽略监控的文件夹，正则
    aggregateTimeout: 300 // 默认值，当第一个文件更改，会在重新构建前增加延迟
  }
}
```

```json
"scripts": {
    "build": "webpack --config config/webpack.prod.js",
    "start": "webpack-dev-server --config config/webpack.dev.js", 
 }
```


