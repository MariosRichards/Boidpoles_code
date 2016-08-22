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
