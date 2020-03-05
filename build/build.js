var levelwidth = 32;
var levelheight = 18;
const levelblocks = levelwidth * levelheight;
const WEBPAGE = "5beam-edit/";
var gridsize = 25;
var blocknodes = Create2DArray(levelwidth);
var itemlist = [
    [".", "Air", "General"],
    ["/", "Slash", "General"],
    ["7", "7", "General"],
    ["1", "1", "General"],
    ["4", "4", "General"],
    [":", "WT", "General"],
    ["5", "5", "Deco"],
    ["8", "8", "General"],
    ["9", "9", "General"],
    [";", ";", "General"],
    ["<", "left", "General"],
    [">", "right", "General"],
    ["📘", "Book", "Entity"],
    ["🔥", "Match", "Entity"],
];
var itemsusing = [];
for (let i = 0; i < itemlist.length; i++) {
    itemsusing[i] = itemlist[i][0];
}
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
var toollist = [
    ["F", "Fill"],
    ["B", "Brush",]
];
var entitylist = [["Book", "01", "char"],
    ["Match", "04", "char"]];
var currententitys = [];
var startpoint;
var toolbutton = [];
var itembutton = [];
var real_time_render = false;
function Create2DArray(rows) {
    var arr = [];
    for (let i = 0; i < rows; i++) {
        arr[i] = [];
    }
    return arr;
}
function pad2(number) {
    return (number < 10 ? '0' : '') + number;
}
class BlockNode {
    constructor(ninfo) { }
}
function preload() {
    for (let i = 1; i < itemlist.length; i++) {
        images[i] = loadImage("../" + WEBPAGE + "img/" + itemlist[i][1] + ".png");
    }
    for (let i = 0; i < deco.length; i++) {
        for (let j = 0; j < deco[i].length; j++) {
            if (deco[i][j] == undefined) {
                return;
            }
            decoimg[i][j] = loadImage("../" + WEBPAGE + "img/deco/outline_" + deco[i][j] + ".png");
        }
    }
}
function setup() {
    startpoint = 50;
    frameRate(24);
    textSize(12 + windowWidth / 100);
    resizeCanvas(gridsize * levelwidth, startpoint + gridsize * levelheight);
    tooliconbar();
    itemiconbar();
    for (let i = 0; i < levelwidth; i++) {
        for (let j = 0; j < levelheight; j++) {
            blocknodes[i][j] = {
                block: ".",
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
    resizeCanvas(gridsize * levelwidth, startpoint + gridsize * levelheight);
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
    for (let i = 0; i < toolbutton.length; i++) {
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
    switch (keyCode) {
        case 76:
            tool = ["L", "Line (WIP)"];
            break;
        case 82:
            tool = ["R", "Replace"];
            break;
        case 70:
            tool = ["F", "Fill"];
            break;
        case 66:
            tool = ["B", "Brush"];
            break;
        case 79:
            printLevel();
            break;
        case 190:
            currentitem = itemlist[0][0];
            break;
        case 68:
            currententitys = [];
        case 27:
            tool = null;
            break;
    }
}
function printLevel() {
    let level = "loadedLevels=\n";
    let entitys = 0;
    let bufferentity = "";
    for (let i = 0; i < levelheight; i++) {
        for (let j = 0; j < levelwidth; j++) {
            if (blocknodes[j][i].block == "📘" || blocknodes[j][i].block == "🔥") {
                entitys++;
                if (blocknodes[j][i].block == "📘") {
                    bufferentity += "01," + pad2(j) + ".00," + pad2(i) + ".00,10";
                }
                if (blocknodes[j][i].block == "🔥") {
                    bufferentity += "03," + pad2(j) + ".00," + pad2(i) + ".00,10";
                }
                bufferentity += "\n";
            }
        }
    }
    level += "Your Created Level\n" + levelwidth + "," + levelheight + "," + pad2(entitys) + ",01," + "L\n";
    for (let i = 0; i < levelheight; i++) {
        for (let j = 0; j < levelwidth; j++) {
            if (blocknodes[j][i].block == "📘" || blocknodes[j][i].block == "🔥") {
                level += ".";
            }
            else if (blocknodes[j][i].block) {
                level += blocknodes[j][i].block;
            }
            else {
                level += ".";
            }
        }
        level += "\n";
    }
    level += bufferentity;
    level += "00\n000000\n";
    console.log(level);
    if (!entitys) {
        console.warn("There are no entities in the level, are you sure you dont want to add any?");
    }
    if (entitys > 99) {
        console.warn("99 is the most entites you can have in a 5b level.");
    }
}
function updateGrid() {
    for (let i = 0; i < levelwidth; i++) {
        for (let j = 0; j < levelheight; j++) {
            let cool = itemsusing.findIndex(c => c === blocknodes[i][j].block);
            if (cool == 0) {
                rect(i * gridsize, startpoint + j * gridsize, gridsize, gridsize);
            }
            else {
                displayBlock(images[cool], i, j);
            }
        }
    }
}
function displayBlock(p5image, i, j) {
    image(p5image, i * gridsize, startpoint + j * gridsize, gridsize, gridsize);
}
function tooliconbar() {
    let tooldiv = createDiv();
    tooldiv.id("tidiv");
    for (let i = 0; i < toollist.length; i++) {
        let tlb = toolbutton[i];
        tlb = createButton("[" + toollist[i][0] + "] " + toollist[i][1] + " Tool");
        tlb.mousePressed(function () { tool = toollist[i]; });
        tlb.class("toolicon");
        tlb.parent(tooldiv);
    }
}
function itemiconbar() {
    let itemdiv = createDiv();
    itemdiv.id("idiv");
    for (let i = 0; i < itemlist.length; i++) {
        let ilb = itembutton[i];
        ilb = createButton("[" + itemlist[i][0] + "] " + itemlist[i][1]);
        ilb.mousePressed(function () {
            currentitem = itemlist[i][0];
        });
        ilb.class("itemicon");
        ilb.parent(itemdiv);
        if (i) {
            ilb.style("background-image", "url(" + "../" + WEBPAGE + "img/" + itemlist[i][1] + ".png" + ")");
        }
        if (itemlist[i][2] == "Entity") {
            ilb.style("background-color", "#a78b65");
        }
    }
}
function checkTool(toolkey) {
    if (tool != null && tool[0] == toolkey) {
        return true;
    }
}
function getClickBN() {
    let smouseY = mouseY - startpoint;
    if (Math.floor(mouseX / gridsize) >= levelwidth || Math.floor(smouseY / gridsize) < 0) {
        return null;
    }
    if (smouseY > gridsize * levelheight - 1) {
        return null;
    }
    return [Math.floor(mouseX / gridsize), Math.floor(smouseY / gridsize)];
}
function lineTool(item, sx1, sy1, sx2, sy2) {
    let dx = sx2 - sx1;
    let dy = sy2 - sy1;
    let y = Math.max(sy1, sy2);
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
    if (blocknodes[startx][starty].block === item) {
        return;
    }
    if (blocknodes[startx][starty].block !== fillon) {
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