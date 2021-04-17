#ifndef Camera_hpp
#define Camera_hpp



#include "glm/glm.hpp"
#include "glm/gtx/transform.hpp"



#include <string>



namespace gps {



	enum MOVE_DIRECTION { MOVE_FORWARD, MOVE_BACKWARD, MOVE_RIGHT, MOVE_LEFT };



	class Camera
	{
	public:
		//Camera constructor
		Camera(glm::vec3 cameraPosition, glm::vec3 cameraTarget, glm::vec3 cameraUp);
		//return the view matrix, using the glm::lookAt() function
		glm::mat4 getViewMatrix();
		glm::vec3 getCameraPosition();
		glm::vec3 getCameraTarget();
		void setCameraPosition(glm::vec3 cP);
		void setCameraTarget(glm::vec3 cT);
		//update the camera internal parameters following a camera move event
		void move(MOVE_DIRECTION direction, float speed);
		//update the camera internal parameters following a camera rotate event
		//yaw - camera rotation around the y axis
		//pitch - camera rotation around the x axis
		void rotate(float pitch, float yaw);



	public:
		glm::vec3 cameraPosition;
		glm::vec3 cameraTarget;
		glm::vec3 cameraFrontDirection;
		glm::vec3 cameraRightDirection;
		glm::vec3 cameraUpDirection;
		float angleX = 0, angleY = 0;
	};



}



#endif /* Camera_hpp */