//Hardcoded fontset for the chip8
fontset = [
  0xF0, 0x90, 0x90, 0x90, 0xF0, // 0
  0x20, 0x60, 0x20, 0x20, 0x70, // 1
  0xF0, 0x10, 0xF0, 0x80, 0xF0, // 2
  0xF0, 0x10, 0xF0, 0x10, 0xF0, // 3
  0x90, 0x90, 0xF0, 0x10, 0x10, // 4
  0xF0, 0x80, 0xF0, 0x10, 0xF0, // 5
  0xF0, 0x80, 0xF0, 0x90, 0xF0, // 6
  0xF0, 0x10, 0x20, 0x40, 0x40, // 7
  0xF0, 0x90, 0xF0, 0x90, 0xF0, // 8
  0xF0, 0x90, 0xF0, 0x10, 0xF0, // 9
  0xF0, 0x90, 0xF0, 0x90, 0x90, // A
  0xE0, 0x90, 0xE0, 0x90, 0xE0, // B
  0xF0, 0x80, 0x80, 0x80, 0xF0, // C
  0xE0, 0x90, 0x90, 0x90, 0xE0, // D
  0xF0, 0x80, 0xF0, 0x80, 0xF0, // E
  0xF0, 0x80, 0xF0, 0x80, 0x80  // F
];

timeout = 0;

V = [];

I = 0;

pc = 0;

delay_timer = 0;
sound_timer = 0;

stack = [];
sp = 0;

decode = function( opcode, opcodes ){
    if( !opcodes ){
        return false;
    }
    var code = opcodes.bits & opcode;
    if( typeof( opcodes[code] ) == "function" ){
        return opcodes[code];
    }
    else{
        return decode( opcode, opcodes[code] );
    }
}

