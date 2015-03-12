
this.b3editor = this.b3editor || {};

(function() {
    "use strict";

var OPTIONS = {
    // CAMERA
    zoom_initial  : 1.0,
    zoom_min      : 0.25,
    zoom_max      : 2.0,
    zoom_step     : 0.25,

    // EDITOR
    snap_x        : 16,
    snap_y        : 16,
    snap_offset_x : 0,
    snap_offset_y : 0,
    
    // CONNECTION
    connection_width       : 2,
    
    // ANCHOR
    anchor_border_width    : 2,
    anchor_radius          : 7,
    anchor_offset_x        : 4,
    anchor_offset_y        : 0,
    
    // BLOCK
    block_border_width     : 2,
    block_root_width       : 40,
    block_root_height      : 40,
    block_composite_width  : 40,
    block_composite_height : 40,
    block_decorator_width  : 60,
    block_decorator_height : 60,
    block_action_width     : 160,
    block_action_height    : 40,
    block_condition_width  : 160,
    block_condition_height : 40,
}

b3editor.OPTIONS = OPTIONS;
}());

this.b3editor = this.b3editor || {};

(function() {
    "use strict";

var SHORTCUTS = {
    key_remove           : 'delete',
    key_select_all       : 'ctrl+a',
    key_deselect_all     : 'ctrl+shift+a',
    key_invert_selection : 'ctrl+i',
    key_copy             : 'ctrl+c',
    key_cut              : 'ctrl+x',
    key_paste            : 'ctrl+v',
    key_organize         : 'a',
    key_zoom_in          : 'ctrl+up',
    key_zoom_out         : 'ctrl+down',
    key_new_tree         : '',
    key_import_tree      : '',
    key_export_tree      : '',
}

b3editor.SHORTCUTS = SHORTCUTS;
}());
this.b3editor = this.b3editor || {};

(function() {
    "use strict";

var THEME_DARK = {
    // CANVAS
    background_color        : '#171717',
    
    // SELECTION
    selection_color         : '#4bb2fd',
    
    // BLOCK
    block_background_color  : '#EFEFEF',
    block_border_color      : '#6d6d6d',
    block_symbol_color      : '#333',
    
    // ANCHOR
    anchor_background_color : '#EFEFEF',
    anchor_border_color     : '#6d6d6d',
    
    // CONNECTION
    connection_color        : '#6d6d6d',
}

b3editor.THEME_DARK = THEME_DARK;
}());
this.b3editor = this.b3editor || {};

(function() {
    "use strict";

var THEME_LIGHT = {
    // CANVAS
    background_color        : '#ffffff',
    
    // SELECTION
    selection_color         : '#2e71a0',
    
    // BLOCK
    block_background_color  : '#EFEFEF',
    block_border_color      : '#6d6d6d',
    block_symbol_color      : '#333',
    
    // ANCHOR
    anchor_background_color : '#EFEFEF',
    anchor_border_color     : '#6d6d6d',
    
    // CONNECTION
    connection_color        : '#6d6d6d',
}

b3editor.THEME_LIGHT = THEME_LIGHT;
}());
this.b3editor = this.b3editor || {};

(function() {
  "use strict";

  /**
   *  SettingsManager
  **/
  var SettingsManager = b3.Class();
  var p = SettingsManager.prototype;

    p.initialize = function() {
        this._dict = {};
    }
    p.clear = function() {
        this._dict = {};
    };
    p.set = function(key, value) {
        this._dict[key] = value;
    };
    p.get = function(key) {
        return this._dict[key]
    };
    p.load = function(data) {
        for (var key in data) {
            this.set(key, data[key]);
        }
    };    

  b3editor.SettingsManager = SettingsManager;
}());
this.b3editor = this.b3editor || {};

(function() {
  "use strict";

  var Root = b3.Class();
  var p = Root.prototype;
  p.name = 'Root';
  p.category = 'root';
  p.title = 'A Behavior Tree';

  b3editor.Root = Root;
}());
this.b3editor = this.b3editor || {};

(function() {
  "use strict";

  /**
   *  Organizer
  **/
  var Organizer = b3.Class();
  var p = Organizer.prototype;

  p.initialize = function() {
    this.depth             = 0;
    this.leafCont          = 0;
    this.horizontalSpacing = 208;
    this.verticalSpacing   = 64;
    this.orderByIndex      = false;
    this.connections       = []; // to redraw connections
    this.blocks            = []; // to reposition blocks
  }

  p.__step = function(block) {
    this.blocks.push(block);

    // leaf
    if (block.outConnections.length == 0) {
      this.leafCont++;

      // leaf nodes have the position accord. to the depth and leaf cont.
      var x = this.depth*this.horizontalSpacing;
      var y = this.leafCont*this.verticalSpacing;
    }

    // internal node
    else {
      // internal nodes have the position acord. to the depth and the
      //    mean position of its children
      var ySum = 0;

      if (this.orderByIndex) {
        var conns = block.outConnections;
      } else {
        // get connections ordered by y position
        var conns = block.getOutConnectionsByOrder();
      }

      for (var i=0; i<conns.length; i++) {
        this.depth++;
        this.connections.push(conns[i]);
        ySum += this.__step(conns[i].outBlock);
        this.depth--;
      }

      var x = this.depth*this.horizontalSpacing;
      var y = ySum/block.outConnections.length;
    }

    block.displayObject.x = x;
    block.displayObject.y = y;

    return y;
  }

  p.organize = function(root, orderByIndex) {
    if (!root) return;

    this.depth        = 0;
    this.leafCont     = 0;
    this.connections  = [];
    this.blocks       = [];
    this.orderByIndex = orderByIndex;

    var offsetX = root.displayObject.x;
    var offsetY = root.displayObject.y;

    var root = root;
    this.__step(root);

    offsetX -= root.displayObject.x;
    offsetY -= root.displayObject.y;

    for (var i=0; i<this.blocks.length; i++) {
      this.blocks[i].displayObject.x += offsetX;
      this.blocks[i].displayObject.y += offsetY;
    }

    for (var i=0; i<this.connections.length; i++) {
      this.connections[i].redraw();
    }
  }

  b3editor.Organizer = Organizer;
}());
this.b3editor = this.b3editor || {};
this.b3editor.draw = this.b3editor.draw || {};

(function() {
    "use strict";

var makeAnchor = function(shape, x, y, radius, bg_color, border_width, border_color) {
    shape.graphics.beginFill(bg_color);
    shape.graphics.setStrokeStyle(border_width, 'round');
    shape.graphics.beginStroke(border_color);
    shape.graphics.drawCircle(x, y, radius);
    shape.graphics.endStroke();
    shape.graphics.endFill();
}

var makeRect = function(shape, w, h, radius, bg_color, border_width, border_color) {
    shape.graphics.beginFill(bg_color);
    shape.graphics.setStrokeStyle(border_width, 'round');
    shape.graphics.beginStroke(border_color);
    shape.graphics.drawRoundRect(-w/2, -h/2, w, h, radius);
    shape.graphics.endStroke();
    shape.graphics.endFill();
}

var makeEllipse = function(shape, w, h, bg_color, border_width, border_color) {
    shape.graphics.beginFill(bg_color);
    shape.graphics.setStrokeStyle(border_width, 'round');
    shape.graphics.beginStroke(border_color);
    // shape.graphics.drawRoundRect(-w/2, -h/2, w, h, 75);
    shape.graphics.drawEllipse(-w/2, -h/2, w, h);
    shape.graphics.endStroke();
    shape.graphics.endFill();
}

var makeRhombus = function(shape, w, h, bg_color, border_width, border_color) {
    shape.graphics.beginFill(bg_color);
    shape.graphics.setStrokeStyle(border_width, 'round');
    shape.graphics.beginStroke(border_color);
    shape.graphics.moveTo(0, h/2);
    shape.graphics.lineTo(w/2, 0);
    shape.graphics.lineTo(0, -h/2);
    shape.graphics.lineTo(-w/2, 0);
    shape.graphics.lineTo(0, h/2);
    // shape.graphics.drawRoundRect(-w/2, -h/2, w, h, 75);
    // shape.graphics.drawEllipse(-w/2, -h/2, w, h);
    shape.graphics.endStroke();
    shape.graphics.endFill();
}

b3editor.draw.rootShape = function(block, settings) {
    var w = block._width;
    var h = block._height;
    var anchorOffsetX = settings.get('anchor_offset_x');
    var shape = block._shapeObject;

    makeAnchor(shape, w/2+anchorOffsetX, 0, 
        settings.get('anchor_radius'),
        settings.get('anchor_background_color'),
        settings.get('anchor_border_width'),
        settings.get('anchor_border_color')
    );
    makeRect(shape, w, h, 15,
        settings.get('block_background_color'),
        settings.get('block_border_width'),
        settings.get('block_border_color')
    );
}

b3editor.draw.compositeShape = function(block, settings) {
    var bounds = block._symbolObject.getBounds();
    var _width = 0;

    if (bounds) { _width = bounds.width+20; }

    var w = Math.max(_width, block._width);
    var h = block._height;
    var anchorOffsetX = settings.get('anchor_offset_x');
    var shape = block._shapeObject;
    block._width = w;
    block._height = h;

    makeAnchor(shape, -w/2-anchorOffsetX, 0, 
        settings.get('anchor_radius'),
        settings.get('anchor_background_color'),
        settings.get('anchor_border_width'),
        settings.get('anchor_border_color')
    )
    makeAnchor(shape, w/2+anchorOffsetX, 0, 
        settings.get('anchor_radius'),
        settings.get('anchor_background_color'),
        settings.get('anchor_border_width'),
        settings.get('anchor_border_color')
    )
    makeRect(shape, w, h, 15,
        settings.get('block_background_color'),
        settings.get('block_border_width'),
        settings.get('block_border_color')
    )
}

b3editor.draw.decoratorShape = function(block, settings) {
    var bounds = block._symbolObject.getBounds();

    var w = Math.max(bounds.width+40, block._width);
    var h = Math.max(bounds.height+50, block._height);
    var anchorOffsetX = settings.get('anchor_offset_x');
    var shape = block._shapeObject;
    block._width = w;
    block._height = h;

    makeAnchor(shape, -w/2-anchorOffsetX, 0, 
        settings.get('anchor_radius'),
        settings.get('anchor_background_color'),
        settings.get('anchor_border_width'),
        settings.get('anchor_border_color')
    )
    makeAnchor(shape, w/2+anchorOffsetX, 0, 
        settings.get('anchor_radius'),
        settings.get('anchor_background_color'),
        settings.get('anchor_border_width'),
        settings.get('anchor_border_color')
    )
    makeRhombus(shape, w, h, 15,
        settings.get('block_background_color'),
        settings.get('block_border_width'),
        settings.get('block_border_color')
    )
}

b3editor.draw.actionShape = function(block, settings) {

    var bounds = block._symbolObject.getBounds();

    // var w = block._width;
    // var h = block._height;
    var w = Math.max(bounds.width+15, block._width);
    var h = Math.max(bounds.height+15, block._height);
    var anchorOffsetX = settings.get('anchor_offset_x');
    var shape = block._shapeObject;
    block._width = w;
    block._height = h;

    makeAnchor(shape, -w/2-anchorOffsetX, 0, 
        settings.get('anchor_radius'),
        settings.get('anchor_background_color'),
        settings.get('anchor_border_width'),
        settings.get('anchor_border_color')
    )
    makeRect(shape, w, h, 15,
        settings.get('block_background_color'),
        settings.get('block_border_width'),
        settings.get('block_border_color')
    );
}

b3editor.draw.conditionShape = function(block, settings) {
    var bounds = block._symbolObject.getBounds();

    var w = Math.max(bounds.width+15, block._width);
    var h = Math.max(bounds.height+15, block._height);
    var anchorOffsetX = settings.get('anchor_offset_x');
    var shape = block._shapeObject;
    block._width = w;
    block._height = h;

    makeAnchor(shape, -w/2-anchorOffsetX, 0, 
        settings.get('anchor_radius'),
        settings.get('anchor_background_color'),
        settings.get('anchor_border_width'),
        settings.get('anchor_border_color')
    )
    makeEllipse(shape, w, h, 
        settings.get('block_background_color'),
        settings.get('block_border_width'),
        settings.get('block_border_color')
    );
}

}());
this.b3editor = this.b3editor || {};
this.b3editor.draw = this.b3editor.draw || {};

