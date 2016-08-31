


//Constants

var CANVAS_WIDTH = 960, //Default 960
    CANVAS_HEIGHT = 500; //Default 500
        
var POLE_COLLISION_RADIUS = 8;
var BULLET_COLLISION_RADIUS = 3;

var POLE_COLLISION_COOLDOWN = 30;
var BULLET_COLLISION_COOLDOWN = POLE_COLLISION_COOLDOWN;

var INITIAL_BULLET_COLLISION_COOLDOWN = 30;

var POLE_SHOOTING_COOLDOWN_BASE = 30; //300
var SHOOTING_COOLDOWN_MAX_VARIANCE = 10; //100

var BULLET_VELOCITY = 1;

//Vars

var INITIAL_NUMBER_POLES = 100, //Default 120
	TAIL_LENGTH = 12, //Default 12
	DEGREES = 180 / Math.PI,
	RADIANS = Math.PI / 180;
	
var INITIAL_NUMBER_BULLETS = 0;
	
var UNIQUE_KEY = -1;

var BULLET_UNIQUE_KEY = -1;

var VISIONCONES_ACTIVE = true;


//Pole specific range vars

var BaseAngleRange = { min: 0, max: 255};
var RadiansRange = { min: 0, max: 2*Math.PI};

var ThrottleRange = { min: -75, max: 100};
var HeatRange = { min: 0, max: 500};
