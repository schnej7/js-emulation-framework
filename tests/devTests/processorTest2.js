function processor(){
    var that = this;
    this.t1 = 0;
    this.t0 = 0;
    this.start = function(){
        that.t1 = new Date().getTime();
        console.log(that.t1 - that.t0);
        that.t0 = new Date().getTime();
        setTimeout( p.start, 0 );
    }
}

var p = new processor();
p.start();
