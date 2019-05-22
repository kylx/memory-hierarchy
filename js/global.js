let my_view = document.getElementById('my_canvas');
var app = new PIXI.Application({ 
    // view: document.getElementById('app'), 
    // resizeTo: document.getElementById('app'), 
    antialias: true, 
    forceFXAA: true,
    height: 480,
    // view: my_view 
});
// app.renderer.view.style.position = "absolute";
// app.renderer.view.style.display = "block";
// app.renderer.autoDensity = true;
// app.renderer.backgroundColor = 0xffffff;

var mouse = app.renderer.plugins.interaction.mouse;

var mousedown = false;
app.stage.on("mousedown", ()=>{
    mousedown = true;
});
app.stage.on("mouseup", ()=>{
    mousedown = false;
});
app.stage.interactive = true;
app.stage.hitArea = new PIXI.Rectangle(0,0,window.innerWidth, window.innerHeight);

function createTextureBit(settings) {
    let graphics = new PIXI.Graphics();
    graphics.beginFill(0xffffff);
    graphics.drawRect(0, 0, settings.bitSize, settings.bitSize);
    graphics.endFill();
    return app.renderer.generateTexture(graphics);
}
function createTexture(width, height) {
    let graphics = new PIXI.Graphics();
    graphics.beginFill(0xffffff);
    graphics.drawRect(0, 0, width, height);
    graphics.endFill();
    return app.renderer.generateTexture(graphics);
}
var TEXTURE_BIT = createTextureBit(SETTINGS_DEFAULT);
var TEXTURE_BLOCK = null;
console.log("global");


// var accessPattern = [];
// var accessIndex = 0;

// var accessPattern = (function(){
//     let con = new PIXI.Container();
//     con.bits = [];
//     con.i = 0;
//     con.lines = [];
//     con.addBit = function(bitt){
//         if (con.bits.find((bit)=>{ 
//             return bit.id == bitt.id; 
//         }))
//         {
//             return;
//         }
//         con.lines.push(bitt.getGlobalPosition());
//         let settings = SETTINGS_DEFAULT;
//         let bit = new PIXI.Sprite(TEXTURE_BIT);
//         bit.id = bitt.id;
        
//         bit.anchor.set(0.5);

//         let txt = new PIXI.Text(''+bit.id, {
//             fontFamily: 'Consolas',
//             fontSize: 12,
//             fill: 0x000000,
//             align: 'center',
//         });
//         txt.anchor.set(0.5);
        
//         bit.addChild(txt);
        

//         // copy relevant settings
        
//         let total = settings.blocksPerRow*settings.rows*settings.bitsPerBlock;
//         let r = bit.id / total;
//         let tc = tinycolor.fromRatio({ h: r, s: 0.8, l: 0.7 });
//         let ti = tinycolor.fromRatio({ h: r, s: 0.5, l: 0.8 });
//         let th = tinycolor.fromRatio({ h: r, s: 0.5, l: 0.4 });
//         bit.colorDefault = parseInt('0x'+tc.toHex());
//         bit.colorHover = parseInt('0x'+ti.toHex());
//         bit.colorChosen = parseInt('0x'+th.toHex());

//         bit.tint = bit.colorDefault;
//         bit.x = con.bits.length * settings.bitSize;
//         con.bits.push(bit);
//         con.addChild(bit);
//         // if (con.i == -1) con.i = 0;
//     }

//     con.moveRight = function(){
//         // con.i++;
//         con.x -= SETTINGS_DEFAULT.bitSize;
//         console.log(con.i);
//         con.bits.shift();
//         con.lines.shift();
//         con.removeChildAt(0);
//     }

//     con.getCurrentBitId = function(){
//         if (con.i.length == 0) return -1;
//         return con.bits[0].id;
//     }

//     return con;
// })();




function addBitAnim(bit, nx, ny){
    anime({
        targets: bit,
        x: nx,
        y: ny,
        duration: 1000,
        easing: 'linear',
        update: function(){
            console.log('up');
        },
    });
}

