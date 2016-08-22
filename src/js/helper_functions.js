function getVelocityValueX()
{
	return Math.random() * 2 - 1;
}

function getVelocityValueY()
{
	return Math.random() * 2 - 1;
}

function getSpeed(dx,dy)
{
	return Math.sqrt(dx * dx + dy * dy);
}

function unitVectors(vx,vy) {
  mag = Math.sqrt(vx**2 + vy**2)
  return [vx/mag, vy/mag, mag]
}

