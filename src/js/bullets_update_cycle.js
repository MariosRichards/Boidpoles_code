function bulletsUpdate(){
		
	for (var i = 0; i < bullets.length; i++) {
	    var bullet = bullets[i];
	
		bulletMoveUpdate(bullet);
		
	 
	}
	
	bullet_head.attr("transform", bulletHeadTransform);
    
	
}
