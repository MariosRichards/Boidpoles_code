function startGameLoop() {
	
	d3.timer(function() {
		
	  if(spermatozoa.length > 0)	
	  {
	  	  polesUpdate();
	  	
	  }
	  
	  if(bullets.length > 0)
	  {
	  	 bulletsUpdate();
	  	
	  }
	 
	});
}

