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

    float dh_l = height - (texture2DRect(heightmap, vec2(gl_FragCoord.x - 1, gl_FragCoord.y)).r + texture2DRect(heightmap, vec2(gl_FragCoord.x - 1, gl_FragCoord.y)).g);
    float dh_u = height - (texture2DRect(heightmap, vec2(gl_FragCoord.x, gl_FragCoord.y + 1)).r + texture2DRect(heightmap, vec2(gl_FragCoord.x, gl_FragCoord.y + 1)).g);
    float dh_r = height - (texture2DRect(heightmap, vec2(gl_FragCoord.x + 1, gl_FragCoord.y)).r + texture2DRect(heightmap, vec2(gl_FragCoord.x + 1, gl_FragCoord.y)).g);
    float dh_d = height - (texture2DRect(heightmap, vec2(gl_FragCoord.x, gl_FragCoord.y - 1)).r + texture2DRect(heightmap, vec2(gl_FragCoord.x, gl_FragCoord.y - 1)).g);

    float f_l = max(0, flux.x + dt * (9.8 * dh_l));
    float f_u = max(0, flux.y + dt * (9.8 * dh_u));
    float f_r = max(0, flux.z + dt * (9.8 * dh_r));
    float f_d = max(0, flux.w + dt * (9.8 * dh_d));

    float K = min(1, water / ((flux.x + flux.y + flux.z + flux.w) * dt));
   /*  outputColor = texture2DRect(heightmap, gl_FragCoord.xy);
    outputColor = vec4(flux.rgb, 1.); */

    vec4 outputFlow = vec4(f_l, f_u, f_r, f_d);
    outputFlow *= K;

    /* f_l *= K; */
    outputColor = outputFlow;

}