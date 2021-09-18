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

    float dh_l = height - (texture2DRect(heightmap, vec2(gl_FragCoord.x, gl_FragCoord.y)).r + texture2DRect(heightmap, vec2(gl_FragCoord.x, gl_FragCoord.y)).g);
    float f_l = max(0, flux.x + dt * (9.8 * dh_l));
    float K = min(1, water / ((flux.x + flux.y + flux.z + flux.w) * dt));
   /*  outputColor = texture2DRect(heightmap, gl_FragCoord.xy);
    outputColor = vec4(flux.rgb, 1.); */

    f_l *= K;
    outputColor = vec4(vec3(f_l, height, water), 1.);

}