let inputs = [];
function watermark(node, usebool, str) {
    this.domPoint = node;
    this.weBool = usebool;
    this.hint = str;
}
function start_watermark() {
    inputs = [];
    let i;
    let nodes = document.getElementsByTagName("INPUT");
    for (i = 0; i < nodes.length; i++) {
        if (nodes[i].type == "text" && isNaN(nodes[i].value)) {
            inputs.push(new watermark(nodes[i],true,nodes[i].value));
            nodes[i].style.color = "#aaa";
        }
    }
}
$(document).ready(function(){
	window.addEventListener("load", start_watermark(), false);
});

function focusFn(node) {
    for (i = 0; i < inputs.length; i++) {
        if (inputs[i].domPoint == node) {
            if (node.value == inputs[i].hint && inputs[i].weBool == true) {
                node.value = "";
                node.style.color = "Black";
            }
        }
    }
}
function blurFn(node) {
    for (i = 0; i < inputs.length; i++) {
        if (inputs[i].domPoint == node) {
            if (node.value == "") {
                node.style.color = "#aaa";
                node.value = inputs[i].hint;
                inputs[i].weBool = true;
            } else {
                node.style.color = "Black";
                inputs[i].weBool = false;
            }
        }
    }
}
