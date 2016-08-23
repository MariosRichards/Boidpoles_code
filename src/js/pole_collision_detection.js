function poleDetectCollision(x,y,spermatozoon){
	
	spermatozoon.collision_cooldown -= 1;
	
	if(spermatozoon.collision_cooldown < 0)
	{
		for(var i=0;i<spermatozoa.length;i++)
		{
			var self_key = spermatozoon.key;
			
			if(spermatozoa[i].key != self_key)
			{
					
				var circle1 = {radius: POLE_COLLISION_RADIUS, x: x, y: y};
				var circle2 = {radius: POLE_COLLISION_RADIUS, x: spermatozoa[i].path[0][0], y: spermatozoa[i].path[0][1]};
				
				var dx = circle1.x - circle2.x;
				var dy = circle1.y - circle2.y;
				
				var distance = Math.sqrt(dx * dx + dy * dy);
				
				if (distance < circle1.radius + circle2.radius) {
	
				    spermatozoon.vx *= -1;
		    		spermatozoon.vy *= -1;
		    		
		    		spermatozoon.collision_cooldown = POLE_COLLISION_COOLDOWN;
		    		
		    		//deletePoleByKey(spermatozoa[i].key);
		    		
		    		//deletePoleByKey(spermatozoon.key);
		    		
		    		
					//console.log("POLE HITS POLE!");
				}
			
			}
		}
	}
	
	
	
	
}
