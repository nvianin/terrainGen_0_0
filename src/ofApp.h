#pragma once

#include "ofMain.h"

class ofApp : public ofBaseApp {

public:
	void setup();
	void update();
	void draw();

	void keyPressed(int key);
	void keyReleased(int key);
	void mouseMoved(int x, int y);
	void mouseDragged(int x, int y, int button);
	void mousePressed(int x, int y, int button);
	void mouseReleased(int x, int y, int button);
	void mouseEntered(int x, int y);
	void mouseExited(int x, int y);
	void windowResized(int w, int h);
	void dragEvent(ofDragInfo dragInfo);
	void gotMessage(ofMessage msg);



	bool heightmapInitialized = false;
	int blendModeIndex = 0;

	float dt = .1;
	float rain = .1;

	// World Layer Textures

	// R aquifer height
	// G clay height
	// B water table
	ofFbo undermap;

	// R rock height
	// G soil height
	// B sediment quantity
	ofFbo heightmap;

	// R flux L
	// G flux U
	// B flux R
	// A flux D
	ofFbo flowmap;

	// G velocity x
	// B velocity y
	ofFbo velmap;

	// R water height 
	ofFbo watermap;

	// ------------------------------------------------
	// UNUSED MAPS FOR LATER USE, NEED TO BE REFACTORED
	// ------------------------------------------------

	// R temperature
	// G humidity
	// B wind
	ofFbo atmomap;


	// A soil humidity
	// A water height
	// A pressure

	// Shader steps

	ofShader fbm;
	ofShader flow;
	ofShader water_height;

	ofShader erode;
	ofShader transpose;

	array<ofShader, 4> shaders = { fbm, flow };
};