opcodes = {
    bits : 0xF000,
    0x0000 : {
        bits: 0x00FF,
        0x0000: function( opcode ){ // 0x00E0: clear the screen
            //console.log("cls");
            for( var k = 0; k < pixels.length; k++ ){
                pixels[k] = false;
            }
            bDisplayUpdate = true;
            display.fill(0).flush();
            pc += 2;
            return true;
        },
        0x000E: function( em ,opcode ){ // 0x00EE: return from a subroutine
            //console.log("return from subroutine");
            pc = stack[--sp] + 2;
            return true;
        }
    },
    0x1000 : function( opcode ){
        pc = 0x0FFF & opcode;
        return true;
    },
    0x2000 : function( opcode ){
        stack[sp++] = pc;
        pc = 0x0FFF & opcode;
        return true;
    },
    0x3000 : function( opcode ){
        if( V[ (0x0F00 & opcode) >> 8 ] === (0x00FF & opcode) ){
            pc += 4;
        }
        else{
            pc += 2;
        }
        return true;
    },
    0x4000 : function( opcode ){
        if( V[ (0x0F00 & opcode) >> 8 ] !== (0x00FF & opcode) ){
            //console.log("skipped");
            pc += 4;
        }
        else{
            pc += 2;
        }
        return true;
    },
    0x5000 : function( opcode ){
        if( V[ (0x0F00 & opcode) >> 8 ] === V[ (0x00F0 & opcode) >> 4 ] ){
            pc += 4;
        }
        else{
            pc += 2;
        }
        return true;
    },
    0x6000 : function( opcode ){
        updateReg( (0x0F00 & opcode) >> 8, 0x00FF & opcode );
        pc += 2;
        return true;
    },
    0x7000 : function( opcode ){
        updateReg( (0x0F00 & opcode) >> 8, (V[ (0x0F00 & opcode) >> 8 ] + (0x00FF & opcode)) & 0x00FF );
        pc += 2;
        return true;
    },
    0x8000 : {
        bits: 0x000F,
        0x0000: function( opcode ){
            updateReg( (0x0F00 & opcode) >> 8, V[ (0x00F0 & opcode) >> 4 ] );
            pc += 2;
            return true;
        },
        0x0001: function( opcode ){
            updateReg( (0x0F00 & opcode) >> 8, V[ (0x0F00 & opcode) >> 8 ] | V[ (0x00F0 & opcode) >> 4 ] );
            pc += 2;
            return true;
        },
        0x0002: function( em ,opcode ){
            updateReg( (0x0F00 & opcode) >> 8, V[ (0x0F00 & opcode) >> 8 ] & V[ (0x00F0 & opcode) >> 4 ] );
            pc += 2;
            return true;
        },
        0x0003: function( em ,opcode ){
            updateReg( (0x0F00 & opcode) >> 8, V[ (0x0F00 & opcode) >> 8 ] ^ V[ (0x00F0 & opcode) >> 4 ] );
            pc += 2;
            return true;
        },
        0x0004: function( em ,opcode ){
            updateReg( (0x0F00 & opcode) >> 8, V[ (0x0F00 & opcode) >> 8 ] + V[ (0x00F0 & opcode) >> 4 ] );
            updateReg( 0xF, ( V[ (0x0F00 & opcode) >> 8 ] & 0x100 ) >> 8 );
            updateReg( (0x0F00 & opcode) >> 8, V[ (0x0F00 & opcode) >> 8 ] & 0x00FF );
            pc += 2;
            return true;
        },
        0x0005: function( em ,opcode ){
            updateReg( (0x0F00 & opcode) >> 8, V[ (0x0F00 & opcode) >> 8 ] + 0x100 );
            updateReg( (0x0F00 & opcode) >> 8, V[ (0x0F00 & opcode) >> 8 ] - V[ (0x00F0 & opcode) >> 4 ] );
            updateReg( 0xF, (V[ (0x0F00 & opcode) >> 8 ] & 0x100) >> 8 );
            updateReg( (0x0F00 & opcode) >> 8, V[ (0x0F00 & opcode) >> 8 ] & 0x00FF );
            pc += 2;
            return true;
        },
        0x0006: function( em ,opcode ){
            updateReg( 0xF, V[ (0x0F00 & opcode) >> 8 ] & 0x1 );
            updateReg( (0x0F00 & opcode) >> 8, V[ (0x0F00 & opcode) >> 8 ] >> 1 );
            pc += 2;
            return true;
        },
        0x0007: function( em ,opcode ){
            updateReg( (0x00F0 & opcode) >> 4, V[ (0x00F0 & opcode) >> 4 ] + 0x100 );
            updateReg( (0x0F00 & opcode) >> 8, V[ (0x00F0 & opcode) >> 4 ] - V[ (0x0F00 & opcode) >> 8 ] );
            updateReg( 0xF, (V[ (0x00F0 & opcode) >> 4 ] & 0x100) >> 8 );
            updateReg( (0x00F0 & opcode) >> 4, V[ (0x00F0 & opcode) >> 4 ] & 0x00FF );
            pc += 2;
            return true;
        },
        0x000E: function( em ,opcode ){
            updateReg( 0xF, V[ (0x0F00 & opcode) >> 8 ] & 0x80 ? 0x1 : 0x0 );
            updateReg( (0x0F00 & opcode) >> 8, V[ (0x0F00 & opcode) >> 8 ] << 1 );
            pc += 2;
            return true;
        }
    },
    0x9000 : function( opcode ){
        if( V[ (0x0F00 & opcode) >> 8 ] !== V[ (0x00F0 & opcode) >> 4 ] ){
            pc += 4;
        }
        else{
            pc += 2;
        }
        return true;
    },
    0xA000 : function( opcode ){
        I = opcode & 0x0FFF;
        pc += 2;
        return true;
    },
    0xB000 : function( opcode ){
        pc = (opcode & 0x0FFF) + V[ 0 ];
        return true;
    },
    0xC000 : function( opcode ){
        updateReg( (0x0F00 & opcode) >> 8, ( Math.random() * 0x80 ) & ( opcode & 0x00FF ) );
        pc += 2;
        return true;
    },
    0xD000 : function( opcode ){
        var X = V[(opcode & 0x0F00) >> 8];
        var Y = V[(opcode & 0x00F0) >> 4];
        var spriteHeight = opcode & 0x000F;

        updateReg( 0xF, 0 );
        for( var hline = 0; hline < spriteHeight; hline++ ){
            var spriteRow = memoryView[ I + hline ];
            for( var vline = 0; vline < 8; vline++ ){
                //If the sprite specifies a difference at this pixel
                if( spriteRow & (0x80 >> vline) ){
                    var pixelIndex = ((Y + hline) * 64) %( 64*32 ) + (X + vline) % 64;
                    //flip the bit
                    var bit = !pixels[ pixelIndex ];
                    pixels[ pixelIndex ] = bit;
                    //update the display
                    display.setPixel((X + vline) % 64, (Y + hline) % 32, bit?1:0);
                    //if the bit was reset, set VF
                    bit || (updateReg( 0xF, 1 ) );
                }
            }
        }
        display.flush( X, Y, 8, spriteHeight );
        pc += 2;
        return true;
    },
    0xE000 : {
        bits: 0x00FF,
        0x009E: function( opcode ){
            if( keys[ V[ (opcode & 0x0F00) >> 8 ] ] ){
                pc += 4;
            }
            else{
                pc += 2;
            }
            return true;
        },
        0x00A1: function( opcode ){
            if( !keys[ V[ (opcode & 0x0F00) >> 8 ] ] ){
                pc += 4;
            }
            else{
                pc += 2;
            }
            return true;
        }
    },
    0xF000 : {
        bits: 0x00FF,
        0x0007: function( opcode ){
            updateReg( (0x0F00 & opcode) >> 8, delay_timer );
            pc += 2;
            return true;
        },
        0x000A: function( opcode ){
            bWaitingForKey = true;
            return true;
        },
        0x0015: function( opcode ){
            delay_timer = V[ (0x0F00 & opcode) >> 8 ];
            pc += 2;
            return true;
        },
        0x0018: function( opcode ){
            sound_timer = V[ (0x0F00 & opcode) >> 8 ];
            pc += 2;
            return true;
        },
        0x001E: function( opcode ){
            I += V[ (0x0F00 & opcode) >> 8 ];
            if( I & 0xF000 ){
                updateReg( 0xF, 1 );
            }
            else{
                updateReg( 0xF, 0 );
            }
            I = I & 0x0FFF;
            pc += 2;
            return true;
        },
        0x0029: function( opcode ){
            I = 0x50 + ( V[ (0x0F00 & opcode) >> 8 ] * 5 );
            pc += 2;
            return true;
        },
        0x0033: function( opcode ){
            var VX = V[(opcode & 0x0F00) >> 8]
            memoryView[I]     = Math.floor( VX / 100);
            memoryView[I + 1] = Math.floor( VX / 10) % 10;
            memoryView[I + 2] = VX % 10;
            pc += 2;
            return true;
        },
        0x0055: function( opcode ){
            X = (opcode & 0x0F00) >> 8;
            for( var i = 0; i <= X; i++ ){
                memoryView[I+i] = V[i];
            }
            pc += 2;
            return true;
        },
        0x0065: function( opcode ){
            X = (opcode & 0x0F00) >> 8;
            for( var i = 0; i <= X; i++ ){
                updateReg( i, memoryView[I+i] );
            }
            pc += 2;
            return true;
        }
    }
};
