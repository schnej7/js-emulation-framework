function emulatorBuilder(){
    this.opcodeSize = function( a_size ){
    }
    this.memorySize = function( a_memorySize, a_instructionSize ){
    }
    this.instructionSet = function( a_instructionSet ){
    }
    this.build = function(){
        var e = new emulator();
        return e;
    }
}


function emulator(){
    this.display = null;
    this.processor = null;
    this.controller = null;
}
