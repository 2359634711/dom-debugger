
let id = 0;

let selectMap = {};
window.selectMap = selectMap;
// let topSortedList = [];
let zIndex = 99999999;
// function parseTop() {
//     let selectList = [];
//     for (let key in selectMap) {
//         selectList.push(selectMap[key]);
//     }
    // let top = 0;
    // topSortedList = selectList
    //     .filter(v => v.pos)
    //     .sort((a, b) => a.pos.top - b.pos.top)
    //     .map(v => {
    //         return (v.textTop = v.pos.top > top
    //                 ? (top = v.pos.top, 0)
    //                 : top - v.pos.top, v);
    //     });
// };

function Select() {
    this.currentSelectWrapDom = document.createElement('div');
    this.currentSelectWrapDom.className = '_____select-wrap';
    this.id = id++;
    document.body.appendChild(this.currentSelectWrapDom);
    this.snappshot = {
        style: {}
    };
    selectMap[this.id] = {
        selectWrapDom: this.currentSelectWrapDom
    };
};

Select.prototype.domSelect = function(currentActiveDom, options) {
    this.rollBack();
    if (!currentActiveDom || !currentActiveDom.getBoundingClientRect) {
        return;
    }
    let rect = currentActiveDom.getBoundingClientRect();
    let bodyRect = document.body.getBoundingClientRect();
    let {style, showMask, text = ''} = options;
    let pos = {
        top: rect.y - bodyRect.y,
        left: rect.x - bodyRect.x,
        width: rect.width,
        height: rect.height
    };
    selectMap[this.id].targetDom = currentActiveDom;
    selectMap[this.id].pos = pos;
    // parseTop();
    style = {
        ...(showMask && {
            position: 'absolute',
            ...{
                top: `${pos.top}px`,
                left: `${pos.left}px`,
                width: `${pos.width}px`,
                height: `${pos.height}px`
            },
            zIndex: (++zIndex > (999999999) && (zIndex = 99999999, zIndex) || zIndex),
            boxSizing: 'border-box',
            pointerEvents: 'none'
            // paddingTop: `${selectMap[this.id].textTop}px`
        }),
        ...style
    };
    this.currentSelectWrapDom.innerHTML = text;
    for (let key in style) {
        this.snappshot.style[key] = this.currentSelectWrapDom.style[key];
        this.currentSelectWrapDom.style[key] = style[key];
    }
}

Select.prototype.rollBack = function() {
    let {style: snappStyle} = this.snappshot;
    for (let key in snappStyle) {
        this.currentSelectWrapDom.style[key] = snappStyle[key];
    }
    selectMap[this.id] = {
        textTop: 0
    }
}

Select.prototype.destroy = function() {
    try {
        document.body.removeChild(this.currentSelectWrapDom);
        delete selectMap[this.id];
    }
    catch (e) {};
};

export default Select;
