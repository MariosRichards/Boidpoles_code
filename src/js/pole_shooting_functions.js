function polesShootUpdate(){
		
	for (var i = 0; i < spermatozoa.length; i++) {
	    var spermatozoon = spermatozoa[i],
	        path = spermatozoon.path,
	        x = path[0][0] + spermatozoon.vx,
	        y = path[0][1] + spermatozoon.vy;
	
		spermatozoon.actual_shooting_cooldown -= 1;
		
		if(spermatozoon.actual_shooting_cooldown < 0)
		{
			createNewBullet(x,y);
			
			spermatozoon.actual_shooting_cooldown = spermatozoon.initial_shooting_cooldown;
		}
	    
	}
	
}