(function() {
    "use strict";

b3editor.draw.rootSymbol = function(block, settings) {
    // var shape = block.displayObject;
    var shape = new createjs.Shape();

    var w = block._width;
    var h = block._height;
    var swidth = h/20;
    var ssize = h/5;
    var scolor = settings.get('block_symbol_color');

    shape.graphics.setStrokeStyle(swidth, 'round');
    shape.graphics.beginStroke(scolor);
    shape.graphics.drawCircle(0, 0, ssize);
    shape.graphics.moveTo(-ssize, ssize);
    shape.graphics.lineTo(ssize, -ssize);
    shape.graphics.endStroke();

    return shape;
};

b3editor.draw.sequenceSymbol = function(block, settings) {
    // var shape = block.displayObject;
    // var shape = block._shapeObject;
    var shape = new createjs.Shape();

    var w = block._width;
    var h = block._height;
    var swidth = h/20;
    var ssize = h/4;
    var scolor = settings.get('block_symbol_color');

    shape.graphics.setStrokeStyle(swidth, 'round');
    shape.graphics.beginStroke(scolor);
    shape.graphics.beginFill(scolor);
    shape.graphics.moveTo(-ssize, 0);
    shape.graphics.lineTo(ssize, 0);
    shape.graphics.drawPolyStar(ssize/2, 0, ssize/2, 3, 0, 0);
    shape.graphics.endFill();
    shape.graphics.endStroke();

    return shape;
};

b3editor.draw.memsequenceSymbol = function(block, settings) {
    var shape = new createjs.Shape();

    var w = block._width;
    var h = block._height;
    var swidth = h/20;
    var ssize = h/4;
    var scolor = settings.get('block_symbol_color');

    shape.graphics.setStrokeStyle(swidth, 'round');
    shape.graphics.beginStroke(scolor);
    shape.graphics.beginFill(scolor);
    shape.graphics.drawPolyStar(0, -ssize*0.75, ssize/2, 6, ssize/10, 0);

    shape.graphics.setStrokeStyle(swidth, 'round');
    shape.graphics.beginStroke(scolor);
    shape.graphics.beginFill(scolor);
    shape.graphics.moveTo(-ssize, ssize/2);
    shape.graphics.lineTo(ssize, ssize/2);
    shape.graphics.drawPolyStar(ssize/2, ssize/2, ssize/2, 3, 0, 0);
    shape.graphics.endFill();
    shape.graphics.endStroke();

    return shape;
};

b3editor.draw.prioritySymbol = function(block, settings) {
    // var shape = block.displayObject;
    // var shape = block._shapeObject;
    var shape = new createjs.Shape();

    var w = block._width;
    var h = block._height;
    var swidth = h/20;
    var ssize = h/8;
    var scolor = settings.get('block_symbol_color');

    shape.graphics.setStrokeStyle(swidth, 'round');
    shape.graphics.beginStroke(scolor);
    shape.graphics.arc(0, -ssize, ssize, 3.141561, 1.570796, false);
    shape.graphics.lineTo(0, ssize);
    shape.graphics.beginFill(scolor);
    shape.graphics.drawCircle(0, ssize*2, swidth/2);

    shape.graphics.endFill();
    shape.graphics.endStroke();

    return shape;
};

b3editor.draw.memprioritySymbol = function(block, settings) {
    var shape = new createjs.Shape();

    var w = block._width;
    var h = block._height;
    var swidth = h/20;
    var ssize = h/8;
    var scolor = settings.get('block_symbol_color');

    shape.graphics.setStrokeStyle(swidth, 'round');
    shape.graphics.beginStroke(scolor);
    shape.graphics.arc(-ssize, -ssize, ssize, 3.141561, 1.570796, false);
    shape.graphics.lineTo(-ssize, ssize);
    shape.graphics.beginFill(scolor);
    shape.graphics.drawCircle(-ssize, ssize*2, swidth/2);
    shape.graphics.drawPolyStar(ssize*1.5, 0, ssize/2, 6, ssize/10, 0);

    shape.graphics.endFill();
    shape.graphics.endStroke();

    return shape;
};

b3editor.draw.textSymbol = function(block, settings) {
    var text = new createjs.Text(
        block.getTitle(),
        '18px Arial',
        '#333333'
    );
    text.textAlign = 'center';

    var bounds = text.getBounds();
    text.regY = bounds.height/2;

    // text.x = -block._width/2;
    // text.y = -block._height/2;

    return text;
}

}());
this.b3editor = this.b3editor || {};

