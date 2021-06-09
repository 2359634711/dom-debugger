import React, { Component} from "react";
import "./App.styl";
import {parseNode, getLayerZIndexList, getTreeRoot, getBaseLayer} from './util/zIndex';
import Select from './util/domSelect';
import className from 'classnames';

class App extends Component{
    constructor(props) {
        super(props);
        this.state = {
            isOpen: true,
            isHide: false,
            hoverOpen: true, // hover 效果是否开启
            scrollOpen: true, // 滚动时展示层级关系
            showSelfClear: () => {}, // 展示自己的退出函数
            showLayerClear: () => {}, // 展示层的退出函数
            nodeTree: {},
            currentNode: {
                dom: {},
                classList: []
            },
            currentBaseNode: {
                dom: {},
                classList: []
            },
            baseLayerList: [],
            baseLayerNode: {},
            zIndexNodeList: [],
            selector: '#app'
        };
        this.nodeTree = {};
    }
    componentDidMount() {
        window.toggleZindexDebugger = open => this.setState({
            isOpen: open
        });
        console.log('开启 zIndexDebugger：toggleZindexDebugger(true);');
        console.log('关闭 zIndexDebugger：toggleZindexDebugger(false);');
        this.showSelfInit();
        this.showLayerInit();
    }
    showSelfInit() {
        let currentSelecter = new Select();
        let baseLayerSelecter = new Select();
        let prevDom = null;
        let currentNode = {};
        let baseLayerList = {};
        let baseLayerNode = {};
        let nodeTree = {};
        let onAction = e => {
            try {
                if (!this.state.hoverOpen) {
                    currentSelecter.rollBack();
                    baseLayerSelecter.rollBack();
                    return;
                }
                nodeTree = parseNode();
                let dom = e.target;
                if (dom === document) {
                    dom = prevDom;
                }
                else {
                    prevDom = dom;
                }
                if (!dom) {
                    return;
                }
                baseLayerList = getBaseLayer(nodeTree, dom, {
                    showSelf: true
                });
                currentSelecter.domSelect(dom, {
                    style: {
                        border: '1px solid red'
                    },
                    showMask: true
                });
                currentNode = {
                    dom,
                    classList: Array.from(dom.classList)
                };
                while (baseLayerList.length > 0 && baseLayerList.shift().node !== document.querySelector(this.state.selector)) {
                }
                if (baseLayerList.length > 1) {
                    baseLayerNode = baseLayerList?.[0] || {};
                }
                else {
                    baseLayerNode = {};
                }
                baseLayerSelecter.domSelect(baseLayerNode.node, {
                    showMask: true,
                    text: `class:.${(baseLayerNode.classList || []).join('.')}<br/>z-index:${baseLayerNode.zIndex}`,
                    style: {
                        backgroundColor: 'rgba(0, 123, 255, 1)',
                        color: '#000'
                    }
                });
                this.setState({
                    currentNode,
                    baseLayerList,
                    baseLayerNode,
                    nodeTree
                });
            }
            catch (e) {
                console.log(e);
            }
            
        };
        document.addEventListener('mouseover', onAction);
        document.addEventListener('scroll', onAction);
        this.setState({
            showSelfInit: () => {
                currentSelecter.destroy();
                baseLayerSelecter.destroy();
                document.removeEventListener('mouseover', onAction);
                document.removeEventListener('scroll', onAction);
            }
        });
    }
    showLayerInit() {
        // let currentSelecter = new Select();
        // let baseLayerSelecter = new Select();
        let zIndexNodeSelecterList = [];
        let colorList = [];
        let lock = false;
        let onAction = () => {
            try {
                if (!this.state.scrollOpen) {
                    zIndexNodeSelecterList.map(v => v.destroy());
                    return;
                }
                if (lock) {
                    return;
                }
                lock = true;
                let nodeTree = parseNode();
                // document.addEventListener('mouseover', e => {
                    zIndexNodeSelecterList.map(v => v.destroy());
                    zIndexNodeSelecterList = [];
                let dom = document.querySelector(this.state.selector);
                let baseLayerList = getBaseLayer(nodeTree, dom, {
                    showSelf: true,
                    onlyBase: true
                });
                // currentSelecter.domSelect(dom, {
                //     style: {
                //         border: '1px solid red'
                //     },
                //     showMask: true
                // });
                // let currentNode = {
                //     dom,
                //     classList: Array.from(dom.classList)
                // };
                let baseLayerNode = {};
                if (baseLayerList.length > 1) {
                    baseLayerNode = baseLayerList?.[baseLayerList.length - 2] || {};
                }
                else if (baseLayerList.length === 1) {
                    if (baseLayerList[0]?.node === document.body) {
                        baseLayerNode = baseLayerList[0];
                    }
                }
                else {
                    baseLayerNode = {};
                }
                // baseLayerSelecter.domSelect(baseLayerNode.node, {
                //     showMask: true,
                //     style: {
                //         backgroundColor: 'rgba(0, 123, 255, .15)'
                //     }
                // });
                let zIndexNodeList = getLayerZIndexList(nodeTree, true, baseLayerNode);
                colorList = zIndexNodeList.map((v, i) => colorList[i]
                    || `rgba(${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)}, .7)`);
                zIndexNodeSelecterList = zIndexNodeList.map((v, i) => {
                    let rect = v.node.getBoundingClientRect();
                    if (rect.width === 0 || rect.height === 0) {
                        return {
                            destroy: () => {}
                        }
                    }
                    let selecter = new Select();
                    selecter.domSelect(v.node, {
                        showMask: true,
                        text: v.zIndex,
                        style: {
                            backgroundColor: colorList[i]
                            // backgroundColor: 'rgba(0, 0, 0, 1)'
                        }
                    });
                    return selecter;
                });
                this.setState({
                    // currentNode,
                    baseLayerList,
                    baseLayerNode,
                    nodeTree,
                    zIndexNodeList
                });
                setTimeout(() => {
                    lock = false;
                });
            }
            catch (e) {
                console.log(e);
                lock = false;
            }
            
        };
        document.addEventListener('scroll', onAction);
        onAction();
        this.setState({
            showLayerClear: () => {
                zIndexNodeSelecterList.map(v => v.destroy());
                document.removeEventListener('scroll', onAction);
            }
        });
        // });
    }
    handleSelectorChange(e) {
        this.setState({
            selector: e.target.value
        })
    };
    handleToggleHover(isOpen) {
        this.setState({
            hoverOpen: isOpen
        });
        if (isOpen) {
            this.showSelfInit();
        }
        else {
            this.state.showSelfClear();
        }
    };
    handleToggleScroll(isOpen) {
        this.setState({
            scrollOpen: isOpen
        });
        if (isOpen) {
            this.showLayerInit();
        }
        else {
            this.state.showLayerClear();
        }
    };
    render() {
        let {currentNode, baseLayerNode, baseLayerList} = this.state;
        let {classList: currentClassList} = currentNode;
        let {classList: currentBaseClassList} = baseLayerNode;
        // hoverOpen: true, // hover 效果是否开启
        // scrollOpen: true, // 滚动时展示层级关系
        let {hoverOpen, scrollOpen, isOpen} = this.state;
        let wrapClass = className({
            'z-index-wrap': true,
            'z-index-hide-wrap': this.state.isHide
        });
        return(
            <div>
                <div className={wrapClass}>
                    <button onClick={() => this.setState({
                        isHide: !this.state.isHide
                    })}>
                        {this.state.isHide ? '展开' : '隐藏'}
                    </button>
                    目标层selector：<input value={this.state.selector} onChange={e => this.handleSelectorChange(e)} type="text" />
                    <button onClick={() => {
                        let isOpenChanged = !isOpen;
                        this.handleToggleScroll(isOpenChanged);
                        this.handleToggleHover(isOpenChanged);
                        this.setState({
                            isOpen: isOpenChanged
                        });
                    }}>
                        {this.state.isOpen ? '总关闭' : '总开启'}
                    </button>
                    {/** hover 开启 */}
                    <button onClick={() => this.handleToggleHover(!hoverOpen)}>
                        {hoverOpen ? 'hover 效果 关闭' : 'hover 效果 开启'}
                    </button>
                    {/** scroll 开启 */}
                    <button onClick={() => this.handleToggleScroll(!scrollOpen)}>
                        {scrollOpen ? '滚动显示层级 关闭' : '滚动显示层级 开启'}
                    </button>
                </div>
            </div>
        );
    }
}

export default App;