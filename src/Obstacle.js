/**
 * Data structure used for obstacle avoidance behavior.
 */
class Obstacle {
  /**
   * @param {import("gl-matrix").vec3} position The center of the obstacle.
   * @param {number} radius The radius of the sphere.
   */
  constructor(position, radius) {
    this.position = position;
    this.radius = radius;
  }
}

export default Obstacle;
