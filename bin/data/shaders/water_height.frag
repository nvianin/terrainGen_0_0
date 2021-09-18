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
        // R flux D
		// G velocity x
		// B velocity y
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

    float sum_in = texture2DRect(flowmap, gl_FragCoord.xy + vec2(-1, 0)).z + texture2DRect(flowmap, gl_FragCoord.xy + vec2(0, -1)).y + texture2DRect(flowmap, gl_FragCoord.xy + vec2(0, 1)).x + texture2DRect(flowmap, gl_FragCoord.xy + vec2(1, 0)).w;

    float sum_out = flux.x + flux.y + flux.z + flux.w;

    float dv = dt * (sum_in - sum_out);

    water = water + dv;

    outputColor = vec4(water, 0, 0, 1.);
}