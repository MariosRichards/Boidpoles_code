function polesUpdate(){
		
	for (var i = 0; i < spermatozoa.length; i++) {
	    var pole = spermatozoa[i],
	        path = pole.path,
	        x = path[0][0] + pole.vx,
	        y = path[0][1] + pole.vy;
	
		poleMoveUpdate(pole);
		
		poleShootUpdate(pole);
	 
	}
	
	head.attr("transform", headTransform);
    tail.attr("d", tailPath);
    
	
}
