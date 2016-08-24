



function Pole()
{

	UNIQUE_KEY += 1;
	
	var x = Math.random() * CANVAS_WIDTH,
		y = Math.random() * CANVAS_HEIGHT;
	
	var shooting_cooldown = Math.floor(Math.random() * ((POLE_SHOOTING_COOLDOWN_BASE+SHOOTING_COOLDOWN_MAX_VARIANCE) - (POLE_SHOOTING_COOLDOWN_BASE-SHOOTING_COOLDOWN_MAX_VARIANCE)) + (POLE_SHOOTING_COOLDOWN_BASE-SHOOTING_COOLDOWN_MAX_VARIANCE));
		
	this.pole_cpu = new pole_cpu(this),
	this.vx = getVelocityValueX(),
	this.vy = getVelocityValueY(), 
	this.path = d3.range(TAIL_LENGTH).map(function() { return [x, y]; }),
	this.count = 0,
	this.key = UNIQUE_KEY,
	this.collision_cooldown = POLE_COLLISION_COOLDOWN,
	this.initial_shooting_cooldown = shooting_cooldown,
	this.actual_shooting_cooldown = shooting_cooldown
	
}

Pole.prototype = {
	constructor: Pole,
// add methods here!
}

function createNewPole()
{	
	
	var new_pole = new Pole()

	spermatozoa.push(new_pole);
					
	updatePoles();
		
}

// function createNewPole()
// {	
	
	// UNIQUE_KEY += 1;
	
	// var x = Math.random() * CANVAS_WIDTH,
		// y = Math.random() * CANVAS_HEIGHT;
	
	// var shooting_cooldown = Math.floor(Math.random() * ((POLE_SHOOTING_COOLDOWN_BASE+SHOOTING_COOLDOWN_MAX_VARIANCE) - (POLE_SHOOTING_COOLDOWN_BASE-SHOOTING_COOLDOWN_MAX_VARIANCE)) + (POLE_SHOOTING_COOLDOWN_BASE-SHOOTING_COOLDOWN_MAX_VARIANCE));
	
	
	// // pole object defined/created here
	// var new_pole = {
		
		// pole_cpu: pole_cpu(pole),
		// vx: getVelocityValueX(),
	    // vy: getVelocityValueY(),
	    // path: d3.range(TAIL_LENGTH).map(function() { return [x, y]; }),
	    // count: 0,
	    // key: UNIQUE_KEY,
    	// collision_cooldown: POLE_COLLISION_COOLDOWN,
    	// initial_shooting_cooldown: shooting_cooldown,
		// actual_shooting_cooldown: shooting_cooldown
	// };
	
	// spermatozoa.push(new_pole);
					
	// updatePoles();
		
// }

function deletePoleByKey(key)
{
	for(var i=0;i<spermatozoa.length;i++)
	{
		if(spermatozoa[i].key === key)
		{
			spermatozoa.splice(i, 1);
		}
	}
	
	updatePoles();
}

function deleteAllPoles()
{
	spermatozoa = [];
	
	updatePoles();

}

function createManyPoles(number) {
	
	for(var i=0;i<number;i++)
	{
		createNewPole();
	}
	
	updatePoles();
}