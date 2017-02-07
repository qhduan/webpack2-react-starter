/**
 * Entry file
 */

console.log("webpack2-react-starter GREEN");

// ES2015才能支持的代码
const arr = ["a", "b", "c"];
for (const a of arr) {
    console.log(a);
}

// React代码
import React from "react";
import ReactDOM from "react-dom";

ReactDOM.render(
    <h1>Hello, world!</h1>,
    document.getElementById("root")
);

// Lodash
console.log("lodash", _.isString(""));

// 加载CSS
// import "./app.css";

// 加载SASS
import "./app.scss";
