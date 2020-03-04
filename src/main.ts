var levelwidth = 32;
var levelheight = 18;
const levelblocks = levelwidth*levelheight;
//const WEBPAGE = ""; // for lcoal
const WEBPAGE = "5beam-edit/"; // for web
var gridsize = 25;
var blocknodes = Create2DArray(levelwidth);
var itemlist = [
    // first arg = levels.txt name
    // second arg = the picture name
    // third arg = category
    // fourth arg = rotation (optional)
    [".","Air","General"],
    ["/","Slash","General"],
    ["7","7","General"],
    ["1","1","General"],
    ["4","4","General"],
    [":","WT","General"],
    ["5","5","Deco"],
    ["8","8","General"],
    ["9","9","General"],
    [";",";","General"],
    ["<","left","General"],
    [">","right","General"],
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
]
var decoimg = [[],[],[],[],[],[]]
var tool = null;
var currentitem = itemlist[1][0];
var toollist = [//["L", "Line (WIP)"],
                ["F", "Fill"],
                ["B", "Brush",]];
// default time size (X,Y)
var startpoint: number;
var toolbutton = [];
var itembutton = [];
var real_time_render = false;
/*

Only turn this on if you have a good pc

*/

//console.log(navigator.hardwareConcurrency);
function Create2DArray(rows) {
    var arr = [];
  
    for (let i = 0; i < rows; i++) {
       arr[i] = [];
    }
  
    return arr;
}

class BlockNode {
    constructor(ninfo: Nodeinfo) {}
}

interface Nodeinfo {
    block: any,
    x: number,
    y: number,
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
    //gui = createGui();
    startpoint = 50; 
    //console.log(decoimg);
    //console.log(deco);
    frameRate(24); // CHANGE THIS WHEN YOU OPTIMIZE THE EDITOR
    textSize(12+windowWidth/100);
    //gridsize = Math.floor(windowWidth/Math.max(levelwidth,levelheight));
    //gridsize = 25;
    resizeCanvas(gridsize*levelwidth,gridsize*levelheight);
    tooliconbar();
    itemiconbar();
    for (let i = 0; i < levelwidth; i++) {
        for (let j = 0; j < levelheight; j++) {
            blocknodes[i][j] = {
                block: ".",
                x: i,
                y: j
            }
        }
    }
    //let div = createDiv();
    //div.parent(document.body);
    //for (let i = 0; i < itemlist.length; i++) {
    //    let icn = createImg(itemlist);
    //}
}

function draw() {
    clear();
    var blockpoint = getClickBN();
    fill(128);
    strokeWeight(1);
    if (!settings) {
        updateGrid();
        //tooliconbar();
        if (tool != null) {
            infoText("You have pressed " + tool[0] + " (" + tool[1] + " Tool) Press ESC to exit.");
        }
        fill("rgba(0,0,255, 0.25)");
        if (blockpoint != null) {
            rect(blockpoint[0]*gridsize,startpoint+blockpoint[1]*gridsize,gridsize,gridsize);
            if (checkTool("B")) {
                rect(blockpoint[0]*gridsize+gridsize,startpoint+blockpoint[1]*gridsize,gridsize,gridsize);
                rect(blockpoint[0]*gridsize-gridsize,startpoint+blockpoint[1]*gridsize,gridsize,gridsize);
                rect(blockpoint[0]*gridsize,startpoint+blockpoint[1]*gridsize+gridsize,gridsize,gridsize);
                rect(blockpoint[0]*gridsize,startpoint+blockpoint[1]*gridsize-gridsize,gridsize,gridsize);
            }
        }   
    }
}

function windowResized() {
    textSize(12+windowWidth/100);
    //gridsize = Math.floor(windowWidth/Math.max(levelwidth,levelheight));
    resizeCanvas(gridsize*levelwidth,gridsize*levelheight);
    draw(); 
    removeElements();
    tooliconbar();
    itemiconbar();
}

