

//Pole specific range vars

var BaseAngleRange = { min: 0, max: 255};
var RadiansRange = { min: 0, max: 2*Math.PI}; //Important to remember it's not from -Pi to Pi ; Pass every Math.atan through normalisation function

var CPUBaseAngleRange = { min: -127, max: 128};

var ThrottleRange = { min: -75, max: 100};

var HeatRange = { min: 0, max: 500};

var ScanRange = { min: 0, max: 1500};

//Constants

var MAXINT = 32767;

var CANVAS_WIDTH = 960, //Default 960
    CANVAS_HEIGHT = 500; //Default 500
        
var POLE_COLLISION_RADIUS = 8;
var BULLET_COLLISION_RADIUS = 3;

var POLE_COLLISION_COOLDOWN = 0;
var BULLET_COLLISION_COOLDOWN = POLE_COLLISION_COOLDOWN;

var POLE_MAX_NONOVERBURN_SPEED = 1;
var POLE_THROTTLE_CHANGE_PER_TICK = POLE_MAX_NONOVERBURN_SPEED*0.04;

var POLE_MAX_STEERING_PER_TICK = 8;

var INITIAL_BULLET_COLLISION_COOLDOWN = 30;

var POLE_SHOOTING_COOLDOWN_BASE = 30; //300
var SHOOTING_COOLDOWN_MAX_VARIANCE = 10; //100

var BULLET_VELOCITY = 1;

var SCANNER_GRAPHIC_COOLDOWN = 8;
var SCANNER_CONE_RANGE = ScanRange.max;

//Vars

var INITIAL_NUMBER_POLES = 100, //Default 120
	TAIL_LENGTH = 12, //Default 12
	DEGREES = 180 / Math.PI,
	RADIANS = Math.PI / 180;
	
var INITIAL_NUMBER_BULLETS = 0;
	
var UNIQUE_KEY = -1;

var BULLET_UNIQUE_KEY = -1;

var VISIONCONES_ACTIVE = true;


