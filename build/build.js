var levelwidth = 32;
var levelheight = 18;
var gridsize = 25;
var blocknodes = Create2DArray(levelwidth);
var itemlist = [
    ["", "Air", "General"],
    ["/", "Slash", "General"],
    ["7", "7", "General"],
    ["1", "1", "General"],
    ["4", "4", "General"],
    [":", "WT", "General"],
];
var settings = false;
var images = [];
var deco = [
    [
        "1sides0",
        "1sides1",
        "1sides2",
        "1sides3"
    ],
    [
        "2sides0",
        "2sides1",
        "2sides2",
        "2sides3"
    ],
    [
        "3sides0",
        "3sides1",
        "3sides2",
        "3sides3"
    ],
    [
        "4sides"
    ],
    [
        "corner0",
        "corner1",
        "corner2",
        "corner3"
    ],
    [
        "line1",
        "line2"
    ]
];
var decoimg = [[], [], [], [], [], []];
var tool = null;
var currentitem = itemlist[1][0];
var toollist = [["L", "Line (WIP)"],
    ["R", "Replace"],
    ["F", "Fill"],
    ["B", "Brush",]];
var startpoint;
var toolbutton = [];
var itembutton = [];
function Create2DArray(rows) {
    var arr = [];
    for (var i = 0; i < rows; i++) {
        arr[i] = [];
    }
    return arr;
}
var BlockNode = (function () {
    function BlockNode(ninfo) {
    }
    return BlockNode;
}());
function preload() {
    for (var i = 1; i < itemlist.length; i++) {
        images[i] = loadImage("../5beam-edit/img/" + itemlist[i][1] + ".png");
    }
    for (var i = 0; i < deco.length; i++) {
        for (var j = 0; j < deco[i].length; j++) {
            if (deco[i][j] == undefined) {
                return;
            }
            decoimg[i][j] = loadImage("../5beam-edit/img/deco/outline_" + deco[i][j] + ".png");
        }
    }
}
function setup() {
    startpoint = 50;
    frameRate(24);
    textSize(12 + windowWidth / 100);
    resizeCanvas(gridsize * levelwidth, gridsize * levelheight);
    tooliconbar();
    itemiconbar();
    for (var i = 0; i < levelwidth; i++) {
        for (var j = 0; j < levelheight; j++) {
            blocknodes[i][j] = {
                block: "",
                x: i,
                y: j
            };
        }
    }
}
function draw() {
    clear();
    var blockpoint = getClickBN();
    fill(128);
    strokeWeight(1);
    if (!settings) {
        updateGrid();
        if (tool != null) {
            infoText("You have pressed " + tool[0] + " (" + tool[1] + " Tool) Press ESC to exit.");
        }
        fill("rgba(0,0,255, 0.25)");
        if (blockpoint != null) {
            rect(blockpoint[0] * gridsize, startpoint + blockpoint[1] * gridsize, gridsize, gridsize);
            if (checkTool("B")) {
                rect(blockpoint[0] * gridsize + gridsize, startpoint + blockpoint[1] * gridsize, gridsize, gridsize);
                rect(blockpoint[0] * gridsize - gridsize, startpoint + blockpoint[1] * gridsize, gridsize, gridsize);
                rect(blockpoint[0] * gridsize, startpoint + blockpoint[1] * gridsize + gridsize, gridsize, gridsize);
                rect(blockpoint[0] * gridsize, startpoint + blockpoint[1] * gridsize - gridsize, gridsize, gridsize);
            }
        }
    }
}
function windowResized() {
    textSize(12 + windowWidth / 100);
    resizeCanvas(gridsize * levelwidth, gridsize * levelheight);
    draw();
    removeElements();
    tooliconbar();
    itemiconbar();
}
function mouseClicked() {
    var blockpoint = getClickBN();
    if (blockpoint != null) {
        if (checkTool("F")) {
            fillTool(currentitem, blockpoint[0], blockpoint[1], blocknodes[blockpoint[0]][blockpoint[1]].block);
            return;
        }
        if (checkTool("B")) {
            brushTool(currentitem, blockpoint[0], blockpoint[1]);
            return;
        }
        if (mouseButton === LEFT) {
            blocknodes[blockpoint[0]][blockpoint[1]].block = currentitem;
        }
    }
    for (var i = 0; i < toolbutton.length; i++) {
        if (toolbutton[i].isPressed) {
            tool = toollist[i];
        }
    }
}
function mouseDragged() {
    redraw();
    mouseClicked();
}
function infoText(textstring, color) {
    if (color) {
        fill(color);
    }
    else {
        fill(0);
    }
    fill('rgba(0,0,0, 0.25)');
    rect(0, 0, windowWidth, 26 + windowWidth / 150);
    fill(255);
    text(textstring, 5, (26 + windowWidth / 150) / 1.375);
}
function keyPressed() {
    if (keyCode === 76) {
        tool = ["L", "Line (WIP)"];
    }
    if (keyCode === 82) {
        tool = ["R", "Replace"];
    }
    if (keyCode === 70) {
        tool = ["F", "Fill"];
    }
    if (keyCode === 66) {
        tool = ["B", "Brush"];
    }
    if (keyCode === 79) {
        var level = "loadedLevels=\n";
        level += "Your Created Level\n" + levelwidth + "," + levelheight + ",01,00,L\n";
        for (var i = 0; i < levelheight; i++) {
            for (var j = 0; j < levelwidth; j++) {
                if (blocknodes[j][i].block) {
                    level += blocknodes[j][i].block;
                }
                else {
                    level += ".";
                }
            }
            level += "\n";
        }
        level += "01,02.00,15.00,10\n00\n000000\n";
        console.log(level);
    }
    if (keyCode === 27) {
        tool = null;
    }
}
function updateGrid() {
    for (var i = 0; i < levelwidth; i++) {
        for (var j = 0; j < levelheight; j++) {
            fill(128);
            checkItem(i, j);
        }
    }
}
function checkItem(i, j) {
    for (var x = 1; x < itemlist.length; x++) {
        if (blocknodes[i][j].block == itemlist[x][0]) {
            image(images[x], i * gridsize, startpoint + j * gridsize, gridsize, gridsize);
            return;
        }
        else {
            rect(i * gridsize, startpoint + j * gridsize, gridsize, gridsize);
        }
    }
}
function tooliconbar() {
    var tooldiv = createDiv();
    tooldiv.id("tidiv");
    var _loop_1 = function (i) {
        var tlb = toolbutton[i];
        tlb = createButton("[" + toollist[i][0] + "] " + toollist[i][1] + " Tool");
        tlb.mousePressed(function () { tool = toollist[i]; });
        tlb.class("toolicon");
        tlb.parent(tooldiv);
    };
    for (var i = 0; i < toollist.length; i++) {
        _loop_1(i);
    }
}
function itemiconbar() {
    var itemdiv = createDiv();
    itemdiv.id("idiv");
    var _loop_2 = function (i) {
        var ilb = itembutton[i];
        ilb = createButton("[" + itemlist[i][0] + "] " + itemlist[i][1]);
        ilb.mousePressed(function () { currentitem = itemlist[i][0]; });
        ilb.class("itemicon");
        ilb.parent(itemdiv);
    };
    for (var i = 0; i < itemlist.length; i++) {
        _loop_2(i);
    }
}
function checkTool(toolkey) {
    if (tool != null && tool[0] == toolkey) {
        return true;
    }
}
function getClickBN() {
    var smouseY = mouseY - startpoint;
    if (Math.floor(mouseX / gridsize) >= levelwidth || Math.floor(smouseY / gridsize) < 0) {
        return null;
    }
    if (smouseY > gridsize * levelheight - 1) {
        return null;
    }
    return [Math.floor(mouseX / gridsize), Math.floor(smouseY / gridsize)];
}
function lineTool(item, sx1, sy1, sx2, sy2) {
    var dx = sx2 - sx1;
    var dy = sy2 - sy1;
    var y = Math.max(sy1, sy2);
    for (var x = sx1; x < sx2; x += 0.5) {
        y = sy1 + dy * (x - sy1) / dx;
        blocknodes[Math.round(x)][Math.round(y)].block = "Red";
        console.log(x, Math.ceil(y));
    }
}
function fillTool(item, startx, starty, fillon) {
    if (startx == levelwidth || starty == levelheight) {
        return;
    }
    if (startx < 0 || starty < 0) {
        return;
    }
    if (blocknodes[startx][starty].block == item) {
        return;
    }
    if (blocknodes[startx][starty].block != fillon) {
        return;
    }
    blocknodes[startx][starty].block = item;
    fillTool(item, startx + 1, starty, fillon);
    fillTool(item, startx - 1, starty, fillon);
    fillTool(item, startx, starty + 1, fillon);
    fillTool(item, startx, starty - 1, fillon);
    return;
}
function brushTool(item, startx, starty) {
    blocknodes[startx][starty].block = item;
    if (startx + 1 != levelwidth && startx + 1 != -1) {
        blocknodes[startx + 1][starty].block = item;
    }
    if (startx - 1 != levelwidth && startx - 1 != -1) {
        blocknodes[startx - 1][starty].block = item;
    }
    if (starty + 1 != levelheight && starty + 1 != -1) {
        blocknodes[startx][starty + 1].block = item;
    }
    if (starty - 1 != levelheight && starty - 1 != -1) {
        blocknodes[startx][starty - 1].block = item;
    }
}
function selectTool() {
}
//# sourceMappingURL=build.js.map