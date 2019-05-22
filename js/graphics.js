class GfxBit {
    constructor(bitId, dummy=false){
        let settings = SETTINGS_DEFAULT;
        this.size = settings.bitSize;
        this.padding = settings.bitPadding;
        this.bit = bitId;
        let total = settings.blocksPerRow*settings.rows*settings.bitsPerBlock;
        let r = this.bit / total;
        let tc = tinycolor.fromRatio({ h: r, s: 0.8, l: 0.7 });
        let ti = tinycolor.fromRatio({ h: r, s: 0.5, l: 1 });
        let th = tinycolor.fromRatio({ h: r, s: 0.5, l: 0.4 });
        
        this.colorDefault = parseInt('0x'+tc.toHex());
        this.colorHover = parseInt('0x'+ti.toHex());
        this.colorChosen = parseInt('0x'+th.toHex());
        if (this.bit == -1) this.colorDefault = 0;
        // console.log("asdasd");
        // console.log(
        //     tc.toHex(),
        //     ti.toHex(),
        //     th.toHex()
        // );

        this.txt = new PIXI.Text(''+this.bit, {
            fontFamily: 'Consolas',
            fontSize: 12,
            fill: 0x000000,
            align: 'center',
        });
        this.txt.anchor.set(0.5);
        
        
        this.sprite = new PIXI.Sprite(TEXTURE_BIT);
        this.sprite.addChild(this.txt);
        this.sprite.tint = this.colorDefault;
        

        this.sprite.anchor.set(0.5);
        this.sprite.interactive = true;
        this.chosen = false;

        if (!dummy){
            this.sprite.on("mouseout", ()=>{
                // if (!this.chosen){
                    this.sprite.tint = this.colorDefault;
                // }
                // else this.sprite.tint = this.colorChosen;
            });
            this.sprite.on("mouseover", ()=>{
                // console.log("cc: ", this.colorHover);
                this.sprite.tint = this.colorHover;
                // console.log(this.sprite.tint);
                if (!mousedown) return;
                
                accessPattern.addBit(this.bit);
                apap();
                // let sp = new Bit(accessPattern.length * SETTINGS_DEFAULT.bitSize, 0, bit.id, SETTINGS_DEFAULT);
                // accessPattern.addBit(this.sprite);
                // accessPattern = accessPattern.filter(onlyUnique);
                // this.chosen = true;
            });
        
            this.sprite.on("click", ()=>{
                this.sprite.tint = this.colorChosen;
                accessPattern.addBit(this.bit);
                apap();
                // this.chosen = true;
                
            });
        }
        
    }
    setX(index, half=false){
        // console.log("pos:", this.sprite.x);
        // console.log("pp:", this.padding);
        // console.log("ss:", this.size);
        // console.log("nn:", this.index);
        this.sprite.x = this.padding + index * (this.size + 2*this.padding);
        if (half){
            this.sprite.x += (this.size + 2*this.padding) * 0.5;
            this.sprite.y = this.padding +(this.size + 2*this.padding) * 0.5;
        }
    }
}

class GfxBlock{
    constructor(block, num, dummy=false, dummy2=false){
        let settings = SETTINGS_DEFAULT;
        let bitSize = settings.bitSize;
        let bitPadding = settings.bitPadding;
        let totalBitSize = bitSize + 2*bitPadding;
        this.block = block;
        this.padding = settings.blockPadding;
        this.size = new PIXI.Point(
            totalBitSize*block.numBits+2*this.padding,
            totalBitSize+2*this.padding

        );
        let total = settings.blocksPerRow*settings.rows*settings.bitsPerBlock;
        let r = this.block.bits[0] / total;
        let ri = r+0.5;
        if (ri > 1) ri -= 1;
        ri = r;
        
        let tc = tinycolor.fromRatio({ h: ri, s: 0.8, l: 0.6 });
        this.colorDefault = parseInt('0x'+tc.toHex());
        if (this.block.bits[0] == -1) this.colorDefault = 0xffffff;

        if (!TEXTURE_BLOCK){
            console.log(this.size);
            TEXTURE_BLOCK = createTexture(this.size.x, this.size.y)
        }
        
        this.sprite = new PIXI.Sprite(TEXTURE_BLOCK);
        this.sprite.tint = this.colorDefault;
        let pp = this.padding;
        
        if (true || !dummy2){
            
            this.txt = new PIXI.Text(num, {
                fontFamily: 'Consolas',
                fontSize: 20,
                fill: 0xffffff,
                align: 'center',
            });
            this.txt.x = -16;
            this.txt.y = 15;
            this.txt.anchor.set(0.5);
            this.sprite.addChild(this.txt);
        }

        this.block.bits.forEach((bit, index)=>{
            let fx = new GfxBit(bit, dummy);
            fx.setX(index, true);
            fx.sprite.x += pp;
            fx.sprite.y += pp;
            this.sprite.addChild(fx.sprite);
        });

        // this.sprite.anchor.set(0.5);
    }
    setX(index){
        this.sprite.x = this.padding + index * (this.size.x + this.padding);
    }
    setY(index){
        this.sprite.y = this.padding + index * (this.size.y + this.padding);
    }
}

