#include "ofApp.h"

//--------------------------------------------------------------
void ofApp::setup() {
	fbm.load("shaders/generic.vert", "shaders/fbm.frag");
	flow.load("shaders/generic.vert", "shaders/flow.frag");

	printf("initialized shaders \n");

	undermap.allocate(ofGetWidth(), ofGetHeight());
	undermap.begin();
	ofClear(0, 0, 0, 0);
	undermap.end();

	heightmap.allocate(ofGetWidth(), ofGetHeight());
	heightmap.begin();
	ofClear(0, 0, 0, 0);
	heightmap.end();

	flowmap.allocate(ofGetWidth(), ofGetHeight());
	flowmap.begin();
	ofClear(0, 0, 0, 0);
	flowmap.end();

	velmap.allocate(ofGetWidth(), ofGetHeight());
	velmap.begin();
	ofClear(0, 0, 0, 0);
	velmap.end();

	watermap.allocate(ofGetWidth(), ofGetHeight());
	watermap.begin();
	ofClear(0, 0, 0, 0);
	watermap.end();

	atmomap.allocate(ofGetWidth(), ofGetHeight());
	atmomap.begin();
	ofClear(0, 0, 0, 0);
	atmomap.end();

	printf("initialized textures \n");
}

//--------------------------------------------------------------
void ofApp::update() {
	if (ofGetFrameNum() % 30 == 0) {
		for (ofShader s : shaders) {
			s.begin();
			s.setUniform2f("resolution", ofGetWidth(), ofGetHeight());
			s.end();
		}

		fbm.load("shaders/generic.vert", "shaders/fbm.frag");
		flow.load("shaders/generic.vert", "shaders/flow.frag");
	}
}

//--------------------------------------------------------------
void ofApp::draw() {
	ofSetColor(255);

	if (!heightmapInitialized) {

		ofEnableBlendMode(OF_BLENDMODE_ADD);
		heightmap.begin();

		ofClear(0, 0, 0, 0);
		fbm.begin();
		fbm.setUniform2f("resolution", ofGetWidth(), ofGetHeight());
		ofSetColor(255, 0, 0);
		ofDrawRectangle(0, 0, ofGetWidth(), ofGetHeight());
		fbm.end();

		heightmap.end();

		watermap.begin();

		ofClear(0, 0, 0, 0);
		ofSetColor(255, 0, 0);
		ofDrawCircle(ofGetWidth() / 2, ofGetHeight() / 2, 175);

		watermap.end();

		ofDisableBlendMode();
		heightmapInitialized = true;
	}

	flowmap.begin();
	flow.begin();

	flow.setUniform2f("resolution", ofGetWidth(), ofGetHeight());
	flow.setUniform1f("dt", dt);
	flow.setUniform1f("rain", rain);

	/*flow.setUniformTexture("undermap", undermap.getTexture(), 1);*/
	flow.setUniformTexture("heightmap", heightmap.getTexture(), 1);
	flow.setUniformTexture("flowmap", flowmap.getTexture(), 2);
	flow.setUniformTexture("velmap", velmap.getTexture(), 3);
	flow.setUniformTexture("watermap", watermap.getTexture(), 4);
	/*flow.setUniformTexture("atmomap", atmomap.getTexture(), 5);*/

	ofDrawRectangle(0, 0, ofGetWidth(), ofGetHeight());

	flow.end();
	flowmap.end();

	flowmap.draw(0, 0, ofGetWidth(), ofGetHeight());

	/*heightmap.draw(0, 0, ofGetWidth(), ofGetHeight());*/
}

//--------------------------------------------------------------
void ofApp::keyPressed(int key) {
	cout << key << "\n";
	switch (key) {
	case 32:
		cout << blendModeIndex << "\n";
		if (blendModeIndex < 5) {
			blendModeIndex++;
		}
		else {
			blendModeIndex = 0;
		}
		break;

	case 114:
		cout << "reinitializing context\n";
		heightmapInitialized = false;
		break;
	}
}

//--------------------------------------------------------------
void ofApp::keyReleased(int key) {

}

//--------------------------------------------------------------
void ofApp::mouseMoved(int x, int y) {

}

//--------------------------------------------------------------
void ofApp::mouseDragged(int x, int y, int button) {
	if (ofGetMousePressed) {
		watermap.begin();

		ofSetColor(255, 0, 0);
		ofDrawCircle(x, y, 100);

		watermap.end();
	}
}

//--------------------------------------------------------------
void ofApp::mousePressed(int x, int y, int button) {
}

//--------------------------------------------------------------
void ofApp::mouseReleased(int x, int y, int button) {

}

//--------------------------------------------------------------
void ofApp::mouseEntered(int x, int y) {

}

//--------------------------------------------------------------
void ofApp::mouseExited(int x, int y) {

}

//--------------------------------------------------------------
void ofApp::windowResized(int w, int h) {

}

//--------------------------------------------------------------
void ofApp::gotMessage(ofMessage msg) {

}

//--------------------------------------------------------------
void ofApp::dragEvent(ofDragInfo dragInfo) {

}
