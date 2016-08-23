function poleShootUpdate(pole){
		
    var path = pole.path,
        x = path[0][0] + pole.vx,
        y = path[0][1] + pole.vy;

	pole.actual_shooting_cooldown -= 1;
	
	if(pole.actual_shooting_cooldown < 0)
	{
		createNewBullet(x,y,pole);
		
		pole.actual_shooting_cooldown = pole.initial_shooting_cooldown;
	}

}
