/**
 * @typedef {Object} SystemOptions
 * @property {number} [scale=1] A global scale for the system.
 * @property {number} [maxSpeed=scale] A maximum speed for the boids in the system. Can be tweaked individually via `boid.maxSpeed`.
 * @property {number} [maxForce=scale] A maximum force for each behavior of a boid. Can be tweaked individually via `boid.maxForce` or via `behaviors.options.maxForce`.
 * @property {import("gl-matrix").vec3} [center=[0, 0, 0]] A center point for the system.
 * @property {import("gl-matrix").vec3} [bounds=[scale, scale, scale]] Positives bounds x/y/z for the system expanding from the center point.
 */

/**
 * Handle common boids update and global state.
 */
class System {
  /**
   * @param {SystemOptions} options
   */
  constructor(options) {
    this.boids = [];
    this.scale = 1;

    this.maxSpeed = this.scale;
    this.maxForce = this.scale;

    this.center = [0, 0, 0];
    this.bounds = [this.scale, this.scale, this.scale];

    Object.assign(this, options);
  }

  /**
   * Get a position within the system's bounds.
   * @returns {number[]}
   */
  getRandomPosition() {
    return [
      (2 * Math.random() - 1) * this.bounds[0] * 0.5 + this.center[0],
      (2 * Math.random() - 1) * this.bounds[1] * 0.5 + this.center[1],
      (2 * Math.random() - 1) * this.bounds[2] * 0.5 + this.center[2],
    ];
  }

  /**
   * Push a new boid to the system.
   * @param {Boid} boid
   */
  addBoid(boid) {
    this.boids.push(boid);
  }

  /**
   * Update all behaviours in the system.
   * @param {number} dt
   */
  update(dt) {
    for (let i = 0; i < this.boids.length; i++) {
      const boid = this.boids[i];
      boid.applyBehaviors({
        boids: this.boids,
        maxSpeed: this.maxSpeed,
        maxForce: this.maxForce,
        center: this.center,
        bounds: this.bounds,
      });
      boid.update(dt, boid.maxSpeed || this.maxSpeed);
    }
  }
}

export default System;
