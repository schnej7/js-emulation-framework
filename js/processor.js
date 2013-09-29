function processor(){
    //Starts Emulation
    this.start = function(){
    }

    //Creates the memory
    this.createMemory = function( memorySize, instructionSize ){
        this.memory = null;
        if( instructionSize === 32 ){
            this.memory = new Uint32Array( memorySize / instructionSize );
        }
        else if( instructionSize === 16 ){
            this.memory = new Uint16Array( memorySize / instructionSize );
        }
        else if( instructionSize === 8 ){
            this.memory = new Uint8Array( memorySize / instructionSize );
        }
        else{
            this.memory = new Array( memorySize / instructionSize );
        }
    }

    //Used to set default memory values
    this.setRom = function( loc, size, data ){
        for( var i = 0; i < size; i++ ){
            this.memory[loc+i] = data[i];
        }
    }

    //Stores the opcodes defined by the config
    this.setOpcodes = function( a_opcodes ){
        this.opcodes = a_opcodes;
    }

    //This is optional, will be used for the developer to write
    //a custome opcode decoder that takes an opcode as an argument
    //and returns the function that should be called
    this.setDecoder = function( a_decoder ){
        this.decode = a_decoder;
    }
}
