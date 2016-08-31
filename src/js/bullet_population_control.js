function Bullet(x,y,pole)
{
	var vx = BULLET_VELOCITY;
	var vy = BULLET_VELOCITY;
	
	if(pole)
	{
		vx = pole.vx*2;
		vy = pole.vy*2;
		
		var velo = rotateVectorByAngle([vx,vy],baseRangeAngleToRadians(pole.turret_heading_offset));
	
		vx = velo[0];
		vy = velo[1];
	}
	
	
	BULLET_UNIQUE_KEY += 1;
	
	this.x = x;
	this.y = y;
	this.vx = vx;
    this.vy = vy;
    this.count = 0;
    this.key = BULLET_UNIQUE_KEY;
	this.collision_cooldown = INITIAL_BULLET_COLLISION_COOLDOWN;
	
}

Bullet.prototype = {
	constructor: Bullet
// add methods here!
};

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
	
	var new_bullet = new Bullet(x,y,pole);
	
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