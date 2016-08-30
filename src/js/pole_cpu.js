
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
var MAXCOMMANDS = 34; // MUST BE POWER OF 2!
// var MAXCOMMANDSAND = MAXCOMMANDS - 1;
// define this as the Label command
var ZEROCYCLESLIMIT = 20;
var MAXPORTS = 24;
var BITLENGTH = 16;
// memory locations

var DSPD = 0;//Desired speed robot is trying to achieve.
var DHD = 1;//Desired heading robot is trying to achieve.
var TPOS = 2; // current turret offset
var ACC = 3; //accuracy value from last scan
var SWAP  = 4;
var TRID = 5;//ID of last target scanned (by any scan).
var TRDIR = 6;//Relative heading of last target scanned.
var TRSPD = 7;//Throttle of last target scanned.
var COLCNT = 8;//Collision count.
var METERS = 9;//Meters travelled. 15 bits used.. (32767+1)=0
var COMBASE = 10;//Current base of the communications queue
var COMEND = 11;//Current end-point of the communications queue
// 12?
var TRVEL = 13;//Absolute speed (cm/cycle) of last target scanned
var FLAGS = 64;
var AX = 65;//ax register
var BX = 66;//bx register
var CX = 67;//cx register
var DX = 68;//dx register
var EX = 69;//ex register
var FX = 70;//fx register
var SP = 71;//stack pointer



// comparison flag bits
var ZERO_FL = 1<<3;     // Zero flag
var GRTR_FL = 1<<2;
var LESS_FL = 1<<1;
var EQUL_FL = 1;



var LABEL_CMD = 255;

var MAXIPO = 19; // max input
var MAXOPO = 13; // max output
var MAXINTERR =20; // max interrupt

// pole_cpu constructor
function pole_cpu(pole) {
	
	this.pole = pole; // we'll test without the link to the pole
	// array of 16 bit integers
	
	this.config = new Int16Array([  0,  0,  0,
									0,  0,  1,
									1,  2,  2,
									3,  3,  4  ]);

	this.config_array = new Int16Array(7);
	// Scan 5, Weap 2, Arm 2, Eng 2, Heat 1, Mines 0, Shield 0
	for (i = 0; i < this.config.length; i++)
	{
		if (this.config_array[ this.config[i] ] < 5)
		{
			this.config_array[ this.config[i] ]++;
		}
	}



	this.program = new Int16Array([18     , 128, 8  ,
								   255    , 1  , 0  ,
								   32     , 17 , 65 ,
								   13     , 65 , 255,
								   33+128 , 10 , 65 ,
								   33+128 ,	12 , 128,
								   22     , 1  , 0 ]);

	// code to create a random program!					   
	randomArray = (length, max) => [...new Array(length)]
		.map((_, i) => Math.round(Math.random() * max));
		
	this.program = new Int16Array( randomArray( Math.round(Math.random() * 255) , 256) );
	// end code to create a random program!
	
	// this.program = new Int16Array([  ]); // jellyhead
								   
	// temp_prog_length_rem = this.program.length % 3;
	if (this.program.length % 3 !=0)
	{
		//throw "program length not a multiple of three";		
		temp_program = new Int16Array( Math.ceil(this.program.length/3)*3 );
		temp_program.set(this.program);
		this.program = temp_program;
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
		if (cmd == LABEL_CMD)
		{
			op1 = this.program[(i*3) + 1];
			this.labels[op1] = i;
		}
	}
	
	this.cpu_timings = {
		0:1,  2:1,  3:1,  4:1,  5:1,   6:1,  7:1, 8:1, 9:1,
		10:1, 11:1, 12:1, 13:1, 14:1, 15:10, 16:10, 17:10,
		18:1, 19:3, 20:2, 21:1, 22:1,
		3101:10, 3102:5, 3103:2, 3104:1, 3105:2, 3106:2,
		3107:32, 3108:1, 3109:2, 3110:4, 3111:5, 3112:1,
		3113:1,  3114:1, 3115:1, 3116:1, 3117:1, 3118:3,
		3200:4,  3201:4, 3202:4, 3203:4, 3204:4, 3205:4, 3206:4, 
		3207:1,  3208:4, 3209:4, 3210:4, 3211:4, 3212:4, 3213:4,
		3214:5,  3215:5, 3216:7, 3217:4, 3218:44,
		3300:4,  3301:4, 3302:4, 3303:4, 3304:4, 3305:4, 3306:4,
		3307:4,  3308:4, 3309:4, 3310:4, 3311:4, 3312:7
	};
		


	
	// this.ax = 0;
	
	this.time_slice = 5;
	// this.cmd_cpu_cycles = { 22: 1, 255: 1, 
	// timings actually depend on input/output actions
	this.cycle_count = 0;
	this.zero_cycle_count = 0;
	
}