(function() {
  "use strict";

  var Block = b3.Class();
  var p = Block.prototype;

  p.initialize = function(node) {
    var dict = node.prototype;

    if (!dict) {
      dict = node;
    }

    this.id             = b3.createUUID();
    this.node           = node;
    this.name           = dict.name;
    this.category       = dict.category;
    this.title          = dict.title || this.name;
    this.description    = dict.description || '';
    this.properties     = $.extend({}, dict.parameters, dict.properties);
    this.mappings       = {};
    this.breakpoint     = false;

    this.displayObject  = new createjs.Container();
    this.inConnection   = null;
    this.outConnections = [];
    this.isSelected     = false;
    this.isDragging     = false;
    this.dragOffsetX    = 0;
    this.dragOffsetX    = 0;
    
    this._width         = null;
    this._height        = null;
    this._shapeObject   = new createjs.Shape();
    this._shadowObject  = null;
    this._symbolObject  = null;

    this.applySettings(app.settings);
  }

  p.applySettings = function(settings) {
    this.settings = settings || this.settings;
    this._shadowObject = new createjs.Shadow(
      this.settings.get('selection_color'), 0, 0, 5
    );

    this.redraw();
  }
  
  p.copy = function() {
    var block = new b3editor.Block(this.node);

    block.displayObject.x = this.displayObject.x;
    block.displayObject.y = this.displayObject.y;
    block._width          = this._width;
    block._height         = this._height;
    block.anchorXOffset   = this.anchorXOffset;
    block.category        = this.category;
    block.title           = this.title;
    block.description     = this.description;

    return block;
  }

  p.redraw = function() {
    // Set variables
    var settings = this.settings;
    var name = this.name;
    var category = this.category.toLowerCase();
    var shape = app.editor.shapes[category];
    var symbol = app.editor.symbols[name] || b3editor.draw.textSymbol;

    this._width  = settings.get('block_'+category+'_width');
    this._height = settings.get('block_'+category+'_height');

    this.displayObject.removeAllChildren();

    // Draw symbol
    this._symbolObject = symbol(this, settings);

    // Draw shape
    this._shapeObject.graphics.clear();
    shape(this, settings);

    // Add to display
    this.displayObject.addChild(this._shapeObject);
    this.displayObject.addChild(this._symbolObject);
  }

  p.getTitle = function() {
    var s = this.title || this.name;
    var this_ = this;
    return s.replace(/(<\w+>)/g, function(match, key) {
      var attr = key.substring(1, key.length-1);
      if (this_.properties.hasOwnProperty(attr))
        return this_.properties[attr];
      else
        return match;
    });
  }

  // SELECTION ==============================================================
  p.select = function() {
    this.isSelected = true;
    this._shapeObject.shadow = this._shadowObject;
  }
  p.deselect = function() {
    this.isSelected = false;
    this._shapeObject.shadow = null;
  }
  // ========================================================================

  // CONNECTIONS ============================================================
  p.getOutNodeIds = function() {
    var nodes = [];
    for (var i=0; i<this.outConnections.length; i++) {
      nodes.push(this.outConnections[i].outBlock.id);
    }

    return nodes;
  }
  p.getOutNodeIdsByOrder = function() {
    var nodes = [];
    var conns = this.getOutConnectionsByOrder();
    for (var i=0; i<conns.length; i++) {
      nodes.push(conns[i].outBlock.id);
    }

    return nodes;
  }
  p.getOutConnectionsByOrder = function() {
    var conns = this.outConnections.slice(0);
    conns.sort(function(a, b) {
      return a.outBlock.displayObject.y - 
             b.outBlock.displayObject.y;
    })

    return conns;
  }

  p.addInConnection = function(connection) {
    this.inConnection = connection;
  }
  p.addOutConnection = function(connection) {
    this.outConnections.push(connection)
  }
  p.removeInConnection = function() {
    this.inConnection = null;
  }
  p.removeOutConnection = function(connection) {
    var index = this.outConnections.indexOf(connection);
    if (index > -1) {
      this.outConnections.splice(index, 1);
    }
  }
  // ========================================================================

  // HITTESTING =============================================================
  p.hitTest = function(x, y) {
    x = x - this.displayObject.x;
    y = y - this.displayObject.y;

    // return this.displayObject.hitTest(x, y);
    return this._shapeObject.hitTest(x, y);
  }
  p.isContainedIn = function(x1, y1, x2, y2) {
    if (x1 < this.displayObject.x-this._width/2 &&
        y1 < this.displayObject.y-this._height/2 &&
        x2 > this.displayObject.x+this._width/2 &&
        y2 > this.displayObject.y+this._height/2) {
      return true;
    }

    return false;
  }
  p.getLeftAnchorX = function() {
    return this.displayObject.x-this._width/2-this.settings.get('anchor_offset_x');
  }
  p.getRightAnchorX = function() {
    return this.displayObject.x+this._width/2+this.settings.get('anchor_offset_x');
  }

  // after hitTest returned true, verify if click was in block
  p.mouseInBlock = function(x, y) {
    return (Math.abs(x - this.displayObject.x) < this._width/2)
  }

  // after hitTest returned true, verify if click was in left anchor
  p.mouseInLeftAnchor = function(x, y) {
    var dx = x - this.displayObject.x;

    return (Math.abs(dx) > this._width/2 && dx < 0);
  }

  // after hitTest returned true, verify if click was in right anchor
  p.mouseInRightAnchor = function(x, y) {
    var dx = x - this.displayObject.x;

    return (Math.abs(dx) > this._width/2 && dx > 0);
  }
  // ========================================================================

  b3editor.Block = Block;
}());
this.b3editor = this.b3editor || {};

(function() {
  "use strict";

  var Connection = b3.Class();
  var p = Connection.prototype;

  p.initialize = function() {
    this.inBlock = null;
    this.outBlock = null;
    this.settings = null;
    this.displayObject = new createjs.Shape();

    // draw
    this.applySettings(app.settings);
  }

  p.addInBlock = function(block) {
    this.inBlock = block;
  }
  p.addOutBlock = function(block) {
    this.outBlock = block;
  }
  p.removeInBlock = function() {
    this.inBlock = null;
  }
  p.removeOutBlock = function() {
    this.outBlock = null;
  }

  p.applySettings = function(settings) {
    this.settings = settings;
    this.redraw();
  }

  p.redraw = function(x1, y1, x2, y2) {
    if (!this.inBlock && (x1==null&&y1==null) ||
        !this.outBlock && (x2==null&&y2==null)) {
      return;
    }

    var settings   = this.settings;
    var graphics   = this.displayObject.graphics;
    var width      = settings.get('connection_width');
    var color      = settings.get('connection_color');
    var diff       = settings.get('anchor_radius') + 
                     settings.get('anchor_border_width');
    var arrowWidth = settings.get('anchor_radius')/2;

    // TODO: error when outBlock or inBlock is null and x or y is 0
    x1 = (x1==0||x1)? x1 : this.inBlock.getRightAnchorX();
    x2 = (x2==0||x2)? x2 : this.outBlock.getLeftAnchorX() - diff;
    y1 = (y1==0||y1)? y1 : this.inBlock.displayObject.y;
    y2 = (y2==0||y2)? y2 : this.outBlock.displayObject.y;

    var dx = 2.5*(x2 - x1)/4;

    graphics.clear();
    graphics.setStrokeStyle(width, 'round');
    graphics.beginStroke(color);
    graphics.moveTo(x1, y1);
    graphics.bezierCurveTo(x1 + dx, y1, x2 - dx, y2, x2, y2);
    graphics.beginFill(color);
    graphics.drawPolyStar(x2-arrowWidth, y2, arrowWidth, 3, 0, 0);
    graphics.endFill();
    graphics.endStroke();
  }

  b3editor.Connection = Connection;
}());
this.b3editor = this.b3editor || {};

(function() {
  "use strict";

  var SelectionBox = b3.Class();
  var p = SelectionBox.prototype;

  p.initialize = function() {
    this.settings = null;
    this.displayObject = new createjs.Shape();
    this.displayObject.alpha = 0.3;
    this.displayObject.visible = false;

    // draw
    this.applySettings(app.settings);
  }

  p.applySettings = function(settings) {
    this.settings = settings;
    this.redraw();
  }

  p.redraw = function(x1, y1, x2, y2) {
    var color = this.settings.get('selection_color');
    var graphics = this.displayObject.graphics;

    var x = Math.min(x1, x2);
    var y = Math.min(y1, y2);
    var w = Math.abs(x1 -x2);
    var h = Math.abs(y1 -y2);

    graphics.clear();
    graphics.beginFill(color);
    graphics.drawRect(x, y, w, h);
    graphics.endFill();
  }

  b3editor.SelectionBox = SelectionBox;
}());
this.b3editor = this.b3editor || {};

(function() {
  "use strict";

  var CameraSystem = b3.Class();
  var p = CameraSystem.prototype;

  p.initialize = function() {
    this.isDragging = false;
    this.offsetX = 0;
    this.offsetY = 0;

    var this_ = this;
    app.game.stage.on('stagemousedown', this.onMouseDown, this);
    app.game.stage.on('stagemousemove', this.onMouseMove, this);
    app.game.stage.on('stagemouseup', this.onMouseUp, this);
    app.game.canvas.addEventListener('mousewheel', function(event) {
      this_.onMouseWheel(event)
    });
    app.game.canvas.addEventListener('DOMMouseScroll ', function(event) {
      this_.onMouseWheel(event)
    }, false);
  };

  p.onMouseDown = function(event) {
    if (event.nativeEvent.which !== 2) return;
    $(app.game.canvas).addClass('grabbing');

    this.isDragging = true;
    this.offsetX = app.game.stage.mouseX - app.game.camera.x;
    this.offsetY = app.game.stage.mouseY - app.game.camera.y;
  };

  p.onMouseMove = function(event) {
    if (!this.isDragging) return;

    app.game.camera.x = app.game.stage.mouseX - this.offsetX;
    app.game.camera.y = app.game.stage.mouseY - this.offsetY;
  };

  p.onMouseUp = function(event) {
    if (event.nativeEvent.which !== 2) return;

    $(app.game.canvas).removeClass('grabbing');

    this.isDragging = false;
    this.offsetX = 0;
    this.offsetY = 0;
  };

  p.onMouseWheel = function(event) {
    if (event.wheelDeltaY > 0) {
      app.editor.zoomIn();
    } else {
      app.editor.zoomOut();
    }
  }

  b3editor.CameraSystem = CameraSystem;
}());
this.b3editor = this.b3editor || {};

(function() {
  "use strict";

  var ConnectionSystem = b3.Class();
  var p = ConnectionSystem.prototype;

  p.initialize = function() {
    this.entity = null;

    app.game.stage.on('stagemousedown', this.onMouseDown, this);
    app.game.stage.on('stagemousemove', this.onMouseMove, this);
    app.game.stage.on('stagemouseup', this.onMouseUp, this);
  }

  p.onMouseDown = function(event) {
    if (event.nativeEvent.which !== 1) return;

    // if clicked on block
    var point = app.game.getLocalMousePosition();
    var x = point.x
    var y = point.y
    var block = app.editor.getBlockUnder(x, y);

    if (this.entity || !block) return;

    if (block.mouseInRightAnchor(x, y)) {
      // if user clicked at the outAnchor
      this.entity = app.editor.addConnection(block);

    } else if (block.mouseInLeftAnchor(x, y)) {
      // if user clicked at the inAnchor
      var connection = block.inConnection;
      if (!connection)
          return;

      block.removeInConnection();
      connection.removeOutBlock();

      this.entity = connection;
    }
  }

  p.onMouseMove = function(event) {
    // if no entity, return
    if (!this.entity) return;

    var point = app.game.getLocalMousePosition();
    var x = point.x
    var y = point.y

    // redraw
    this.entity.redraw(null, null, x, y);
  }

  p.onMouseUp = function(event) {
      if (event.nativeEvent.which !== 1) return;

      // if no entity, return
      if (!this.entity) return;

      var point = app.game.getLocalMousePosition();
      var x = point.x;
      var y = point.y;
      var block = app.editor.getBlockUnder(x, y);

      // if not entity or entity but no block
      if (!block || block === this.entity.inBlock || block.category === 'root') {
          app.editor.removeConnection(this.entity);
      } else {
          // if double parent on node
          if (block.inConnection) {
              app.editor.removeConnection(block.inConnection);
          }

          // if double children on root
          if ((this.entity.inBlock.category === 'root' || this.entity.inBlock.category === 'decorator') &&
                  this.entity.inBlock.outConnections.length > 1) {
              app.editor.removeConnection(this.entity.inBlock.outConnections[0]);
          }

          this.entity.addOutBlock(block);
          block.addInConnection(this.entity);

          this.entity.redraw();
      }

      this.entity = null;
  }

  b3editor.ConnectionSystem = ConnectionSystem;
}());
this.b3editor = this.b3editor || {};

