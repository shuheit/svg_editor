var app = app || {};

$(function(){
  initCanvas();

  var importButton = document.getElementById("importSVG");
  importButton.addEventListener("change", function(event){
    var file = event.target.files[0];
    var reader = new FileReader();
    reader.onload=function(event){
      var data = event.target.result;
      var blob = new Blob([data], {'type' : file.type}); 
      var url = window.URL.createObjectURL(blob);
      var center = getCenter();
      addSVG( url, center );
    };
    reader.readAsArrayBuffer(file);
  }, false);

  var exportSVG = document.getElementById("exportSVG");
  exportSVG.addEventListener("click", function(event){
    var svg = app.canvas.toSVG()
    var blob = new Blob( [svg], {type: 'text/plain'} );
    var ts = Math.round(new Date().getTime() / 1000);
    saveAs(blob, 'exported_' + ts + '.svg');
  }, false);

  var defaultButton = document.getElementById("default");
  defaultButton.addEventListener("click", function(event){
    app.canvas.clear().renderAll();
    initFace();
  }, false);

  document.addEventListener('keydown', function(event) {
    if(event.keyCode === 8){
      event.preventDefault();
      if(app.canvas.getActiveObject()) app.canvas.getActiveObject().remove();
    } else if (event.keyCode === 46){
      event.preventDefault();
    }
  }, false);;
 
 initFace(); 
});

function initCanvas() {
  app.canvas = new fabric.Canvas('canvas');

  $(window).resize( respondCanvas );
  function respondCanvas() {
    app.canvas.setWidth($(main).width());
    app.canvas.setHeight($(main).height());
  }
  respondCanvas();
}

function initFace() {
  var center = getCenter();
  addSVG('img/brow.svg', [center[0] - 100 - 40, center[1] - 100 - 8]);
  addSVG('img/brow.svg', [center[0] + 100 - 40, center[1] - 100 - 8]);
  addSVG('img/eye.svg', [center[0] - 100 - 15, center[1] - 50 - 15]);
  addSVG('img/eye.svg', [center[0] + 100 - 15, center[1] - 50 - 15]);
  addSVG('img/nose.svg', [center[0] - 20, center[1] - 20]);
  addSVG('img/mouth.svg', [center[0] - 40, center[1] + 50]);
}

function addSVG( url, pos ) {
  fabric.loadSVGFromURL( url, function(objects, options) {
    var loadedObject = fabric.util.groupSVGElements(objects, options);
    loadedObject.set({
      left: pos[0],
      top: pos[1],
      angle: 0,
      padding: 0
    });
    loadedObject.setCoords();
    app.canvas.add(loadedObject);
    app.canvas.calcOffset();
  });
}

function getCenter() {
  var w = $(canvas).width();
  var h = $(canvas).height();
  return [w/2, h/2];
}