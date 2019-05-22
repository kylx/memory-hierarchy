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
    return self.id === value.id;
}
// console.log(TEXTURE_BIT);
// var Bit = function(x, y, id, settings){
//     let bit = new PIXI.Sprite(TEXTURE_BIT);
//     bit.id = id;

//     let txt = new PIXI.Text(''+bit.id, {
//         fontFamily: 'Consolas',
//         fontSize: 12,
//         fill: 0x000000,
//         align: 'center',
//     });
//     txt.anchor.set(0.5);
    
//     bit.addChild(txt);
    

//     // copy relevant settings
    
//     let total = settings.blocksPerRow*settings.rows*settings.bitsPerBlock;
//     let r = bit.id / total;
//     let tc = tinycolor.fromRatio({ h: r, s: 0.8, l: 0.7 });
//     let ti = tinycolor.fromRatio({ h: r, s: 0.5, l: 0.8 });
//     let th = tinycolor.fromRatio({ h: r, s: 0.5, l: 0.4 });
//     bit.colorDefault = parseInt('0x'+tc.toHex());
//     bit.colorHover = parseInt('0x'+ti.toHex());
//     bit.colorChosen = parseInt('0x'+th.toHex());

//     bit.tint = bit.colorDefault;
//     bit.x = x;
//     bit.anchor.set(0.5);
//     bit.interactive = true;
//     let halfFullSize = settings.bitSize/2 + settings.bitPadding;
//     bit.hitArea = new PIXI.Rectangle(-settings.bitSize/2, -settings.bitSize/2, settings.bitSize, settings.bitSize);
//     bit.chosen = false;

//     bit.on("mouseout", ()=>{
//         if (!bit.chosen) bit.tint = bit.colorDefault;
//         else bit.tint = bit.colorChosen;
//     });
//     bit.on("mouseover", ()=>{
//         bit.tint = bit.colorHover;
//         if (!mousedown) return;
//         // let sp = new Bit(accessPattern.length * SETTINGS_DEFAULT.bitSize, 0, bit.id, SETTINGS_DEFAULT);
//         accessPattern.addBit(bit);
//         // accessPattern = accessPattern.filter(onlyUnique);
//         bit.chosen = true;
//     });

//     bit.on("click", ()=>{
//         bit.tint = bit.colorChosen;
//         accessPattern.addBit(bit);
//         bit.chosen = true;
        
//     });

//     return bit;
// };

// var Block = function(x, y, id, settings) {
//     let cont = new PIXI.Container();
    
//     cont.id = id;
    
//     // copy relevant settings
//     cont.bitsPerBlock = settings.bitsPerBlock;
//     cont.bitPadding = settings.bitPadding;
//     cont.bitSize = settings.bitSize;
//     cont.bitFullSize = settings.bitPadding * 2 + settings.bitSize;

//     cont.x = x;
//     cont.y = y;

//     // create bits
//     for (let i = 0; i < settings.bitsPerBlock; i++) {
//         cont.addChild(new Bit(
//             cont.bitPadding+cont.bitSize/2+cont.bitFullSize*i, 
//             y, 
//             cont.id*settings.bitsPerBlock+i,
//             settings));
//     }

//     return cont;
// }
Array.prototype.rotate = (function() {
    // save references to array functions to make lookup faster
    var push = Array.prototype.push,
        splice = Array.prototype.splice;

    return function(count) {
        var len = this.length >>> 0, // convert to uint
            count = count >> 0; // convert to int

        // convert count to value in range [0, len)
        count = ((count % len) + len) % len;

        // use splice.call() instead of this.splice() to make function generic
        push.apply(this, splice.call(this, 0, count));
        return this;
    };
})();

class AccessPattern{
    constructor(){
        this.bits = [];
        this.counter = 0;
    }
    addBit(bitId){
        console.log("new bit: ", bitId);
        this.bits.push(bitId);
    }
    resetCounter(){
        this.counter = 0;
    }
    hasNext(){
        if (this.bits.length == 0) return false;
        return this.counter+1 < this.bits.length;
    }
    getCurrent(){
        if (this.bits.length == 0) return -1;
        return this.bits[this.counter];
    }
    gotoNext(){
        if (this.bits.length == 0)
            this.resetCounter();
        else{
            this.counter++;
        }
    }
}