(function() {
  "use strict";

  var DragSystem = b3.Class();
  var p = DragSystem.prototype;

  p.initialize = function() {
    this.isDragging = false;

    app.game.stage.on('stagemousedown', this.onMouseDown, this);
    app.game.stage.on('stagemousemove', this.onMouseMove, this);
    app.game.stage.on('stagemouseup', this.onMouseUp, this);
  }

  p.onMouseDown = function(event) {
    if (event.nativeEvent.which !== 1) return;

    // ctrl is for selection
    if (key.ctrl) return;

    // if is already dragging 
    if (this.isDragging) return;
    
    var point = app.game.getLocalMousePosition();
    var x = point.x
    var y = point.y
    var block = app.editor.getBlockUnder(x, y);

    // if mouse not on block
    if (!block) return;

    // if no block selected
    if (!block.isSelected) return;

    // if mouse in anchor
    if (!block.mouseInBlock(x, y)) return;

    // start dragging
    this.isDragging = true;

    for (var i=0; i<app.editor.selectedBlocks.length; i++) {
      var block = app.editor.selectedBlocks[i];
      block.isDragging = true;
      block.dragOffsetX = x - block.displayObject.x;
      block.dragOffsetY = y - block.displayObject.y;
    }
  }

  p.onMouseMove = function(event) {
    if (!this.isDragging) return;

    var point = app.game.getLocalMousePosition();
    var x = point.x
    var y = point.y

    // // move entity
    for (var i=0; i<app.editor.selectedBlocks.length; i++) {
      var block = app.editor.selectedBlocks[i];

      var dx = x - block.dragOffsetX;
      var dy = y - block.dragOffsetY;

      block.displayObject.x = dx - dx%app.settings.get('snap_x');
      block.displayObject.y = dy - dy%app.settings.get('snap_y');

      // redraw connections linked to the entity
      if (block.inConnection) {
        block.inConnection.redraw();
      }
      for (var j=0; j<block.outConnections.length; j++) {
        block.outConnections[j].redraw();
      }
    }
  }

  p.onMouseUp = function(event) {
    if (event.nativeEvent.which !== 1) return;
    if (!this.isDragging) return;

    this.isDragging = false;
    for (var i=0; i<app.editor.selectedBlocks.length; i++) {
      var block = app.editor.selectedBlocks[i];
      block.isDragging = false;
    }
  }
    
  b3editor.DragSystem = DragSystem;
}());
this.b3editor = this.b3editor || {};

(function() {
  "use strict";

  var SelectionSystem = b3.Class();
  var p = SelectionSystem.prototype;

  p.initialize = function() {
    this.isSelecting = false;
    this.ctrl = false;
    this.x1 = 0;
    this.y1 = 0;

    app.game.stage.on('stagemousedown', this.onMouseDown, this);
    app.game.stage.on('stagemousemove', this.onMouseMove, this);
    app.game.stage.on('stagemouseup', this.onMouseUp, this);
  }

  p.onMouseDown = function(event) {
    if (event.nativeEvent.which !== 1) return;

    // if clicked on block
    var point = app.game.getLocalMousePosition();
    var x = point.x;
    var y = point.y;

    var block = app.editor.getBlockUnder(x, y);

    if (block) {
      // if block isnt selected, select it
      if (!block.isSelected) {
        if (block.mouseInBlock(x, y)) {
          if (!key.ctrl) {
            app.editor.deselectAll();
          }

          app.editor.select(block);
        }
      } else if (key.ctrl) {
        app.editor.deselect(block);
      }

    // if clicked on open space
    } else {
      this.isSelecting = true;
      this.x1 = x;
      this.y1 = y;

      if (!key.ctrl) {
        app.editor.deselectAll();
      } else {
        this.ctrl = true;
      }
      // if (key.ctrl) {
      // } else {
      // }
    }
  }

  p.onMouseMove = function(event) {
    if (!this.isSelecting) {
      return;
    }

    var point = app.game.getLocalMousePosition();
    var x = point.x
    var y = point.y

    app.editor.selectionBox.displayObject.visible = true;
    app.editor.selectionBox.redraw(this.x1, this.y1, x, y);
  }

  p.onMouseUp = function(event) {
    if (event.nativeEvent.which !== 1) return;   
    if (!this.isSelecting) return;

    var point = app.game.getLocalMousePosition();
    var x = point.x;
    var y = point.y;

    var x1 = Math.min(this.x1, x);
    var y1 = Math.min(this.y1, y);
    var x2 = Math.max(this.x1, x);
    var y2 = Math.max(this.y1, y);

    for (var i=0; i<app.editor.blocks.length; i++) {
      var block = app.editor.blocks[i];
      if (block.isContainedIn(x1, y1, x2, y2)) {
        app.editor.invertSelection(block);
      }
    }

    app.editor.selectionBox.displayObject.visible = false;
    this.isSelecting = false;
    this.ctrl = false;
  }

  b3editor.SelectionSystem = SelectionSystem;
}());
this.app = this.app || {};
this.app.helpers = this.app.helpers || {};

