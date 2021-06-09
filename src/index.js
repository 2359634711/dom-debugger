import {hot} from "react-hot-loader";

import React from "react";
import ReactDOM from "react-dom";
import App from "./App.js";

let root = document.getElementById('zIndex-comput');
if (!root) {
    root = document.createElement('div');
    document.body.appendChild(root);
    root.id = 'zIndex-comput';
}

ReactDOM.render(<App />, root);

export default hot(module)(App);

