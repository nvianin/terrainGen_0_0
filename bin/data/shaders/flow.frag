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
    float sediment = texture2DRect(heightmap, gl_FragCoord.xy).b; 
    float water = texture2DRect(flowmap, gl_FragCoord.xy).b;

    vec4 flux = vec4(texture2DRect(flowmap, gl_FragCoord.xy).rgb, texture2DRect(velmap, gl_FragCoord.xy).r);
    vec2 velocity = texture2DRect(velmap, gl_FragCoord.xy).rg;


    //  spawn rainfall


    water += .1;


    //  -1 x 1 | -1
    //  -1 x 1 | x
    //  -1 x 1 | 1


    //  diffuse on each side
    /* for(int x = -1; x < 2; x += 2) {
        for(int y = -1; y < 2; y += 2) {
            float amt = texture2DRect(flowmap, gl_FragCoord.xy + vec2(x, y)).b;
            water += amt;
        }
    }
    water/=4;
    water*=1.; */



    outputColor = texture2DRect(heightmap, gl_FragCoord.xy);
    outputColor = vec4(flux.rgb, 1.);

}