var width = 64;
var height = 32;
var display;
var index = 0;
window.onload = function(){
    display = new Display( width, height, 12, !!CanvasRenderingContext2D );
    document.getElementById("screen").appendChild( display.container );
    display.fill("#000").flush();
    callback(1, 0);
};

var callback = function(x, y){
    var _x = x > 0 ? x - 1 : width - 1;
    var _y = x > 0 ? y : (y > 0 ? y - 1 : height - 1);
    var color = "#00" + index;
    index = (index + 1) % 9;
    display.setPixel( _x, _y, color );
    display.setPixel( x, y, "#F00" );
    setTimeout( callback, 0, (x + 1) % width, (y + Math.floor((x + 1)/width)) % height );
};
