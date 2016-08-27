
// 22  128 8  //mov        turn_rate,      8
// 255 1   0  // :1
// 27  10  65 // ipo        p_rand, ax
// 4   65  255// and        ax,     255
// 156 13  65 // opo        p_abs_turret,     ax 
// 156 14  128// opo        14,     turn_rate
// 12  1   0  // jmp        1

var MAXINT    = 32767;
var MININT    = -32768;
var CPUMEMORY = 1024; // MUST BE POWER OF 2!
var CPUMEMORYAND = CPUMEMORY - 1; 
var MAXCOMMANDS = 64; // MUST BE POWER OF 2!
var MAXCOMMANDSAND = MAXCOMMANDS - 1;
// define this as the Label command
var ZEROCYCLESLIMIT = 20;
var MAXPORTS = 24;


// pole_cpu constructor
function pole_cpu(pole) {
	
	this.pole = pole // we'll test without the link to the pole
	// array of 16 bit integers
	this.program = new Int16Array([22 , 128, 8  ,
								   255, 1  , 0  ,
								   27 , 10 , 65 ,
								   4  , 65 , 255,
								   156, 13 , 65 ,
								   156,	14 , 128,
								   12 , 1 , 0 ]);

	// this.program = new Int16Array([  ]); // jellyhead
								   
	// temp_prog_length_rem = this.program.length % 3;
	if (this.program.length % 3 !=0)
	{
		//throw "program length not a multiple of three";		
		temp_program = new Int16Array( Math.ceil(this.program.length/3)*3 );
		temp_program.set(this.program);
		this.program = temp_program
	}
	this.program_length = this.program.length / 3;
	   
	this.ip = 0;
	this.memory = new Int16Array(CPUMEMORY);
	
	// has to be built!
	// walk through the entire program and build this
	// Better way?
	// Labels - will overwrite themselves if you use the same label!
	// 
	this.labels = {};	
	for (i = 0; i < this.program_length; i++)
	{
		cmd = this.program[i*3];
		if (cmd == 255)
		{
			op1 = this.program[(i*3) + 1];
			this.labels[op1] = i;
		}
	}
	
	this.cpu_timings = { 22:1, 4:1 };
	
	//this.ax = 0;
	
	this.time_slice = 5;
	//this.cmd_cpu_cycles = { 22: 1, 255: 1, 
	// timings actually depend on input/output actions
	this.cycle_count = 0;
	this.zero_cycle_count = 0;
	
}

// user variables start at 128
// lets define label as cmd == 255 (63 if we're casting down)

// where a cmd can have a number or variable operand
// add start with numbers and add 64 to replace with variable

function pole_cpu_update() {

	this.cycle_count += this.time_slice;
	this.zero_cycle_count = 0;

	while ( this.cycle_count > 0 ) {
				

		// putting this at the top means a zero-length program
		// does(should) not cause a crash!
		if (this.ip >= this.program_length)
		{
			this.ip = 0; // return to beginning
			this.cycle_count -= 1; // implicit NOP
			continue; 
		}
		// check for end of code!
		// remember - implicit NOP at end of program


		var pos = this.ip*3;
		var cmd = this.program[pos];
		var op1 = this.program[pos+1];
		var op2 = this.program[pos+2];
		
		// handle the V/N conversion
// CMD NN + 0
// CMD VN + 64
// CMD NV + 128
// CMD VV + 192	
		
		temp = Math.floor( cmd / MAXCOMMANDS );
		if (temp == 1){
			op1 = op1 & CPUMEMORYAND;
		} 
		else if (temp == 2) {
			op2 = op2 & CPUMEMORYAND;
		} 
		else if (temp == 3) {
			op1 = op1 & CPUMEMORYAND;
			op2 = op2 & CPUMEMORYAND;
		}
		cmd = cmd & MAXCOMMANDSAND; // cheap modulo 64
		
		
		// HANDLE THE CPU TIME SLICE COST FOR COMMANDS
		// IPO/OPO/INT - 26,27,28
		// and DEL - 1 -> DEL N, N (no - just include this as zero - add in the command)
		if (cmd == 26 || cmd == 27 || cmd == 28) {
			timings_key = 100*cmd + op1;
		}
		else {
			timings_key = cmd;
		}
		
		if (timings_key in this.cpu_timings) {
			this.cycle_count -= this.cpu_timings[timings_key];
		}
		else if (cmd == 1 && op1 != 0) {// DEL N - N x NOP command
			this.cycle_count -= Math.abs(op1);
		}
		else {
			this.zero_cycle_count += 1;
			if (this.zero_cycle_count >= ZEROCYCLESLIMIT) {
				this.zero_cycle_count -= ZEROCYCLESLIMIT;
				this.cycle_count -= 1;
			}			
		}


		// add time cost from cmd_cpu_cycles array!	

		switch(cmd) {
			case 0: //NOP
				// no effect other than the time cycle cost of 1
				break;
			case 1: //DEL N
				// no effect other than the time cycle cost of abs(N)
				break;
			case 2: //NEG V
				var v = op1 & CPUMEMORYAND;
				this.memory[v] = -this.memory[v];
				break;
			case 3: //INC V
				var v = op1 & CPUMEMORYAND;
				this.memory[v]++;
				break;
			case 4: //DEC V
				var v = op1 & CPUMEMORYAND;
				this.memory[v]--;
				break;
			case 5: //NOT V
				var v = op1 & CPUMEMORYAND;
				this.memory[v] = -this.memory[v];
				break;
			case 6: 
				var v = op1 & CPUMEMORYAND;
				this.memory[v] = -this.memory[v];
				break;

				
			case 22: // MOV V N
				var v = op1 & CPUMEMORYAND;
				this.memory[v] = op2;
				// make sure variable identifier in range
				break;
				
			case 27: // IPO N V
				// force op1 into range 
				var port = Math.abs(op1 % MAXPORTS); // still some output only options in here!
				var v = op2 & CPUMEMORYAND;
				switch(port) {
					case 10:     //Returns random number     [-32768 - 32767]
						this.memory[v] = Math.floor( Math.random() * (MAXINT - MININT + 1) ) + MININT;
					break;
					
					default:
						throw "ipo statement fail!"
				}
				break;
				
			case 4: // AND V N
				var v = op1 & CPUMEMORYAND;
				this.memory[v] = this.memory[v] & op2;
				break;
				
			case 28: // OPO N1 V2
				// force op1 into range 
				var port = Math.abs(op1 % MAXPORTS); // still some output only options in here!
				var v = op2 & CPUMEMORYAND;
				switch(port) {
					case 13:     
						//  Sets turret offset to value      [0 - 255]
					break;
					
					case 14:
						// Turn specified number of degrees
						// make shot!
						poleShootUpdate(this.pole);
					break;
					
					default:
						throw "ipo statement fail!"
				}		
				break;
				
			case 12: // jmp
				if (op1 in this.labels) {
					this.ip = this.labels[op1];
				}
				break;
				
			case MAXCOMMANDSAND: // label
				// empty

				break;	
				
			default:
				console.log(cmd);
				throw "switch statement fail!"
		}
		// increment instruction pointer
		this.ip += 1;
		
	}
}



pole_cpu.prototype = {
	constructor: pole_cpu,
	pole_cpu_update: pole_cpu_update
}

// var cpu = new pole_cpu()

// cpu
