function Pole()
{

	UNIQUE_KEY += 1;
	
	var x = Math.random() * (CANVAS_WIDTH - POLE_COLLISION_RADIUS*2),
		y = Math.random() * (CANVAS_HEIGHT - POLE_COLLISION_RADIUS*2);
		
	if(x <= POLE_COLLISION_RADIUS*2)
	{
		x = 1 + POLE_COLLISION_RADIUS*2;
	}
	if(y <= POLE_COLLISION_RADIUS*2)
	{
		y = 1 + POLE_COLLISION_RADIUS*2;
	}
		
	var free_space = false;
	
	var attempts = 10000;
	
	//Loop controls that poles only appear in free space, and not on top of other poles
	//Not a perfect function, still has a chance of not finding a good spot for the pole and creating it anyway
	//Next improvement: Make it so if there is no space for the pole, it won't be created, and it will tell so
	while(!free_space && attempts > 0)
	{
		
		//if(attempts == 1) alert();
		
		var collided = false;
	
		for(var i=0;i<spermatozoa.length;i++)
		{						
			var circle1 = {radius: POLE_COLLISION_RADIUS*2, x: x, y: y};
			var circle2 = {radius: POLE_COLLISION_RADIUS*2, x: spermatozoa[i].path[0][0], y: spermatozoa[i].path[0][1]};
			
			var dx = circle1.x - circle2.x;
			var dy = circle1.y - circle2.y;
			
			var distance = Math.sqrt(dx * dx + dy * dy);
			
			//Collided
			if (distance < circle1.radius + circle2.radius) {
				collided = true;
				break;
			}				
		}
		
		if(collided)
		{
			x = Math.random() * (CANVAS_WIDTH - POLE_COLLISION_RADIUS*2),
			y = Math.random() * (CANVAS_HEIGHT - POLE_COLLISION_RADIUS*2);
			
			if(x < POLE_COLLISION_RADIUS*2)
			{
				x = 1 + POLE_COLLISION_RADIUS*2;
			}
			if(y < POLE_COLLISION_RADIUS*2)
			{
				y = 1 + POLE_COLLISION_RADIUS*2;
			}
		
		} else {
			free_space = true;
			attempts = 10000;
		}
		
		attempts--;
	}
	
	var shooting_cooldown = Math.floor(Math.random() * ((POLE_SHOOTING_COOLDOWN_BASE+SHOOTING_COOLDOWN_MAX_VARIANCE) - (POLE_SHOOTING_COOLDOWN_BASE-SHOOTING_COOLDOWN_MAX_VARIANCE)) + (POLE_SHOOTING_COOLDOWN_BASE-SHOOTING_COOLDOWN_MAX_VARIANCE));
		
	this.pole_cpu = new pole_cpu(this);

	this.path = d3.range(TAIL_LENGTH).map(function() { return [x, y]; });
	this.count = 0;
	this.key = UNIQUE_KEY;
	this.collision_cooldown = POLE_COLLISION_COOLDOWN;
	this.initial_shooting_cooldown = shooting_cooldown;
	this.actual_shooting_cooldown = shooting_cooldown;
		
	this.intended_steering = 0; //In BaseRangeAngle Units
	this.amount_steering_completed = 0; //In BaseRangeAngle Units
	this.is_steering_completed = true;
	
	this.is_colliding_wall = false;
	this.is_colliding_pole = false;
	
	this.throttle = Math.random() * (ThrottleRange.max - ThrottleRange.min) + ThrottleRange.min; //range [-75, 100]
	this.desired_throttle = Math.random() * (ThrottleRange.max - ThrottleRange.min) + ThrottleRange.min;
	
	this.throttle = 10; //range [-75, 100]
	this.desired_throttle = 10;
			
	this.current_speed = this.throttle/ThrottleRange.max*POLE_MAX_NONOVERBURN_SPEED;
		
	this.vx = this.current_speed;
	this.vy = this.current_speed; 
	
	this.current_heat_level = 0;
	
	this.turret_heading_offset = radiansToBaseRangeAngle(0); //In reference to pole heading
	//this.turret_heading = radiansToBaseRangeAngle((Math.atan2(this.vy, this.vx) * DEGREES)+(this.turret_heading_offset * DEGREES));
	this.turret_heading = radiansToBaseRangeAngle(0);
	
	this.armour = 100;
		
	
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
	
	//returns range to nearest target	
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
		
	};
	
	//returns heading to nearest target
	this.sonar = function() {
		
		//Unclear if "heading to nearest target" means angle to nearest target or angle
		//difference between the that angle and the headings angle
		
		var closest = 1000000000;
		var closest_target = null;
		
		var vx = 0;
		var vy = 0;
		
		for(var i=0;i<spermatozoa.length;i++)
		{
			vx = spermatozoa[i].path[0][0] - this.path[0][0];
			vy = spermatozoa[i].path[0][1] - this.path[0][1];
			
			if(unitVectors(vx,vy)[2] < closest)
			{
				closest = unitVectors(vx,vy)[2];
				closest_target = spermatozoa[i];
			}
		}
		
		if(closest != 1000000000) 
		{								
			var angle_radians = Math.atan2(vx, vy);
				
			return angle_radians;
			
		} else return -1;
		
		//[0,255]	
	};
	
	
	//return scan_arc diameter 
	this.get_scan_arc = function() {
		
		//[0,64]
	};
		
	//0 = Off, 1 = On
	this.get_overburn = function() {
		
	};
		
	
	//get transponder_id
	//(initially set to the order of the robot in creation - e.g. 6th robot created gets transponder_id = 6)
	
	this.get_transponder_if = function() {
		
		
	};

	//	shutdown_level is the point at which the heat level at which the robot shuts down
	//it stays shut down until the heat falls to the shutdown heat level -50 (or 0 - whichever is higher)
	//default shutdown_level is 400
	
	this.get_shutdown_level = function() {
		
		
	};

		
	//get the channel the robot is set to receive communication on
	this.get_channel = function() {
		
	};
	
	//return 0 if shield off
	//return 1 if shield on
	
	this.get_shield = function() {
		
	};
	
	
	//drop mine with detection radius x
	//(mines have no size = so 0 detection range means a robot needs to sit *precisely* on top of the mine to detonate it)
	
	this.lay_mine = function(x) {
		
		
	};
		
	//return number of mines remaining	
	this.mines_remaining = function() {
		
	};
		
	//detonate *all* your mines
	//you can't normally detonate mines (they recognise their owner), but when you detonate them like this, you can actually cause yourself damage
		
	this.detonate_mines = function() {
		
	};
		
	///Sets
	
	//sets desired_throttle to [-75,100]
	this.set_throttle = function(x) {
		
		if(x < ThrottleRange.min)
		{
			x = ThrottleRange.min;
		} 
		
		if(x > ThrottleRange.max) {
			x = ThrottleRange.max;
		}
		
		this.desired_throttle = x;
		
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
	
	//0 = Off, anything else = On
	this.set_overburn = function(x) {
		
	};
	
	//set transponder_id to x	
	this.set_transponder_id = function(x) {
		
	};
	
	//set scar arc *diameter* in degrees [0,64] 
	//- e.g. if you set it to be 64, then the scan arc will be 128 degreese (e.g. a semicircle)
	this.set_scan_arc = function(x) {
		
	};

	//	set shutdown_level [0, 500]
	//	(robot explodes at 500!)
	
	this.set_shutdown_level = function(x) {
		
		
	};
	
	//	set the channel on which the robot is set to receive communication on	
	this.set_channel = function(x) {
		
	};	
	
	
	//x=0 shield off, x!=0 shield on
	this.set_shield = function(x) {
		
	};
	

	//offsets turret - e.g. move it relative to its current position
	this.rotate_turret = function(x)
	{
		var original_turret_heading = this.turret_heading_offset; 
		
		//console.log(original_turret_heading + "<-->" + properAngleNormalisation(original_turret_heading));
								
		//var final_amount = original_turret_heading+CPUBaseRangeAngleToBaseRangeAngle(x);
		
		var final_amount = original_turret_heading+x;
			
		final_amount = baseRangeAngleToRadians(final_amount);
				
		this.turret_heading_offset = radiansToBaseRangeAngleFloat(final_amount);
		//this.turret_heading = radiansToBaseRangeAngle((properAngleNormalisation(Math.atan2(this.vy, this.vx)))+(this.turret_heading_offset));
		//[0,255]
	};
	
	//set curret turret offset to value e.g. move turret to new angle relative to wherever the tank is heading
	this.aim_turret = function(x){
			
		//This one to keep it constantly in the angle you want
				
		//var original_pole_heading = properAngleNormalisation(Math.atan2(this.vy, this.vx));
				
		//var final_amount = radiansToBaseRangeAngle(properAngleNormalisation(original_pole_heading + baseRangeAngleToRadians(CPUBaseRangeAngleToBaseRangeAngle(x))));
												
		//this.turret_heading_offset = CPUBaseRangeAngleToBaseRangeAngle(x);
		this.turret_heading_offset = x;
		
		//this.turret_heading = radiansToBaseRangeAngle((Math.atan2(this.vy, this.vx) * DEGREES)+(this.turret_heading_offset * DEGREES));
		//[0,255]
	};
	
	//turn tank specified number of degrees
	this.steering = function(x) {
		
		//var rotated_vector = rotateVectorByAngle([this.vx,this.vy],baseRangeAngleToRadians(x));
		
		var original_pole_heading = properAngleNormalisation(Math.atan2(this.vy, this.vx));
		
		var angle_desired = properAngleNormalisation(baseRangeAngleToRadians(x));
		
		var final_intended_steering = this.intended_steering + angle_desired;
		
		//console.log(this.intended_steering - this.amount_steering_completed);
		
		if(final_intended_steering > Math.PI)
		{
			final_intended_steering = -(2*Math.PI - angle_desired);
		}
				
		/*this.intended_steering = 0; //In BaseRangeAngle Units
		this.steering_completed = 0; //In BaseRangeAngle Units
		this.max_steering_per_tick = 8;*/
		
		if(angle_desired != 0)
		{
			/*if(this.intended_steering == this.amount_steering_completed)
			{
				console.log("TITITI");
				this.intended_steering = 0;
				this.amount_steering_completed = 0;
			}*/
			
			this.intended_steering = final_intended_steering;
			
		}	
		//[0,255]
	};
	
	//fire weapons at angle of turret with small adjustment [-4,4] adjustment
	this.fire_weapon = function(x) {
		
		//Still have to program the angle adjustment
		
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
	
	//returns the number of your mines that remain laid on the map
	
	this.mines_on_map = function() {
		
	};
		
	//detonate robot
	//(when robot dies it explodes dealing damage to other nearby robots)
	this.self_destruct = function() {
		
		
	};

	//returns transponder_id of last target tank scanned
	
	this.scanned_id = function() {
		
	};

	//returns direction (relative to scan - e.g. 0 means it was moving in the same direction as the scan - i.e. away) and current_throttle of the target when scanned
	this.scanned_inf = function() {
		
	};
	
	//returns [current_speed, time since last damage taken, time since last fired shot hit another robot]
	//(times are all in game cycles)
		
	this.robot_info = function() {
		
	};
		
}
	
	Pole.prototype = {
		constructor: Pole
	// add methods here!
	};
	
