
# 从零启动一个Webpack2+React的开发栈

## 首先安装node.js

[https://nodejs.org/](https://nodejs.org/)

## 一切从npm init开始

在某个文件夹，运行`npm init`命令，它会问你几个问题，例如项目名字，项目版本号，项目的git repo，
然后它会生成一个最简单的项目————只有一个`package.json`文件。

这个文件描述了你的项目的基本情况，项目依赖什么其他组件，这也是别人能复用你的项目的最根本所在。

## webpack是什么

`webpack`是一个前端打包程序，它可以把前端JavaScript程序、CSS样式、JSON文件，
甚至图片、字体等一切资源，打包为更少量的`JS`文件，这样方便了前端项目的管理。
正如`webpack`的首页图片一样：

![https://webpack.github.io/assets/what-is-webpack.png](https://webpack.github.io/assets/what-is-webpack.png)

然后我们安装`webpack`，它会自动安装在当前目录的`node_modules`目录中：

```Bash
npm i --save-dev webpack webpack-dev-server
```

*现在的webpack2已经是稳定版本，上面的命令应该会安装最新的webpack2.x*

其中`npm i`是`npm install`的简写，而`--save-dev`命令会让你后面安装的依赖，
自动帮助你写入`package.json`里面去。(这条命令执行之后可以看看`package.json`文件，
    对了一个叫做`devDependencies`的属性，它记录了这个项目的依赖和版本)

## webpack的配置

webpack必须有一个用来设置的json文件，参考[官方文档](https://webpack.js.org/configuration/)

一个最简单的webpack配置文件是这样的：

```JavaScript
var path = require("path");

module.exports = {
    entry: "./app/index.js",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist")
    }
};
```

其中`entry`是程序的“入口”文件，就如同C语言的`main`函数所在的文件一样，入口也可以有多个。
`webpack`会自动解析入口文件中调用的依赖，你在入口文件中用`requrie`（Node）或者`import`（ES2015）
加载任何依赖的时候，最终`webpack`都会将他们打包在一起。

`output`是指定一个或多个“输出”文件，每个入口都对应一个输出文件。  
`webpack`最基本的作用，就是将入口文件和入口文件的依赖，编译成一个唯一的输出文件。
这样无论我们写多个源文件，最终都只会得到一个输出文件，极大地方便前端项目的模块化管理。

我们将它保存为`webpack.config.js`到项目目录。

`webpack`可以做到：

* 自动计算JS、CSS等文件之间的依赖
* 自动压缩JS、CSS文件（minify）
* 自动打包、加载你所调用的第三方库
* 让你在浏览器中调用 Node/Bower 才有的组件

然后我们运行下面的命令，调用`webpack`的`cli`工具（命令行工具），指定好配置文件所在的位置，
就可以将入口文件编译到输出文件的路径上了。（这里是`dist/bundle.js`）
```Bash
./node_modules/webpack/bin/webpack.js --config webpack.config.js
```

## 测试服务器

我们还需要一个测试服务器来，让我们能在浏览器中看到前端代码的运行效果，`webpack-dev-server`模块提供了这样的功能。

并且它还支持热加载，也就是动态修改源代码的时候，浏览器也会动态的刷新。

首先我们的前端需要一个网页端的入口，让我们写一个最简单的HTML文件：

```HTML
<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
</head>
<body>
    <script src="bundle.js"></script>
</body>
</html>
```

这个html文件的唯一作用，就是可以加载我们的`bundle.js`

然后我们给`webpack.config.js`加入一个devServer属性：

```JavaScript
var path = require("path");

module.exports = {
    entry: "./app/index.js",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist")
    },
    devServer: {
        contentBase: path.resolve(__dirname, "./dist"),
    },
};
```

`devServer`属性指定了前端项目的启动目录（这里是`./dist`）。然后我们运行命令：

```Bash
./node_modules/webpack-dev-server/bin/webpack-dev-server.js --config webpack.config.js
```

它就会在`8080`端口构建一个服务，这个时候我们访问本地地址
[http://127.0.0.1:8080](http://127.0.0.1:8080)

就能看到`index.html`的内容了。

我们修改`app/index.js`的入口文件的内容，浏览器也会自动刷新，展现我们的修改。

## 安装babel

`babel`是一个代码转换器，或者说是一个“编译器”，
他可以将一些浏览器不支持的代码，转换为浏览器能支持的代码。

为了让`webpack`能自动对代码进行一些处理，我们需要安装一些`loader`，
这些组件会帮助我们对不同文件进行转换。

首先我们安装`babel`的依赖和它的`loader`：

```Bash
npm i babel-loader babel-core babel-preset-es2015
```

然后在`webpack.config.js`中设置`babel`，就是下面代码中的`module`属性。

```JavaScript
var path = require("path");

module.exports = {
    entry: "./app/index.js",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist")
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: "babel-loader",
                    exclude: /node_modules/,
                    options: {
                        presets: ["es2015"]
                    },
                },
            },
        ],
    },
    devServer: {
        contentBase: path.resolve(__dirname, "./dist"),
    },
};
```

上面的正则表达式`test: /\.js$/`，代表是文件名以`.js`结尾的文件，就要经过babel转换。  
`presets: ["es2015"]`是`babel`的一个选项，告诉它我们要使用`ES2015`插件。

这样我们重启`webpack-dev-server`之后，
就可以在`app/index.js`中添加一些只有`es2015`支持的代码了。
（经过`babel`的编译，不支持`es2015`特性的浏览器也可以运行）

例如：

```JavaScript
// es2015 code
const arr = ["a", "b", "c"];
for (const a of arr) {
    console.log(a);
}
```

## 开始react

`react`代码本身也是无法直接被浏览器运行的，不过它可以通过`babel`进行编译，
转换为浏览器可以运行的代码。我们安装如下的`react`依赖：

```Bash
npm i babel-preset-react react react-dom --save-dev
```

然后修改`webpack.config.js`里面babel的部分，让它支持`react`：

把`presets: ["es2015"]`修改为`presets: ["es2015", "react"]`

然后在`app/index.js`里面就可以写一些`react`代码了，例如：

```JavaScript
import React from "react";
import ReactDOM from "react-dom";

ReactDOM.render(
    <h1>Hello, world!</h1>,
    document.getElementById("root")
);
```

这个代码的意思是，我们在html页面里，一个`id`为`root`的容器中，
渲染`react`组件`<h1>Hello, world!</h1>`

这个`id`为`root`的对象，我们可以直接手工写入到html文件中，把html的body修改为：

```HTML
<div id="root"></div>
<script src="bundle.js"></script>
```

注意这里`<script src="bundle.js"></script>`要在`<div id="root"></div>`之下的，
也就是让浏览器先渲染出root，然后再执行我们的代码。

更多内容可以参考React的
[官方tutorial](https://facebook.github.io/react/tutorial/tutorial.html)

在多文件的时候，`webpack`可以指定多个入口

## 多入口文件

```JavaScript
var path = require("path");

module.exports = {
    context: path.resolve(__dirname, "./src"),
    entry: {
        app: ["./home.js", "./events.js", "./vendor.js"],
    },
    output: {
        path: path.resolve(__dirname, "./dist"),
        filename: "[name].bundle.js",
    },
};
```

`entry`中的多个入口会分别转换为不同的输出文件。

## 全局访问

一个很常用的库是`lodash`，提供各种扩展JavaScript能力的功能，我们要在`webpack`中加载它
并且让它能被全局访问，我们可以在`webpack.config.js`加入如下内容：

```JavaScript
module.exports = {
    plugins: [
        new webpack.ProvidePlugin({
            "_": "lodash",
        }),
    ],
    // ...
}
```

这个插件就是加载`lodash`，并给它一个`_`的别名，让全局都能访问到`_`这个变量。

## 载入CSS

要让`webpack`支持`CSS`文件，首先要安装两个关于`CSS`的`loader`：

```Bash
npm i style-loader css-loader --save-dev
```

然后修改`webpack.config.js`

```JavaScript
module.exports = {
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    "style-loader",
                    "css-loader"
                ],
            },
            // ...
        ],
    },
    // ...
};
```

`use: ["style-loader", "css-loader"]`这条语句会让`webpack`对`CSS`文件先使用
`css-loader`，然后使用`style-loader`。

我们可以写一个`app/app.css`文件如下：

```CSS
body {
    background-color: #ccc;
}
```
然后就可以在`app/index.js`中加载它

```JavaScript
import "./app.css";
```

## SASS

`SASS`是建立在`CSS`之上的语言，关系就好像`React`和`JavaScript`一样。
我们安装它所需的`loader`：

```Bash
npm i sass-loader node-sass --save-dev
```

然后修改`webpack.config.js`

```JavaScript
module.exports = {
    module: {
        rules: [
            {
                test: /\.(sass|scss)$/,
                use: [
                    "style-loader",
                    "css-loader",
                    "sass-loader",
                ]
            },
            // ...
        ],
    },
    // ...
};
```

我们可以写一个`app/app.scss`文件如下：

```SCSS
body {
    $bgcolor: #333;
    background-color: $bgcolor;
}
```
然后就可以在`app/index.js`中加载它

```JavaScript
import "./app.scss";
```

## webpack简化了模块管理

在~上古时代~，我们的`JavaScript`入口可能只有一个，它可能是一个300KB，数千行代码的文件

```
└── app/
    └── all_bad_things.js   // 一个300KB，数千行代码的文件
```

有了`webpack`之后，我们的文档结构可以是：

```
└── app/
    ├── components/
    │   ├── button.js
    │   ├── calendar.js
    │   ├── comment.js
    │   ├── modal.js
    │   ├── tab.js
    │   ├── timer.js
    │   ├── video.js
    │   └── wysiwyg.js
    │
    └── index.js  // ~ 1KB 的代码，其他东西都可以从components中import模块
```

这样我们就把一个很难维护的文件，分化为很多个不同的模块，入口文件仅仅需要调用这些模块就可以了。
这样整体的项目结构更清晰，更便于修改和维护。


## 文章部分内容改编自

https://blog.madewithenvy.com/getting-started-with-webpack-2-ed2b86c68783#.5csvakdmc
