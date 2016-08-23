function startGameLoop() {
	
	d3.timer(function() {
		
	  if(spermatozoa.length > 0)	
	  {
	  	  polesMoveUpdate();
	  	  
	  	  polesShootUpdate();
	  }
	  
	  if(bullets.length > 0)
	  {
	  	bulletsMoveUpdate();
	  	
	  }
	 
	});
}

