function deleteBulletByKey(key)
{
	for(var i=0;i<bullets.length;i++)
	{
		if(bullets[i].key === key)
		{
			bullets.splice(i, 1);
		}
	}
	
	updateBullets();
}

function createNewBullet(x,y,pole)
{	
	
	var vx = BULLET_VELOCITY;
	var vy = BULLET_VELOCITY;
	
	if(pole)
	{
		vx = pole.vx*2;
		vy = pole.vy*2;
	}
	
	BULLET_UNIQUE_KEY += 1;
		
	var new_bullet = {
		
		x: x,
		y: y,
		vx: vx,
	    vy: vy,
	    count: 0,
	    key: BULLET_UNIQUE_KEY,
    	collision_cooldown: INITIAL_BULLET_COLLISION_COOLDOWN
		
	};
	
	bullets.push(new_bullet);
					
	updateBullets();
		
}

function deleteAllBullets()
{
	bullets = [];
	
	updateBullets();

}

function createManyBullets(number) {
	
	for(var i=0;i<number;i++)
	{
		var x = Math.random() * CANVAS_WIDTH,
		y = Math.random() * CANVAS_HEIGHT;
		
		createNewBullet(x,y);
	}
	
	updateBullets();
}