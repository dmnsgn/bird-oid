import { vec3 } from "gl-matrix";
import { limit } from "./utils.js";

export default class Boid {
  constructor(behaviors) {
    this.position = vec3.create();
    this.velocity = vec3.create();
    this.acceleration = vec3.create();
    this.target = vec3.create();

    this.behaviors = behaviors || [];
  }

  applyForce(force) {
    vec3.add(this.acceleration, this.acceleration, force);
  }

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
        ...behavior.options
      });

      if (force) {
        limit(force, force, this.maxForce || maxForce);
        if (behavior.scale) vec3.scale(force, force, behavior.scale || 1);

        this.applyForce(force);
      }
    }
  }

  update(dt, maxSpeed) {
    vec3.scaleAndAdd(this.velocity, this.velocity, this.acceleration, dt);
    limit(this.velocity, this.velocity, maxSpeed);
    vec3.scaleAndAdd(this.position, this.position, this.velocity, dt);
    vec3.set(this.acceleration, 0, 0, 0);
  }
}