class CBlock{
    constructor(physId=-1){
        this.setPhysId(physId);
    }
    setPhysId(physId){
        this.physId = physId;
        this.bits = [];
        this.numBits = SETTINGS_DEFAULT.bitsPerBlock;
        for (let i = 0; i < this.numBits; i++){
            if (this.physId != -1) this.bits.push(physId*this.numBits+i)
            else this.bits.push(-1)
        }
    }
    containsBit(bitId){
        return this.bits.indexOf(bitId) != -1;
    }
}

class CSet {
    constructor(){
        this.numBlocks = SETTINGS_DEFAULT.numSetBlocks;
        this.blocks = [];
        for (let i = 0; i < this.numBlocks; i++){
            this.blocks.push(new CBlock());
        }
    }
    loadBlock(physId){
        this.blocks[this.numBlocks-1].setPhysId(physId);
        this.rotate();
    }
    containsBit(bitId){
        if (this.physId == -1) return false;
        return this.blocks.some((block)=>{
            return block.containsBit(bitId);
        });
    }

    rotate(count=1){
        this.blocks.rotate(-count);
    }
}

class CCache {
    constructor(){
        this.numSets = SETTINGS_DEFAULT.numCacheSets;
        this.sets = [];
        for (let i = 0; i < this.numSets; i++){
            this.sets.push(new CSet());
        }
    }
    loadBlock(physId){
        let id = physId % this.numSets;
        this.sets[id].loadBlock(physId);
    }
    containsBit(bitId){
        return this.sets.some((set)=>{
            return set.containsBit(bitId);
        });
    }
}

class CMemory {
    constructor(){
        this.numBlocks = SETTINGS_DEFAULT.blocksPerRow * SETTINGS_DEFAULT.rows;
        this.bitsPerBlock = SETTINGS_DEFAULT.bitsPerBlock;
        this.blocks = [];
        for (let i = 0; i < this.numBlocks; i++){
            this.blocks.push(new CBlock(i));
        }
    }
    getPhysIdOfBit(bitId){
        let physId = Math.floor(bitId / this.bitsPerBlock);
        assert(0 <= physId && physId < this.numBlocks);
        return physId;
    }
}

// var Set = function(numBlocks) {
//     let set = new PIXI.Container();
//     set.numBlocks = numBlocks;
//     set.blocks = [];
//     set.conts = [];
//     for (let i = 0; i < set.numBlocks; i++)
//     {
//         set.blocks.push([]);
//         let cc = new PIXI.Container();
//         cc.y = i * 40;
//         set.addChild(cc);
//         set.conts.push(cc);
//         for (let i = 0; i < SETTINGS_DEFAULT.bitsPerBlock; i++){
//             set.blocks[i].push(-1);
//         }
//     }

//     set.contains = function(bitId){
//         for (let b = 0; b < set.numBlocks; b++){
//             for (let i = 0; i < SETTINGS_DEFAULT.bitsPerBlock; i++){
//                 if (set.blocks[b][i] == bitId) return true;
//             }
//         }
//         return false;
//     }

//     set.setBlock = function(blockId){
//         console.log('set', blockId);
//         let id = set.numBlocks-1;
//         set.blocks[id] = [];
//         for (let i = 0; i < SETTINGS_DEFAULT.bitsPerBlock; i++){
//             set.blocks[id].push(blockId*SETTINGS_DEFAULT.bitsPerBlock+i);
//         }
//         set.blocks.rotate(-1);
//         set.removeChildren();
//         set.conts = [];
//         for (let j = 0; j < set.numBlocks; j++)
//         {
//             set.blocks.push([]);
//             let cc = new PIXI.Container();
//             cc.y = j * 40;
//             set.addChild(cc);
//             set.conts.push(cc);
//             let id = j;
//             for (let i = 0; i < SETTINGS_DEFAULT.bitsPerBlock; i++){
//                 let settings = SETTINGS_DEFAULT;
//                 let bit = new PIXI.Sprite(TEXTURE_BIT);
//                 bit.id = set.blocks[id][i];
//                 // console.log(bit.id);
//                 bit.anchor.set(0.5);
    