function mouseClicked() {
    var blockpoint = getClickBN();
    if (blockpoint != null) { // make sure cursor is on the grid
        // todo: optimize tool thingy
        if (checkTool("F")) {
            fillTool(currentitem,blockpoint[0],blockpoint[1],blocknodes[blockpoint[0]][blockpoint[1]].block);
            return;
        }
        if (checkTool("B")) {
            brushTool(currentitem,blockpoint[0],blockpoint[1]);
            return;
        }
        if (mouseButton === LEFT) {
            blocknodes[blockpoint[0]][blockpoint[1]].block = currentitem;
            //console.log(currentitem);
            //console.log(images);
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
    //if (keyCode === 16) {
    //    
    //}
}

function infoText(textstring: string, color?: string) {
    if (color) {
        fill(color);
    } else {
        fill(0);
    }
    fill('rgba(0,0,0, 0.25)');
    rect(0,0,windowWidth,26+windowWidth/150);
    fill(255);
    text(textstring,5,(26+windowWidth/150)/1.375);
}

function keyPressed() {
    switch (keyCode) {
        case 76:
            tool = ["L","Line (WIP)"];
            break;
        case 82:
            tool = ["R","Replace"];
            break;
        case 70:
            tool = ["F","Fill"];
            break;
        case 66:
            tool = ["B","Brush"];
            //lineTool("red",4,5,8,10);
            break;
        case 79:
            let level = "loadedLevels=\n";
            level += "Your Created Level\n" + levelwidth + "," + levelheight + ",01,00,L\n";
            for (let i = 0; i < levelheight; i++) {
                for (let j = 0; j < levelwidth; j++) {
                    //console.log(j);
                    if (blocknodes[j][i].block) {
                        level += blocknodes[j][i].block;
                    } else {
                        level += ".";
                    }
                }
                level += "\n";
            }
            level += "01,02.00,15.00,10\n00\n000000\n";
            console.log(level);
            break;
        case 27:
            tool = null;
            break;
    }
}

function updateGrid() {
    for (let i = 0; i < levelwidth; i++) {
        for (let j = 0; j < levelheight; j++) {
            //fill(255-(i+j)*4);
            let cool = itemsusing.findIndex(c => c === blocknodes[i][j].block);
            if (cool == 0) {
                rect(i*gridsize,startpoint+j*gridsize,gridsize,gridsize);
            } else {
                displayBlock(images[cool],i,j);
            }
            //console.log(cool);
            //console.log(blocknodes[i][j].block);
            //let c = images[][]
            //displayBlock(images[],i,j);
            //checkItem(i,j);
        }   
    }
}

function displayBlock(p5image,i: number,j: number) {
    image(p5image,i*gridsize,startpoint+j*gridsize,gridsize,gridsize);
}

/*function checkItem(i,j) {
    for (let x = 1; x < itemsusing.length; x++) { 
        // for future optimization, only loop items that are put in the level

        if (blocknodes[i][j].block == itemsusing[x][0]) {
            //fill("red"); //debug
            displayBlock(images[x][0],i,j);

            if (real_time_render) {
            let item = itemlist[x][0];
            var collison = [0,0,
                            0,0]; //LEFT, RIGHT, UP, DOWN

            if (blocknodes[i-1][j].block == item) { // LEFT
                collison[0] = 1;
                //console.log("LEFT COL");
            }

            if (blocknodes[i+1][j].block == item) { // RIGHT
                collison[1] = 1;
                //console.log("RIGHT COL");
            }

            if (blocknodes[i][j+1].block == item) { // UP
                collison[2] = 1;
                //console.log("UP COL");
            }

            if (blocknodes[i][j-1].block == item) { // DOWN
                collison[3] = 1;
                //console.log("DOWN COL");
            }
            if (collison.find(c => c == 0) == undefined) {
                //console.log(collison);
                return;
            } else if (collison.find(c => c === 1)) { // ???? why not just collison.find(number) dum js
                if (collison[2] == 1) {
                    if (collison[4] == 1) {
                        displayBlock(decoimg[5][1],i,j);
                    } else if (collison[1] == 1) {
                        displayBlock(decoimg[1][0],i,j);
                    } else if (false) {
                        displayBlock(decoimg[2][2],i,j);
                        image(decoimg[2][2],i*gridsize,startpoint+j*gridsize,gridsize,gridsize);
                    } else if (collison[4] == 1) {
                        displayBlock(decoimg[5][1],i,j);
                    }
                    /*if (collison[3] == 2) {

                    } else {
                        image(decoimg[2][0],i*gridsize,startpoint+j*gridsize,gridsize,gridsize);
                    }
                } else if (collison[3] == 1) {
                    displayBlock(decoimg[2][0],i,j);
                } else if (collison[0] == 1) {
                    displayBlock(decoimg[2][3],i,j);
                } else if (collison[1] == 1) {
                    displayBlock(decoimg[2][1],i,j);
                }
            } else {
                displayBlock(decoimg[3][0],i,j);
            }
            }
        } else {
            rect(i*gridsize,startpoint+j*gridsize,gridsize,gridsize);
        }
    }
}*/

function tooliconbar() {
    let tooldiv = createDiv();
    tooldiv.id("tidiv")
    for (let i = 0; i < toollist.length; i++) {
        let tlb = toolbutton[i]
        tlb = createButton("[" + toollist[i][0] + "] " + toollist[i][1] + " Tool");
        //tlb.position(0,gridsize*levelheight+(i*21));
        tlb.mousePressed(function(){tool = toollist[i]});
        tlb.class("toolicon");
        tlb.parent(tooldiv);
        //tlb.style("float","right");
        //tlb.style("position","relative");
    }
}

function itemiconbar() {
    let itemdiv = createDiv();
    itemdiv.id("idiv")
    for (let i = 0; i < itemlist.length; i++) {
        let ilb = itembutton[i]

        ilb = createButton("[" + itemlist[i][0] + "] " + itemlist[i][1]);
        ilb.mousePressed(function(){ // ITEM ICON ONCLICK FUNCTION
            currentitem = itemlist[i][0];
            if (!itemsusing.find(c => c === itemlist[i][0])) {
                itemsusing.push(itemlist[i][0]);
                console.log(itemsusing);
            }
        });
        ilb.class("itemicon");
        ilb.parent(itemdiv);
        if (i) { // bruh moment
            ilb.style("background-image","url(" + "../" + WEBPAGE + "img/" + itemlist[i][1] + ".png" +")")
        }    
    }
}

function checkTool(toolkey: string) {
    if (tool != null && tool[0] == toolkey) {
        return true;
    }
}

function getClickBN() { // Get Click Block Node
    let smouseY = mouseY-startpoint;
    //console.log(smouseY);
    if (Math.floor(mouseX/gridsize) >= levelwidth || Math.floor(smouseY/gridsize) < 0) {
        return null;
    }
    if (smouseY > gridsize*levelheight-1) {
        return null;
    }
    return [Math.floor(mouseX/gridsize),Math.floor(smouseY/gridsize)];
}

function lineTool(item: string, sx1: number, sy1: number, sx2: number, sy2: number) {
    // thank you wikipedia https://en.wikipedia.org/wiki/Line_drawing_algorithm
    let dx = sx2 - sx1;
    let dy = sy2 - sy1;
    let y = Math.max(sy1,sy2);

    for (var x = sx1; x < sx2; x+=0.5) {
        y = sy1 + dy * (x - sy1) / dx;

        blocknodes[Math.round(x)][Math.round(y)].block = "Red";
        console.log(x,Math.ceil(y));
    }
}

function fillTool(item: string, startx: number, starty: number, fillon: string) { // start must be array
    if (startx == levelwidth || starty == levelheight) {
        return; // doesn't exist
    }
    if (startx < 0 || starty < 0) {
        return; // doesn't exist
    }
    if (blocknodes[startx][starty].block == item) {
        return; // no need to fill, its already the item we want
    }
    if (blocknodes[startx][starty].block != fillon) {
        return; // not that we are filling on
    }
    //console.log(blocknodes[startx][starty]);
    blocknodes[startx][starty].block = item;

    fillTool(item,startx+1,starty,fillon);
    fillTool(item,startx-1,starty,fillon);
    fillTool(item,startx,starty+1,fillon);
    fillTool(item,startx,starty-1,fillon);

    return;
}

function brushTool(item: string, startx: number, starty: number) {
    blocknodes[startx][starty].block = item;
    if (startx+1 != levelwidth && startx+1 != -1) {
        blocknodes[startx+1][starty].block = item;
    }
    if (startx-1 != levelwidth && startx-1 != -1) {
        blocknodes[startx-1][starty].block = item;
    }
    if (starty+1 != levelheight && starty+1 != -1) {
        blocknodes[startx][starty+1].block = item;
    }
    if (starty-1 != levelheight && starty-1 != -1) {
        blocknodes[startx][starty-1].block = item;
    }
}

function selectTool() {

}