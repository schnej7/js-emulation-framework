var displayTests = {
    name : "Display Tests",
    tests : [
    {
      name: "Fill window",
      src: ["../../js/display.js"],
      globals: ["display"],
      time: 0.003,
      before: function(){
        var screen = document.createElement('div');
        screen.id = "screen";
        document.getElementsByTagName('body')[0].appendChild(screen);
        display = new Display( 64, 32, 12, !!CanvasRenderingContext2D );
        document.getElementById("screen").appendChild( display.container );
      },
      test: function(){
        display.fill("#000").flush();
      }
    },
    {
      name: "Multi Pixel Render",
      src: ["../../js/display.js"],
      globals: ["display"],
      time: 0.004,
      before: function(){
        var screen = document.createElement('div');
        screen.id = "screen";
        document.getElementsByTagName('body')[0].appendChild(screen);
        display = new Display( 64, 32, 12, !!CanvasRenderingContext2D );
        document.getElementById("screen").appendChild( display.container );
      },
      test: function(){
        for( var y = 0; y < 32; y++ ){
          for( var x = 0; x < 64; x++ ){
            display.setPixel( x, y, ("#0" + x%9) + y%9 );
          }
        }
        display.flush();
      }
    },
    {
      name: "Single Pixels Render",
      src: ["../../js/display.js"],
      globals: ["display"],
      time: 0.005,
      before: function(){
        var screen = document.createElement('div');
        screen.id = "screen";
        document.getElementsByTagName('body')[0].appendChild(screen);
        display = new Display( 64, 32, 12, !!CanvasRenderingContext2D );
        document.getElementById("screen").appendChild( display.container );
      },
      test: function(){
        for( var y = 0; y < 32; y++ ){
          for( var x = 0; x < 64; x++ ){
            display.setPixel( x, y, ("#0" + x%9) + y%9 ).flush();
          }
        }
      }
    }]
};
