#version 410 core

in vec3 fNormal;
in vec4 fPosEye;
in vec2 fTexCoords;
in vec4 fragPosLightSpace;

in vec3 fragPos;

out vec4 fColor;

//lighting
uniform	vec3 lightDir;
uniform	vec3 lightColor;

//texture
uniform sampler2D diffuseTexture;
uniform sampler2D specularTexture;
uniform sampler2D shadowMap;

vec3 ambient;
float ambientStrength = 0.2f;
vec3 diffuse;
vec3 specular;
float specularStrength = 0.5f;
float shininess = 32.0f;

uniform int enableFog;

void computeLightComponents()
{		
	vec3 cameraPosEye = vec3(0.0f);//in eye coordinates, the viewer is situated at the origin
	
	//transform normal
	vec3 normalEye = normalize(fNormal);	
	
	//compute light direction
	vec3 lightDirN = normalize(lightDir);
	
	//compute view direction 
	vec3 viewDirN = normalize(cameraPosEye - fPosEye.xyz);
		
	//compute ambient light
	ambient = ambientStrength * lightColor;
	
	//compute diffuse light
	diffuse = max(dot(normalEye, lightDirN), 0.0f) * lightColor;
	
	//compute specular light
	vec3 reflection = reflect(-lightDirN, normalEye);
	float specCoeff = pow(max(dot(viewDirN, reflection), 0.0f), shininess);
	specular = specularStrength * specCoeff * lightColor;
}

void calcPointLight(vec3 pointLightPosition, vec3 pointLightColor, float constant, float linear, float quadratic)
{

	vec3 cameraPosEye = vec3(0.0f);
	vec3 normalEye = normalize(fNormal);
    vec3 lightDirN = normalize(pointLightPosition.xyz - fragPos.xyz);
	vec3 viewDirN = normalize(cameraPosEye - fragPos.xyz);
	float distance = length(pointLightPosition.xyz - fragPos.xyz);
	float att = 1.0f/(constant + linear * distance + quadratic * (distance * distance));
	ambient += att * ambientStrength * pointLightColor;
	diffuse += att * max(dot(normalEye, lightDirN), 0.0f) * pointLightColor;
	vec3 reflection = reflect(-lightDirN, normalEye);
	float spec = pow(max(dot(viewDirN, reflection), 0.0f), 32);
	specular += att * spec * pointLightColor;
}

float computeShadow()
{
	vec3 normalizedCoords = fragPosLightSpace.xyz / fragPosLightSpace.w;
	normalizedCoords = normalizedCoords * 0.5 + 0.5;
	float closestDepth = texture(shadowMap, normalizedCoords.xy).r;
	float currentDepth = normalizedCoords.z;
	float bias = 0.005f;
	float shadow = currentDepth - bias > closestDepth ? 1.0f : 0.0f;

	if (normalizedCoords.z > 1.0f)
		return 0.0f;

	return shadow;
}

float computeFog()
{
	 float fogDensity = 0.01f;
	 float fragmentDistance = length(fPosEye);
	 float fogFactor = exp(-pow(fragmentDistance * fogDensity, 2));

	 //vec4 colorFromTexture = texture(diffuseTexture, fTexCoords);

	 return clamp(fogFactor, 0.0f, 1.0f);
}
vec3 pos = vec3(19.3859f, 17.0f, -52.5078f);
vec3 pos1 = vec3(19.3859f, 13.1f, -52.5078f);
vec3 pos2[20];

vec3 pointLightColor = vec3(1.0f, 0.0f, 0.0f);
vec3 pointLightColor1 = vec3(1.0f, 1.0f, 1.0f);

void main() 
{
	
	//float alfa = 0.005f;

	computeLightComponents();
	
	vec3 baseColor = vec3(0.9f, 0.35f, 0.0f);//orange

	calcPointLight(pos, pointLightColor, 1.0f, 0.022f, 0.2f);
	calcPointLight(pos1, pointLightColor, 1.0f, 0.022f, 0.2f);

	float aux = -29.0f;
	for(int i = 0; i < 20; i++){
		pos2[i].x = 12.4f;
		pos2[i].y = 1.25f;
		pos2[i].z = aux;
		aux -= 1;
		calcPointLight(pos2[i], pointLightColor1, 1.0f, 0.7f, 1.8f);
	}
	
	ambient *= texture(diffuseTexture, fTexCoords).rgb;
	diffuse *= texture(diffuseTexture, fTexCoords).rgb;
	specular *= texture(specularTexture, fTexCoords).rgb;

	float shadow = computeShadow();
    vec3 color = min((ambient + (1.0f - shadow)*diffuse) + (1.0f - shadow)*specular, 1.0f);
	vec4 colorFromTexture = texture(diffuseTexture, fTexCoords);
	
	if(colorFromTexture.a < 0.1)
			discard;

	if(enableFog == 1)
	{
	fColor = vec4(color, 1.0f);
	float fogFactor = computeFog();
	vec4 fogColor = vec4(0.5f, 0.5f, 0.5f, 1.0f);
	color = mix(fogColor.rgb, color, fogFactor);

	fColor = vec4(color, colorFromTexture.a);
	}
	else
	{
	fColor = vec4(color, colorFromTexture.a);
	}
	
}
