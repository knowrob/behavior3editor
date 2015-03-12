this.b3editor = this.b3editor || {};

(function() {
  "use strict";

  var Game = b3.Class();
  var p = Game.prototype;

  p.initialize = function() {
    // createjs and creatine variables
    this.canvas = app.dom.gameCanvas[0];
    this.stage = new createjs.Stage(this.canvas);
    this.display = new creatine.Display(this.canvas);
    
    console.log("Width: " + this.display.width);

    this.display.setUserSelect(false);
    this.display.setTouchAction(false);
    this.display.scaleMode = creatine.STRETCH;
    this.display.refresh();

    this.stage.snapToPixelEnabled = true;
    createjs.Ticker.setFPS(60);

    // layers
    this.camera = new createjs.Container();
    this.layerConnections = new createjs.Container();
    this.layerBlocks = new createjs.Container();
    this.layerOverlay = new createjs.Container();

    this.applySettings(app.settings);

    // add children
    this.camera.addChild(this.layerConnections);
    this.camera.addChild(this.layerBlocks);
    this.camera.addChild(this.layerOverlay);
    this.stage.addChild(this.camera);

    var this_ = this;
    createjs.Ticker.addEventListener('tick', function() {
      this_.stage.update();
    });
  }

  p.getLocalMousePosition = function() {
    return this.camera.globalToLocal(
      this.stage.mouseX,
      this.stage.mouseY
    )
  }

  p.applySettings = function(settings) {
    this.canvas.style.background = settings.get('background_color');    
  }

  b3editor.Game = Game;
}());
