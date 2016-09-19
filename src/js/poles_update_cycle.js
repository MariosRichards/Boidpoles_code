function polesUpdate(){
			
	for (var i = 0; i < spermatozoa.length; i++) {
	    var pole = spermatozoa[i],
	        path = pole.path,
	        x = path[0][0] + pole.vx,
	        y = path[0][1] + pole.vy;

		visionConeUpdate(pole);
		
		pole.pole_cpu.pole_cpu_update();
	
		//poleMoveUpdate(pole);
		
		//poleShootUpdate(pole);
		
		//var cpu = pole.pole_cpu;
		//cpu.pole_cpu_update();
		
		//Function to persistently draw the visioncones of the turret
		//visionConeUpdate(pole);
		
		//Function to only update cones based on scan logic
		
	}
	
	for (var i = 0; i < spermatozoa.length; i++) {
	    var pole = spermatozoa[i],
	        path = pole.path,
	        x = path[0][0] + pole.vx,
	        y = path[0][1] + pole.vy;

		//scannerConeUpdate(pole);
		
		//pole.pole_cpu.pole_cpu_update();
	
		poleMoveUpdate(pole);
		
		//poleShootUpdate(pole);
		
		//var cpu = pole.pole_cpu;
		//cpu.pole_cpu_update();
		
		//Function to persistently draw the visioncones of the turret
		//visionConeUpdate(pole);
		
		//Function to only update cones based on scan logic
		
	}
	
	head.attr("transform", headTransform);
    tail.attr("d", tailPath);
    //vision_cone.attr("transform", visionConeTransform);
    turret.attr("transform", turretTransform);
    
	
}
