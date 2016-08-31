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
  var mag = Math.sqrt(vx**2 + vy**2);
  return [vx/mag, vy/mag, mag];
}

function radiansToBaseRangeAngle(angle) //Turns radian angle into the angle in range 0-255
{
	angle = parseInt((angle/2*Math.PI)*255);
	
	return angle;
}

function baseRangeAngleToRadians(angle) //Turns angle in range 0-255 into radian angle
{
	angle = (angle/255)*2*Math.PI;
	
	return angle;
}