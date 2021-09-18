#version 150 
precision highp float;
precision highp int;
out vec4 outputColor;

uniform vec2 resolution;
uniform float dt;
uniform float rain;

uniform sampler2DRect heightmap;
		// R rock height
		// G soil height
		// B sediment quantity

uniform sampler2DRect flowmap;
		// R flux L
		// G flux U
		// B flux R
        // A flux D
        
uniform sampler2DRect velmap;
        // R velocity x
		// G velocity y

uniform sampler2DRect watermap;
        // R water height

void main() {
    vec2 st = gl_FragCoord.xy / resolution;

    float rock = texture2DRect(heightmap, gl_FragCoord.xy).r;
    float soil = texture2DRect(heightmap, gl_FragCoord.xy).g;
    float height = rock + soil;

    float sediment = texture2DRect(heightmap, gl_FragCoord.xy).b;
    float water = texture2DRect(watermap, gl_FragCoord.xy).r;

    vec4 flux = texture2DRect(flowmap, gl_FragCoord.xy);
    vec2 velocity = texture2DRect(velmap, gl_FragCoord.xy).rg;

    /* velocity.x =  */

    outputColor = vec4(velocity, 0., 1.);
}