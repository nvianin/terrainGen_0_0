// fragment shader

#version 150
precision highp float;
precision highp int;

out vec4 outputColor;
uniform int seed;
uniform vec2 resolution;
uniform vec2 world_pos;

// 	<www.shadertoy.com/view/XsX3zB>
//	by Nikita Miropolskiy

/* discontinuous pseudorandom uniformly distributed in [-0.5, +0.5]^3 */
vec3 random3(vec3 c) {
    float j = 4096.0 * sin(dot(c, vec3(17.0, 59.4, 15.0)));
    vec3 r;
    r.z = fract(512.0 * j);
    j *= .125;
    r.x = fract(512.0 * j);
    j *= .125;
    r.y = fract(512.0 * j);
    return r - 0.5;
}

const float F3 = 0.3333333;
const float G3 = 0.1666667;
float snoise(vec3 p) {

    vec3 s = floor(p + dot(p, vec3(F3)));
    vec3 x = p - s + dot(s, vec3(G3));

    vec3 e = step(vec3(0.0), x - x.yzx);
    vec3 i1 = e * (1.0 - e.zxy);
    vec3 i2 = 1.0 - e.zxy * (1.0 - e);

    vec3 x1 = x - i1 + G3;
    vec3 x2 = x - i2 + 2.0 * G3;
    vec3 x3 = x - 1.0 + 3.0 * G3;

    vec4 w, d;

    w.x = dot(x, x);
    w.y = dot(x1, x1);
    w.z = dot(x2, x2);
    w.w = dot(x3, x3);

    w = max(0.6 - w, 0.0);

    d.x = dot(random3(s), x);
    d.y = dot(random3(s + i1), x1);
    d.z = dot(random3(s + i2), x2);
    d.w = dot(random3(s + 1.0), x3);

    w *= w;
    w *= w;
    d *= w;

    return dot(d, vec4(52.0));
}

float snoiseFractal(vec3 m) {
    return 0.5333333 * snoise(m) + 0.2666667 * snoise(2.0 * m) + 0.1333333 * snoise(4.0 * m) + 0.0666667 * snoise(8.0 * m);
}

float my_fbm(vec3 v, float scale, int depth) {

    float n = 0.;
    for(int i = 0; i < depth; i++) {
        n += snoise(v * scale * i / depth + pow(2, i)) * (1 - (1 / (pow(2, i + 1))));
    }
    n += snoise(v * scale * depth / depth + pow(2, depth)) * (1 / (pow(2, depth + 1)));

    /* return snoiseFractal(v * scale); */
    return n;
}

// FBM NOISE

void main() {
    vec2 st = vec2(gl_FragCoord.x / resolution.x, gl_FragCoord.y / resolution.y);

    float terrain_seed = 42.;
    float ocean_seed = 42.;

    float height = snoiseFractal(vec3(st * 13, terrain_seed));
    height -= snoiseFractal(vec3(st, ocean_seed));

    outputColor = vec4(height, 0, 0, 1.);
}
