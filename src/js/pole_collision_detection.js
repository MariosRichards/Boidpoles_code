function poleDetectCollision(x,y,pole){
	
	var is_colliding_pole = false;
	
	pole.collision_cooldown -= 1;
	
	if(pole.collision_cooldown < 0)
	{
		for(var i=0;i<spermatozoa.length;i++)
		{
			var self_key = pole.key;
			
			if(spermatozoa[i].key != self_key)
			{
					
				var circle1 = {radius: POLE_COLLISION_RADIUS, x: x, y: y};
				var circle2 = {radius: POLE_COLLISION_RADIUS, x: spermatozoa[i].path[0][0], y: spermatozoa[i].path[0][1]};
				
				var dx = circle1.x - circle2.x;
				var dy = circle1.y - circle2.y;
				
				var distance = Math.sqrt(dx * dx + dy * dy);
				
				if (distance < circle1.radius + circle2.radius) {
	
					is_colliding_pole = true;
					
				    /*pole.vx *= -1;
		    		pole.vy *= -1;*/
		    		
		    		pole.collision_cooldown = POLE_COLLISION_COOLDOWN;
		    		
		    		//deletePoleByKey(spermatozoa[i].key);
		    		
		    		//deletePoleByKey(pole.key);
		    		
		    		
					//console.log("POLE HITS POLE!");
				}
			
			}
		}
	}
	
	pole.is_colliding_pole = is_colliding_pole;
		
	var is_colliding_wall = false;
	
	if (x < 0 + POLE_COLLISION_RADIUS || x > CANVAS_WIDTH - POLE_COLLISION_RADIUS) { is_colliding_wall = true; }
    if (y < 0 + POLE_COLLISION_RADIUS || y > CANVAS_HEIGHT - POLE_COLLISION_RADIUS) { is_colliding_wall = true; }
    
    pole.is_colliding_wall = is_colliding_wall;
    
	
	
}
