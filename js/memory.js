function assert(condition, message) {
    if (!condition) {
        message = message || "Assertion failed";
        if (typeof Error !== "undefined") {
            throw new Error(message);
        }
        throw message; // Fallback
    }
}
console.log(TEXTURE_BIT);
var Bit = function(x, y, id, settings){
    let bit = new PIXI.Sprite(TEXTURE_BIT);
    bit.id = id;
    console.log("bit ", bit.id);

    // copy relevant settings
    bit.colorChosen = settings.bitColorChosen;
    bit.colorDefault = settings.bitColorDefault;

    // sprite settings
    bit.x = x;
    bit.pivot.x = settings.bitSize / 2;
    bit.pivot.y = settings.bitSize / 2;
    bit.interactive = true;
    let halfFullSize = settings.bitSize/2 + settings.bitPadding;
    bit.hitArea = new PIXI.Rectangle(0, 0, halfFullSize*2, halfFullSize*2);

    bit.on("mouseout", ()=>{
        bit.tint = bit.colorDefault;
        bit.scale.x = bit.scale.y = 1;
    });
    bit.on("mouseover", ()=>{
        if (!mousedown) return;
        bit.tint = bit.colorChosen;
        bit.scale.x = bit.scale.y = 1.2;
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

var Memory = function(x, y, numX, numY, settings) {
    let cont = new PIXI.Container();
    cont.x = x;
    cont.y = y;

    cont.numX = numX;
    cont.numY = numY;
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
                y*numX+x,
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


