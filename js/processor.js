function processor(){
    //Starts Emulation
    this.start = function(){
        this.init();
    }

    //Setup for anything that needs to happen
    //before emulation starts
    this.init = function(){
        //Init the registers and flags if they have
        //not been already
        if (!this.registers){
            this.registers = {};
        }
        if (!this.registers['pc']){
            this.registers['pc'] = 0;
        }
        if (!this.flags){
            this.flags = {};
        }
        //Set the size of the opcodes if not specified
        //to 2 (arbitrary) this should never happen
        if (!this.opcodeSize){
            this.opcodeSize = 2;
        }
        //If there is no defined debug logic
        //make it an empty function
        if (!this.debugStep){
            this.debugStep = function(){};
        }
    }

    //Do a full cycle of emulation
    this.emulateCycle = function(){
        //Fetch the opcode
        var opcode = this.fetchNextOpcode();
        //Decode the opcode
        var opcodeMethod = this.decode( opcode );
        //Execute the opcode
        opcodeMethod();
        //Run any debug code
        this.debugStep();
        //Check for a need to pause
        if( !this.paused ){
            this.nextOpcodeTimer = setTimeout( this.emulateCycle, this.opcodeTimeout );
        }
    }

    //Helper function to get the next opcode
    this.fetchNextOpcode = function(){
        var opcode = 0;
        for( var i = 0; i < this.opcodeSize; i++ ){
            opcode += this.memoryView[this.pc + i] << ((this.opcodeSize-1)-i) * this.instructionSize;
        }
        this.registers['pc'] += this.instructionSize;
        return opcode;
    }

    //Creates the memory
    //Optimized for 32, 16, and 8 bit memory block sizes
    this.createMemory = function( memorySize, blockSize ){
        this.memorySize = memorySize;
        this.blockSize = blockSize;
        this.memory = null;
        if( blockSize === 32 ){
            this.memory = new Uint32Array( memorySize / blockSize );
        }
        else if( blockSize === 16 ){
            this.memory = new Uint16Array( memorySize / blockSize );
        }
        else if( blockSize === 8 ){
            this.memory = new Uint8Array( memorySize / blockSize );
        }
        else{
            this.memory = new Array( memorySize / blockSize );
        }
    }

    //Used to set default memory values before emulation
    //and to load game data
    this.setMemory = function( loc, size, data ){
        for( var i = 0; i < size; i++ ){
            this.memory[loc+i] = data[i];
        }
    }

    //Stores the opcodes defined by the config and the
    //size of each opcode in terms of memory blocks
    this.setOpcodes = function( a_opcodes, a_instructionSize ){
        this.instructionSize = a_instructionSize;
        this.opcodes = a_opcodes;
    }

    //This is optional, will be used for the developer to write
    //a custome opcode decoder that takes an opcode as an argument
    //and returns the function that should be called
    this.setDecoder = function( a_decoder ){
        this.decode = a_decoder;
    }

    //Add a flag
    this.addRegisters = function( a_name, a_default ){
        if (!this.flags){
            this.flags = {};
        }
        this.flags[a_name] = a_default;
    }

    //Add registers
    this.addRegisters = function( a_name, a_registers ){
        if (!this.registers){
            this.registers = {};
        }
        this.registers[a_name] = a_registers;
    }
}
