#include "Camera.hpp"
#include <iostream>

namespace gps {

	//Camera constructor
	Camera::Camera(glm::vec3 cameraPosition, glm::vec3 cameraTarget, glm::vec3 cameraUp) {
		this->cameraPosition = cameraPosition;
		this->cameraTarget = cameraTarget;
		this->cameraUpDirection = cameraUp;
		this->angleX = 0;
		this->angleY = 0;
		//TODO - Update the rest of camera parameters

	}

	//return the view matrix, using the glm::lookAt() function
	glm::mat4 Camera::getViewMatrix() {
		return glm::lookAt(cameraPosition, cameraTarget, cameraUpDirection);
	}
	glm::vec3 Camera::getCameraPosition() {
		return cameraPosition;
	}
	glm::vec3 Camera::getCameraTarget() {
		return cameraTarget;
	}	
	void Camera::setCameraPosition(glm::vec3 cP) {
		this->cameraPosition = cP;
	}
	void Camera::setCameraTarget(glm::vec3 cT) {
		this->cameraTarget = cT;
	}

	//update the camera internal parameters following a camera move event
	void Camera::move(MOVE_DIRECTION direction, float speed) {
		speed *= 50;
		switch (direction)
		{
		case MOVE_FORWARD:
			this->cameraPosition += this->cameraFrontDirection * speed;
			this->cameraTarget += this->cameraFrontDirection * speed;
			break;
		case MOVE_BACKWARD:
			this->cameraPosition -= this->cameraFrontDirection * speed;
			this->cameraTarget -= this->cameraFrontDirection * speed;
			break;
		case MOVE_RIGHT:
			this->cameraPosition += this->cameraRightDirection * speed;
			this->cameraTarget += this->cameraRightDirection * speed;
			break;
		case MOVE_LEFT:
			this->cameraPosition -= this->cameraRightDirection * speed;
			this->cameraTarget -= this->cameraRightDirection * speed;
			break;
		}

	}


	void Camera::rotate(float pitch, float yaw) {

		this->angleY += yaw;
		this->angleX += pitch;
		cameraTarget = glm::vec3(cameraPosition.x + sin(angleY), cameraPosition.y + sin(angleX), cameraPosition.z - cos(angleY));

		// cameraTarget = glm::vec3(cameraPosition.x , cameraPosition.y + cos(angleY-angleX), cameraPosition.z - sin(angleY-angleX));
		// glm::lookAt(cameraPosition, cameraTarget, cameraUpDirection);
	   //  cameraTarget.y = cameraFrontDirection.y + cos(pitch) + sin(pitch);
		this->cameraFrontDirection = glm::normalize(this->cameraTarget - this->cameraPosition);
		this->cameraRightDirection = glm::cross(this->cameraFrontDirection, this->cameraUpDirection);


	}
}