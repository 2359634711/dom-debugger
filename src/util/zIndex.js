
function getZindex(dom) {
    let zIndex = window.getComputedStyle(dom).zIndex;
    return zIndex;
}

function getChildren(dom) {
    return (dom || {}).children || [];
}

function parseNode(node = document.body) {
    let zIndex = getZindex(node);
    let children = Array.from(getChildren(node)).map(parseNode);
    return {
        classList: Array.from(node.classList),
        children,
        tagName: node.tagName,
        zIndex,
        node
    };
}

function getTreeRoot(tree, node) {
    if (!tree) {
        return null;
    }
    if (tree.node === node) {
        return tree;
    }
    return (tree.children || []).find(v => getTreeRoot(v, node)) || null;
}

// 获取某一层的 z-index
function getLayerZIndexList(tree = {}, node, root = getTreeRoot(tree, node)) {
    if (!root) {
        return [null];
    }
    let currentZindex = root.zIndex;
    if (currentZindex === 'auto' || node) {
        return (root.children || []).reduce((chain, v) => {
            return [
                ...chain,
                ...getLayerZIndexList(tree, null, v)
            ];
        }, []);
    }
    return [root];
}

function getBaseLayer(tree = {}, node, options) {
    // [parent, son]
    // showSelf true 的话算自己
    // false 不算自己
    // 仅在当前层为 非 static 有效
    let {showSelf} = options;
    if (!tree || !tree.node) {
        return [];
    }
    let res = [];
    let recursion = (root = tree) => {
        // 递归深度优先遍历
        if (root.node === node) {
            return [root, ...(root.zIndex !== 'auto' && showSelf && [root] || [])];
        }
        else {
            let child = (root.children || []).map(recursion).find(v => v.length > 0);
            if (child) {
                if (root.zIndex !== 'auto') {
                    return [root, ...child];
                }
                else {
                    return child;
                }
            }
        }
        return [];
    };
    return [tree, ...recursion()];
}
// // 获取相对层 index
// function getRelativeZindex(nodeTree, target, base = document.body) {
//     if (!nodeTree || nodeTree.node) {
//         return;
//     }
//     let {children} = nodeTree;
//     (children || []).map(getRelativeZindex);
// };

export {
    getTreeRoot,
    getLayerZIndexList,
    parseNode,
    getBaseLayer
    // getRelativeZindex
};
