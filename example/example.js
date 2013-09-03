var width = 64;
var height = 32;
var display;
var index = 0;
var x = 1, y = 0, _x = 0, _y = 0;
window.onload = function(){
    display = new Display( width, height, 12, !!CanvasRenderingContext2D );
    console.log(document.getElementById("screen"));
    console.log(display.container);
    document.getElementById("screen").appendChild( display.container );
    display.fill("#000").flush();
    callback();
};

var callback = function(){
    index = (index + 1) % 9;
    var color = "#00" + index;
    display.setPixel( _x, _y, color );
    display.setPixel( x, y, "#F00" ).flush();
    _x = x;
    _y = y;
    x = (x + 1) % width;
    y = x ? y : (y + 1) % height;
    setTimeout( callback, 0 );
};
