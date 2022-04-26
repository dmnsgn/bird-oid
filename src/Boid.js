import { vec3 } from "gl-matrix";

import { limit } from "./utils.js";

/**
 * A data structure for a single Boid.
 *
 * @property {import("gl-matrix").vec3} position
 * @property {import("gl-matrix").vec3} velocity
 * @property {import("gl-matrix").vec3} acceleration
 * @property {import("gl-matrix").vec3[]} target
 * @property {import("../types.js").BehaviorObject[]} behavious
 */
class Boid {
  /**
   * @param {import("../types.js").BehaviorObject[]} behaviors An array of behaviors to apply to the boid.
   */
  constructor(behaviors) {
    this.position = vec3.create();
    this.velocity = vec3.create();
    this.acceleration = vec3.create();
    this.target = vec3.create();

    this.behaviors = behaviors || [];
  }

  /**
   * Add a force to the boid's acceleration vector. If you need mass, you can either use behaviors.scale or override.
   * @param {import("gl-matrix").vec3} force
   */
  applyForce(force) {
    vec3.add(this.acceleration, this.acceleration, force);
  }

  /**
   * Compute all the behaviors specified in `boid.behaviors` and apply them via applyForce. Arguments usually come from the system and can be overridden via `behavior.options`.
   * @param {import("../types.js").ApplyBehaviorObject} applyOptions
   */
  applyBehaviors({ boids, maxSpeed, maxForce, center, bounds }) {
    for (let i = 0; i < this.behaviors.length; i++) {
      const behavior = this.behaviors[i];
      if (behavior.enabled === false) continue;

      const force = behavior.fn({
        boids,
        maxSpeed,
        maxForce: this.maxForce || maxForce,
        center,
        bounds,
        position: this.position,
        velocity: this.velocity,
        target: this.target,
        ...behavior.options,
      });

      if (force) {
        limit(force, force, this.maxForce || maxForce);
        if (behavior.scale) vec3.scale(force, force, behavior.scale || 1);

        this.applyForce(force);
      }
    }
  }

  /**
   * Update a boid's position according to its current acceleration/velocity and reset acceleration. Usually called consecutively to `boid.applyBehaviors`.
   * @param {number} dt
   * @param {number} maxSpeed
   */
  update(dt, maxSpeed) {
    vec3.scaleAndAdd(this.velocity, this.velocity, this.acceleration, dt);
    limit(this.velocity, this.velocity, maxSpeed);
    vec3.scaleAndAdd(this.position, this.position, this.velocity, dt);
    vec3.set(this.acceleration, 0, 0, 0);
  }
}

export default Boid;