(function() {
  "use strict";

  
  
  
  var _createCategory = function(category, list) {
    // this.addHeaderToList(category);
    var header = _createHeader(category);
    list.append(header);
    
    for (var id in app.editor.nodes) {
      var node = app.editor.nodes[id];
      
      if (node.prototype.category == category) {
        var title = node.prototype.title || node.prototype.name,
 title = title.replace(/(<\w+>)/g, function(match, key) { return '@'; });
 
 var item = _createItem(title, node.prototype.name );
 list.append(item);
      }
    }
    //     return items;
  };
  var createList = function() {
    var list = $('#node-list')
    _createCategory('composite', list);
    _createCategory('decorator', list);
    _createCategory('condition', list);
    _createCategory('action', list);
    
    return list;
  };
  
  
  
  
  
  
  /* PANELS ================================================================== */
  var _createHeader = function(category) {
    var header = $('<div class="panel panel-default">' +
                   '  <div class="panel-heading">' +
                   '    <h4 class="panel-title text-uppercase">' +
                   '      <a class="collapsed" data-toggle="collapse" data-target="#collapse' + category + '" data-parent="#nodes-panel-group" aria-expanded="false" aria-controls="#collapse' + category + '">'+category+'</a>' +
                   '    </h4>' +
                   '  </div>');
    return header;
  };
  var _createItem = function(title, name) {
    var item = $('<li class="list-group-item"></li>');
    var link = $('<a href="#">'+title+'</a>');
    link.attr('data-name', name);
    link.attr('id', 'node-'+name);
    item.append(link);
    return item;
  };
  var _createCategory = function(category) {
    var header = _createHeader(category);
    
    var panel = $('<div id="collapse' + category + '" class="panel-collapse collapse in">');
    var list  = $('<ul class="list-group">');

    for (var id in app.editor.nodes) {
      var node = app.editor.nodes[id];

      if (node.prototype.category == category) {
        var title = node.prototype.title || node.prototype.name,
        title = title.replace(/(<\w+>)/g, function(match, key) { return '@'; });

        var item = _createItem(title, node.prototype.name );
        list.append(item);
      }
    }
    panel.append(list);
    header.append(panel);
    return header;
  };
  var createList = function() {
    var list = $('<div></div>');
    list.append(_createCategory('composite'));
    list.append(_createCategory('decorator'));
    list.append(_createCategory('condition'));
    list.append(_createCategory('action'));

    return list;
  };

  app.helpers.updateNodes = function() {
    var list = createList();
    
    app.dom.nodesPanel.html(list);
    app.dom.nodesComp = $('#nodes-panel-group');

//     app.helpers._updateCollapsable();
    app.helpers._updateDraggable();
    app.helpers._updateDroppable();

//     MT: disabled editing of custom nodes
//     $('li.list-group-item a', app.dom.nodesComp).each(function() {
//       var link = $(this);
// 
//       var name = link.attr('data-name');
//       if (b3[name]) return; // if node in b3, do not edit
// 
//       var edit = $(' <a href="#" class="edit">(Edit)</a>');
// 
//       edit.hide();
//       edit.click(function(e) {
//         app.events.onOpenEditNodeModal(e);
//       });
//       edit.attr('data-reveal-id', 'modalEditNode');
//       link.addClass('node');
//       link.append(edit);
// 
//       link.hover(function() {
//         edit.toggle();
//       });
//     })
  };
  app.helpers.updateProperties = function(block) {
    if (app.block) {
      app.helpers.updateBlock();
    }

    app.block = block;

    if (!block) {
      app.dom.propertiesPanel.toggleClass('invisible');
      app.dom.propertiesAlternatePanel.toggleClass('invisible');
    } else {
      app.dom.propertiesPanel.toggleClass('invisible');
      app.dom.propertiesAlternatePanel.toggleClass('invisible');

      $('#title', app.dom.propertiesPanel).val(block.title);
      $('#description', app.dom.propertiesPanel).val(block.description);
      
      if(block.breakpoint == true) {
        $('#breakpoint', app.dom.propertiesPanel).html('remove breakpoint <i class="fa fa-minus-square">');
        $('#breakpoint', app.dom.propertiesPanel).css('color', '#DD0000');
        $('#breakpoint', app.dom.propertiesPanel).data('task-id', block.id);
      } else {
        $('#breakpoint', app.dom.propertiesPanel).html('add breakpoint <i class="fa fa-plus-square"></i>');
        $('#breakpoint', app.dom.propertiesPanel).css('color', '#008CBA');
        $('#breakpoint', app.dom.propertiesPanel).data('task-id', block.id);
      }
      
      var propers = $('#properties-table', app.dom.propertiesPanel);
      app.helpers.remAllEditableRows(propers);
      for (var k in block.properties) {
        app.helpers.addEditableRow(propers, k, block.properties[k]);
      }
      
      var maps = $('#mappings-table', app.dom.propertiesPanel);
      app.helpers.remAllEditableRows(maps);
      for (var k in block.mappings) {
        app.helpers.addEditableRow(maps, k, block.mappings[k]);
      }
    }
  };
  app.helpers.updateHelp = function() {

  };
  /* ========================================================================= */

  /* ========================================================================= */
  app.helpers.updateBlock = function() {
    if (!app.block) return;

    var title = $('#title', app.dom.propertiesPanel).val();
    var description = $('#description', app.dom.propertiesPanel).val();

    var breakpoint = false;
    if($('#breakpoint').text().indexOf("remove") != -1) {
      breakpoint=true;
    }
    
    // Update properties
    var props = {}
    $('#properties-table > .editable-row', app.dom.propertiesPanel).each(function() {
      var row = $(this);
      var key = $('.key > input', row).val();
      var value = $('.value > input', row).val();

      if ($.isNumeric(value)) {
        value = parseFloat(value);
      }

      if (key) {
        props[key] = value;
      }
    });
    
    // Update remappings
    var mappings = {}
    $('#mappings-table > .editable-row', app.dom.propertiesPanel).each(function() {
      var row = $(this);
      var key = $('.key > input', row).val();
      var value = $('.value > input', row).val();
      
      if ($.isNumeric(value)) {
        value = parseFloat(value);
      }
      
      if (key) {
        mappings[key] = value;
      }
    });

    app.block.title = title;
    app.block.description = description;
    app.block.breakpoint = breakpoint;
    app.block.properties = props;
    app.block.mappings = mappings;
    app.block.redraw();
  };
  /* ========================================================================= */

  /* EDITABLE TABLES ========================================================= */
  app.helpers.addEditableRow = function(table, key, value, keyPlaceholder, valuePlaceholder) {
    key = key || '';
    value = value || '';
    keyPlaceholder=keyPlaceholder||'Key';
    valuePlaceholder=valuePlaceholder||'Value';

    // escape HTML quotes:
//     if(value != null && value != -1) {  // TODO: check if not a number
      value = String(value).replace(/&/g, "&amp;").replace(/\"/g,'&quot;').replace(/</g, "&lt;").replace(/>/g, "&gt;");
//     }
    
    var row = $('<div class="editable-row"></div>');
    var colKey = $('<div class="editable-col key"><input type="text" placeholder="'+keyPlaceholder+'" value="'+key+'"></div>');
    var colVal = $('<div class="editable-col value"><input type="text" placeholder="'+valuePlaceholder+'" value="'+value+'"></div>');
    var colOp = $('<div class="editable-col operator"><input type="button" class="operator" value="-"></div>');

    colOp.click(app.events.onRemEditableRow);

    row.append(colKey);
    row.append(colVal);
    row.append(colOp);
    row.hide();
    row.fadeIn(100);

    $('input', row).change(app.events.onPropertyChange);

    table.append(row);
  };
  app.helpers.remEditableRow = function(row) {
    row.remove();
    app.helpers.updateBlock();
  };
  app.helpers.remAllEditableRows = function(table) {
    table.html('');
  };

  app.helpers.addDynamicRow = function(table) {
      var row = $('<tr></tr>');
      var colKey = $('<td><input id="name" type="text" placeholder="Node name" value=""></td>');
      var colVal = $('<td><input id="title" type="text" placeholder="Node title" value=""></td>');
      var colCat = $('<td><select id="category"><option value="composite">Composite</option><option value="decorator">Decorator</option><option value="condition">Condition</option><option value="action" selected>Action</option></select></td>');
      var colOp = $('<td class="operator"><input type="button" class="operator" value="-"></td>');

      colOp.click(app.events.onRemDynamicRow);

      row.append(colKey);
      row.append(colVal);
      row.append(colCat);
      row.append(colOp);
      row.hide();
      row.fadeIn(100);

      table.append(row);
  }
  app.helpers.remDynamicRow = function(row) {
    row.remove();
  };
  app.helpers.resetDynamicTable = function(table) {
    table.html('');
    app.helpers.addDynamicRow(table);
    app.helpers.addDynamicRow(table);
    app.helpers.addDynamicRow(table);
  };
  app.helpers.addCustomNodes = function(table) {
    var classes = {
      'composite' : b3.Composite,
      'decorator' : b3.Decorator,
      'condition' : b3.Condition,
      'action' : b3.Action
    }

    $('tr', table).each(function() {
      var name = $('#name', this).val();
      var title = $('#title', this).val();
      var category = $('#category', this).val();
      var cls = classes[category];

      if (!name) return;

      if (app.editor.nodes[name]) {
          app.helpers.alert('error', 'Node name "'+name+'" already registered.');
          return;
      }
      var tempClass = b3.Class(cls);
      tempClass.prototype.name = name;
      tempClass.prototype.title = title;
      
      app.editor.registerNode(tempClass);
    });

    app.helpers.updateNodes();
  };

  app.helpers.addCustomNode = function(option) {
    var classes = {
      'composite' : b3.Composite,
      'decorator' : b3.Decorator,
      'condition' : b3.Condition,
      'action' : b3.Action
    };
    var category = option.category;
    var cls = classes[category];
    
    var tempClass = b3.Class(cls);
    tempClass.prototype.name = option.name;
    tempClass.prototype.title = option.title;
    app.editor.registerNode(tempClass);

    app.helpers.updateNodes();
  };
  /* ========================================================================= */

  /* ========================================================================= */
  app.helpers.alert = function(type, message) {
    $.notify(message, type);
  };
  /* ========================================================================= */

  /* MENU ==================================================================== */
  app.helpers.updateShortcuts = function() {
    for (var k in app.settings._dict) {
      if (k.indexOf('key_') === 0) {
        var value = app.settings.get(k);
        $('#'+k).html(value);

        var callback = app.KEY_MAP[k];
        if (callback) {
            key(value, callback);
        }
      }
    }
  };
  /* ========================================================================= */

  /* JS PLUGINS ============================================================== */

  app.helpers._updateDraggable = function() {
    $('.list-group-item > a', app.dom.nodesComp).draggable({
      cursorAt : {top: 100, left: 200},
      appendTo : "body",
      helper   : app.events.onNodeDrag
    });
  };
  app.helpers._updateDroppable = function() {
    app.dom.gameCanvas.droppable({
      greedy : true,
      drop   : app.events.onNodeDrop
    });
  };
  /* ========================================================================= */

})();this.app = this.app || {};
this.app.events = this.app.events || {};

(function() {
  "use strict";

  /* EDITOR CALLBACKS ======================================================== */
  app.events.onBlockSelect = function(event) {
    var block = null;
    if (app.editor.selectedBlocks.length == 0) {
      block = event._target;
    }

    app.helpers.updateProperties(block);
  };
  app.events.onBlockDeselect = function(event) {
    var block = null;
    if (app.editor.selectedBlocks.length == 2) {
        block = (app.editor.selectedBlocks[0]!==event._target)?
                       app.editor.selectedBlocks[0] :
                       app.editor.selectedBlocks[1];
    }

    app.helpers.updateProperties(block);
  };
  /* ========================================================================= */

  /* NODES =================================================================== */
  app.events.onNodeDrag = function(event) {
    var canvas = $('<canvas id="preview-canvas" width="400", height="200"></canvas>');
    var name = $(this).attr('data-name');
    var node = app.editor.nodes[name];
    var block = new b3editor.Block(node);
    var shape = block.displayObject;
    shape.x = 200;
    shape.y = 100;
    var stage = new createjs.Stage(canvas.get(0));
    stage.addChild(shape);
    stage.update();

    canvas.addClass('grabbing');

    return canvas;
  };
  app.events.onNodeDrop = function(event, ui) {
    var name = $(ui.draggable).attr('data-name');
    var node = app.editor.nodes[name];
    var point = app.game.getLocalMousePosition();
    var block = app.editor.addBlock(node, point.x, point.y);
    app.editor.snap(block);
    app.editor.deselectAll();
    app.editor.select(block);
  };
  app.events.onOpenEditNodeModal = function(event) {
    var link = $(event.target).parent();
    var nodeName = link.attr('data-name');
    
    var node = app.editor.nodes[nodeName];
    app.dom.editNodeTable.attr('data-name', node.prototype.name);
    $('#name', app.dom.editNodeTable).val(node.prototype.name);
    $('#title', app.dom.editNodeTable).val(node.prototype.title);
    // $('#category', app.editNodeTable).val(node.prototype.category);
  };
  app.events.onNodeEditSave = function() {
    app.helpers.updateBlock();
    app.editor.deselectAll();

    var oldName = app.dom.editNodeTable.attr('data-name');
    var node = app.editor.nodes[oldName];
    var oldTitle = node.prototype.title;

    var newName = $('#name', app.dom.editNodeTable).val();
    var newTitle = $('#title', app.dom.editNodeTable).val();

    if (oldName !== newName && app.editor.nodes[newName]) {
        app.helpers.alert('error', 'Node name "'+newName+'" already registered.');
        return;
    }

    node.prototype.name = newName;
    node.prototype.title = newTitle;

    for (var i=0; i<app.editor.blocks.length; i++) {
        var block = app.editor.blocks[i];
        if (block.node === node) {
            block.name = newName;
            if (block.title === oldTitle || block.title === oldName) {
                block.title = newTitle || newName;
            }
            block.redraw();
        }
    }

    delete app.editor.nodes[oldName];
    app.editor.nodes[newName] = node;

    app.helpers.updateNodes();
  };
  app.events.onNodeEditRemove = function() {
    app.helpers.updateBlock();
    app.editor.deselectAll();

    var oldName = app.dom.editNodeTable.attr('data-name');
    var node = app.editor.nodes[oldName];

    for (var i=app.editor.blocks.length-1; i>=0; i--) {
        var block = app.editor.blocks[i];
        if (block.node === node) {
            app.editor.removeBlock(block);
        }
    }

    delete app.editor.nodes[oldName];

    app.helpers.updateNodes();
  };
  /* ========================================================================= */

  /* PROPERTIES ============================================================== */
  app.events.onAddEditableRow = function(table) {
    if( $(table).attr('id') == "mappings-table") {
      app.helpers.addEditableRow(table, '', '', 'Local', 'Parent');
    } else {
      app.helpers.addEditableRow(table);
    }
  };
  app.events.onRemEditableRow = function(event) {
    var id = $(event.target).attr('data-id');
    app.helpers.remEditableRow($(this).parent());
  };
  app.events.onPropertyChange = function(obj) {
    app.helpers.updateBlock();
  };
  app.events.onAddDynamicRow = function(table) {
    app.helpers.addDynamicRow(table);
  };
  app.events.onRemDynamicRow = function(event) {
    var id = $(event.target).attr('data-id');
    app.helpers.remDynamicRow($(this).parent());
  };
  /* ========================================================================= */

  /* MENU FILE =============================================================== */
  app.events.onButtonNewTree = function(event) {
    app.editor.reset();
    app.editor.center();
    return false;
  };
  app.events.onButtonImportTree = function(event) {
    var json = app.dom.importEntry.val();

    try {
      app.editor.importFromJSON(json);
      app.helpers.updateNodes();
    } catch (e) {
      app.helpers.alert('error', 'Bad input format, check the console to '+
                                 'know more about this error.');
      console.error(e);
      app.editor.center();
    }
    return false;
  };
  app.events.onButtonExportTree = function(event) {
    app.helpers.updateBlock();
    
    app.dom.exportEntry.val('');
    var json = app.editor.exportToJSON();
    app.dom.exportEntry.val(json);
    return false;
  };
  /* ========================================================================= */

  /* MENU EDIT =============================================================== */
  app.events.onButtonCopy = function(event) {
    app.editor.copy();
    return false;
  };
  app.events.onButtonCut = function(event) {
    app.editor.cut();
    return false;
  };
  app.events.onButtonPaste = function(event) {
    app.editor.paste();
    return false;
  };
  app.events.onButtonRemove = function(event) {
    app.editor.remove();
    return false;
  };
  app.events.onButtonRemoveConnections = function(event) {
    app.editor.removeConnections();
    return false;
  };
  app.events.onButtonRemoveInConnections = function(event) {
    app.editor.removeInConnections();
    return false;
  };
  app.events.onButtonRemoveOutConnections = function(event) {
    app.editor.removeOutConnections();
    return false;
  };
  /* ========================================================================= */

  /* MENU VIEW =============================================================== */
  app.events.onButtonAutoOrganize = function(event) {
    app.editor.organize();
    return false;
  };
  app.events.onButtonZoomIn = function(event) {
    app.editor.zoomIn();
    return false;
  };
  app.events.onButtonZoomOut = function(event) {
    app.editor.zoomOut();
    return false;
  };
  /* ========================================================================= */
  
  /* MENU SELECTION ========================================================== */
  app.events.onButtonSelectAll = function(event) {
    app.editor.selectAll(); return false;
  };
  app.events.onButtonDeselectAll = function(event) {
    app.editor.deselectAll(); return false;
  };
  app.events.onButtonInvertSelection = function(event) {
    app.editor.invertSelection(); return false;
  };
  /* ========================================================================= */
  
  /* MENU RUN ========================================================== */
  app.events.onButtonExecuteTree = function(event) {
    
    app.helpers.updateBlock();
    var json = app.editor.exportToJSON();
    
    var goal = new ROSLIB.Goal({
      actionClient : behavior_tree_action,
      goalMessage : {
        tree: {
          id: 'some-id',
          label: 'some-label',
          json: json
        },
        vis: true,
        debug: false
      }
    });
    
    goal.on('feedback', function(feedback) {
      console.log('Feedback: ' + feedback.sequence);
    });
    
    goal.on('result', function(result) {
      console.log('Final Result: ' + result.sequence);
    });
    
    goal.send();
  };
  
  
  app.events.onButtonDebugTree = function(event) {
    
    app.helpers.updateBlock();
    var json = app.editor.exportToJSON();
    
    var goal = new ROSLIB.Goal({
      actionClient : behavior_tree_action,
      goalMessage : {
        tree: {
          id: 'some-id',
          label: 'some-label',
          json: json
        },
        vis: true,
        debug: true
      }
    });
    
    goal.on('feedback', function(feedback) {
      console.log('Current node: ' + feedback.running_node);
    });
    
    goal.on('result', function(result) {
      console.log('Execution result: ' + result.result.status);
    });
    
    goal.send();
  };
  
  app.events.onButtonDebugStep = function(event) {
    
    var msg = new ROSLIB.Message({cmd: 0, arg: ''});
    behavior_tree_dbg.publish(msg);
  };
  
  app.events.onButtonDebugLeap = function(event) {
    
    var msg = new ROSLIB.Message({cmd: 1, arg: ''});
    behavior_tree_dbg.publish(msg);
  };
  
  app.events.onButtonDebugPause = function(event) {
    
    var msg = new ROSLIB.Message({cmd: 2, arg: ''});
    behavior_tree_dbg.publish(msg);
  };
  
  app.events.onButtonStopTree = function(event) {
    behavior_tree_action.cancel();
  };
  
  app.events.onToggleBreakpoint = function(event) {
    
    var task_id = $('#breakpoint', app.dom.propertiesPanel).data('task-id');
    
    if($('#breakpoint').text().indexOf("add") != -1) {
      
      // adding breakpoint
      $('#breakpoint').html('remove breakpoint <i class="fa fa-minus-square">');
      $('#breakpoint').css('color', '#DD0000');
      
      var msg = new ROSLIB.Message({cmd: 3, arg: task_id});
      behavior_tree_dbg.publish(msg);
      
    } else {
      
      // removing breakpoint
      $('#breakpoint').html('add breakpoint <i class="fa fa-plus-square"></i>');
      $('#breakpoint').css('color', '#008CBA');
      
      var msg = new ROSLIB.Message({cmd: 4, arg: task_id});
      behavior_tree_dbg.publish(msg);
    }
  };
  
  /* ========================================================================= */

})();this.b3editor = this.b3editor || {};

(function() {
  "use strict";

  var Game = b3.Class();
  var p = Game.prototype;

  p.initialize = function() {
    // createjs and creatine variables
    this.canvas = app.dom.gameCanvas[0];
    this.stage = new createjs.Stage(this.canvas);
    this.display = new creatine.Display(this.canvas);

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
this.b3editor = this.b3editor || {};

(function() {
  "use strict";

  var Editor = b3.Class(createjs.EventDispatcher);

  var p = Editor.prototype;
  
  p._initialize = function() {
    this.blocks           = [];
    this.connections      = [];
    this.nodes            = {};
    this.symbols          = {};
    this.shapes           = {};
    this.systems          = [];
    this.clipboard        = [];
    this.selectedBlocks   = [];
    this.selectionBox     = new b3editor.SelectionBox();
    this.insertingBlockId = null;
    this.defaultNodes     = [
        b3editor.Root,
        b3.Sequence,
        b3.Priority,
        b3.MemSequence,
        b3.MemPriority,
        b3.Repeater,
        b3.RepeatUntilFailure,
        b3.RepeatUntilSuccess,
        b3.MaxTime,
        b3.Inverter,
        b3.Limiter,
        b3.Failer,
        b3.Succeeder,
        b3.Runner,
        b3.Error,
        b3.Wait
    ];
    this.organizer   = new b3editor.Organizer();

    // register system
    this.registerSystem(new b3editor.CameraSystem());
    this.registerSystem(new b3editor.SelectionSystem());
    this.registerSystem(new b3editor.DragSystem());
    this.registerSystem(new b3editor.ConnectionSystem());

    // register shape
    this.registerShape('root',      b3editor.draw.rootShape);
    this.registerShape('composite', b3editor.draw.compositeShape);
    this.registerShape('decorator', b3editor.draw.decoratorShape);
    this.registerShape('condition', b3editor.draw.conditionShape);
    this.registerShape('action',    b3editor.draw.actionShape);

    // register symbol
    this.registerSymbol('Root',         b3editor.draw.rootSymbol);
    this.registerSymbol('Sequence',     b3editor.draw.sequenceSymbol);
    this.registerSymbol('MemSequence',  b3editor.draw.memsequenceSymbol);
    this.registerSymbol('Priority',     b3editor.draw.prioritySymbol);
    this.registerSymbol('MemPriority',  b3editor.draw.memprioritySymbol);

    // register node
    for (var i = 0; i < this.defaultNodes.length; i++) {
      this.registerNode(this.defaultNodes[i]);
    };

    app.game.layerOverlay.addChild(this.selectionBox.displayObject);

    this.reset();
    this.center();
  };

  // INTERNAL =================================================================
  p.registerNode = function(node) {
    // TODO: raise error if node is invalid
    var name = node.prototype.name;
    this.nodes[name] = node;
  }
  p.registerSymbol = function(category, symbol) {
    if (!symbol) {
      symbol = category;
    }
    this.symbols[category] = symbol;
  }
  p.registerShape = function(name, shape) {
    this.shapes[name] = shape;
  }
  p.registerSystem = function(system, priority) {
    if (priority) {
      this.systems.splice(0, 0, system);
    } else {
      this.systems.push(system);
    }
  }
  p.getRoot = function() {
    for (var i=0; i<this.blocks.length; i++) {
      if (this.blocks[i].category === 'root') {
        return this.blocks[i];
      }
    }
  }
  p.getBlockUnder = function(x, y) {
    if (!x || !y) {
      var point = app.game.getLocalMousePosition();
      x = point.x;
      y = point.y;
    }

    // Get block under the mouse
    for (var i=this.blocks.length-1; i>=0; i--) {
      var block = this.blocks[i];

      // Verify collision
      if (block.hitTest(x, y)) {
        return block;
      }
    }
  }
  p.getBlockById = function(id) {
    for (var i=0; i<this.blocks.length; i++) {
      var block = this.blocks[i];
      if (block.id == id) {
        return block;
      }
    }
  }
  p.applySettings = function(settings) {
    var settings = settings || app.settings;
    app.game.applySettings(settings);
    for (var i=0; i<this.blocks.length; i++) {
      this.blocks[i].applySettings(settings);
    }
    for (var i=0; i<this.connections.length; i++) {
      this.connections[i].applySettings(settings);
    }
  }
  p.importFromJSON = function(json) {
    this.reset();

    var data = JSON.parse(json);
    var dataRoot = null;
    var hasDisplay = (data.display)?true:false;

    if (data.custom_nodes) {
      for (var i = 0; i < data.custom_nodes.length; i++) {
        var template = data.custom_nodes[i];
        if (!this.nodes[template.name]) {
          //If the node doesn't allready exist
          this.createNodeType(template);
        }   
      };
    }

    // Nodes
    for (var id in data.nodes) {
      var spec = data.nodes[id];

      spec.display = spec.display || {};

      var block = this.addBlock(spec.name, spec.display.x, spec.display.y);
      block.id = spec.id;
      block.title = spec.title;
      block.description = spec.description;
      block.breakpoint = spec.breakpoint;
      
      // interpret JSON-formatted code:
      var props = {}
      for (var key in spec.properties) {
        
        if(typeof spec.properties[key] === 'string' ||
           typeof spec.properties[key] === 'number' ||
           typeof spec.properties[key] === 'boolean') {
            props[key] = spec.properties[key];
          } else {
            props[key] = JSON.stringify(spec.properties[key]);
          }
      }       
      block.properties = $.extend({}, spec.parameters, props);
      
      block.mappings = spec.mappings || {};
      block.redraw();

      if (block.id === data.root) {
        dataRoot = block;
      }
    }

    // Connections
    for (var id in data.nodes) {
      var spec = data.nodes[id];
      var inBlock = this.getBlockById(id);

      var children = null;
      if (inBlock.category == 'composite' && spec.children) {
        children = spec.children;
      }
      else if (inBlock.category == 'decorator' && spec.child ||
               inBlock.category == 'root' && spec.child) {
        children = [spec.child]
      }
      
      if (children) {
        for (var i=0; i<children.length; i++) {
          var outBlock = this.getBlockById(children[i]);
          this.addConnection(inBlock, outBlock);
        }
      }
    }

    if (dataRoot) {
      this.addConnection(this.getRoot(), dataRoot);
    }

    data.display = data.display || {};
    app.game.camera.x      = data.display.camera_x || 0;
    app.game.camera.y      = data.display.camera_y || 0;
    app.game.camera.scaleX = data.display.camera_z || 1;
    app.game.camera.scaleY = data.display.camera_z || 1;

    // Auto organize
    if (!hasDisplay) {
      this.organize(true);
    }
  }
  p.exportToJSON = function() {
    var root = this.getRoot();
    var data = {};

    // Tree data
    data.title       = root.title;
    data.description = root.description;
    data.root        = root.getOutNodeIds()[0] || null;
    data.display     = {
      'camera_x' : app.game.camera.x,
      'camera_y' : app.game.camera.y,
      'camera_z' : app.game.camera.scaleX,
      'x'        : root.displayObject.x,
      'y'        : root.displayObject.y
    }
    data.properties  = root.properties;
    data.nodes       = {};
    data.custom_nodes = [];
    for(var key in this.nodes) {
      var node = this.nodes[key];
      if (this.defaultNodes.indexOf(node) === -1) {
        var item = {
          "name" : node.prototype.name,
          "title" : node.prototype.title,
          "category": node.prototype.category,
        };
        data.custom_nodes.push(item);
      }
    }

    // Node Spec
    for (var i=0; i<this.blocks.length; i++) {
      var block = this.blocks[i];

      if (block.category === 'root') continue;

      var spec = {};
      spec.id          = block.id,
      spec.name        = block.name,
      spec.title       = block.title,
      spec.description = block.description;
      spec.breakpoint = block.breakpoint;
      spec.display     = {
        'x' : block.displayObject.x,
        'y' : block.displayObject.y
      }
      spec.parameters  = block.parameters;
      
      // interpret JSON-formatted code:
      spec.properties = {}
      for (var key in block.properties) {
        var val = "";
        try {
          val = JSON.parse(block.properties[key]);
        } catch (e) {
          val = block.properties[key];
        }
        spec.properties[key]  = val;  
      } 
      
      spec.mappings  = block.mappings;

      var children = block.getOutNodeIdsByOrder();
      if (block.category == 'composite') {
        spec.children = children;
      } else if (block.category == 'decorator' || block.category == 'root') {
        spec.child = children[0] || null;
      }

      data.nodes[block.id] = spec;
    }

    return JSON.stringify(data, null, 4);
  }
  p.createNodeType = function(template) {
    var classes = {
      'composite' : b3.Composite,
      'decorator' : b3.Decorator,
      'condition' : b3.Condition,
      'action' : b3.Action,
    };
    var category = template.category;
    var cls = classes[category];
    
    var tempClass = b3.Class(cls);
    tempClass.prototype.name = template.name;
    tempClass.prototype.title = template.title;
    
    this.registerNode(tempClass);
  }
  // ==========================================================================
  
  // VIEWER ===================================================================
  p.zoom = function(factor) {
    app.game.camera.scaleX = factor;
    app.game.camera.scaleY = factor;
  }
  p.pan = function(x, y) {
    app.game.camera.x += x;
    app.game.camera.y += y;
  }
  p.setcam = function(x, y) {
    app.game.camera.x = x;
    app.game.camera.y = y;
  }
  p.center = function() {
    var hw = app.game.canvas.width/2;
    var hh = app.game.canvas.height/2;
    this.setcam(hw, hh);
  }
  p.organize = function(orderByIndex) {
    this.organizer.organize(this.getRoot(), orderByIndex);
  }
  p.reset = function(all) {
    // REMOVE BLOCKS
    for (var i=0; i<this.blocks.length; i++) {
      var block = this.blocks[i];
      app.game.layerBlocks.removeChild(block.displayObject);
    }
    this.blocks = [];

    // REMOVE CONNECTIONS
    for (var i=0; i<this.connections.length; i++) {
      var conn = this.connections[i];
      app.game.layerConnections.removeChild(conn.displayObject);
    }
    this.connections = [];

    app.game.camera.x = 0;
    app.game.camera.y = 0;
    app.game.camera.scaleX = 1;
    app.game.camera.scaleY = 1;

    if (!all) {
      this.addBlock('Root', 0, 0);
    }
  }
  p.snap = function(blocks) {
    if (!blocks) {
      blocks = this.blocks;
    }
    else if (!$.isArray(blocks)) {
      blocks = [blocks];
    }

    var snap_x = app.settings.get('snap_x');
    var snap_y = app.settings.get('snap_y');

    for (var i=0; i<blocks.length; i++) {
      var block = blocks[i];
      block.displayObject.x -= block.displayObject.x%snap_x;
      block.displayObject.y -= block.displayObject.y%snap_y;
    }
  }
  p.addBlock = function(name, x, y) {
    x = x || 0;
    y = y || 0;

    if (typeof name == 'string') {
      var node = this.nodes[name];
    } else {
      var node = name;
    }

    var block = new b3editor.Block(node);
    block.displayObject.x = x;
    block.displayObject.y = y;

    this.blocks.push(block);
    app.game.layerBlocks.addChild(block.displayObject);

    return block;
  }
  p.addConnection = function(inBlock, outBlock) {
    var connection = new b3editor.Connection(this);

    if (inBlock) {
      connection.addInBlock(inBlock);
      inBlock.addOutConnection(connection);
    }

    if (outBlock) {
      connection.addOutBlock(outBlock);
      outBlock.addInConnection(connection);
    }

    this.connections.push(connection);
    app.game.layerConnections.addChild(connection.displayObject);

    connection.redraw();

    return connection;
  }
  p.removeBlock = function(block) {
    var index = this.blocks.indexOf(block);
    if (index > -1) this.blocks.splice(index, 1);


    if (block.inConnection) {
      this.removeConnection(block.inConnection);
    }

    if (block.outConnections.length > 0) {
      for (var i=block.outConnections.length-1; i>=0; i--) {
        this.removeConnection(block.outConnections[i]);
      }
    }

    app.game.layerBlocks.removeChild(block.displayObject);
  }
  p.removeConnection = function(connection) {
    if (connection.inBlock) {
      connection.inBlock.removeOutConnection(connection);
      connection.removeInBlock();
    }

    if (connection.outBlock) {
      connection.outBlock.removeInConnection();
      connection.removeOutBlock();
    }

    var index = this.connections.indexOf(connection);
    if (index > -1) this.connections.splice(index, 1);

    app.game.layerConnections.removeChild(connection.displayObject);
  }
  // ==========================================================================
  
  // EDITOR INTERFACE =========================================================
  p.select = function(block) {
    if (block.isSelected) return;

    var event = new createjs.Event('blockselect');
    event._target = block;
    this.dispatchEvent(event);

    block.select();
    this.selectedBlocks.push(block)
  }
  p.deselect = function(block) {
    if (!block.isSelected) return;

    var event = new createjs.Event('blockdeselect');
    event._target = block;
    this.dispatchEvent(event);

    block.deselect();
    var index = this.selectedBlocks.indexOf(block);
    if (index > -1) this.selectedBlocks.splice(index, 1);
  }
  p.selectAll = function() {
    for (var i=0; i<this.blocks.length; i++) {
      this.select(this.blocks[i]);
    }
  }
  p.deselectAll = function() {
    for (var i=0; i<this.selectedBlocks.length; i++) {
      var event = new createjs.Event('blockdeselect');
      event._target = this.selectedBlocks[i];
      this.dispatchEvent(event);
      this.selectedBlocks[i].deselect();
    }

    this.selectedBlocks = [];
  }
  p.invertSelection = function(block) {
    var blocks = (block)?[block]:this.blocks;

    for (var i=0; i<blocks.length; i++) {
      var block = blocks[i];

      if (block.isSelected) {
        this.deselect(block);
      } else {
        this.select(block);
      }
    }
  }

  p.copy = function() {
    this.clipboard = [];

    for (var i=0; i<this.selectedBlocks.length; i++) {
      var block = this.selectedBlocks[i];

      if (block.category != 'root') {
        this.clipboard.push(block)
      }
    }
  }
  p.cut = function() {
    this.clipboard = [];

    for (var i=0; i<this.selectedBlocks.length; i++) {
      var block = this.selectedBlocks[i];

      if (block.category != 'root') {
        this.removeBlock(block);
        this.clipboard.push(block)
      }
    }
    this.selectedBlocks = [];
  }
  p.paste = function() {
    var newBlocks = [];
    for (var i=0; i<this.clipboard.length; i++) {
      var block = this.clipboard[i];

      // Copy the block
      var newBlock = block.copy();
      newBlock.displayObject.x += 50;
      newBlock.displayObject.y += 50;

      // Add block to container
      this.blocks.push(newBlock)
      app.game.layerBlocks.addChild(newBlock.displayObject);
      newBlocks.push(newBlock);
    }

    // Copy connections
    // TODO: cubic complexity here! How to make it better?
    for (var i=0; i<this.clipboard.length; i++) {
      var oldBlock = this.clipboard[i];
      var newBlock = newBlocks[i];

      for (var j=0; j<oldBlock.outConnections.length; j++) {
        for (var k=0; k<this.clipboard.length; k++) {
          if (oldBlock.outConnections[j].outBlock === this.clipboard[k]) {
            this.addConnection(newBlock, newBlocks[k]);
            break;
          }
        }
      }
    }

    // Deselect old blocks and select the new ones
    this.deselectAll();
    for (var i=0; i<newBlocks.length; i++) {
      this.select(newBlocks[i]);
    }

    this.snap(newBlocks);
  }
  p.remove = function() {
    var root = null;
    for (var i=0; i<this.selectedBlocks.length; i++) {
      if (this.selectedBlocks[i].category == 'root') {
        root = this.selectedBlocks[i];
      } else {
        this.removeBlock(this.selectedBlocks[i]);
      }
    }

    this.deselectAll();
    if (root) {
      this.select(root);
    }
  }

  p.removeConnections = function() {
    for (var i=0; i<this.selectedBlocks.length; i++) {
      var block = this.selectedBlocks[i];

      if (block.inConnection) {
        this.removeConnection(block.inConnection);
      }

      if (block.outConnections.length > 0) {
        for (var j=block.outConnections.length-1; j>=0; j--) {
          this.removeConnection(block.outConnections[j]);
        }
      }
    }
  }
  p.removeInConnections = function() {
    for (var i=0; i<this.selectedBlocks.length; i++) {
      var block = this.selectedBlocks[i];

      if (block.inConnection) {
        this.removeConnection(block.inConnection);
      }
    }
  }
  p.removeOutConnections = function() {
    for (var i=0; i<this.selectedBlocks.length; i++) {
      var block = this.selectedBlocks[i];

      if (block.outConnections.length > 0) {
        for (var j=block.outConnections.length-1; j>=0; j--) {
          this.removeConnection(block.outConnections[j]);
        }
      }
    }
  }

  p.zoomIn = function() {
    var min = app.settings.get('zoom_min');
    var max = app.settings.get('zoom_max');
    var step = app.settings.get('zoom_step');
    
    var zoom = app.game.camera.scaleX;
    this.zoom(creatine.clip(zoom+step, min, max));
  }
  p.zoomOut = function() {
    var min = app.settings.get('zoom_min');
    var max = app.settings.get('zoom_max');
    var step = app.settings.get('zoom_step');
    
    var zoom = app.game.camera.scaleX;
    this.zoom(creatine.clip(zoom-step, min, max));
  }
  // ==========================================================================

  b3editor.Editor = Editor;
}());
this.app = this.app || {};
this.app.dom = this.app.dom || {};

(function() {
  "use strict";

  app.initialize = function() {
    // create the constants
    app.initializeConstants();
    
    // inserting html documents
    app.initializeHTML();

    // load view and editor
    app.initializeEditor();

    // load javascript plugins
    app.initializePlugins();
  }

  app.initializeConstants = function() {
    // keys already added to editor constants
    app.KEY_MAP = {
      'key_select_all'       : app.events.onButtonSelectAll,
      'key_deselect_all'     : app.events.onButtonDeselectAll,
      'key_invert_selection' : app.events.onButtonInvertSelection,
      'key_copy'             : app.events.onButtonCopy,
      'key_cut'              : app.events.onButtonCut,
      'key_paste'            : app.events.onButtonPaste,
      'key_remove'           : app.events.onButtonRemove,
      'key_organize'         : app.events.onButtonAutoOrganize,
      'key_zoom_in'          : app.events.onButtonZoomIn,
      'key_zoom_out'         : app.events.onButtonZoomOut,
      'key_new_tree'         : app.events.onButtonNewTree,
      'key_import_tree'      : app.events.onButtonImportTree,
      'key_export_tree'      : app.events.onButtonExportTree,
    }
  }

  app.initializeHTML = function() {
    var page = $('#page');

    // append all views to the page
    for (var key in loader._loadedResults) {
      if (key.indexOf('view') === 0) {
        page.append(loader.getResult(key));
      }
    }

    app.dom.page                     = $('#page');

    // canvas
    app.dom.gameCanvas               = $('#game-canvas');
    
    // panels
    app.dom.nodesPanel               = $('#nodes-panel-group');
    app.dom.propertiesPanel          = $('#properties-panel');
    app.dom.propertiesAlternatePanel = $('#properties-panel-alternate');
    app.dom.helpPanel                = $('#help-panel');
    
    // dynamic components
    // app.dom.nodesComp                = null; // assigned on the updateNodes
    // app.dom.properties      = $('#properties-panel');
    // app.dom.properties_al   = $('#properties-panel-alternate');
    // app.dom.help            = $('#help-panel');

    // static components
    app.dom.exportEntry              = $('#export-entry'); // assigned on the updateNodes
    app.dom.importEntry              = $('#import-entry'); // assigned on the updateNodes
    app.dom.addNodeTable             = $('#addnode-table'); // assigned on the updateNodes
    app.dom.editNodeTable            = $('#editnode-table'); // assigned on the updateNodes
  }

  app.initializeEditor = function() {
    app.storage = new creatine.Storage('b3editor');
    if (typeof(app.storage.get('firsttime')) === 'undefined') {
      app.storage.set('firsttime', true);
    }

    app.settings = new b3editor.SettingsManager();
    app.settings.load(b3editor.OPTIONS);
    app.settings.load(b3editor.THEME_LIGHT);
    app.settings.load(b3editor.SHORTCUTS);

    app.game = new b3editor.Game();
    app.editor = new b3editor.Editor();
    app.editor._initialize();

    // // Link selection callbacks
    app.editor.on('blockselect', app.events.onBlockSelect);
    app.editor.on('blockdeselect', app.events.onBlockDeselect);
    // // Populate node list
    app.helpers.updateNodes();
    app.helpers.updateShortcuts();

//     if (app.storage.get('firsttime') === true) {
//       app.storage.set('firsttime', false);
//       $('#modalFirstTime').foundation('reveal', 'open');
//     }
  }

  app.initializePlugins = function() {
//     $('.nano').nanoScroller();
    //$(document).foundation();
    // $(document).foundation('joyride', 'start');
    $.notify.defaults({
      // whether to hide the notification on click
      clickToHide: true,
      // whether to auto-hide the notification
      autoHide: true,
      // if autoHide, hide after milliseconds
      autoHideDelay: 5000,
      // show the arrow pointing at the element
      arrowShow: true,
      // arrow size in pixels
      arrowSize: 5,
      // default positions
      elementPosition: 'bottom left',
      globalPosition: 'bottom center',
      // default style
      style: 'bootstrap',
      // default class (string or [string])
      className: 'error',
      // show animation
      showAnimation: 'slideDown',
      // show animation duration
      showDuration: 400,
      // hide animation
      hideAnimation: 'slideUp',
      // hide animation duration
      hideDuration: 200,
      // padding between element and notification
      gap: 2
    })
  }

})();