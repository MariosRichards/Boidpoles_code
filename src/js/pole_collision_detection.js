function detectCollision(x,y,spermatozoon){
	
	for(var i=0;i<spermatozoa.length;i++)
	{
		var self_key = spermatozoon.key;
		
		if(spermatozoa[i].key != self_key)
		{
				
			var circle1 = {radius: COLLISION_RADIUS, x: x, y: y};
			var circle2 = {radius: COLLISION_RADIUS, x: spermatozoa[i].path[0][0], y: spermatozoa[i].path[0][1]};
			
			var dx = circle1.x - circle2.x;
			var dy = circle1.y - circle2.y;
			
			var distance = Math.sqrt(dx * dx + dy * dy);
			
			if (distance < circle1.radius + circle2.radius) {
				
			    spermatozoon.vx *= -1;
	    		spermatozoon.vy *= -1;
	    		
	    		//console.log("Collision detected!");
			}
		
		}
	}
	
	
}
