function assert(condition, message) {
    if (!condition) {
        message = message || "Assertion failed";
        if (typeof Error !== "undefined") {
            throw new Error(message);
        }
        throw message; // Fallback
    }
}
var onlyUnique = function(value, index, self) { 
    return self.indexOf(value) === index;
}
console.log(TEXTURE_BIT);
var Bit = function(x, y, id, settings){
    let bit = new PIXI.Sprite(TEXTURE_BIT);
    bit.id = id;
    console.log("bit ", bit.id);

    let txt = new PIXI.Text(''+bit.id, {
        fontFamily: 'Consolas',
        fontSize: 12,
        fill: 0x000000,
        align: 'center',
    });
    txt.anchor.set(0.5);
    
    bit.addChild(txt);

    // copy relevant settings
    
    let total = settings.blocksPerRow*settings.rows*settings.bitsPerBlock;
    let r = bit.id / total;
    let tc = tinycolor.fromRatio({ h: r, s: 0.8, l: 0.7 });
    let ti = tinycolor.fromRatio({ h: r, s: 0.5, l: 0.8 });
    let th = tinycolor.fromRatio({ h: r, s: 0.8, l: 0.9 });
    bit.colorDefault = parseInt('0x'+tc.toHex());
    bit.colorHover = parseInt('0x'+ti.toHex());
    bit.colorChosen = parseInt('0x'+th.toHex());

    bit.tint = bit.colorDefault;

    // sprite settings
    bit.x = x;
    // bit.pivot.x = settings.bitSize / 2;
    // bit.pivot.y = settings.bitSize / 2;
    bit.anchor.set(0.5);
    bit.interactive = true;
    let halfFullSize = settings.bitSize/2 + settings.bitPadding;
    bit.hitArea = new PIXI.Rectangle(-settings.bitSize/2, -settings.bitSize/2, settings.bitSize, settings.bitSize);
    bit.chosen = false;

    bit.on("mouseout", ()=>{
        if (!bit.chosen) bit.tint = bit.colorDefault;
        else bit.tint = bit.colorChosen;
        // console.log("pa", bit.hitArea);
        // console.log("pg", bit.getBounds());
        // console.log("pl", bit.getLocalBounds());
        // // bit.scale.x = bit.scale.y = 1;
        // console.log("aa", bit.hitArea);
        // console.log("ag", bit.getBounds());
        // console.log("al", bit.getLocalBounds());
        
        
    });
    bit.on("mouseover", ()=>{
        
        bit.tint = bit.colorHover;
        // bit.scale.x = bit.scale.y = 2;
        // console.log(bit.hitArea);
        if (!mousedown) return;
        accessPattern.push(bit);
        accessPattern = accessPattern.filter(onlyUnique);
        bit.chosen = true;
    });

    bit.on("click", ()=>{
        
        // bit.tint = bit.colorHover;
        // bit.scale.x = bit.scale.y = 2;
        // console.log(bit.hitArea);
        // if (!mousedown) return;
        bit.tint = bit.colorChosen;
        accessPattern.push(bit);
        bit.chosen = true;
    });

    return bit;
};

var Block = function(x, y, id, settings) {
    let cont = new PIXI.Container();
    
    cont.id = id;
    
    // copy relevant settings
    cont.bitsPerBlock = settings.bitsPerBlock;
    cont.bitPadding = settings.bitPadding;
    cont.bitSize = settings.bitSize;
    cont.bitFullSize = settings.bitPadding * 2 + settings.bitSize;

    cont.x = x;
    cont.y = y;

    // create bits
    for (let i = 0; i < settings.bitsPerBlock; i++) {
        cont.addChild(new Bit(
            cont.bitPadding+cont.bitSize/2+cont.bitFullSize*i, 
            y, 
            cont.id*settings.bitsPerBlock+i,
            settings));
    }

    return cont;
}

class Set {

}

var Memory = function(x, y, settings) {
    let cont = new PIXI.Container();
    cont.x = x;
    cont.y = y;

    cont.numX = settings.blocksPerRow;
    cont.numY = settings.rows;
    cont.blockPadding = settings.blockPadding;
    cont.bitSize = settings.bitSize;
    cont.bitPadding = settings.bitPadding;
    cont.bitsPerBlock = settings.bitsPerBlock;
    cont.bitFullSize = settings.bitPadding * 2 + settings.bitSize;

    cont.blockFullSize = new PIXI.Point(
        cont.blockPadding * 2 + cont.bitsPerBlock * cont.bitFullSize,
        cont.blockPadding * 2 + cont.bitFullSize,
    );
    // console.log(cont.blockFullSize);

    for (let x = 0; x < cont.numX; ++x) {
        for (let y = 0; y < cont.numY; ++y) {
            let block = new Block(
                cont.blockPadding+cont.blockFullSize.x*x,
                cont.blockPadding+cont.blockFullSize.y*y,
                y*cont.numX+x,
                settings,
            );
            cont.addChild(block);

            // console.log([
            //     cont.blockPadding+cont.blockFullSize.x*x,
            //     cont.blockPadding+cont.blockFullSize.y*y/2,
            //     block.x, block.y,
            // ]);
        }
    }
    

    return cont;
}

class AccessPattern {
    constructor() {
        this.list = [];
    }

    add(bit) {
        this.list.push(bit);
    }

    reset() {
        this.list = [];
    }
}


