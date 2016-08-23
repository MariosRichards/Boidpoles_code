function bulletDetectCollision(x,y,bullet){
	
	bullet.collision_cooldown -= 1;
	
	if(bullet.collision_cooldown < 0)
	{
		//BULLET TO BULLET Collision
		
		for(var i=0;i<bullets.length;i++)
		{
						
			var self_key = bullet.key;
			
			if(bullets[i].key != self_key)
			{
					
				var circle1 = {radius: BULLET_COLLISION_RADIUS, x: x, y: y};
				var circle2 = {radius: BULLET_COLLISION_RADIUS, x: bullets[i].x, y: bullets[i].y};
				
				var dx = circle1.x - circle2.x;
				var dy = circle1.y - circle2.y;
				
				var distance = Math.sqrt(dx * dx + dy * dy);
				
				if (distance < circle1.radius + circle2.radius) {
					
					//console.log("BULLET HITS BULLET!");
					
				    //bullet.vx *= -1;
		    		//bullet.vy *= -1;
		    		
		    		bullet.collision_cooldown = BULLET_COLLISION_COOLDOWN;
		    		
		    		deleteBulletByKey(bullets[i].key);
		    		
		    		deleteBulletByKey(bullet.key);
		    		
		    		
		    		//console.log("Collision detected!");
				}
			
			}
		}
		
		//BULLET TO POLE Collision
		
		for(var i=0;i<spermatozoa.length;i++)
		{	
				
			var circle1 = {radius: BULLET_COLLISION_RADIUS, x: x, y: y};
			var circle2 = {radius: POLE_COLLISION_RADIUS, x: spermatozoa[i].path[0][0], y: spermatozoa[i].path[0][1]};
			
			var dx = circle1.x - circle2.x;
			var dy = circle1.y - circle2.y;
			
			var distance = Math.sqrt(dx * dx + dy * dy);
			
			if (distance < circle1.radius + circle2.radius) {
				
				console.log("BULLET HITS POLE!");
								
			    //bullet.vx *= -1;
	    		//bullet.vy *= -1;
	    		
	    		bullet.collision_cooldown = BULLET_COLLISION_COOLDOWN;
	    		
				deletePoleByKey(spermatozoa[i].key);
				
				deleteBulletByKey(bullet.key);
	    		//console.log("Collision detected!");
			}
		
		}
	}
	
	
	
	
}