class GfxSet{
    constructor(set, num){
        let settings = SETTINGS_DEFAULT;
        let bitSize = settings.bitSize;
        let bitPadding = settings.bitPadding;
        let totalBitSize = bitSize + 2*bitPadding;
        this.numBlocks = set.numBlocks;
        this.set = set;
        this.padding = settings.blockPadding;
        this.size = new PIXI.Point(
            totalBitSize*settings.bitsPerBlock+2*this.padding,
            totalBitSize+2*this.padding

        );
        this.sprite = new PIXI.Container();

        this.txt = new PIXI.Text('set ' + num, {
            fontFamily: 'Consolas',
            fontSize: 20,
            fill: 0xffffff,
            align: 'center',
        });
        this.txt.y = -24;
        // this.txt.anchor.set(0.5);
        this.sprite.addChild(this.txt);
    }
    setX(index){
        this.sp.x = this.padding + index * (this.size + this.padding);
    }
}

class GfxCache{
    constructor(cache){
        // let settings = SETTINGS_DEFAULT;
        // let bitSize = settings.bitSize;
        // let bitPadding = settings.bitPadding;
        // let totalBitSize = bitSize + 2*bitPadding;
        // this.numBlocks = set.numBlocks;
        // this.set = set;
        // this.padding = settings.blockPadding;
        // this.size = new PIXI.Point(
        //     totalBitSize*settings.bitsPerBlock+2*this.padding,
        //     totalBitSize+2*this.padding

        // );
        this.sprite = new PIXI.Container();
    }
    setX(index){
        this.sp.x = this.padding + index * (this.size + this.padding);
    }
}

class GfxMemory {
    constructor(memory){
        this.memory = memory;
        let settings = SETTINGS_DEFAULT;
        this.sprite = new PIXI.Sprite();



        // cont.x = x;
        // cont.y = y;

        this.numX = settings.blocksPerRow;
        this.numY = settings.rows;
        this.blockPadding = settings.blockPadding;
        this.bitSize = settings.bitSize;
        this.bitPadding = settings.bitPadding;
        this.bitsPerBlock = settings.bitsPerBlock;
        this.bitFullSize = settings.bitPadding * 2 + settings.bitSize;

        this.blockFullSize = new PIXI.Point(
            this.blockPadding * 2 + this.bitsPerBlock * this.bitFullSize,
            this.blockPadding * 2 + this.bitFullSize,
        );
        // console.log(cont.blockFullSize);

        for (let x = 0; x < this.numX; ++x) {
            for (let y = 0; y < this.numY; ++y) {
                let id = y * this.numX + x;
                let block = new CBlock(id);
                let fx = new GfxBlock(block, id, false, true);
                // console.log(block);
                // console.log(fx);
                // console.log(this.sprite);
                fx.setX(x);
                fx.setY(y);
                fx.sprite.x += x * 40;
                this.sprite.addChild(fx.sprite);

                // console.log([
                //     cont.blockPadding+cont.blockFullSize.x*x,
                //     cont.blockPadding+cont.blockFullSize.y*y/2,
                //     block.x, block.y,
                // ]);
            }
        }
    }
}

class GfxAccessPattern {
    constructor(accessPattern){
        this.sprite = new PIXI.Container();
        
        let bs = SETTINGS_DEFAULT.bitSize;
        let bp = SETTINGS_DEFAULT.bitPadding;
        accessPattern.bits.forEach((bit, index)=>{
            let bb = new GfxBit(bit);
            bb.setX(index - accessPattern.counter + 1);
            this.sprite.addChild(bb.sprite);
        });

        if (accessPattern.bits.length != 0){
            this.txt = new PIXI.Text('V', {
                fontFamily: 'Consolas',
                fontSize: 20,
                fill: 0xffffff,
                align: 'center',
            });
            this.txt.x = -5;
            this.txt.y = -30;
            // this.txt.anchor.set(0.5);
            this.sprite.addChild(this.txt);
        }
        
    }
}

// var Memory = function(x, y, settings) {
    
    

//     return cont;
// }