// We need an update function to be called from pole_update to set some memory values!


// We also need a function to be called from pole_update to get the config values!





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
			op1 = this.memory[ op1 & CPUMEMORYAND ];
		} 
		else if (temp == 2) {
			op2 = this.memory[ op2 & CPUMEMORYAND ];
		} 
		else if (temp == 3) {
			op1 = this.memory[ op1 & CPUMEMORYAND ];
			op2 = this.memory[ op2 & CPUMEMORYAND ];
		}
		cmd = cmd % MAXCOMMANDS; 
		
		
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
				// no effect other than the time cycle cost of 
				this.cycle_count -= Math.abs(op1);
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
				this.memory[v] = ~this.memory[v];
				break;
			case 6: //ADD #N N
				var v = op1 & CPUMEMORYAND;
				this.memory[v] += op2;
				break;
			case 7: //SUB #N N
				var v = op1 & CPUMEMORYAND;
				this.memory[v] -= op2;
				break;
			case 8: //SHL #N N
				var v = op1 & CPUMEMORYAND;
				this.memory[v] <<= op2; // could force this into the range of -16/16
				break;
			case 9: //SHR #N N
				var v = op1 & CPUMEMORYAND;
				this.memory[v] >>= op2;
				break;
			case 10: //ROL #N V
				var v = op1 & CPUMEMORYAND;
				this.memory[v] = ( this.memory[v] << op2 ) || ( this.memory[v] >> (BITLENGTH - op2) );
				break;
			case 11: //ROR #N V
				var v = op1 & CPUMEMORYAND;
				this.memory[v] = ( this.memory[v] >> op2 ) || ( this.memory[v] << (BITLENGTH - op2) );
				break;
			case 12: //OR  #N N
				var v = op1 & CPUMEMORYAND;
				this.memory[v] |= op2;
				break;
			case 13: //AND #N V
				var v = op1 & CPUMEMORYAND;
				this.memory[v] &= op2;
				break;
			case 14: //XOR #N V
				var v = op1 & CPUMEMORYAND;
				this.memory[v] ^= op2;
				break;
			case 15: //MPY #N N
				var v = op1 & CPUMEMORYAND;
				this.memory[v] *= op2;
				break;
			case 16: //DIV #N N
				var v = op1 & CPUMEMORYAND;
				if (op2 == 0) { op2=1;}
				this.memory[v] /= op2;
				break;				
			case 17: //MOD #N N
				var v = op1 & CPUMEMORYAND;
				if (op2 == 0) { op2=1;}
				this.memory[v] %= op2;
				break;
			case 18: //MOV #N N
				var v = op1 & CPUMEMORYAND;
				this.memory[v] = op2;
				break;
			case 19: //XCHG #N #N
				var v1 = op1 & CPUMEMORYAND;
				var v2 = op2 & CPUMEMORYAND;
				this.memory[SWAP] = this.memory[v1];
				this.memory[v1] = this.memory[v2];
				this.memory[v2] = this.memory[SWAP];
				break;
			case 20: //TEST N N // Ands two numbers, result not stored, flags set
				this.memory[FLAGS] &= ~(GRTR_FL+LESS_FL); // After a TEST, the Greater flag and the Less flag are always 0.
				// Equal flag:    Set when operands are equal.	
				if ( op1 == op2 ) {	this.memory[FLAGS] |= EQUL_FL; }
				// Zero flag:     Set when the binary "AND" of operands #1 & #2 = 0.
				if ( (op1 & op2) == 0 ) { this.memory[FLAGS] |= ZERO_FL; }

				break;					
			case 21: //CMP N N // Compares two numbers, results in flags reg.
				// Equal flag:    Set when operands are equal.
				if ( op1 == op2 ) {	this.memory[FLAGS] |= EQUL_FL; }				
				// Less flag:     Set when operand#1 < operand#2
				if ( op1 < op2 ) {	this.memory[FLAGS] |= LESS_FL; }
				// Greater flag:  Set when operand#1 > operand#2				
				if ( op1 > op2 ) {	this.memory[FLAGS] |= GRTR_FL; }
				// Zero flag:     Set when operands are equal AND are 0.
				if ( op1 == op2 && op1 == 0 ) {	this.memory[FLAGS] |= ZERO_FL; }				
				break;					
			case 22: // JMP N      Jumps program (ip) to label #N
				if (op1 in this.labels) {this.ip = this.labels[op1];}
				break;
			case 23: // JLS N      Jumps to label N if last compare was <
				if (this.memory[FLAGS] & LESS_FL){
					if (op1 in this.labels) {this.ip = this.labels[op1];}
					}
				break;
			case 24: // JGR N      Jumps to label N if last compare was >
				if (this.memory[FLAGS] & GRTR_FL){
					if (op1 in this.labels) {this.ip = this.labels[op1];}
					}
				break;
			case 25: // JNE N      Jumps to label N if last compare was <>
				if ( !(this.memory[FLAGS] & EQUL_FL) ){
					if (op1 in this.labels) {this.ip = this.labels[op1];}
					}
				break;
			case 26: // JEQ N      Jumps to label N if last compare was =
				if (this.memory[FLAGS] & EQUL_FL){
					if (op1 in this.labels) {this.ip = this.labels[op1];}
					}
				break;
			case 27: // JAE N      Jumps to label N if last compare was >=
				if ( (this.memory[FLAGS] & EQUL_FL) && (this.memory[FLAGS] & GRTR_FL) ) {
					if (op1 in this.labels) {this.ip = this.labels[op1];}
					}
				break;
			case 28: // JBE N      Jumps to label N if last compare was <=
				if ( (this.memory[FLAGS] & EQUL_FL) && (this.memory[FLAGS] & LESS_FL) ) {
					if (op1 in this.labels) {this.ip = this.labels[op1];}
					}
				break;
			case 29: // JZ  N      Jumps to label N if last compare was 0
				if (this.memory[FLAGS] & ZERO_FL){
					if (op1 in this.labels) {this.ip = this.labels[op1];}
					}
				break;
			case 30: // JNZ N      Jumps to label N if last compare was not 0
				if ( !(this.memory[FLAGS] & ZERO_FL) ){
					if (op1 in this.labels) {this.ip = this.labels[op1];}
					}
				break;



			case 31: // INT N      Executes interrupt number N
				var interrupt = Math.abs(op1 % MAXINTERR);
				switch(interrupt) {
					case 0: //0   - Destruct     Detonate the robot (if I go down, you go down with me!)
					// function<<<<<<
					break;
					case 1: //  1  10 Reset        Resets robot program.
					// ??????
					// completely initialise everything?
					break;
					case 2://2   5 Locate       Sets EX,FX registers equal to X,Y coordinates.
					// function<<<<<<
					break;
					case 3://3   2 Keepshift    Sets Keepshift, input:     AX 0 = off, non-0 = on
					// function<<<<<<
					break;				
					case 4://4   1 Overburn     Sets Overburn,  input:     AX 0 = off, non-0 = on
					// function<<<<<<
					break;				
					case 5://5   2 ID           Returns robot ID number in FX
					// function<<<<<<
					break;				
					case 6://6   2 Timer        Returns game clock in EX:FX (32-bit number)
					// function<<<<<<
					break;
					case 7://7  32 Find Angle   Returns angle to point specified in EX,FX; AX=result
					// atan2(values forced into [0-1500]
					break;
					case 8://8   1 Target-ID    Returns ID of last robot scanned (with any scan) in FX
						this.memory[FX] = this.memory[TRID];
					break;
					case 9://9   2 Target-Info  Returns info on last scanned target (EX=dir,FX=throttle)
						this.memory[EX] = this.memory[TRDIR];
						this.memory[FX] = this.memory[TRSPD];
					break;
					case 10://10   4 Game-Info    Returns info: DX=Total number of robots active,                                   EX=Match number,                                   FX=Number of matches
					// function<<<<<<
					break;
					case 11://11   5 Robot-info   Returns info: DX=Robot speed (in cm per game-cycle),                                   EX=Time since last damage taken                                   FX=Time since a fired shot hit a robot.                                   (time measured in game-cycles)                                   (robot speed is current as of int call)
					// function<<<<<<
					break;
					case 12://12   1 Collisions   Returns collision count in FX
						this.memory[FX] = this.memory[COLCNT];
					break;
					case 13://13   1 Reset ColCnt Resets collision count back to 0.
						this.memory[COLCNT] = 0;
					break;
					case 14://14   1 Transmit     Transmits the data in AX on the current channel.
					// function<<<<<<
					break;
					case 15://15   1 Receive      Returns the next item in com queue in FX
					// function<<<<<<
					break;
					case 16://16   1 DataReady    Returns the amount of data in queue in FX (0 for none).
					// function<<<<<<
					break;					
					case 17://17   1 ClearCom     Empties the Com Queue
					// function<<<<<<
					break;					
					case 18://18   3 Kills/Deaths Returns info: DX=Kill Count (spans multiple rounds)                                   EX=Kill Count (for this round only)                                   FX=Deaths     (spans multiple rounds)
					// function<<<<<<
					break;					
					case 19://19   1 ClearMeters  Resets the 'meters' variable to 0.
						this.memory[METERS] = 0;
					break;										
				}
				break;
				
			case 32: // IPO N V// NOTE - V is fixed - would change order, but better to remain ATRobots compatible
				// force op1 into range 
				var port = Math.abs(op1 % MAXIPO); // still some output only options in here!
				var v = op1 & CPUMEMORYAND;
				switch(port) {
					case 0: // 17   0   I/O Scan-Arc          Sets/Returns scan-arc width.      [0 - 64]
					break;
					case 1: // 18   0   I/O Overburn          Sets/Returns overburn status
					break;
					case 2: // 19   0   I/O Transponder       Sets/Returns current transponder ID
					break;
					case 3: // 20   0   I/O Shutdown-Level    Sets/Returns shutdown-level.
					break;
					case 4: // 21   0   I/O Com Channel       Sets/Returns com channel setting
					break;
					case 5: // 22   0   I/O Mine Layer        Lays mine or Returns mines-remaining.
					break;
					case 6: // 23   0   I/O Mine Trigger      Detonates/returns previously-placed mines.
					break;
					case 7: // 24   0   I/O Shield            Sets/Returns shield's status (0=off, else=on)
					break;					
					case 8:  // 1   0    I  Spedometer        Returns current throttle setting[-75- 100]
					break;
					case 9:  // 2   0    I  Heat Sensor       Returns current heat-level       [0 - 500]
					break;
					case 10:  // 3   0    I  Compass           Returns current heading          [0 - 255]
					break;
					case 11:  // 4   0    I  Turret Sensor     Returns current turret offset    [0 - 255]
					break;
					case 12:  // 5   0    I  Turret Sensor     Returns absolute turret heading  [0 - 255]
					break;
					case 13:  // 6   0    I  Damage Sensor     Returns current armor level      [0 - 100]
					break;
					case 14:  // 7   1    I  Scanner           Returns range to nearest target in scan arc
					break;
					case 15:  // 8   1    I  Accuracy          Returns accuracy of last scan     [-2 - 2]
					break;
					case 16:  // 9   3    I  Radar             Returns range to nearest target
					break;
					case 17: // 10   0    I  Random Generator  Returns random number     [-32768 - 32767]
						this.memory[v] = Math.floor( Math.random() * (MAXINT - MININT + 1) ) + MININT;
					break;
					case 18: // 16  40    I  Sonar             Returns heading to nearest target[0 - 255]
					break;

					default:
						throw "ipo statement fail!";
				}
				break;

			case 33: // OPO N1 V2
				// force op1 into range 
				var port = Math.abs(op1 % MAXOPO); // still some output only options in here!
				var v = op2 & CPUMEMORYAND;
				switch(port) {
					case 0: // 17   0   I/O Scan-Arc          Sets/Returns scan-arc width.      [0 - 64]
					break;
					case 1: // 18   0   I/O Overburn          Sets/Returns overburn status
					break;
					case 2: // 19   0   I/O Transponder       Sets/Returns current transponder ID
					break;
					case 3: // 20   0   I/O Shutdown-Level    Sets/Returns shutdown-level.
					break;
					case 4: // 21   0   I/O Com Channel       Sets/Returns com channel setting
					break;
					case 5: // 22   0   I/O Mine Layer        Lays mine or Returns mines-remaining.
					break;
					case 6: // 23   0   I/O Mine Trigger      Detonates/returns previously-placed mines.
					break;
					case 7: // 24   0   I/O Shield            Sets/Returns shield's status (0=off, else=on)
					break;						
					case 8: // 11   0    O  Throttle          Sets throttle                  [-75 - 100]
					break;
					case 9: // 12   0    O  Rotate Turret     Offsets turret (cumulative)
					break;
					case 10: // 13   0    O  Aim Turret        Sets turret offset to value      [0 - 255]     
					break;
					case 11: // 14   0    O  Steering          Turn specified number of degrees
					break;
					case 12: // 15   3    O  Weapon control    Fires weapon w/ angle adjustment  [-4 - 4]
						poleShootUpdate(this.pole);					
					break;

					default:
						throw "ipo statement fail!";
				}		
				break;
				
			// case MAXCOMMANDSAND: // label
				// // empty

				// break;	
				
			default:
				console.log(cmd);
				throw "switch statement fail!";
		}
		// increment instruction pointer
		this.ip += 1;
		
	}
}



pole_cpu.prototype = {
	constructor: pole_cpu,
	pole_cpu_update: pole_cpu_update
};

// var cpu = new pole_cpu()

// cpu
