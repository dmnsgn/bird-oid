import { vec3 } from "gl-matrix";

function limit(out, a, n) {
  const squaredLength = vec3.squaredLength(a);

  if (squaredLength > n * n) {
    const v = n / Math.sqrt(squaredLength);
    out[0] *= v;
    out[1] *= v;
    out[2] *= v;
  }

  return out;
}

export { limit };
