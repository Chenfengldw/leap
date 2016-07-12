var bgNodeCount = 200;

var bgNetwork = null;
var bgNodes = [];
var bgEdges = [];
var hideNode = {
    id: 0,
    color: '#111',
    size: 100,
    borderWidth: 0,
    mass: 15
}

function bgDestory() {
    if (bgNetwork !== null) {
        bgNetwork.destory();
        bgNetwork = null;
    }
}

function bgGenerateNodes(dataSet, count) {
    for (var i = 1; i <= count; i++) {
        var r = Math.floor(Math.random() * 256);
        var g = Math.floor(Math.random() * 256);
        var b = Math.floor(Math.random() * 256);
        dataSet.add({
            id: i,
            //color: 'white', // white color
            color: 'rgb(' + r.toString() + ',' + g.toString() + ',' + b.toString() + ')', // random color
            borderWidth: 0,
            mass: 5
        });
    }
    dataSet.add(hideNode);
}

function bgDraw() {
    bgDestory();

    // create a network
    var container = document.getElementById('backgroundNetwork');

    var nodes = new vis.DataSet(bgNodes);
    var edges = new vis.DataSet(bgEdges);
    bgGenerateNodes(nodes, bgNodeCount);
    var data = {
        nodes: nodes,
        edges: edges
    };
    
    var options = {
        nodes: {
            shape: 'dot',
            size: 10
        }
    };
    bgNetwork = new vis.Network(container, data, options);
}

function bgFocusRandom() {
    var nodeId = Math.floor(Math.random() * bgNodeCount);
    var nodePosition = bgNetwork.getPositions(nodeId);
    var options = {
        scale: Math.random() * 0.4 + 0.1,
        animation: {
            duration: 7500 //ms
        }
    };
    bgNetwork.focus(nodeId, options);
    bgNetwork.moveNode(0,
        nodePosition[nodeId.toString()].x + Math.floor(Math.random() * 4) - 2,
        nodePosition[nodeId.toString()].y + Math.floor(Math.random() * 4) - 2);
}

function bgStartShow() {
    bgFocusRandom();
    setTimeout(bgStartShow, 7500);
}