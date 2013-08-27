var lenght = 64;
var height = 32;
var display;
window.onload = function(){
    console.log("here");
    display = new Display( length, height, 12, !CanvasRenderingContext2D );
    display.fill("#000").flush();
    document.getElementById("screen").appendChild( display.container );
    callback(1, 1);
};

var callback = function(x, y){
    var _x = x > 0 ? x - 1 : length - 1;
    var _y = x > 0 ? y : y - 1;
    display.setPixel( _x, _y, "#000" );
    display.setPixel( x, y, "#F00" );
    display.flush();
    //setTimeout( callback( (x + 1) % length, y +  Math.floor((x + 1)/length) ), 1000 );
};