//                 let txt = new PIXI.Text(''+bit.id, {
//                     fontFamily: 'Consolas',
//                     fontSize: 12,
//                     fill: 0x000000,
//                     align: 'center',
//                 });
//                 txt.anchor.set(0.5);
                
//                 bit.addChild(txt);
                
    
//                 // copy relevant settings
                
//                 let total = settings.blocksPerRow*settings.rows*settings.bitsPerBlock;
//                 let r = bit.id / total;
//                 let tc = tinycolor.fromRatio({ h: r, s: 0.8, l: 0.7 });
//                 let ti = tinycolor.fromRatio({ h: r, s: 0.5, l: 0.8 });
//                 let th = tinycolor.fromRatio({ h: r, s: 0.5, l: 0.4 });
//                 bit.colorDefault = parseInt('0x'+tc.toHex());
//                 bit.colorHover = parseInt('0x'+ti.toHex());
//                 bit.colorChosen = parseInt('0x'+th.toHex());
//                 // console.log(bit.id, total, bit.colorDefault);
//                 bit.tint = bit.colorDefault;
//                 bit.x = i * (settings.bitSize + settings.bitPadding);
//                 set.conts[id].addChild(bit);
//             }
//         }
//         // set.conts[id].removeChildren();
        
//         // [set.blocks[id], set.blocks[0]] = [set.blocks[0], set.blocks[id]];
//         set.blocks.rotate(1);
//         // set.swapChildren(
//         //     set.getChildAt(0), 
//         //     set.getChildAt(id),
//         //     );
//         for (let i = 0; i < set.numBlocks; i++){
//             let j = i-1;
//             set.conts[i].y += 40;
//         }
//         set.conts[set.numBlocks-1].y -= 40 * set.numBlocks;
//         // [set.conts[i].x, set.conts[i].y, 
//         //     set.conts[j].x, set.conts[j].y] = 
//         //     [set.conts[j].x, set.conts[j].y,
//         //         set.conts[i].x, set.conts[i].y, ]
        
//     }


//     return set;
// }

// var Memory = function(x, y, settings) {
//     let cont = new PIXI.Container();
//     cont.x = x;
//     cont.y = y;

//     cont.numX = settings.blocksPerRow;
//     cont.numY = settings.rows;
//     cont.blockPadding = settings.blockPadding;
//     cont.bitSize = settings.bitSize;
//     cont.bitPadding = settings.bitPadding;
//     cont.bitsPerBlock = settings.bitsPerBlock;
//     cont.bitFullSize = settings.bitPadding * 2 + settings.bitSize;

//     cont.blockFullSize = new PIXI.Point(
//         cont.blockPadding * 2 + cont.bitsPerBlock * cont.bitFullSize,
//         cont.blockPadding * 2 + cont.bitFullSize,
//     );
//     // console.log(cont.blockFullSize);

//     for (let x = 0; x < cont.numX; ++x) {
//         for (let y = 0; y < cont.numY; ++y) {
//             let block = new Block(
//                 cont.blockPadding+cont.blockFullSize.x*x,
//                 cont.blockPadding+cont.blockFullSize.y*y,
//                 y*cont.numX+x,
//                 settings,
//             );
//             cont.addChild(block);

//             // console.log([
//             //     cont.blockPadding+cont.blockFullSize.x*x,
//             //     cont.blockPadding+cont.blockFullSize.y*y/2,
//             //     block.x, block.y,
//             // ]);
//         }
//     }
    

//     return cont;
// }

// class AccessPattern {
//     constructor() {
//         this.list = [];
//     }

//     add(bit) {
//         this.list.push(bit);
//     }

//     reset() {
//         this.list = [];
//     }
// }


