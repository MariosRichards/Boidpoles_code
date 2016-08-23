
// 22  128 8  //mov        turn_rate,      8
// 255 1   0  // :1
// 27  10  65 // ipo        p_rand, ax
// 4   65  255// and        ax,     255
// 156 13  65 // opo        p_abs_turret,     ax 
// 156 14  128// opo        14,     turn_rate
// 12  1   0  // jmp        1


// pole_cpu constructor
function pole_cpu() {
	
	// this.pole = pole // we'll test without the link to the pole
	// array of 16 bit integers
	this.program = new Int16Array([22 , 128, 8  ,
								   255, 1  , 0  ,
								   27 , 10 , 65 ,
								   4  , 65 , 255,
								   156, 13 , 65 ,
								   156,	14 , 128,
								   12 , 1 , 0 ]);
	this.ip = 0;
	this.memory = new Int16Array(1024);
	this.labels = {1:1};
	//this.ax = 0;
	
	this.time_slice = 5;
	//this.cmd_cpu_cycles = { 22: 1, 255: 1, 
	// timings actually depend on input/output actions
	this.cycle_count = 0;
	this.zero_cycle_count = 0;
	
}

// user variables start at 128
// lets define label as cmd == 255

// where a cmd can have a number or variable operand
// add start with numbers and add 64 to replace with variable

function pole_cpu_update() {
	
	
	this.cycle_count = 0
	this.zero_cycle_count = 0
	
	while (this.cycle_count < this.time_slice) {
		
		var pos = this.ip*3;
		var cmd = this.program[pos]
		var op1 = this.program[pos+1]
		var op2 = this.program[pos+2]
		
		switch(cmd) {
			case 22: // MOV V N
				var v = Math.abs(op1 % 1024);
				this.memory[v] = op2;
				// make sure variable identifier in range
				this.cycle_count += 1
				break;
			case 27: // IPO N V
				// force op1 into range 
				var port = Math.abs(op1 % 24); // still some output only options in here!
				var v = Math.abs(op2 % 1024);
				switch(port) {
					case 10:     //Returns random number     [-32768 - 32767]
						this.memory[v] = Math.floor( Math.random() * (32767 + 32768 + 1) ) - 32767;
						this.zero_cycle_count += 1
					break;
					default:
						throw "ipo statement fail!"
				}
				
				break;
			case 4: // AND V N
				var v = Math.abs(op1 % 1024);
				this.memory[v] = this.memory[v] & 255;
				this.cycle_count += 1
				break;
			case 156: // OPO N1 V2

				// force op1 into range 
				var port = Math.abs(op1 % 24); // still some output only options in here!
				var v = Math.abs(op2 % 1024);
				switch(port) {
					case 13:     
						//  Sets turret offset to value      [0 - 255]
						this.zero_cycle_count += 1
					break;
					case 14:
					
						// Turn specified number of degrees
						this.zero_cycle_count += 1
					break;
					default:
						throw "ipo statement fail!"
					
				}		
			
			
				break;
			case 12: // jmp
				if (op1 in this.labels) {
					this.ip = this.labels[op1];
				}
				this.zero_cycle_count += 1
				break;
			case 255: // label
				// empty
				this.zero_cycle_count += 1
				break;			
			default:
				throw "switch statement fail!"
				
		}
		
		this.ip += 1
		console.log(this.ip)
		// to prevent infinite loops!
		if (this.zero_cycle_count >=20){
			this.zero_cycle_count -= 20;
			this.cycle_count += 1
		}
		
		// add time cost from cmd_cpu_cycles array!	
	}
}



pole_cpu.prototype = {
	constructor: pole_cpu,
	pole_cpu_update: pole_cpu_update
}

var cpu = new pole_cpu()

cpu
