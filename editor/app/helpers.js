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

    $('li.list-group-item a', app.dom.nodesComp).each(function() {
      var link = $(this);

      var name = link.attr('data-name');
      if (b3[name]) return; // if node in b3, do not edit

      var edit = $('<a href="#" class="edit right">Edit</a>');

      edit.hide();
      edit.click(function(e) {
        app.events.onOpenEditNodeModal(e);
      });
      edit.attr('data-reveal-id', 'modalEditNode');
      link.addClass('node');
      link.append(edit);

      link.hover(function() {
        edit.toggle();
      });
    })
  };
  app.helpers.updateProperties = function(block) {
    if (app.block) {
      app.helpers.updateBlock();
    }

    app.block = block;

    if (!block) {
      app.dom.propertiesPanel.hide();
      app.dom.propertiesAlternatePanel.show();
    } else {
      app.dom.propertiesPanel.show();
      app.dom.propertiesAlternatePanel.hide();

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
    value = value.replace(/&/g, "&amp;").replace(/\"/g,'&quot;').replace(/</g, "&lt;").replace(/>/g, "&gt;");
    
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

})();