/**
 * Data structure used for path following behavior.
 */
class Path {
  /**
   * @param {import("gl-matrix").vec3[]} points An array of 3d points.
   * @param {number} radius
   */
  constructor(points, radius) {
    this.points = points;
    this.radius = radius;
  }
}

export default Path;
