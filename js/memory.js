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
        // console.log("new bit: ", bitId);
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
        
        for (let i = 0; i < this.numBlocks; i++){
            let block = this.blocks[i];
            if (block.physId == physId){

                [this.blocks[0], this.blocks[i]] = [this.blocks[i], this.blocks[0]];
                return;
            }
        }
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
        if (!(0 <= physId && physId < this.numBlocks)) return -1;
        return physId;
    }
}



