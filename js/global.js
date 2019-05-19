
var app = new PIXI.Application({ antialias: true, forceFXAA: true });
app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.autoDensity = true;
app.renderer.resize(window.innerWidth, window.innerHeight);

var mouse = app.renderer.plugins.interaction.mouse;

var mousedown = false;
app.stage.on("mousedown", ()=>{
    mousedown = true;
});
app.stage.on("mouseup", ()=>{
    mousedown = false;
});

function createTextureBit(settings) {
    let graphics = new PIXI.Graphics();
    graphics.beginFill(0xffffff);
    graphics.drawRect(0, 0, settings.bitSize, settings.bitSize);
    graphics.endFill();
    return app.renderer.generateTexture(graphics);
}
var TEXTURE_BIT = createTextureBit(SETTINGS_DEFAULT);
console.log("global");