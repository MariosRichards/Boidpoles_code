function Pole()
{

	UNIQUE_KEY += 1;
	
	var x = Math.random() * CANVAS_WIDTH,
		y = Math.random() * CANVAS_HEIGHT;
	
	var shooting_cooldown = Math.floor(Math.random() * ((POLE_SHOOTING_COOLDOWN_BASE+SHOOTING_COOLDOWN_MAX_VARIANCE) - (POLE_SHOOTING_COOLDOWN_BASE-SHOOTING_COOLDOWN_MAX_VARIANCE)) + (POLE_SHOOTING_COOLDOWN_BASE-SHOOTING_COOLDOWN_MAX_VARIANCE));
		
	this.pole_cpu = new pole_cpu(this);
	this.vx = getVelocityValueX();
	this.vy = getVelocityValueY(); 
	this.path = d3.range(TAIL_LENGTH).map(function() { return [x, y]; });
	this.count = 0;
	this.key = UNIQUE_KEY;
	this.collision_cooldown = POLE_COLLISION_COOLDOWN;
	this.initial_shooting_cooldown = shooting_cooldown;
	this.actual_shooting_cooldown = shooting_cooldown;
	
	this.current_speed = 50;
	
	this.throttle = 100;
	
	this.maximum_forward_speed = 150;
	this.maximum_backwards_speed = 75;
	
	this.current_heat_level = 0;
	
	this.turret_heading_offset = radiansToBaseRangeAngle(0); //In reference to pole heading
	//this.turret_heading = radiansToBaseRangeAngle((Math.atan2(this.vy, this.vx) * DEGREES)+(this.turret_heading_offset * DEGREES));
	this.turret_heading = radiansToBaseRangeAngle(0);
	
	this.armour = 100;
	
	this.desired_speed = 0;
	
	
	this.attemp_shooting = function() {
		
		 var path = this.path,
        x = path[0][0] + this.vx,
        y = path[0][1] + this.vy;

		this.actual_shooting_cooldown -= 1;
			
		if(this.actual_shooting_cooldown < 0)
		{
			createNewBullet(x,y,this);
			
			this.actual_shooting_cooldown = this.initial_shooting_cooldown;
		}
	};
	
	//Gets
	
	//returns 'throttle' = current_speed as a % of maximum forward speed
	this.get_throttle = function() {
	
		/*var speed = this.current_speed;
		var converted_speed;
		
		if(speed < 0)
		{
			converted_speed = speed/this.max_robot_speed
			converted_speed = Math.floor(speed / this.maximum_backwards_speed*ThrottleRange.min);
		}else{
			converted_speed = Math.floor(speed / this.maximum_forward_speed*ThrottleRange.max);
		}*/

		return this.throttle;
		
		//range [-75, 100]
	};
	
	//returns current heat level
	this.heat_sensor = function()
	{
		
		if(this.current_heat_level < HeatRange.min)
		{
			this.current_heat_level = HeatRange.min;
		} else if (this.current_heat_level > HeatRange.max)
		{
			this.current_heat_level = HeatRange.max;
		}
		
		return this.current_heat_level;
		
		//range [0, 500]
	};
		
	//returns current absolute heading (which way robot is facing/moving)
	this.compass = function()
	{
		return radiansToBaseRangeAngle(Math.atan2(this.vy, this.vx));
		//range [0, 255]
	};
	
	//returns current turret offset (relative to robot heading)
	this.get_turret_offset = function()
	{
		
		return this.turret_heading_offset;
		
		//range [0, 255]
	};
	
	
	//returns current turret absolute heading (same as compass, but for the turret)
	this.get_turrent_heading = function()
	{
		return this.turret_heading;
		//range [0, 255]
	};
	
	//returns current armour level (e.g. hitpoints)
	this.damage_sensor = function() {
		
		return this.armour;
		
		//range [0-100]
	};
	
	//returns range to nearest target in last scan
	//( if you see nothing, return MAXINT (32767) )
	this.scanner = function() {
			
		
		
		//range [0-MaxScanRange?] [0 - 1500]
	};
	
	//	returns position in scan arc of nearest target in last scan
	// (scan arc is divided in to 5 equal parts)
	
	this.accuracy = function() {
		
		//range [-2, 2]
		
	};
	
	this.radar = function() {
	
		var closest = 1000000000;
		var closest_target = null;
		
		for(var i=0;i<spermatozoa.length;i++)
		{
			var vx = spermatozoa[i].path[0][0] - this.path[0][0];
			var vy = spermatozoa[i].path[0][1] - this.path[0][1];
			
			if(unitVectors(vx,vy)[2] < closest)
			{
				closest = unitVectors(vx,vy)[2];
				closest_target = spermatozoa[i];
			}
		}
		
		if(closest != 1000000000) 
		{
			return closest;
		} else return -1;
		//returns range to nearest target	
	};
	
	///Sets
	
	//sets throttle to [-75,100]
	this.set_throttle = function(x) {
		
		if(x < ThrottleRange.min)
		{
			x = ThrottleRange.min;
		} 
		
		if(x > ThrottleRange.max) {
			x = ThrottleRange.max;
		}
		
		this.throttle = x;
		
		/*var speed = x;
		var converted_speed;
		
		if(speed < 0)
		{
			converted_speed = Math.floor(speed / this.maximum_backwards_speed*ThrottleRange.min);
		}else{
			converted_speed = Math.floor(speed / this.maximum_forward_speed*ThrottleRange.max);
		}
		
		this.desired_speed = converted_speed;*/
		
	};
	
	
	//offsets turret - e.g. move it relative to its current position
	this.rotate_turret = function(x)
	{
		var original_turret_heading = this.turret_heading_offset; 
				
		var calc = original_turret_heading += x;
		
		var absolute_value = Math.abs(calc);
		
		var final_amount = absolute_value;
		
		if(x>=255)
		{
			while(absolute_value>=255)
			{
				absolute_value -= 255;
			}
			
			final_amount = absolute_value;
			
		} else if(x<0)
		{
			while(absolute_value<0)
			{
				absolute_value += 255;
			}
			
			final_amount = 255 - absolute_value;
		}
		
		this.turret_heading_offset = final_amount;
		this.turret_heading = radiansToBaseRangeAngle((Math.atan2(this.vy, this.vx) * DEGREES)+(this.turret_heading_offset * DEGREES));
		//[-128,127]
	};
	
	//set curret turret offset to value e.g. move turret to new angle relative to wherever the tank is heading
	this.aim_turret = function(x){
		
		var original_pole_heading = radiansToBaseRangeAngle((Math.atan2(this.vy, this.vx)));
				
		var calc = original_pole_heading += x;
		
		var absolute_value = Math.abs(calc);
		
		var final_amount = absolute_value;
		
		if(x>=255)
		{
			while(absolute_value>=255)
			{
				absolute_value -= 255;
			}
			
			final_amount = absolute_value;
			
		} else if(x<0)
		{
			while(absolute_value<0)
			{
				absolute_value += 255;
			}
			
			final_amount = 255 - absolute_value;
		}
		
		this.turret_heading_offset = final_amount;
		this.turret_heading = radiansToBaseRangeAngle((Math.atan2(this.vy, this.vx) * DEGREES)+(this.turret_heading_offset * DEGREES));
		//[-128,127]
	};
	
	
	////
	
	this.locate = function(pole)
	{
		return [this.path[0][0],this.path[0][1]];
	};
	
	this.set_keepshift = function(x)
	{
		var keepshift = true;
		
		if(x == 0)
		{
			keepshift = false;
		} 
		
		return keepshift;
	};
	
	this.set_overburn = function(x)
	{
		var overburn = true;
		
		if(x == 0)
		{
			overburn = false;
		} 
		
		return overburn;
	};
}

Pole.prototype = {
	constructor: Pole
// add methods here!
};
	
