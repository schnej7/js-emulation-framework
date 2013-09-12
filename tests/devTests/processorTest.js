if(typeof(Worker)!=="undefined"){
    if(typeof(w)=="undefined"){
        w=new Worker("../../js/processor.js");
    }
    w.onmessage = function (event) {
        console.log(event.data);
    };
}
else{
    console.log("no workers!");
}
