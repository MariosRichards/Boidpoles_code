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
  var mag = Math.sqrt(vx*vx + vy*vy);
  return [vx/mag, vy/mag, mag];
}

function radiansToBaseRangeAngle(angle) //Turns radian angle into the angle in range 0-255
{	
	

	if(angle>=RadiansRange.min)
	{
		while(angle > RadiansRange.max)
		{
			angle -= RadiansRange.max;
		}
		
	}
	else
	{
		while(angle < RadiansRange.min)
		{
			angle += RadiansRange.max;
		} 
		
		angle = RadiansRange.max - angle;
	}
	
	angle = Math.floor((angle/RadiansRange.max)*BaseAngleRange.max);
	
	return angle;
}

function radiansToBaseRangeAngleFloat(angle) //Turns radian angle into the angle in range 0-255
{	
	

	if(angle>=RadiansRange.min)
	{
		while(angle > RadiansRange.max)
		{
			angle -= RadiansRange.max;
		}
		
	}
	else
	{
		while(angle < RadiansRange.min)
		{
			angle += RadiansRange.max;
		} 
		
		angle = RadiansRange.max - angle;
	}
	
	angle = (angle/RadiansRange.max)*BaseAngleRange.max;
	
	return angle;
}

function baseRangeAngleToRadians(angle) //Turns angle in range 0-255 into radian angle
{		
	if(angle>=BaseAngleRange.min)
	{
		while(angle > BaseAngleRange.max)
		{
			angle -= BaseAngleRange.max;
		}
	}
	else
	{
		while(angle < BaseAngleRange.min)
		{
			angle += BaseAngleRange.max;
		} 
		
		angle = BaseAngleRange.max - angle;
	}
	
	angle = (angle/BaseAngleRange.max)*RadiansRange.max;
	
	return angle;
}

function properAngleNormalisation(radan1)
{
	var angle_radians = radan1;
	
	/*while (angle_radians < - Math.PI) angle_radians += 2*Math.PI;
	while (angle_radians > Math.PI) angle_radians -= 2*Math.PI;*/
	
	while (angle_radians < 0) angle_radians += 2*Math.PI;
	while (angle_radians > 2*Math.PI) angle_radians -= 2*Math.PI;
	
	return angle_radians;
}
//Vector in format [x][y] ; Angle in radians
function rotateVectorByAngle(vec, ang)
{
    var cos = Math.cos(ang);
    var sin = Math.sin(ang);
    return new Array(Math.round(10000*(vec[0] * cos - vec[1] * sin))/10000, Math.round(10000*(vec[0] * sin + vec[1] * cos))/10000);
};