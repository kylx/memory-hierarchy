function assert(condition, message) {
    if (!condition) {
        message = message || "Assertion failed";
        if (typeof Error !== "undefined") {
            throw new Error(message);
        }
        throw message; // Fallback
    }
}

var Settings = function(
    bitsPerBlock, // how many bits per block
    ){
    this.bitsPerBlock = bitsPerBlock;


}

class PhysicalMemory {
    constructor(settings, numBlocks) {
        this.settings = settings;
        this.numBlocks = numBlocks;
        this.numBits = settings.bitsPerBlock * numBlocks;
        this.getBlockContainingBit = function (bit) {
            assert(0 <= bit && bit < this.numBits, "Accessing bits that's out of range");
            return Math.floor(bit / this.settings.bitsPerBlock);
        };
        
    }

    initializeGraphics(app, bitSize, numBlocksPerRow) {
        this.bitSize = bitSize;
        this.numBlocksPerRow = numBlocksPerRow;
        this.paddingBetweenBits = 2;
        this.paddingBetweenBlocks = 6;
        // create graphics
        let graphics = new PIXI.Graphics();
        graphics.beginFill(0xDE3249);
        graphics.drawRect(0, 0, this.bitSize, this.bitSize);
        graphics.endFill();
        this.texture = app.renderer.generateTexture(graphics);
        this.container = new PIXI.Container();
        app.stage.addChild(this.container);
        let blockX = this.paddingBetweenBlocks;
        let blockY = this.paddingBetweenBlocks;
        let blockCounter = 0;
        for (let b = 0; b < this.numBlocks; ++b) {
            console.group('Block ' + b);
            let block = new PIXI.Container();
            block.x = blockX;
            block.y = blockY;
            for (let bt = 0; bt < this.settings.bitsPerBlock; ++bt) {
                let sprite = new PIXI.Sprite(this.texture);
                sprite.x = bt * (this.paddingBetweenBits + this.bitSize);
                sprite.y = this.paddingBetweenBits;
                console.log('Bit ', bt, ': ', sprite.x, ',', sprite.y);
                block.addChild(sprite);
            }
            this.container.addChild(block);
            blockCounter++;
            if (blockCounter == this.numBlocksPerRow) {
                
                blockCounter = 0;
                blockY += this.paddingBetweenBits + this.paddingBetweenBlocks + this.bitSize;
                blockX = this.paddingBetweenBlocks;
                console.log("Next row!");
            }
            else{
                // This works for some reason...
                blockX += this.paddingBetweenBits * (this.settings.bitsPerBlock-1) + this.bitSize * this.settings.bitsPerBlock + this.paddingBetweenBlocks;
            }
            console.log('Next block: ', blockX, ',', blockY);
            console.groupEnd('Block ' + b)
        }
    };
}