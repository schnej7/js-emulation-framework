function processor(){
    this.start = function(){
        self.postMessage('hi');
        setTimeout( p.start, 0 );
    }
}

var p = new processor();
p.start();
